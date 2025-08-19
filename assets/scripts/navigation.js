// navigation.js
// Mantém a estrutura original + Swiper.
// Adiciona prévia automática (portrait) usando a YouTube Iframe API sem mudar o HTML/CSS.

window.addEventListener('load', () => {
  const frame = document.getElementById('video-frame');
  const swiperEl = document.getElementById('video-thumbs-swiper');
  const videoTitleEl = document.getElementById('video-title');
  const videoDescEl = document.getElementById('video-description');

  if (!frame || !swiperEl || typeof Swiper === 'undefined') return;

  // ===== Config =====
  const PREVIEW_SECONDS = 6;             // duração da prévia
  const VIS_THRESHOLD = 0.5;             // % mínima visível
  const mmPortrait = window.matchMedia('(orientation: portrait)');

  // ===== Estado =====
  let player = null;
  let playerReady = false;
  let previewTimer = null;
  let isVisible = false;
  let pending = null; // { id, title, description, preview }

  // ===== Swiper (inalterado) =====
  const swiper = new Swiper('#video-thumbs-swiper', {
    slidesPerView: 'auto',
    spaceBetween: 12,
    freeMode: true,
    grabCursor: true,
    mousewheel: { forceToAxis: false },
    keyboard: { enabled: true },
  });

  // Marca o primeiro como ativo e injeta título/descrição iniciais (inalterado)
  const firstBtn = swiperEl.querySelector('.swiper-slide button[data-ytid]');
  if (firstBtn && !swiperEl.querySelector('button[aria-current="true"]')) {
    firstBtn.setAttribute('aria-current', 'true');
    const initialTitle = firstBtn.getAttribute('data-title') || 'Vídeo';
    const initialDescription = firstBtn.getAttribute('data-description') || '';
    if (videoTitleEl) videoTitleEl.textContent = initialTitle;
    if (videoDescEl) videoDescEl.textContent = initialDescription;
    frame.title = initialTitle;
  }

  // ===== Troca de vídeo nas thumbs =====
  swiperEl.addEventListener('click', (e) => {
    const btn = e.target.closest('.swiper-slide button[data-ytid]');
    if (!btn) return;

    const id = btn.getAttribute('data-ytid')?.trim();
    const title = btn.getAttribute('data-title') || 'Vídeo';
    const description = btn.getAttribute('data-description') || '';

    if (!id || /watch\?v=|shorts\//i.test(id)) {
      console.warn('data-ytid deve ser apenas o ID do vídeo YouTube.');
      return;
    }

    // Marca visualmente a thumb ativa
    swiperEl.querySelectorAll('button[aria-current="true"]').forEach(b => b.removeAttribute('aria-current'));
    btn.setAttribute('aria-current', 'true');

    // Troca de vídeo + prévia (se portrait)
    setVideo(id, title, description, /*doPreview*/ true);
  });

  // ===== API do YouTube =====
  function ensureYTAPI(onReady) {
    if (window.YT && YT.Player) { onReady(); return; }
    const prev = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = function () {
      if (typeof prev === 'function') prev();
      onReady();
    };
    if (!document.querySelector('script[src*="youtube.com/iframe_api"]')) {
      const s = document.createElement('script');
      s.src = 'https://www.youtube.com/iframe_api';

      document.head.appendChild(s);
    }
  }

  function initPlayer() {
    // Cria o player usando o próprio iframe #video-frame já existente (sem mexer no HTML).
    player = new YT.Player('video-frame', {
      playerVars: {
        playsinline: 1,
        rel: 0,
        modestbranding: 1,
        origin: location.origin,
        controls: mmPortrait.matches ? 0 : 1,
        disablekb: mmPortrait.matches ? 1 : 0
      },
      events: {
        onReady: () => {
          playerReady = true;

          // Se houve clique antes da API ficar pronta, refaz a troca agora
          if (pending) {
            const { id, title, description, preview } = pending;
            pending = null;
            setVideo(id, title, description, preview);
            return;
          }

          // Garante prévia inicial no portrait para o vídeo ativo
          const activeBtn = swiperEl.querySelector('button[aria-current="true"][data-ytid]') || firstBtn;
          if (activeBtn) {
            const id = activeBtn.getAttribute('data-ytid');
            const title = activeBtn.getAttribute('data-title') || 'Vídeo';
            const description = activeBtn.getAttribute('data-description') || '';
            setVideo(id, title, description, /*doPreview*/ mmPortrait.matches);
          }
        }
      }
    });
  }

  function startPreview() {
    if (!playerReady || !isVisible || !mmPortrait.matches) return;
    clearTimeout(previewTimer);
    try {
      player.mute();
      if (typeof player.seekTo === 'function') player.seekTo(0, true);
      player.playVideo();
      previewTimer = setTimeout(() => {
        try {
          player.pauseVideo();
        } catch { }
      }, PREVIEW_SECONDS * 1000);
    } catch { }
  }

  function setVideo(id, title, description, doPreview) {
    // Atualiza título/descrição (inalterado)
    if (videoTitleEl) videoTitleEl.textContent = title || 'Vídeo';
    if (videoDescEl) videoDescEl.textContent = description || '';
    frame.title = title || 'Vídeo';

    if (!playerReady) {
      // Mantém comportamento antigo enquanto a API carrega (atualiza src)
      frame.src = `https://www.youtube.com/embed/${id}?enablejsapi=1&playsinline=1&rel=0&modestbranding=1&controls=${mmPortrait.matches ? 0 : 1}&disablekb=${mmPortrait.matches ? 1 : 0}`;
      pending = { id, title, description, preview: doPreview };
      return;
    }

    try {
      if (mmPortrait.matches && doPreview) {
        // Troca e roda prévia (sempre reinicia do 0)
        player.loadVideoById(id, 0, 'large');
        startPreview();
      } else {
        // No landscape, só prepara sem tocar sozinho
        player.cueVideoById(id);
      }
    } catch {
      // Fallback mínimo mantendo sua estrutura
      frame.src = `https://www.youtube.com/embed/${id}?enablejsapi=1&playsinline=1&rel=0&modestbranding=1&controls=${mmPortrait.matches ? 0 : 1}&disablekb=${mmPortrait.matches ? 1 : 0}`;

    }
  }

  // ===== Visibilidade do iframe (prévia só quando realmente visível) =====
  const io = new IntersectionObserver((entries) => {
    const e = entries[0];
    isVisible = !!e && e.isIntersecting && e.intersectionRatio >= VIS_THRESHOLD;
    if (isVisible && mmPortrait.matches) {
      startPreview();
    } else {
      clearTimeout(previewTimer);
      try { player && player.pauseVideo(); } catch { }
    }
  }, { threshold: [VIS_THRESHOLD] });
  io.observe(frame);

  // ===== Mudança de orientação: refaz a prévia no portrait =====
  mmPortrait.addEventListener('change', () => {
    clearTimeout(previewTimer);
    try { player && player.pauseVideo(); } catch { }
    if (mmPortrait.matches && isVisible) {
      startPreview();
    }
  });

  // Sobe a API
  ensureYTAPI(initPlayer);
});
