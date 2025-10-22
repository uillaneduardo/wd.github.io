(() => {
  const ATTR_URLS = ["data-include"];
  const ATTR_TTL = "data-ttl";
  const ATTR_CACHE_KEY = "data-cache-key";
  const ATTR_INSERT = "data-insert"; // append | prepend | outer
  const CACHE_PREFIX = "include-cache:";

  function getUrlFrom(el) {
    for (const attr of ATTR_URLS) {
      const url = el.getAttribute(attr);
      if (url) return url;
    }
    return null;
  }

  function cacheKey(url, bust = "") {
    return `${CACHE_PREFIX}${bust ? bust + ":" : ""}${new URL(url, document.baseURI).href}`;
  }

  function readCache(key) {
    try {
      const raw = sessionStorage.getItem(key);
      if (!raw) return null;
      const data = JSON.parse(raw);
      if (data.exp && Date.now() > data.exp) {
        sessionStorage.removeItem(key);
        return null;
      }
      return data.html;
    } catch {
      return null;
    }
  }

  function writeCache(key, html, ttlMs) {
    try {
      const payload = { html };
      if (ttlMs && ttlMs > 0) payload.exp = Date.now() + ttlMs;
      sessionStorage.setItem(key, JSON.stringify(payload));
    } catch {/* storage cheio/bloqueado: ignora */}
  }

  // --- Sanitização básica contra XSS vindos do fragmento ---
  function sanitizeFragment(container) {
    // remove <script>
    container.querySelectorAll("script").forEach(s => s.remove());

    // remove atributos perigosos (on*, javascript:)
    container.querySelectorAll("*").forEach(node => {
      [...node.attributes].forEach(attr => {
        const name = attr.name.toLowerCase();
        const val = (attr.value || "").trim();

        // eventos inline (onclick, onerror, etc.)
        if (name.startsWith("on")) {
          node.removeAttribute(attr.name);
          return;
        }

        // urls javascript:
        if ((name === "href" || name === "src") && /^javascript:/i.test(val)) {
          node.removeAttribute(attr.name);
          return;
        }

        // css url javascript: (defesa simples; sanitização completa exigiria parser CSS)
        if (name === "style" && /javascript:/i.test(val)) {
          node.removeAttribute(attr.name);
          return;
        }
      });
    });
  }

  async function loadInto(el) {
    const url = getUrlFrom(el);
    if (!url) return;

    const ttlAttr = el.getAttribute(ATTR_TTL);
    const ttlMs = ttlAttr ? Number(ttlAttr) * 1000 : 0;
    const bustTag = el.getAttribute(ATTR_CACHE_KEY) || "";
    const key = cacheKey(url, bustTag);

    // tenta cache
    const cached = readCache(key);
    if (cached !== null) {
      inject(el, cached);
      return;
    }

    // rede
    try {
      const res = await fetch(url, { credentials: "same-origin" });
      if (!res.ok) throw new Error(`HTTP ${res.status} ao carregar ${url}`);
      const html = await res.text();
      writeCache(key, html, ttlMs);
      inject(el, html);
    } catch (err) {
      console.error(err);
      // não substituir conteúdo existente; apenas sinalizar
      const warn = document.createElement("p");
      warn.style.color = "red";
      warn.textContent = `Erro ao carregar "${url}".`;
      el.appendChild(warn);
    }
  }

  function inject(el, html) {
    const insertMode = (el.getAttribute(ATTR_INSERT) || "append").toLowerCase();

    // cria um container temporário para sanitizar e depois obter os nós
    const temp = document.createElement("div");
    temp.innerHTML = html;
    sanitizeFragment(temp);

    // transforma childNodes em DocumentFragment para inserção eficiente
    const frag = document.createDocumentFragment();
    Array.from(temp.childNodes).forEach(n => frag.appendChild(n));

    if (insertMode === "outer") {
      const parent = el.parentNode;
      if (!parent) return;
      parent.insertBefore(frag, el);
      parent.removeChild(el);
      return;
    }

    if (insertMode === "prepend") {
      el.insertBefore(frag, el.firstChild);
    } else {
      // append (padrão)
      el.appendChild(frag);
    }
  }

  // Auto-init (funciona no <head> com defer ou no final do <body>)
  const start = () => {
    const selectors = ATTR_URLS.map(a => `[${a}]`).join(",");
    document.querySelectorAll(selectors).forEach(loadInto);
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }

  // API manual opcional
  window.includeInto = async function(el, url, {
    ttlSeconds = 0,
    insert = "append", // append | prepend | outer
    cacheKeyTag = ""
  } = {}) {
    if (url) el.setAttribute("data-include", url);
    if (ttlSeconds) el.setAttribute(ATTR_TTL, String(ttlSeconds));
    if (insert) el.setAttribute(ATTR_INSERT, insert);
    if (cacheKeyTag) el.setAttribute(ATTR_CACHE_KEY, cacheKeyTag);
    await loadInto(el);
  };
})();
