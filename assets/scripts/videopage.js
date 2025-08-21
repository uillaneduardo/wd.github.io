// videopage.js
const bodyUi = document.querySelectorAll(".scrollable");
const btnOpenVideoPage = document.getElementById("btn-open-video");
const btnCloseVideoPage = document.getElementById("btn-close-video");
const videoPage = document.getElementById("video-page");

const firstExit = document.getElementById("player-first-exit");
const lastExit = document.getElementById("player-last-exit");
const thumbsSwiper = document.getElementById("video-thumbs-swiper");

// Estado
let closed = true;
let unlistenSnapEnd = null;           // remove o listener ao fechar
let videoPageIframe = null;           // iframe que é movido entre cards
let player = null;                    // YT player
let playerReady = false;
let lastActiveCard = null;            // evita recarregar o mesmo card
let wantsAutoplayAudio = false;       // vira true após 1 interação do usuário
const mmPortrait = window.matchMedia('(orientation: portrait)');

// ===== Listeners globais
btnOpenVideoPage.addEventListener("click", (e) => {
  wantsAutoplayAudio = true;
  startVideoPage();
});
btnCloseVideoPage.addEventListener("click", finishVideoPage);

// Uma única interação habilita áudio para as próximas trocas
['pointerup', 'click', 'touchend'].forEach(ev => {
  videoPage.addEventListener(ev, () => {
    wantsAutoplayAudio = true;
    try {
      if (playerReady && player) {
        player.unMute();
        // se estiver pausado exatamente nesse momento, tenta tocar
        if (player.getPlayerState?.() !== 1) player.playVideo?.();
      }
    } catch { }
  }, { passive: true });
});

// ===== Abertura/fechamento
function startVideoPage() {
  openVideoPage();
  closed = false;

  // Infra mínima
  addPreconnect('https://www.youtube.com');
  addPreconnect('https://i.ytimg.com');

  // Iframe que será realocado
  videoPageIframe = ensureVideoPageIframe();

  // Vincula cards de vídeo aos ids das thumbs e aplica capa
  mapThumbsToVideoCards();

  // Posiciona no mesmo índice da thumb ativa
  alignVideoPageToActiveThumb();

  // Sobe a Iframe API e cria o player (uma vez)
  ensureYTAPI(() => ensurePlayer(() => {
  const active = getActiveCard(videoPage);
  if (active && active !== firstExit && active !== lastExit) {
    lastActiveCard = active;
    mountIframeInCard(active, videoPageIframe);
    const vid = active.getAttribute('data-ytid-videopage');
    if (vid) {
      setActiveVideo(vid, { autoplay: mmPortrait.matches }); // carrega/cueia o inicial
    } 
  }
}));

  // Listener de fim do snap ativo só enquanto a videopage estiver aberta
  unlistenSnapEnd = addSnapEndListener(videoPage, videoPageIframe);

  // Se mudar orientação durante a sessão, ajusta controles
  mmPortrait.addEventListener('change', onOrientationChange, { once: true });
}

function finishVideoPage() {
  // Remove listener (se existir)
  if (typeof unlistenSnapEnd === 'function') {
    unlistenSnapEnd();
    unlistenSnapEnd = null;
  }

  // PAUSA SEGURA ao fechar
  try {
    if (playerReady && player) {
      player.pauseVideo();
    }
  } catch { }

  closeVideoPage();
  closed = true;

  // Reset opcional do marcador de card
  lastActiveCard = null;
}

function openVideoPage() {
  bodyUi.forEach(ui => ui.classList.add("block-ui"));
  videoPage.classList.remove("closed-ui");
}

function closeVideoPage() {
  videoPage.classList.add("closed-ui");
  bodyUi.forEach(ui => ui.classList.remove("block-ui"));
}

/* ============================
   CORE — Ativo, snap e montagem
   ============================ */

// Card ativo (um card = 100vh; chamado só no fim do snap)
function getActiveCard(container) {
  const r = container.getBoundingClientRect();
  const x = r.left + r.width / 2;
  const y = r.top + r.height / 2;
  return document.elementFromPoint(x, y)?.closest('.video-page-content') || null;
}

// Move o iframe para dentro do card alvo (sem recriar)
function mountIframeInCard(activeCard, iframeEl) {
  if (!activeCard || !iframeEl) return;
  if (iframeEl.parentNode !== activeCard) {
    activeCard.appendChild(iframeEl);
  }
}

// Handler do fim do snap:
// - se for exit, fecha;
// - se for o MESMO card de antes, não faz nada (evita reiniciar);
// - senão, monta iframe e carrega/cue o vídeo daquele card.
function onSnapEnd(container, iframeEl) {
  const active = getActiveCard(container);
  if (!active) return;

  if (active === firstExit || active === lastExit) {
    finishVideoPage();
    return;
  }

  // se é o mesmo card, não interrompe o vídeo
  if (active === lastActiveCard) return;
  lastActiveCard = active;

  mountIframeInCard(active, iframeEl);

  const vid = active.getAttribute('data-ytid-videopage');
  if (vid) {
    setActiveVideo(vid, { autoplay: mmPortrait.matches });
  }
}

// Listener plugado no open/close
function addSnapEndListener(container, iframeEl) {
  const handler = () => onSnapEnd(container, iframeEl);
  container.addEventListener('scrollend', handler);
  return () => container.removeEventListener('scrollend', handler);
}

