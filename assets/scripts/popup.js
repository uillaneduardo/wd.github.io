(() => {
  const popupEl = document.getElementById('popup');
  const titleEl = document.getElementById('popup-title');
  const contentEl = document.getElementById('popup-content');
  const closeBtn = document.getElementById('popup-close');
  let closeAllowed = true;

  // ---------- FOCUS TRAP util ----------
  const focusableSel = [
    'a[href]', 'area[href]', 'input:not([disabled])',
    'select:not([disabled])', 'textarea:not([disabled])',
    'button:not([disabled])', 'iframe', 'audio[controls]',
    'video[controls]', '[contenteditable]:not([contenteditable="false"])',
    '[tabindex]:not([tabindex="-1"])'
  ].join(',');

  function trapFocus(container, e) {
    if (e.key !== 'Tab') return;
    const f = [...container.querySelectorAll(focusableSel)].filter(el => el.offsetParent !== null || container === el);
    if (!f.length) return;
    const first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { last.focus(); e.preventDefault(); }
    else if (!e.shiftKey && document.activeElement === last) { first.focus(); e.preventDefault(); }
  }

  // ---------- Feature detect ----------
  const hasDialog = typeof window.HTMLDialogElement === 'function' && typeof popupEl.showModal === 'function';

  // Estado compartilhado
  let fbBackdrop, fbShell, lastActive;

  // ---------- Fallback setup (sem <dialog>) ----------
  function setupFallback() {
    // Criar backdrop e “shell” (div com role=dialog)
    fbBackdrop = document.createElement('div');
    fbBackdrop.className = 'popup-fb-backdrop';
    fbBackdrop.setAttribute('aria-hidden', 'true');

    fbShell = document.createElement('div');
    fbShell.className = 'popup-fb';
    fbShell.setAttribute('role', 'dialog');
    fbShell.setAttribute('aria-modal', 'true');
    fbShell.setAttribute('aria-labelledby', 'popup-title');
    fbShell.setAttribute('aria-describedby', 'popup-content');
    fbShell.setAttribute('aria-hidden', 'true');

    // Mover o conteúdo do <dialog> para dentro do shell
    const panel = document.createElement('div');
    panel.className = 'popup-panel';
    // move todos filhos atuais
    while (popupEl.firstChild) panel.appendChild(popupEl.firstChild);
    fbShell.appendChild(panel);

    // Inserir no DOM
    document.body.append(fbBackdrop, fbShell);

    // Interações
    fbBackdrop.addEventListener('click', closeFallback);
    fbShell.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeFallback();
      trapFocus(fbShell, e);
    });
  }

  function openFallback() {
    lastActive = document.activeElement;
    document.body.classList.add('body-lock');
    fbBackdrop.setAttribute('aria-hidden', 'false');
    fbShell.setAttribute('aria-hidden', 'false');
    // foca o primeiro foco possível
    const first = fbShell.querySelector(focusableSel) || fbShell;
    first.focus({ preventScroll: true });
  }

  function closeFallback() {
    if(!closeAllowed) return;
    fbBackdrop.setAttribute('aria-hidden', 'true');
    fbShell.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('body-lock');
    if (lastActive) lastActive.focus({ preventScroll: true });
  }

  // ---------- API pública unificada ----------
  function showPopup({ title = '', content = '', classes = [], allowClosing = true } = {}) {
    closeAllowed = allowClosing;
    titleEl.textContent = title;
    contentEl.innerHTML = content;
    closeBtn.style.display = allowClosing ? '' : 'none';

    // Limpa/aplica classes visuais na casca
    (hasDialog ? popupEl : fbShell).className = hasDialog ? '' : 'popup-fb';
    if (classes && classes.length) (hasDialog ? popupEl : fbShell).classList.add(...classes);

    if (hasDialog) {
      lastActive = document.activeElement;
      popupEl.showModal();
      // Focus e trap
      const first = popupEl.querySelector(focusableSel) || popupEl;
      first.focus({ preventScroll: true });
      popupEl.addEventListener('keydown', onKeydownTrap);
    } else {
      openFallback();
    }
  }

  function closePopup() {
    if (!closeAllowed) return;
    if (hasDialog) {
      popupEl.close();
      popupEl.removeEventListener('keydown', onKeydownTrap);
      if (lastActive) lastActive.focus({ preventScroll: true });
    } else {
      closeFallback();
    }
  }

  function onKeydownTrap(e) {
    if (e.key === 'Escape') { e.preventDefault(); closePopup(); return; }
    trapFocus(popupEl, e);
  }

  // ---------- Inicialização ----------
  if (!hasDialog) setupFallback();

  // Eventos comuns
  (hasDialog ? closeBtn : (hasDialog ? closeBtn : (document.querySelector('.popup-panel .popup-close') || closeBtn)))
    .addEventListener('click', closePopup);

  if (hasDialog) {
    // Fechar clicando fora (backdrop nativo) — usar 'cancel' para permitir Esc também
    popupEl.addEventListener('cancel', (e) => { e.preventDefault(); closePopup(); });
    // Clique no backdrop (somente <dialog> com ::backdrop)
    popupEl.addEventListener('click', (e) => {
      const rect = popupEl.getBoundingClientRect();
      const clickedOutside = e.clientX < rect.left || e.clientX > rect.right || e.clientY < rect.top || e.clientY > rect.bottom;
      if (clickedOutside) closePopup();
    });
  }

  // Exponha globalmente se desejar:
  window.Popup = { show: showPopup, close: closePopup };
})();

