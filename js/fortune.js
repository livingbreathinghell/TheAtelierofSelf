// ===============================
// FORTUNE TELLING VIDEO SYSTEM (STABLE v3)
// ===============================

// 🎬 YOUR FORTUNE VIDEOS
const FORTUNE_VIDEOS = [
  'media/fortune-videos/fortune1.mp4',
  'media/fortune-videos/fortune2.mp4',
  'media/fortune-videos/fortune3.mp4',
  'media/fortune-videos/fortune4.mp4'
];

let currentFortuneIndex = -1;
let fortuneVideo = null;
let fortuneBtn = null;
let fortuneWrapper = null;
let hasVideoError = false;

// 🛡️ Prevent double init
let fortuneInitialized = false;

// ===============================
// 🌍 GLOBAL READY PROMISE (FIXED)
// ===============================
let fortuneReadyResolver;

const fortuneReadyPromise = new Promise(resolve => {
  fortuneReadyResolver = resolve;
});

// expose globally ONCE
window.fortuneReadyPromise = fortuneReadyPromise;

// ===============================
// 🎲 Pick random video
// ===============================
function getRandomFortuneVideo() {
  if (FORTUNE_VIDEOS.length === 0) return null;
  if (FORTUNE_VIDEOS.length === 1) return FORTUNE_VIDEOS[0];

  let newIndex;
  do {
    newIndex = Math.floor(Math.random() * FORTUNE_VIDEOS.length);
  } while (newIndex === currentFortuneIndex);

  currentFortuneIndex = newIndex;
  return FORTUNE_VIDEOS[newIndex];
}

// ===============================
// ⚠️ Placeholder fallback
// ===============================
function showFortunePlaceholder() {
  if (!fortuneWrapper) return;

  if (fortuneWrapper.querySelector('.fortune-placeholder')) return;

  const placeholder = document.createElement('div');
  placeholder.className = 'fortune-placeholder';
  placeholder.innerHTML = `
    <span style="font-size: 2rem; margin-bottom: 10px;">✮</span>
    <span>add your fortune</span>
    <span>videos here!</span>
    <span style="opacity: 0.5; margin-top: 8px; font-size: 10px;">media/fortune-videos/</span>
  `;

  if (fortuneVideo) {
    fortuneVideo.style.display = 'none';
  }

  fortuneWrapper.appendChild(placeholder);
  hasVideoError = true;

  // 🔓 Don't block page forever
  if (fortuneReadyResolver) fortuneReadyResolver();
}

// ===============================
// 🎥 Load video
// ===============================
function loadRandomFortune() {
  if (!fortuneVideo) return;

  const videoSrc = getRandomFortuneVideo();

  if (!videoSrc) {
    console.warn('No fortune videos available');
    showFortunePlaceholder();
    return;
  }

  hasVideoError = false;

  const placeholder = fortuneWrapper?.querySelector('.fortune-placeholder');
  if (placeholder) placeholder.remove();

  fortuneVideo.style.display = 'block';

  // reset handlers
  fortuneVideo.onloadeddata = null;
  fortuneVideo.oncanplaythrough = null;
  fortuneVideo.onerror = null;

  let readyFired = false;

  function markReady() {
    if (readyFired) return;
    readyFired = true;

    console.log(`✨ Ready fortune: ${videoSrc}`);
    fortuneVideo.currentTime = 0;
    fortuneVideo.pause();

    // ✅ resolve global promise ONCE
    if (fortuneReadyResolver) {
      fortuneReadyResolver();
      fortuneReadyResolver = null; // prevent double resolve
    }
  }

  // fast + reliable
  fortuneVideo.onloadeddata = markReady;

  // backup safety
  fortuneVideo.oncanplaythrough = markReady;

  // error handling
  fortuneVideo.onerror = () => {
    console.warn(`⚠️ Retry loading: ${videoSrc}`);

    setTimeout(() => {
      fortuneVideo.src = videoSrc;
    }, 300);

    setTimeout(() => {
      if (fortuneVideo.readyState < 2) {
        console.warn('❌ Video failed after retry');
        showFortunePlaceholder();
      }
    }, 1200);
  };

  // start loading
  fortuneVideo.preload = "auto";
  fortuneVideo.pause();
  fortuneVideo.src = videoSrc;
  fortuneVideo.load();

  // reset button
  if (fortuneBtn) {
    fortuneBtn.classList.remove('playing');
    fortuneBtn.textContent = 'reveal your fortune';
  }
}

// ===============================
// ▶️ Play video
// ===============================
function playFortune() {
  if (!fortuneVideo || hasVideoError) return;

  fortuneVideo.play()
    .then(() => {
      if (fortuneBtn) {
        fortuneBtn.classList.add('playing');
        fortuneBtn.textContent = 'revealing...';
      }
    })
    .catch(err => {
      console.error('Playback failed:', err);
    });
}

// ===============================
// 🔁 When video ends
// ===============================
function onFortuneEnd() {
  console.log('✨ Fortune revealed!');

  if (!fortuneVideo) return;

  setTimeout(() => {
    loadRandomFortune();
  }, 100);
}

// ===============================
// 🚀 INIT
// ===============================
function initFortune(container) {
  if (fortuneInitialized) {
    console.log('⚠️ Fortune already initialized');
    return;
  }

  const root = container || document;

  fortuneVideo = root.querySelector('#fortune-video');
  fortuneBtn = root.querySelector('#fortune-btn');
  fortuneWrapper = root.querySelector('.fortune-video-wrapper');

  if (!fortuneVideo || !fortuneBtn || !fortuneWrapper) {
    console.warn('⏳ Fortune not ready, retrying...');
    setTimeout(() => initFortune(container), 100);
    return;
  }

  fortuneInitialized = true;

  fortuneVideo.removeEventListener('ended', onFortuneEnd);
  fortuneVideo.addEventListener('ended', onFortuneEnd);

  fortuneBtn.addEventListener('click', () => {
    if (hasVideoError) return;

    fortuneVideo.play()
      .then(() => {
        fortuneBtn.classList.add('playing');
        fortuneBtn.textContent = 'revealing...';
      })
      .catch(() => {
        console.warn('⚠️ not ready yet, retrying...');
        setTimeout(playFortune, 200);
      });
  });

  loadRandomFortune();

  console.log('✅ Fortune system initialized');
}

// ===============================
// 🌍 expose globally
// ===============================
window.initFortune = initFortune;
window.loadRandomFortune = loadRandomFortune;
