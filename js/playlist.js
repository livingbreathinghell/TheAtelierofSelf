/* ============================
   YOUTUBE PLAYLIST PLAYER
   For Content Hub
============================ */

const YT_TRACKS = [
  { title: "Sailin' Da South - DJ Screw ✦", videoId: "ibJpn-RDg8U" },
  { title: "Alchemy - Uncle Outrage ✦", videoId: "QN0LJt2qZHQ" },
  { title: "Revolution - Aimee Allen ✦", videoId: "2tvyVq5Hvq4" },
  // Add more tracks here!
];

let activeIndex = 0;
let playing = false;
let shuffleOn = false;

function initHubPlaylist() {
  const iframe = document.getElementById("yt-iframe");
  const queue = document.getElementById("yt-queue");
  const playBtn = document.getElementById("yt-play-pause");
  const prevBtn = document.getElementById("yt-prev");
  const nextBtn = document.getElementById("yt-next");
  const shuffleBtn = document.getElementById("yt-shuffle");
  const leds = document.querySelectorAll(".wled");
  const overlay = document.getElementById("video-overlay");
  const thumb = document.getElementById("video-thumb");
  const titleEl = document.getElementById("yt-title");

  if (!iframe || !queue || !playBtn) {
    console.log("⏳ Playlist elements not found yet");
    return;
  }

  console.log("✅ Playlist initialized!");

  function getEmbedUrl(videoId, autoplay) {
    return `https://www.youtube.com/embed/${videoId}?enablejsapi=1&autoplay=${autoplay ? 1 : 0}&rel=0&modestbranding=1`;
  }

  function updateThumbnail(videoId) {
    if (thumb) {
      thumb.src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
    }
  }

  function updateTitle(index) {
    if (titleEl) {
      titleEl.textContent = "♪  " + YT_TRACKS[index].title + "  ───────────";
    }
  }

  function updateLeds() {
    leds.forEach((led, i) => {
      led.classList.toggle("active", playing && i <= activeIndex % leds.length);
    });
  }

  function renderQueue() {
    queue.innerHTML = "";
    YT_TRACKS.forEach((track, i) => {
      const div = document.createElement("div");
      div.className = "queue-item" + (i === activeIndex ? " active" : "");
      div.textContent = (i === activeIndex ? "▶ " : "") + track.title;
      div.addEventListener("click", () => switchTo(i, true));
      queue.appendChild(div);
    });
  }

  function switchTo(index, autoplay) {
    activeIndex = index;
    playing = !!autoplay;
    iframe.src = getEmbedUrl(YT_TRACKS[index].videoId, autoplay);
    updateThumbnail(YT_TRACKS[index].videoId);
    updateTitle(index);
    playBtn.textContent = playing ? "‖" : "▶";

    if (overlay) {
      if (playing) {
        overlay.classList.add("hidden");
      } else {
        overlay.classList.remove("hidden");
      }
    }

    updateLeds();
    renderQueue();
  }

  function sendCommand(func) {
    try {
      iframe.contentWindow.postMessage(
        JSON.stringify({ event: "command", func: func, args: [] }), "*"
      );
    } catch (e) {}
  }

  function getNextIndex() {
    if (shuffleOn && YT_TRACKS.length > 1) {
      let next;
      do { next = Math.floor(Math.random() * YT_TRACKS.length); } while (next === activeIndex);
      return next;
    }
    return (activeIndex + 1) % YT_TRACKS.length;
  }

  // Overlay click - start playing
  if (overlay) {
    overlay.addEventListener("click", () => {
      overlay.classList.add("hidden");
      playing = true;
      playBtn.textContent = "‖";
      iframe.src = getEmbedUrl(YT_TRACKS[activeIndex].videoId, true);
      updateTitle(activeIndex);
      updateLeds();
    });
  }

  // Play/Pause
  playBtn.addEventListener("click", () => {
    if (!playing) {
      playing = true;
      playBtn.textContent = "‖";
      if (overlay) overlay.classList.add("hidden");
      sendCommand("playVideo");
    } else {
      playing = false;
      playBtn.textContent = "▶";
      sendCommand("pauseVideo");
    }
    updateLeds();
  });

  // Previous
  prevBtn.addEventListener("click", () => {
    switchTo((activeIndex - 1 + YT_TRACKS.length) % YT_TRACKS.length, playing);
  });

  // Next
  nextBtn.addEventListener("click", () => {
    switchTo(getNextIndex(), playing);
  });

  // Shuffle toggle
  if (shuffleBtn) {
    shuffleBtn.addEventListener("click", () => {
      shuffleOn = !shuffleOn;
      shuffleBtn.style.color      = shuffleOn ? "#F9E5B8" : "";
      shuffleBtn.style.textShadow = shuffleOn ? "0 0 7px rgba(249,229,184,0.8)" : "";
      shuffleBtn.style.background = shuffleOn
        ? "linear-gradient(180deg, #2e2820 0%, #1e1c14 100%)"
        : "";
    });
  }

  // 🎵 AUTO-LOAD first track
  iframe.src = getEmbedUrl(YT_TRACKS[0].videoId, false);
  updateThumbnail(YT_TRACKS[0].videoId);
  updateTitle(0);

  renderQueue();
  updateLeds();
}

// Wait for elements to load, then init
function waitAndInitPlaylist() {
  const checkInterval = setInterval(() => {
    const queue = document.getElementById("yt-queue");
    if (queue) {
      clearInterval(checkInterval);
      initHubPlaylist();
    }
  }, 200);

  setTimeout(() => clearInterval(checkInterval), 10000);
}

document.addEventListener("DOMContentLoaded", waitAndInitPlaylist);
window.initHubPlaylist = initHubPlaylist;
