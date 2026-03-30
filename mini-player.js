
/* =========================
   MINI MUSIC PLAYER (Post Audio)
   Works with dynamically loaded content!
========================= */

function initPostAudio(root = null) {
  root = root || document;
  
  const postsAudio = root.querySelectorAll(".post-left-audio");

  postsAudio.forEach(box => {
    const audio = box.querySelector(".post-audio");
    const btn = box.querySelector(".play-pause-btn");
    const img = box.querySelector("img");

    if (!audio || !btn) return;
    
    if (btn.dataset.bound) return;
    btn.dataset.bound = "true";

    btn.addEventListener("click", () => {
      // 👇 Stop the standalone playlist first!
      const playlistAudio = document.querySelector("#playlist-audio");
      const playlistBtn = document.querySelector("#play-pause");
      if (playlistAudio && !playlistAudio.paused) {
        playlistAudio.pause();
        if (playlistBtn) playlistBtn.textContent = "▶";
      }

      // Pause all other mini players
      document.querySelectorAll(".post-left-audio").forEach(otherBox => {
        const otherAudio = otherBox.querySelector(".post-audio");
        const otherBtn = otherBox.querySelector(".play-pause-btn");
        const otherImg = otherBox.querySelector("img");
        if (otherAudio !== audio) {
          otherAudio.pause();
          otherBtn.textContent = "▶";
          if (otherImg) otherImg.classList.remove("spinning");
        }
      });

      // Toggle this audio
      if (audio.paused) {
        audio.play().catch(err => console.log("Play error:", err));
        btn.textContent = "‖";
        if (img) img.classList.add("spinning");
      } else {
        audio.pause();
        btn.textContent = "▶";
        if (img) img.classList.remove("spinning");
      }
    });
    
    audio.addEventListener("ended", () => {
      btn.textContent = "▶";
      if (img) img.classList.remove("spinning");
    });
  });
}
/* =========================
   Auto-init for dynamically loaded posts
========================= */
function watchForPostAudio() {
  // Init any already in DOM
  initPostAudio();
  
  // Watch for new posts being added
  const observer = new MutationObserver((mutations) => {
    mutations.forEach(mutation => {
      mutation.addedNodes.forEach(node => {
        if (node.nodeType === 1) { // Element node
          // Check if the added node IS a post-audio or CONTAINS one
          if (node.classList && node.classList.contains("post-left-audio")) {
            initPostAudio(node.parentElement);
          } else if (node.querySelectorAll) {
            const audioBoxes = node.querySelectorAll(".post-left-audio");
            if (audioBoxes.length > 0) {
              initPostAudio(node);
            }
          }
        }
      });
    });
  });

  observer.observe(document.body, { childList: true, subtree: true });
}

// Start watching when DOM is ready
document.addEventListener("DOMContentLoaded", watchForPostAudio);

// Also expose globally so you can call it manually if needed
window.initPostAudio = initPostAudio;
