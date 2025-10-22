(() => {
  const MQ_LANDSCAPE = '(orientation: landscape)';

  const roByEl = new WeakMap();     // ResizeObserver por elemento
  const measuring = new WeakSet();  // guarda elementos em medição (evita loops)

  function isLandscape() {
    return window.matchMedia(MQ_LANDSCAPE).matches;
  }

  function shouldApply(el) {
    const mode = (el.getAttribute('data-text-fit-box') || 'both').toLowerCase();
    if (mode === 'both') return true;
    if (mode === 'landscape') return isLandscape();
    if (mode === 'portrait') return !isLandscape();
    return true;
  }

  // Define qual caixa limita a largura
  function resolveContainer(el) {
    const opt = el.getAttribute('data-fit-container');
    if (!opt) return el.parentElement || document.documentElement;
    if (opt === 'self') return el;
    try {
      const target = document.querySelector(opt);
      return target || el.parentElement || document.documentElement;
    } catch {
      return el.parentElement || document.documentElement;
    }
  }

  function getHorizontalPadding(node) {
    const st = getComputedStyle(node);
    return (parseFloat(st.paddingLeft) || 0) + (parseFloat(st.paddingRight) || 0);
  }

  function fitToBox(el) {
    if (!el || measuring.has(el)) return;
    if(!shouldApply(el)){
        el.style.fontSize = '';
        return;
    }

    measuring.add(el);

    const container = resolveContainer(el);
    const available = Math.max(
      0,
      (container.clientWidth || window.innerWidth) - getHorizontalPadding(container)
    );

    const minPx = parseFloat(el.getAttribute('data-fit-min') || '10');
    const maxPx = parseFloat(el.getAttribute('data-fit-max') || '300');

    // Guardar estilos que vamos mexer
    const prev = {
      transform: el.style.transform,
      fontSize: el.style.fontSize,
      whiteSpace: el.style.whiteSpace
    };

    // Neutraliza transform/nowrap para medir corretamente
    el.style.transform  = 'none';
    el.style.whiteSpace = 'nowrap';
    el.style.fontSize   = minPx + 'px';

    // Busca binária
    let lo = minPx, hi = Math.max(minPx, maxPx), best = minPx;
    for (let i = 0; i < 18; i++) {
      const mid = (lo + hi) / 2;
      el.style.fontSize = mid + 'px';
      const w = el.scrollWidth;

      if (w <= available) { best = mid; lo = mid; }
      else { hi = mid; }
    }

    // Aplica tamanho final
    el.style.fontSize = best.toFixed(2) + 'px';

    // Restaura o que foi alterado para medir (menos fontSize, que queremos manter)
    el.style.transform  = prev.transform || '';
    el.style.whiteSpace = prev.whiteSpace || '';

    measuring.delete(el);
  }

  function fitAll() {
    document.querySelectorAll('[data-text-fit-box]').forEach(fitToBox);
  }

  // Debounce com RAF
  let raf = 0;
  function scheduleAll() {
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(fitAll);
  }

  // Observa orientação e resize global
  window.addEventListener('resize', scheduleAll, { passive: true });
  const mq = window.matchMedia(MQ_LANDSCAPE);
  if (mq.addEventListener) mq.addEventListener('change', scheduleAll);
  else if (mq.addListener) mq.addListener(scheduleAll);

  // Observa adição de nós e mudanças de atributos APENAS nos elementos alvo
  const mo = new MutationObserver((muts) => {
    for (const m of muts) {
      if (m.type === 'childList') {
        m.addedNodes.forEach(n => {
          if (n.nodeType === 1) {
            if (n.matches?.('[data-text-fit-box]')) {
              attachResizeObserver(n);
              fitToBox(n);
            }
            n.querySelectorAll?.('[data-text-fit-box]').forEach(el => {
              attachResizeObserver(el);
              fitToBox(el);
            });
          }
        });
      } else if (m.type === 'attributes') {
        if (m.target.matches?.('[data-text-fit-box]')) {
          // atributos do próprio elemento (ex.: mudou o modo, min/max, container)
          attachResizeObserver(m.target);
          fitToBox(m.target);
        }
      }
    }
  });

  mo.observe(document.documentElement, {
    childList: true,
    subtree: true,
    attributes: true,
    // Importante: não observar "style" globalmente (causava loop).
    attributeFilter: ['data-text-fit-box', 'data-fit-min', 'data-fit-max', 'data-fit-container']
  });

  // Observa mudanças de tamanho do CONTAINER (mais confiável que MutationObserver)
  function attachResizeObserver(el) {
    const container = resolveContainer(el);
    let ro = roByEl.get(el);
    if (ro) ro.disconnect();

    ro = new ResizeObserver(() => fitToBox(el));
    ro.observe(container);
    // observar o próprio elemento também, caso mude padding/zoom via CSS
    ro.observe(el);
    roByEl.set(el, ro);
  }

  // Primeira execução
  document.querySelectorAll('[data-text-fit-box]').forEach(el => {
    attachResizeObserver(el);
  });
  scheduleAll();

  // API opcional
  window.TextFitBox = { fitToBox, fitAll };
})();
