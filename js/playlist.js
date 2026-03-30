/* =========================
   PLAYLIST PLAYER INIT (Async-Safe)
========================= */
function initPlaylist(root = null) {
  root = root || document;

  const playerRoot = root.querySelector("#playlist-player");
  if (!playerRoot) return;

  const audio = playerRoot.querySelector("#playlist-audio");
  const playPauseBtn = playerRoot.querySelector("#play-pause");

  if (!audio || !playPauseBtn) return;

  if (!playPauseBtn.dataset.bound) {
    playPauseBtn.dataset.bound = "true";

    playPauseBtn.addEventListener("click", () => {
      if (audio.paused) {
        // 👇 Stop all mini players first!
        document.querySelectorAll(".post-left-audio").forEach(box => {
          const miniAudio = box.querySelector(".post-audio");
          const miniBtn = box.querySelector(".play-pause-btn");
          const miniImg = box.querySelector("img");
          if (miniAudio) miniAudio.pause();
          if (miniBtn) miniBtn.textContent = "▶";
          if (miniImg) miniImg.classList.remove("spinning");
        });

        audio.play();
        playPauseBtn.textContent = "‖";
      } else {
        audio.pause();
        playPauseBtn.textContent = "▶";
      }
    });
  }

  if (!audio.src) audio.src = "media/audio/tornado.mp3";
}
/* =========================
   Async-safe auto-init
========================= */
async function waitForPlaylist(timeout = 2000) {
  return new Promise(resolve => {
    const el = document.getElementById("playlist-container");
    if (el) return resolve(el);

    const observer = new MutationObserver((mutations, obs) => {
      const container = document.getElementById("playlist-container");
      if (container) {
        obs.disconnect();
        resolve(container);
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    setTimeout(() => {
      observer.disconnect();
      resolve(null);
    }, timeout);
  });
}

// Auto-init safely after partials load
document.addEventListener("DOMContentLoaded", async () => {
  const container = await waitForPlaylist();
  if (container) initPlaylist(container);
});

// Expose globally for partial loader integration
window.initPlaylist = initPlaylist;


