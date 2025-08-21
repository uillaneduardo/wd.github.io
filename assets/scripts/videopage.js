// videopage.js
const bodyUi = document.querySelectorAll(".scrollable");
const videoPage = document.getElementById("video-page");

const firstExit = document.getElementById("player-first-exit");
const lastExit  = document.getElementById("player-last-exit");

let activeCard = null;
let lastActiveCard = null;
let videoPagePlayer = null;

const cards = document.querySelectorAll(".video-page-content");
const videoCards = Array.from(cards).filter(el => el !== firstExit && el !== lastExit);

const videoPageIframe = document.getElementById("video-page-frame");
const cardMainSlide = document.getElementById("card-video");
const thumbsSwiper = document.getElementById("video-thumbs-swiper");

const btnCloseVideoPage = document.getElementById("btn-close-video");

let closed = true;
let unlistenSnapEnd = null;

cardMainSlide.addEventListener("click", startVideoPage);
btnCloseVideoPage.addEventListener("click", finishVideoPage);

function startVideoPage(){
  openVideoPage();
  closed = false;

  // alinhar card inicial ao item ativo do carrossel
  alignVideoPageToActiveThumb();
  // monta imediatamente no card visível ao abrir
  onSnapEnd(videoPage);

  // listener de scrollend só enquanto estiver aberto
  unlistenSnapEnd = addSnapEndListener(videoPage, videoPageIframe);
}

function finishVideoPage(){

  if (typeof unlistenSnapEnd === 'function') {
    unlistenSnapEnd();
    unlistenSnapEnd = null;
  }
  closeVideoPage();
  closed = true;

  if (videoPagePlayer && typeof videoPagePlayer.stopVideo === 'function') {
    videoPagePlayer.stopVideo();
  }
}

function openVideoPage(){
  bodyUi.forEach(ui => ui.classList.add("block-ui"));
  videoPage.classList.remove("closed-ui");
}

function closeVideoPage(){
  videoPage.classList.add("closed-ui");
  bodyUi.forEach(ui => ui.classList.remove("block-ui"));
}

/* ============================
   FUNÇÕES DO ESQUELETO
   ============================ */

// Retorna o card ativo (1 card = 100vh; só chamamos no fim do snap)
function getActiveCard(container) {
  const r = container.getBoundingClientRect();
  const x = r.left + r.width / 2;
  const y = r.top + r.height / 2;

  let prevPE;
  if (videoPageIframe) {
    prevPE = videoPageIframe.style.pointerEvents;
    videoPageIframe.style.pointerEvents = 'none';
  }

  const el = document.elementFromPoint(x, y);
  const card = el?.closest('.video-page-content') || null;

  if (videoPageIframe) {
    videoPageIframe.style.pointerEvents = prevPE || '';
  }
  return card;
}



// Handler do fim do snap
function onSnapEnd(container) {
  lastActiveCard = activeCard;
  activeCard = getActiveCard(container);

  if (!activeCard || lastActiveCard === activeCard) return;

  // Se for card de saída, fecha
  if (activeCard === firstExit || activeCard === lastExit) {
    finishVideoPage();
    return;
  }
  alignToCard(activeCard);
  updateVideoPagePlayer(activeCard)
}

// Adiciona/remove listener de scrollend
function addSnapEndListener(container, iframeEl) {
  const handler = () => onSnapEnd(container, iframeEl);
  container.addEventListener('scrollend', handler);
  return () => container.removeEventListener('scrollend', handler);
}

// Alinha início com o carrossel
function alignVideoPageToActiveThumb() {
  if (!thumbsSwiper) return;

  const btns = Array.from(thumbsSwiper.querySelectorAll('.swiper-slide button[data-ytid]'));
  if (btns.length === 0) return;

  let activeBtn = thumbsSwiper.querySelector('.swiper-slide button[aria-current="true"][data-ytid]');
  if (!activeBtn) activeBtn = btns[0];

  const activeIndex = btns.indexOf(activeBtn);
  if (activeIndex < 0) return;

  const targetCard = videoCards[activeIndex] || videoCards[0];
  if (targetCard && typeof targetCard.scrollIntoView === 'function') {
    targetCard.scrollIntoView({ block: 'center', behavior: 'auto' });
  }
}

//Posiciona o vídeo na tela
function alignToCard(card){
  // target.offsetTop é a posição do card dentro do próprio #video-page
  videoPageIframe.style.transform = `translateY(${card.offsetTop}px)`;
}

function initVideoPagePlayer() {
  videoPagePlayer = new YT.Player('video-page-frame', {
    playerVars: { playsinline:1, rel:0, modestbranding:1, controls:0, autoplay:1 },
    events: {
      onReady: () => {
        const initial = activeCard || getActiveCard(videoPage);
        updateVideoPagePlayer(initial);
      }
    }
  });
}

function updateVideoPagePlayer(card) {
  const ytid = card?.getAttribute('data-ytid-videopage');

  if (ytid && videoPagePlayer && typeof videoPagePlayer.loadVideoById === 'function') {
    videoPagePlayer.loadVideoById(ytid, 0, 'hd1080');
  }
}

function ensureYTAPI(callback) {
  if (window.YT && YT.Player) {
    callback();
    return;
  }

  const prev = window.onYouTubeIframeAPIReady;
  window.onYouTubeIframeAPIReady = function () {
    if (typeof prev === 'function') prev();
    callback();
  };

  if (!document.querySelector('script[src*="youtube.com/iframe_api"]')) {
    const s = document.createElement('script');
    s.src = 'https://www.youtube.com/iframe_api';
    document.head.appendChild(s);
  }
}

function applyVideoPageThumbnails() {
  // Usa a lista já filtrada que você tem (cards sem os exits)
  (videoCards || []).forEach(card => {
    const id = card.getAttribute('data-ytid-videopage');
    if (!id) return;

    const tryMax = `https://img.youtube.com/vi/${id}/maxresdefault.jpg`;
    const tryHQ  = `https://img.youtube.com/vi/${id}/hqdefault.jpg`;

    // Preload com fallback
    const probe = new Image();

    const applyBG = (url) => {
      // aplica uma única vez as propriedades base
      card.style.backgroundImage  = `url("${url}")`;
      card.style.backgroundSize   = 'cover';
      card.style.backgroundPosition = 'center';
      card.style.backgroundRepeat = 'no-repeat';
    };

    probe.onload = () => applyBG(probe.src);
    probe.onerror = () => {
      if (probe.src !== tryHQ) {
        probe.src = tryHQ; // fallback
      }
    };

    probe.src = tryMax; // tenta a maior resolução primeiro
  });
}

ensureYTAPI(initVideoPagePlayer);
applyVideoPageThumbnails();