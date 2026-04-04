// ===============================
// FORTUNE TELLING VIDEO SYSTEM (STABLE v2)
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

/**
 * Pick a random video (not same as last)
 */
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

/**
 * Show placeholder if videos fail
 */
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
}

/**
 * Load a random video (clean + delayed reset)
 */
function loadRandomFortune() {
  if (!fortuneVideo) return;

  const videoSrc = getRandomFortuneVideo();

  if (!videoSrc) {
    console.warn('No fortune videos available');
    showFortunePlaceholder();
    return;
  }

  hasVideoError = false;

  // Remove placeholder
  const placeholder = fortuneWrapper?.querySelector('.fortune-placeholder');
  if (placeholder) placeholder.remove();

  fortuneVideo.style.display = 'block';

  // 🧠 IMPORTANT: set handlers BEFORE src
  fortuneVideo.onloadeddata = () => {
    fortuneVideo.currentTime = 0;
    fortuneVideo.pause();
    console.log(`✨ Loaded fortune: ${videoSrc}`);
  };

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

  // 🔥 CLEAN RESET (simpler + more reliable)
  fortuneVideo.pause();
  fortuneVideo.src = "";   // instead of removeAttribute
  fortuneVideo.load();

  // ⏳ tiny delay (still good)
  setTimeout(() => {
    fortuneVideo.src = videoSrc;
  }, 80);

  // Button reset
  if (fortuneBtn) {
    fortuneBtn.classList.remove('playing');
    fortuneBtn.textContent = 'reveal your fortune';
  }
}

/**
 * Play video
 */
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

/**
 * When video ends → load new one (STABILIZED)
 */
function onFortuneEnd() {
  console.log('✨ Fortune revealed!');

  setTimeout(() => {
    if (fortuneVideo) {
      fortuneVideo.pause();
      fortuneVideo.removeAttribute('src');
      fortuneVideo.load();
    }

    // ⏳ Give browser breathing room
    setTimeout(() => {
      loadRandomFortune();
    }, 150);

  }, 700);
}

/**
 * INIT (with retry if DOM not ready)
 */
function initFortune(container) {
  if (fortuneInitialized) {
    console.log('⚠️ Fortune already initialized');
    return;
  }

  const root = container || document;

  fortuneVideo = root.querySelector('#fortune-video');
  fortuneBtn = root.querySelector('#fortune-btn');
  fortuneWrapper = root.querySelector('.fortune-video-wrapper');

  // 🔁 RETRY INIT if elements not ready yet
  if (!fortuneVideo || !fortuneBtn || !fortuneWrapper) {
    console.warn('⏳ Fortune not ready, retrying...');
    setTimeout(() => initFortune(container), 100);
    return;
  }

  fortuneInitialized = true;

  // Clean old listener
  fortuneVideo.removeEventListener('ended', onFortuneEnd);
  fortuneVideo.addEventListener('ended', onFortuneEnd);

  // Button click
  fortuneBtn.addEventListener('click', () => {
    if (hasVideoError) return;

    if (fortuneVideo.readyState < 2) {
      console.log('⏳ video not ready');
      return;
    }

    if (fortuneVideo.paused) {
      playFortune();
    }
  });

  // Load first fortune
  loadRandomFortune();

  console.log('✅ Fortune system initialized');
}

// 🌍 expose globally
if (typeof window !== 'undefined') {
  window.initFortune = initFortune;
  window.loadRandomFortune = loadRandomFortune;
}
