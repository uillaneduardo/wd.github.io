/* ===== Config ===== */
const PREVIEW_SECONDS = 6; // pré-visualização de 6s
let isLoggedIn = false;
const ytVideos = ["dQw4w9WgXcQ","9bZkp7q19f0","e-ORhEE9VVg","3JZ_D3ELwOQ"];
let currentIndex = 0;

/* ===== ETA "next spin" fake ===== */
const nextSpinEtaEl = document.getElementById('nextSpinEta');
let etaMinutes = 20*60 + 57;
function updateEta(){
  if(etaMinutes<0) return;
  const h = Math.floor(etaMinutes/60);
  const m = etaMinutes%60;
  nextSpinEtaEl.textContent = `${String(h).padStart(2,'0')}h${String(m).padStart(2,'0')}m`;
  etaMinutes--;
}
updateEta();
setInterval(updateEta, 60_000);

/* ===== Feed Player ===== */
let feedPlayer;
function initFeedPlayer(){
  feedPlayer = new YT.Player('feedVideo', {
    videoId: ytVideos[currentIndex],
    playerVars: { playsinline:1, controls:0, rel:0, modestbranding:1 },
    events: { 'onReady': onFeedReady }
  });
}
function onFeedReady(){
  try{ feedPlayer.mute(); }catch(e){}
  startFeedProgressLoop();
}

/* ===== Feed ===== */
const feedScreen = document.getElementById('feedScreen');
const backBtn = document.getElementById('backBtn');

function openFeed(videoId){
  feedScreen.style.display = 'block';
  document.body.style.overflow = 'hidden';
  const idx = ytVideos.indexOf(videoId);
  currentIndex = idx >= 0 ? idx : 0;
  feedPlayer.loadVideoById(ytVideos[currentIndex], 0, "hd1080");
  try{ feedPlayer.playVideo(); }catch(e){}
}
function closeFeed(){
  feedScreen.style.display = 'none';
  document.body.style.overflow = '';
  try{ feedPlayer.pauseVideo(); }catch(e){}
}
backBtn.addEventListener('click', closeFeed);

// Barra de progresso (indicador apenas)
const progressFill = document.querySelector('.progress-bar-fill');
let progressLoop = null;
function startFeedProgressLoop(){
  clearInterval(progressLoop);
  progressLoop = setInterval(()=>{
    if(!feedPlayer || typeof feedPlayer.getDuration!=="function") return;
    const dur = feedPlayer.getDuration() || 0;
    const cur = feedPlayer.getCurrentTime? feedPlayer.getCurrentTime() : 0;
    const p = dur ? (cur/dur)*100 : 0;
    progressFill.style.width = p + '%';
  }, 180);
}

// Pause/Play no toque central do feed
document.getElementById('feedTap').addEventListener('click', ()=>{
  const s = feedPlayer.getPlayerState();
  if(s === YT.PlayerState.PLAYING){ feedPlayer.pauseVideo(); }
  else { feedPlayer.playVideo(); }
});

// Ações com gate de login
const likeBtn = document.getElementById('likeBtn');
const shareBtn = document.getElementById('shareBtn');
const likeCount = document.getElementById('likeCount');
const shareCount = document.getElementById('shareCount');

likeBtn.addEventListener('click', ()=>{
  if(!isLoggedIn) return openLogin();
  likeCount.textContent = (+likeCount.textContent + 1);
});
shareBtn.addEventListener('click', ()=>{
  if(!isLoggedIn) return openLogin();
  shareCount.textContent = (+shareCount.textContent + 1);
});

// Swipe com animação mais fluida
const feedContainer = document.getElementById('feedContainer');
let startY = 0, currentY = 0, swiping = false;

feedContainer.addEventListener('touchstart', (e)=>{
  swiping = true;
  startY = e.touches[0].clientY;
  currentY = startY;
  const el = document.getElementById('feedVideo');
  el.style.transition = 'none';
}, {passive:true});

feedContainer.addEventListener('touchmove', (e)=>{
  if(!swiping) return;
  currentY = e.touches[0].clientY;
  const dy = currentY - startY;
  const el = document.getElementById('feedVideo');
  el.style.transform = `translateY(${dy}px)`;
}, {passive:true});

feedContainer.addEventListener('touchend', ()=>{
  if(!swiping) return;
  swiping = false;
  const dy = currentY - startY;
  const el = document.getElementById('feedVideo');
  const threshold = Math.min(120, window.innerHeight * 0.18);
  el.style.transition = 'transform .3s cubic-bezier(.2,.8,.2,1)';
  if(dy < -threshold && currentIndex < ytVideos.length-1){
    currentIndex++;
    el.style.transform = 'translateY(-100%)';
    setTimeout(()=>{
      feedPlayer.loadVideoById(ytVideos[currentIndex], 0, "hd1080");
      el.style.transform = 'translateY(0)';
    }, 300);
  } else if(dy > threshold && currentIndex > 0){
    currentIndex--;
    el.style.transform = 'translateY(100%)';
    setTimeout(()=>{
      feedPlayer.loadVideoById(ytVideos[currentIndex], 0, "hd1080");
      el.style.transform = 'translateY(0)';
    }, 300);
  } else {
    el.style.transform = 'translateY(0)';
  }
});

/* ===== Popup Login (parcial) ===== */
const loginPopup = document.getElementById('loginPopup');
const closeLoginPopup = document.getElementById('closeLoginPopup');
const userIcon = document.getElementById('userIcon');

function openLogin(){
  loginPopup.style.display = 'block';
}
function closeLogin(){
  loginPopup.style.display = 'none';
}

userIcon.addEventListener('click', openLogin);
closeLoginPopup.addEventListener('click', closeLogin);

document.getElementById('loginGoogle').addEventListener('click', ()=>{
  isLoggedIn = true; closeLogin(); alert('Logado com Google (simulação)'); window.location.href = 'roleta.html';
});
document.getElementById('loginApple').addEventListener('click', ()=>{
  isLoggedIn = true; closeLogin(); alert('Logado com Apple (simulação)'); window.location.href = 'roleta.html';
});

// Join & Claim: abre login se não autenticado
document.getElementById('joinClaimBtn').addEventListener('click', ()=>{
  if(!isLoggedIn) return openLogin();
  window.location.href = 'roleta.html';
});

// ESC fecha popup
document.addEventListener('keydown', (e)=>{
  if(e.key === 'Escape' && loginPopup.style.display==='block') closeLogin();
});