// Garante <iframe id="video-page-iframe">
function ensureVideoPageIframe() {
  let el = document.getElementById('video-page-iframe');
  if (el) return el;

  el = document.createElement('iframe');
  el.id = 'video-page-iframe';
  el.title = 'video-page';
  el.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
  el.allowFullscreen = true;
  el.referrerPolicy = "strict-origin-when-cross-origin";
  el.style.width = '100%';
  el.style.height = '100%';
  el.style.border = '0';
  return el;
}

/* ============================
   YouTube Iframe API (mínimo)
   ============================ */

function ensureYTAPI(onReady) {
  if (window.YT && window.YT.Player) { onReady(); return; }
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

function ensurePlayer(onReady) {
  if (playerReady && player) { onReady(); return; }
  player = new YT.Player('video-page-iframe', {
    playerVars: {
      playsinline: 1,
      rel: 0,
      modestbranding: 1,
      origin: location.origin,
      controls: mmPortrait.matches ? 0 : 1,
      disablekb: mmPortrait.matches ? 1 : 0
    },
    events: {
      onReady: () => { playerReady = true; onReady(); },
      onStateChange: (e) => {
        // LOOP: se terminar, volta ao início e toca
        const ENDED = 0;
        if (e.data === ENDED) {
          try {
            player.seekTo(0, true);
            player.playVideo();
          } catch { }
        }
      }
    }
  });
}

function setActiveVideo(videoId, { autoplay } = { autoplay: false }) {
  if (playerReady && player) {
    try {
      if (autoplay) {
        // Sempre inicia muted: isso garante autoplay no mobile
        player.mute();
        player.loadVideoById(videoId, 0, 'large');

        // Se o usuário já “liberou” áudio em um toque anterior,
        // desmuta e dá play logo em seguida:
        if (wantsAutoplayAudio) {
          player.unMute();
          player.playVideo();
        }
      } else {
        player.cueVideoById(videoId);
      }
      return;
    } catch {}
  }

  // Se o player ainda não está pronto, seta src mínimo (mantém política de controles)
  if (videoPageIframe) {
    videoPageIframe.src =
      `https://www.youtube.com/embed/${videoId}` +
      `?enablejsapi=1&playsinline=1&rel=0&modestbranding=1` +
      `&controls=${mmPortrait.matches ? 0 : 1}` +
      `&disablekb=${mmPortrait.matches ? 1 : 0}`;
  }
}

/* ============================
   Capas + mapeamento de ordens
   ============================ */

function mapThumbsToVideoCards() {
  if (!thumbsSwiper) return;

  const btns = Array.from(thumbsSwiper.querySelectorAll('.swiper-slide button[data-ytid]'));
  if (!btns.length) return;

  const videoCards = Array.from(videoPage.querySelectorAll('.video-page-content'))
    .filter(el => el !== firstExit && el !== lastExit);

  videoCards.forEach((card, i) => {
    const btn = btns[i];
    if (!btn) return;
    const id = (btn.getAttribute('data-ytid-videopage') || btn.getAttribute('data-ytid') || '').trim();
    if (!id) return;
    card.setAttribute('data-ytid-videopage', id);
    decorateCardCover(card, id);
    // pré-carrega imagem da próxima capa
    const next = btns[i + 1];
    if (next) {
      const nextId = (next.getAttribute('data-ytid-videopage') || next.getAttribute('data-ytid') || '').trim();
      if (nextId) {
        const img = new Image();
        img.src = `https://img.youtube.com/vi/${nextId}/hqdefault.jpg`;
      }
    }
  });
}

function decorateCardCover(card, videoId) {
  card.style.backgroundImage = `url("https://img.youtube.com/vi/${videoId}/hqdefault.jpg")`;
  card.style.backgroundSize = 'cover';
  card.style.backgroundPosition = 'center';
}

function alignVideoPageToActiveThumb() {
  if (!thumbsSwiper) return;

  const btns = Array.from(thumbsSwiper.querySelectorAll('.swiper-slide button[data-ytid]'));
  if (!btns.length) return;

  let activeBtn = thumbsSwiper.querySelector('.swiper-slide button[aria-current="true"][data-ytid]');
  if (!activeBtn) activeBtn = btns[0];

  const activeIndex = Math.max(0, btns.indexOf(activeBtn));

  const videoCards = Array.from(videoPage.querySelectorAll('.video-page-content'))
    .filter(el => el !== firstExit && el !== lastExit);

  const targetCard = videoCards[activeIndex] || videoCards[0];
  if (targetCard?.scrollIntoView) {
    targetCard.scrollIntoView({ block: 'center', behavior: 'auto' });
  }
}

/* ============================
   Utilidades
   ============================ */

function addPreconnect(href) {
  if (document.querySelector(`link[rel="preconnect"][href="${href}"]`)) return;
  const l = document.createElement('link');
  l.rel = 'preconnect';
  l.href = href;
  l.crossOrigin = '';
  document.head.appendChild(l);
}

function onOrientationChange() {
  try {
    if (!playerReady || !player) return;
    player.setOption('playerVars', 'controls', mmPortrait.matches ? 0 : 1);
    player.setOption('playerVars', 'disablekb', mmPortrait.matches ? 1 : 0);
  } catch { }
}
