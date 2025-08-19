/* switcher-view.js */
(() => {
  "use strict";

  // ========= Opções =========
  const DEFAULTS = {
    mode: "occupancy", // "enter" | "exit" | "occupancy"
    classActive: "viewer-on", // ex.: "viewer-on"
    classHidden: "viewer-off", // ex.: "viewer-off"
    thresholds: [0, 0.01, 0.1, 0.25, 0.5, 0.75, 1],
    rootMargin: "0px 0px -10% 0px", // leve histerese no bottom
    preferByScrollDir: true, // ao decidir entre visíveis, usa direção
    minScrollDelta: 12 // px para considerar que rolou "de verdade"
  };

  // ========= Estado =========
  const opts = { ...DEFAULTS, ...window.SwitcherViewOptions };
  const switchers = Array.from(document.querySelectorAll(".switcher-view"));
  if (!switchers.length) return;

  const visible = new Set(); // elementos atualmente visíveis
  const ratios = new Map();  // el -> último intersectionRatio
  let currentActive = null;

  let lastScrollY = window.scrollY;
  let lastTriggerY = window.scrollY;
  let scrollDir = "down"; // "down" | "up"
  let rafPending = false;

  // ========= Utils =========
  const getTop = (el) => el.getBoundingClientRect().top + window.scrollY;

  const findViewer = (switcherEl) => switcherEl.querySelector("[data-viewer]");

  const isHideType = (viewer) =>
    (viewer?.dataset.viewer || "").toLowerCase() === "hide";

  const activate = (switcherEl) => {
    const viewer = findViewer(switcherEl);
    if (!viewer) return;
    viewer.classList.add(opts.classActive);
    if (isHideType(viewer)) viewer.classList.remove(opts.classHidden);
  };

  const deactivate = (switcherEl) => {
    const viewer = findViewer(switcherEl);
    if (!viewer) return;
    viewer.classList.remove(opts.classActive);
    if (isHideType(viewer)) viewer.classList.add(opts.classHidden);
  };

  const setActive = (next) => {
    if (next === currentActive) return;
    if (currentActive) deactivate(currentActive);
    if (next) activate(next);
    currentActive = next;
  };

  const pickByScrollDir = (candidates) => {
    if (!candidates.length) return null;
    if (!opts.preferByScrollDir || candidates.length === 1) return candidates[0];

    // ordena por top crescente
    candidates.sort((a, b) => getTop(a) - getTop(b));
    return scrollDir === "down" ? candidates[candidates.length - 1] : candidates[0];
  };

  const choosePreferredVisible = () => {
    if (!visible.size) return null;

    if (opts.mode === "occupancy") {
      // maior intersectionRatio; empate → direção de rolagem
      let max = -1;
      const best = [];
      for (const el of visible) {
        const r = ratios.get(el) ?? 0;
        if (r > max) {
          max = r;
          best.length = 0;
          best.push(el);
        } else if (r === max) {
          best.push(el);
        }
      }
      return pickByScrollDir(best);
    }

    // modos "enter" e "exit" (quando precisamos escolher entre vários visíveis)
    return pickByScrollDir(Array.from(visible));
  };

  const schedule = () => {
    if (rafPending) return;
    rafPending = true;
    requestAnimationFrame(() => {
      rafPending = false;
      reevaluate();
    });
  };

  // ========= Lógica principal por modo =========
  const reevaluate = () => {
    if (opts.mode === "enter") {
      // no modo enter, só trocamos quando:
      // - o ativo saiu de vista (já forçado no IO), OU
      // - ainda não há ativo, então escolhemos algum visível (pela direção)
      if (!currentActive) setActive(choosePreferredVisible());
      return;
    }

    if (opts.mode === "exit") {
      // só troca quando o ativo sai (forçado no IO)
      // mas se não há ativo (ex. na carga), escolha um
      if (!currentActive) setActive(choosePreferredVisible());
      return;
    }

    // occupancy: sempre manter quem tem maior fração visível
    const preferred = choosePreferredVisible();
    if (preferred && preferred !== currentActive) setActive(preferred);
  };

  // ========= Observers & Listeners =========
  const io = new IntersectionObserver((entries) => {
    let activeLeft = false;

    for (const entry of entries) {
      const el = entry.target;
      ratios.set(el, entry.intersectionRatio);

      if (entry.isIntersecting) {
        visible.add(el);

        if (opts.mode === "enter") {
          // prioridade para quem ENTRA imediatamente
          if (el !== currentActive) setActive(el);
        }
      } else {
        visible.delete(el);
        if (currentActive === el) {
          // ativo saiu completamente da view
          deactivate(el);
          currentActive = null;
          activeLeft = true;
        }
      }
    }

    // "exit": só decide quando o ativo saiu
    if (opts.mode === "exit") {
      if (activeLeft) schedule();
      return;
    }

    // "enter": já ativamos quem entrou; só falta escolher inicial se não houver ativo
    if (opts.mode === "enter") {
      if (!currentActive && visible.size) schedule();
      return;
    }

    // "occupancy": atualizar decisão durante o scroll (via onScroll) é suficiente,
    // mas se alguém entrou/saiu, podemos recalcular já.
    if (opts.mode === "occupancy") schedule();
  }, { threshold: opts.thresholds, rootMargin: opts.rootMargin });

  const onScroll = () => {
    const y = window.scrollY;
    if (y > lastScrollY) scrollDir = "down";
    else if (y < lastScrollY) scrollDir = "up";
    lastScrollY = y;

    if (Math.abs(y - lastTriggerY) >= opts.minScrollDelta) {
      lastTriggerY = y;
      schedule();
    }
  };

  // comportamento conservador em resize:
  // só reagir se o ativo deixou de ser visível (o IO normalmente cobre isso)
  const onResize = () => {
    if (!currentActive) return;
    // fallback simples: se o ativo não está no Set, recalcular
    if (!visible.has(currentActive)) schedule();
  };

  // ========= Init =========
  const init = () => {
    switchers.forEach((el) => {
      // Se o viewer vier marcado com hidden, mantemos como está até ativar
      io.observe(el);
    });

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);

    // primeira passada: se algo já nasce visível, modos:
    // - enter: IO vai ativar quem entrar
    // - exit/occupancy: escolheremos um assim que houver interseção
    // chamamos uma avaliação inicial por segurança
    schedule();
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  // ========= API opcional p/ debug/config =========
  window.SwitcherView = {
    get mode() { return opts.mode; },
    set mode(m) {
      if (["enter", "exit", "occupancy"].includes(m)) {
        opts.mode = m;
        schedule();
      }
    },
    get active() { return currentActive; },
    get visibles() { return Array.from(visible); },
    setClasses(activeClass, hiddenClass) {
      if (typeof activeClass === "string") opts.classActive = activeClass;
      if (typeof hiddenClass === "string") opts.classHidden = hiddenClass;
      // reaplica no ativo atual
      if (currentActive) {
        const v = findViewer(currentActive);
        if (v) {
          v.classList.add(opts.classActive);
          v.classList.remove(DEFAULTS.classActive);
        }
      }
    },
    forceRecalc: schedule
  };
})();
