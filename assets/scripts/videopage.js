// === videopage.js — Feed “tipo TikTok” com DOIS players (ativo + buffer) ===
// Integra com sua estrutura:
// - #btn-open-video          → área que abre o feed
// - #video-thumbs-swiper     → lista com .swiper-slide button[data-ytid] (usa aria-current="true" p/ índice)
// Não altera seu HTML; cria/remover o overlay via JS. Só roda em portrait.

(function () {
  const mmPortrait = window.matchMedia('(orientation: portrait)');
  const openArea   = document.getElementById('btn-open-video');
  const thumbsWrap = document.getElementById('video-thumbs-swiper');
  if (!openArea || !thumbsWrap) return;

  // ===== util do feed (lê sua lista de thumbs) =====
  const getThumbButtons = () =>
    Array.from(thumbsWrap.querySelectorAll('.swiper-slide button[data-ytid]'));
  const getActiveIndex = () =>
    getThumbButtons().findIndex(b => b.getAttribute('aria-current') === 'true');
  const getVideoIdAt = (idx) => {
    const btns = getThumbButtons();
    if (idx < 0 || idx >= btns.length) return null;
    return (btns[idx].getAttribute('data-ytid') || '').trim();
  };

  // ===== cria overlay =====
  let root, viewport, stack, paneActive, paneBuffer, tap, actions, back, likeBtn, likeCount, shareBtn, shareCount, progressFill;
  let created = false;

  function ensureOverlay() {
    if (created) return;

    root = document.createElement('div');
    root.className = 'wd-feed';
    root.setAttribute('role', 'dialog');
    root.setAttribute('aria-modal', 'true');

    viewport = document.createElement('div');
    viewport.className = 'wd-feed__viewport';
    root.appendChild(viewport);

    // stack com dois panes
    stack = document.createElement('div');
    stack.className = 'wd-feed__stack';
    viewport.appendChild(stack);

    paneActive = document.createElement('div');
    paneActive.className = 'wd-feed__pane';
    paneActive.id = 'wdFeedPaneActive';
    stack.appendChild(paneActive);

    paneBuffer = document.createElement('div');
    paneBuffer.className = 'wd-feed__pane';
    paneBuffer.id = 'wdFeedPaneBuffer';
    stack.appendChild(paneBuffer);

    // tap central
    tap = document.createElement('div');
    tap.className = 'wd-feed__tap';
    viewport.appendChild(tap);

    // ações (opcional)
    actions = document.createElement('div');
    actions.className = 'wd-feed__actions';
    actions.innerHTML = `
      <button id="wdLikeBtn" aria-label="Curtir"><i class="bi bi-heart-fill"></i></button>
      <div id="wdLikeCount" class="wd-feed__count">0</div>
      <button id="wdShareBtn" aria-label="Compartilhar"><i class="bi bi-share-fill"></i></button>
      <div id="wdShareCount" class="wd-feed__count">0</div>
    `;
    viewport.appendChild(actions);

    // back
    back = document.createElement('button');
    back.className = 'wd-feed__back';
    back.setAttribute('aria-label', 'Voltar');
    back.innerHTML = '<i class="bi bi-arrow-left"></i> Back';
    viewport.appendChild(back);

    // progresso
    const prog = document.createElement('div');
    prog.className = 'wd-feed__progress';
    prog.innerHTML = `<div class="wd-feed__progress-fill"></div>`;
    viewport.appendChild(prog);
    progressFill = prog.querySelector('.wd-feed__progress-fill');

    document.body.appendChild(root);

    likeBtn    = actions.querySelector('#wdLikeBtn');
    likeCount  = actions.querySelector('#wdLikeCount');
    shareBtn   = actions.querySelector('#wdShareBtn');
    shareCount = actions.querySelector('#wdShareCount');

    created = true;
  }

  // ===== YouTube Iframe API (dois players) =====
  let ytReady = false;
  function ensureYTAPI(cb) {
    if (window.YT && YT.Player) { ytReady = true; cb(); return; }
    const prev = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = function () {
      ytReady = true;
      if (typeof prev === 'function') try { prev(); } catch(e){}
      cb();
    };
    if (!document.querySelector('script[src*="youtube.com/iframe_api"]')) {
      const s = document.createElement('script');
      s.src = 'https://www.youtube.com/iframe_api';
      document.head.appendChild(s);
    }
  }

  let playerActive = null;
  let playerBuffer = null;

  function createPlayers(activeId, bufferId) {
    // limpa se já existirem
    try { playerActive && playerActive.destroy(); } catch(e){}
    try { playerBuffer && playerBuffer.destroy(); } catch(e){}
    playerActive = null; playerBuffer = null;

    // cria dois contêineres de iframe dentro de cada pane
    paneActive.innerHTML = '<div id="wdFeedPlayerActive"></div>';
    paneBuffer.innerHTML = '<div id="wdFeedPlayerBuffer"></div>';

    playerActive = new YT.Player('wdFeedPlayerActive', {
      videoId: activeId,
      playerVars: { playsinline:1, controls:0, rel:0, modestbranding:1 },
      events: {
        onReady: () => { try { playerActive.playVideo(); } catch(e){}; startProgressLoop(); }
      }
    });

    if (bufferId) {
      playerBuffer = new YT.Player('wdFeedPlayerBuffer', {
        videoId: bufferId,
        playerVars: { playsinline:1, controls:0, rel:0, modestbranding:1 }
      });
    }
  }

  // ===== estado do feed =====
  let index = 0;            // índice atual
  let dirY = 0;             // -1 (subindo → próximo), +1 (descendo → anterior), 0 neutro
  let isDragging = false;
  let startX = 0, startY = 0, lastX = 0, lastY = 0;
  let axis = null;          // 'y' | 'x' | null
  const V_SW_THRESHOLD = () => Math.min(140, window.innerHeight * 0.20);
  const H_SW_THRESHOLD = () => Math.min(140, window.innerWidth  * 0.22); // fechar: direita→esquerda

  // ===== abrir/fechar =====
  function openFeed(initialId) {
    if (!mmPortrait.matches) return;
    ensureOverlay();
    document.body.classList.add('wd-body-lock');
    root.style.display = 'block';

    // define índice pelo aria-current, senão cai no 0
    const ariaIdx = getActiveIndex();
    index = ariaIdx >= 0 ? ariaIdx : 0;

    // se veio um id explícito, tenta alinhar
    const fromThumbs = getThumbButtons();
    if (initialId) {
      const found = fromThumbs.findIndex(b => b.getAttribute('data-ytid') === initialId);
      if (found >= 0) index = found;
    }

    // prepara players
    const activeId = getVideoIdAt(index) || getVideoIdAt(0);
    const nextId   = getVideoIdAt(index + 1) || null;
    ensureYTAPI(() => {
      createPlayers(activeId, nextId);

      // posição inicial dos panes
      paneActive.style.transform = 'translateY(0)';
      paneBuffer.style.transform = 'translateY(100%)'; // próximo fica “embaixo”
    });

    wireGestures();
    wireControls();
  }

  function closeFeed() {
    root.style.display = 'none';
    document.body.classList.remove('wd-body-lock');
    try { playerActive && playerActive.pauseVideo(); } catch(e){}
    try { playerBuffer && playerBuffer.pauseVideo(); } catch(e){}
  }

  // ===== progresso =====
  let progressTimer = null;
  function startProgressLoop() {
    clearInterval(progressTimer);
    progressTimer = setInterval(() => {
      if (!playerActive || typeof playerActive.getDuration !== 'function') return;
      const dur = playerActive.getDuration() || 0;
      const cur = playerActive.getCurrentTime ? playerActive.getCurrentTime() : 0;
      const p = dur ? (cur / dur) * 100 : 0;
      if (progressFill) progressFill.style.width = p + '%';
    }, 180);
  }

  // ===== gestos =====
  let gesturesWired = false;
  function wireGestures() {
    if (gesturesWired) return;
    gesturesWired = true;

    const surface = viewport;

    surface.addEventListener('touchstart', (e) => {
      if (e.touches.length !== 1) return;
      isDragging = true; axis = null; dirY = 0;
      startX = lastX = e.touches[0].clientX;
      startY = lastY = e.touches[0].clientY;

      // remove transições para acompanhar o dedo
      paneActive.style.transition = 'none';
      paneBuffer.style.transition = 'none';
    }, { passive: true });

    surface.addEventListener('touchmove', (e) => {
      if (!isDragging) return;
      const x = e.touches[0].clientX;
      const y = e.touches[0].clientY;
      const dx = x - startX;
      const dy = y - startY;
      lastX = x; lastY = y;

      // decide eixo dominante
      if (!axis) {
        axis = Math.abs(dy) > Math.abs(dx) ? 'y' : 'x';
      }

      if (axis === 'y') {
        // vertical → mostrar próximo/anter como no TikTok
        // prevemos preventDefault quando já tem direção para reduzir “pull to refresh” depois
        // (podemos endurecer isso na próxima rodada)
        const h = window.innerHeight;
        const pct = Math.max(-1, Math.min(1, dy / h)); // -1..1
        dirY = (pct < 0) ? -1 : 1;

        // coloca o buffer no lado certo
        if (dirY < 0) {
          // arrastando para cima: próximo aparece de baixo
          paneBuffer.style.transform = `translateY(${100 + (dy / h) * 100}%)`;
        } else {
          // arrastando para baixo: anterior aparece de cima
          paneBuffer.style.transform = `translateY(${-100 + (dy / h) * 100}%)`;
        }
        // o ativo segue o dedo
        paneActive.style.transform = `translateY(${dy}px)`;

      } else {
        // horizontal → gesto de voltar: direita → esquerda fecha
        paneActive.style.transform = `translateX(${dx}px)`;
      }
    }, { passive: true });

    surface.addEventListener('touchend', () => {
      if (!isDragging) return;
      isDragging = false;

      const dx = lastX - startX;
      const dy = lastY - startY;

      // volta transições para o snap
      paneActive.style.transition = 'transform .28s cubic-bezier(.2,.8,.2,1)';
      paneBuffer.style.transition = 'transform .28s cubic-bezier(.2,.8,.2,1)';

      if (axis === 'x') {
        // fechar: movimento da DIREITA → ESQUERDA (dx <= -threshold)
        if (dx <= -H_SW_THRESHOLD()) {
          paneActive.style.transform = 'translateX(-100%)';
          setTimeout(closeFeed, 260);
        } else {
          // volta
          paneActive.style.transform = 'translateX(0)';
        }
        return;
      }

      // eixo vertical
      const vth = V_SW_THRESHOLD();

      if (dy <= -vth) {
        // próximo (swipe up)
        gotoNext();
      } else if (dy >= vth) {
        // anterior (swipe down)
        gotoPrevOrClose();
      } else {
        // cancela → volta para 0/oculto
        paneActive.style.transform = 'translateY(0)';
        paneBuffer.style.transform = (dirY < 0) ? 'translateY(100%)' : 'translateY(-100%)';
      }

      axis = null; dirY = 0;
    }, { passive: true });
  }

  // ===== troca de vídeos usando dois players =====
  function gotoNext() {
    const btns = getThumbButtons();
    if (index >= btns.length - 1) {
      // fim do feed → snap de volta
      paneActive.style.transform = 'translateY(0)';
      paneBuffer.style.transform = 'translateY(100%)';
      return;
    }
    const nextIndex = index + 1;
    const nextId = getVideoIdAt(nextIndex);

    // anima: ativo sobe, buffer sobe para ocupar
    paneActive.style.transform = 'translateY(-100%)';
    paneBuffer.style.transform = 'translateY(0)';

    setTimeout(() => {
      // swap de papéis: buffer vira ativo
      swapPlayersAfterTransition(/*movingUp=*/true, nextIndex);

      // prepara novo buffer (o “próximo do próximo”) sempre na posição +100%
      const nnId = getVideoIdAt(nextIndex + 1);
      try {
        // reseta DOM panes
        paneActive.style.transform = 'translateY(0)';
        paneBuffer.style.transform = 'translateY(100%)';
        // recarrega playerBuffer com o novo id
        if (nnId) {
          safeLoad(playerBuffer, nnId);
        } else {
          // se não há próximo, pausa buffer
          try { playerBuffer && playerBuffer.pauseVideo(); } catch(e){}
        }
      } catch {}
    }, 260);
  }

  function gotoPrevOrClose() {
    if (index <= 0) {
      // primeiro → fecha
      paneActive.style.transform = 'translateY(0)';
      paneBuffer.style.transform = 'translateY(-100%)';
      closeFeed();
      return;
    }
    const prevIndex = index - 1;
    const prevId = getVideoIdAt(prevIndex);

    // Para mostrar o anterior vindo de cima, precisamos que o BUFFER esteja em -100% com o vídeo anterior já lá.
    // Carrega o buffer com o anterior e posiciona-o acima:
    try { safeLoad(playerBuffer, prevId); } catch(e){}
    paneBuffer.style.transform = 'translateY(-100%)';

    // anima: ativo desce, buffer desce para ocupar
    paneActive.style.transform = 'translateY(100%)';
    paneBuffer.style.transform = 'translateY(0)';

    setTimeout(() => {
      // swap de papéis: buffer vira ativo
      swapPlayersAfterTransition(/*movingUp=*/false, prevIndex);

      // prepara novo buffer (o “anterior do anterior” não é necessário; preferimos já preparar o próximo normal)
      const nextId = getVideoIdAt(index + 1);
      paneBuffer.style.transform = 'translateY(100%)';
      if (nextId) {
        safeLoad(playerBuffer, nextId);
      }
    }, 260);
  }

  function safeLoad(player, id) {
    if (!player || !id) return;
    try {
      // loadVideoById troca imediatamente; cueVideoById prepara sem tocar.
      player.cueVideoById(id); // prepara silenciosamente
    } catch (e) {
      // se der erro (ex.: ainda não pronto), recriaremos quando necessário
    }
  }

  function swapPlayersAfterTransition(movingUp, newIndex) {
    // Troca o papel dos DOM panes
    // Ideia: simplesmente trocamos os players entre os contêineres,
    // mas como o YT Player está “fixo” ao div-id, é mais simples:
    //  1) destruímos o que virou “antigo ativo”
    //  2) promovemos o buffer (recriando playerActive com o id do buffer atual)
    //  3) recriamos um buffer fresquinho para o próximo lado
    index = newIndex;

    // Descobre os IDs de destino
    const currId = getVideoIdAt(index);
    const nextId = getVideoIdAt(index + 1);

    // destrói e recria
    try { playerActive && playerActive.destroy(); } catch(e){}
    paneActive.innerHTML = '<div id="wdFeedPlayerActive"></div>';
    playerActive = new YT.Player('wdFeedPlayerActive', {
      videoId: currId,
      playerVars: { playsinline:1, controls:0, rel:0, modestbranding:1 },
      events: {
        onReady: () => { try { playerActive.playVideo(); } catch(e){}; startProgressLoop(); }
      }
    });

    try { playerBuffer && playerBuffer.destroy(); } catch(e){}
    paneBuffer.innerHTML = '<div id="wdFeedPlayerBuffer"></div>';
    if (nextId) {
      playerBuffer = new YT.Player('wdFeedPlayerBuffer', {
        videoId: nextId,
        playerVars: { playsinline:1, controls:0, rel:0, modestbranding:1 }
      });
    } else {
      playerBuffer = null;
    }
  }

  // ===== controles =====
  let controlsWired = false;
  function wireControls() {
    if (controlsWired) return;
    controlsWired = true;

    // Tap central = play/pause
    tap.addEventListener('click', () => {
      if (!playerActive) return;
      const s = playerActive.getPlayerState && playerActive.getPlayerState();
      if (s === YT.PlayerState.PLAYING) playerActive.pauseVideo();
      else playerActive.playVideo();
    });

    // Back (também disponível no gesto horizontal)
    back.addEventListener('click', closeFeed);

    // Ícones (placeholders locais)
    likeBtn.addEventListener('click', () => {
      likeCount.textContent = (+likeCount.textContent + 1);
    });
    shareBtn.addEventListener('click', () => {
      shareCount.textContent = (+shareCount.textContent + 1);
    });

    // Se trocar thumb fora do feed, alinhar índice numa próxima abertura
    thumbsWrap.addEventListener('click', () => {
      if (root.style.display !== 'block') return;
      const i = getActiveIndex();
      if (i >= 0) index = i;
    });

    // Se mudar para landscape com feed aberto → fecha
    mmPortrait.addEventListener('change', () => {
      if (!mmPortrait.matches && root.style.display === 'block') closeFeed();
    });
  }

  // ===== abrir a partir do player visível =====
  openArea.addEventListener('click', () => {
    if (!mmPortrait.matches) return; // só portrait
    // tenta abrir com o vídeo marcado como aria-current, senão cai no 0
    const startId = getVideoIdAt(Math.max(0, getActiveIndex()));
    openFeed(startId);
  });

})();
