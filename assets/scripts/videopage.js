const bodyUi = document.querySelectorAll(".scrollable");
const btnOpenVideoPage = document.getElementById("btn-open-video");
const btnCloseVideoPage = document.getElementById("btn-close-video");
const videoPage = document.getElementById("video-page");
//var
let closed = true;
//Listeners
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

  bodyUi.forEach(ui => {
    ui.classList.add("block-ui");
  });

  videoPage.classList.remove("closed-ui");
}
function closeVideoPage(){

  videoPage.classList.add("closed-ui");

  bodyUi.forEach(ui => {
    ui.classList.remove("block-ui");
  });

}
