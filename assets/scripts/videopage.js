// videopage.js
const bodyUi = document.querySelectorAll(".scrollable");
const btnOpenVideoPage = document.getElementById("btn-open-video");
const btnCloseVideoPage = document.getElementById("btn-close-video");
const videoPage = document.getElementById("video-page");

const firstExit = document.getElementById("player-first-exit");
const lastExit  = document.getElementById("player-last-exit");
const thumbsSwiper = document.getElementById("video-thumbs-swiper");

// var
let closed = true;
let unlistenSnapEnd = null;         // remove o listener quando fechar
let videoPageIframe = null;         // iframe que será movido entre os cards

// Listeners
btnOpenVideoPage.addEventListener("click", startVideoPage);
btnCloseVideoPage.addEventListener("click", finishVideoPage);

function startVideoPage(){
  openVideoPage();
  closed = false;

  // garante o iframe da videopage
  videoPageIframe = ensureVideoPageIframe();

  // alinhar card inicial ao item ativo do carrossel
  alignVideoPageToActiveThumb();

  // monta imediatamente no card visível ao abrir
  onSnapEnd(videoPage, videoPageIframe);

  // adiciona listener de scrollend somente enquanto a videopage estiver aberta
  unlistenSnapEnd = addSnapEndListener(videoPage, videoPageIframe);
}

function finishVideoPage(){
  if (typeof unlistenSnapEnd === 'function') {
    unlistenSnapEnd();
    unlistenSnapEnd = null;
  }
  closeVideoPage();
  closed = true;
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
   ESQUELETO — FUNÇÕES
   ============================ */

// 1) Retorna o card ativo (um card = 100vh; chamamos só no fim do snap)
function getActiveCard(container) {
  const r = container.getBoundingClientRect();
  const x = r.left + r.width / 2;
  const y = r.top + r.height / 2;
  return document.elementFromPoint(x, y)?.closest('.video-page-content') || null;
}

// 2) Move o iframe para dentro do card alvo (sem recriar)
function mountIframeInCard(activeCard, iframeEl) {
  if (!activeCard || !iframeEl) return;
  if (iframeEl.parentNode !== activeCard) {
    activeCard.appendChild(iframeEl);
  }
}

// 3) Handler chamado AO TERMINAR O SNAP (scrollend)
// - se for um exit (topo/base), fecha a videopage
// - senão, monta o iframe no card ativo
function onSnapEnd(container, iframeEl) {
  const active = getActiveCard(container);
  if (!active) return;

  // comparação por referência de objeto funciona em JS
  if (active === firstExit || active === lastExit) {
    finishVideoPage();
    return;
  }

  mountIframeInCard(active, iframeEl);
}

// 4) Adiciona/remover listener NO OPEN/CLOSE
function addSnapEndListener(container, iframeEl) {
  const handler = () => onSnapEnd(container, iframeEl);
  container.addEventListener('scrollend', handler);
  return () => container.removeEventListener('scrollend', handler);
}

// 5) Garante um <iframe id="video-page-iframe"> para a videopage (apenas esqueleto)
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
   Alinhar início com o carrossel
   ============================ */

// Encontra o índice da thumb ativa no swiper e rola para o card correspondente.
// Considera apenas cards de vídeo (exclui exits).
function alignVideoPageToActiveThumb() {
  if (!thumbsSwiper) return;

  // pega todas as thumbs em ordem
  const btns = Array.from(thumbsSwiper.querySelectorAll('.swiper-slide button[data-ytid]'));
  if (btns.length === 0) return;

  // encontra a ativa; se não houver, usa a primeira
  let activeBtn = thumbsSwiper.querySelector('.swiper-slide button[aria-current="true"][data-ytid]');
  if (!activeBtn) activeBtn = btns[0];

  const activeIndex = btns.indexOf(activeBtn);
  if (activeIndex < 0) return;

  // seleciona apenas os cards de vídeo (exclui os exits)
  const videoCards = Array.from(videoPage.querySelectorAll('.video-page-content'))
    .filter(el => el !== firstExit && el !== lastExit);

  const targetCard = videoCards[activeIndex] || videoCards[0];
  if (targetCard && typeof targetCard.scrollIntoView === 'function') {
    // comportamento simples; “instant” não é padrão em todos os browsers
    targetCard.scrollIntoView({ block: 'center', behavior: 'auto' });
  }
}
