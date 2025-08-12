let previewPlayer, previewStopTimer=null;

function initPreviewPlayer(){
  previewPlayer = new YT.Player('previewVideo', {
    videoId: ytVideos[0],
    playerVars: {
      playsinline:1, controls:1, rel:0, modestbranding:1,
      autoplay:1, mute:1
    },
    events: { 'onReady': onPreviewReady }
  });
}

function onPreviewReady(){
  try{ previewPlayer.mute(); }catch(e){}
  try{ previewPlayer.playVideo(); }catch(e){}
  if (PREVIEW_SECONDS > 0) {
    clearTimeout(previewStopTimer);
    previewPlayer.seekTo(0, true);
    previewStopTimer = setTimeout(()=>{ previewPlayer.pauseVideo(); }, PREVIEW_SECONDS*1000);
  }

  // Thumbs trocam o vídeo
  document.querySelectorAll('#videoCarousel .thumb-item').forEach(img=>{
    img.addEventListener('click', ()=>{
      const id = img.getAttribute('data-ytid');
      previewPlayer.loadVideoById(id, 0, "hd1080");
      if (PREVIEW_SECONDS > 0) {
        clearTimeout(previewStopTimer);
        previewPlayer.playVideo();
        previewStopTimer = setTimeout(()=>{ previewPlayer.pauseVideo(); }, PREVIEW_SECONDS*1000);
      }
    });
  });

  // Overlay abre Feed com o mesmo vídeo
  document.getElementById('previewTap').addEventListener('click', ()=>{
    const vid = previewPlayer?.getVideoData()?.video_id || ytVideos[0];
    if (typeof openFeed === 'function') openFeed(vid);
  });
}

window.onYouTubeIframeAPIReady = function(){
  initPreviewPlayer();
  if(typeof initFeedPlayer === 'function') initFeedPlayer();
};

