// videopage.js
const bodyUi = document.querySelectorAll(".scrollable");
const btnOpenVideoPage = document.getElementById("btn-open-video");
const btnCloseVideoPage = document.getElementById("btn-close-video");
const videoPage = document.getElementById("video-page");

// var
let closed = true;

// Listeners
btnOpenVideoPage.addEventListener("click", startVideoPage);
btnCloseVideoPage.addEventListener("click", finishVideoPage);

function startVideoPage(){
  openVideoPage(1,1);
  closed = false;
}
function finishVideoPage(){
  closeVideoPage();
  closed = true;
}

function openVideoPage(videoId, index){
  bodyUi.forEach(ui => ui.classList.add("block-ui"));
  videoPage.classList.remove("closed-ui");

  // chamar reciclagem no término do snap (mobile)
  bindSnapEnd();
}

function closeVideoPage(){
  videoPage.classList.add("closed-ui");
  bodyUi.forEach(ui => ui.classList.remove("block-ui"));

  unbindSnapEnd();
}

/* ===========================
   RECICLAGEM SIMPLES
   =========================== */

function getContents() {
  return videoPage.querySelectorAll(".video-page-content");
}

// Joga o primeiro .video-page-content para o final
function recycleDown() {
  const contents = getContents();
  const first = contents[0];
  if (first) videoPage.appendChild(first);
}

// Joga o último .video-page-content logo antes do primeiro conteúdo
function recycleUp() {
  const contents = getContents();
  const last = contents[contents.length - 1];
  const first = contents[0];
  if (last && first) videoPage.insertBefore(last, first);
}

/* ===========================
   SNAP END (mobile)
   =========================== */

let removeSnapListener = null;

function bindSnapEnd() {
  unbindSnapEnd(); // evita duplicar

  const onSnapEnd = () => {
    const atTop = videoPage.scrollTop === 0;
    const atBottom = (videoPage.scrollTop + videoPage.clientHeight) >= videoPage.scrollHeight;

    if (atTop) {
      recycleUp();
    } else if (atBottom) {
      recycleDown();
    }
  };

  videoPage.addEventListener("scrollend", onSnapEnd);
  removeSnapListener = () => videoPage.removeEventListener("scrollend", onSnapEnd);
}

function unbindSnapEnd() {
  if (typeof removeSnapListener === "function") {
    removeSnapListener();
    removeSnapListener = null;
  }
}
