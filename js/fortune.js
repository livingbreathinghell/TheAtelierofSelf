
// ===============================
// FORTUNE TELLING VIDEO SYSTEM
// Save as: js/fortune.js
// ===============================

// 🎬 YOUR FORTUNE VIDEOS - update these paths!
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

/**
 * Pick a random video (different from current if possible)
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
 * Show placeholder when videos not yet added
 */
function showFortunePlaceholder() {
  if (!fortuneWrapper) return;
  
  // Check if placeholder already exists
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
 * Load a random video and pause on first frame
 */
function loadRandomFortune() {
  if (!fortuneVideo) return;
  
  const videoSrc = getRandomFortuneVideo();
  if (!videoSrc) {
    console.warn('No fortune videos available');
    showFortunePlaceholder();
    return;
  }
  
  // Reset error state
  hasVideoError = false;
  fortuneVideo.style.display = 'block';
  
  // Remove placeholder if exists
  const placeholder = fortuneWrapper?.querySelector('.fortune-placeholder');
  if (placeholder) placeholder.remove();
  
  fortuneVideo.src = videoSrc;
  fortuneVideo.load();
  
  // Pause on first frame when metadata loads
  fortuneVideo.addEventListener('loadeddata', function onLoad() {
    fortuneVideo.currentTime = 0;
    fortuneVideo.pause();
    fortuneVideo.removeEventListener('loadeddata', onLoad);
    console.log(`✨ Loaded fortune: ${videoSrc}`);
  }, { once: true });
  
  // Handle video load error
  fortuneVideo.addEventListener('error', function onError() {
    console.warn(`Could not load: ${videoSrc}`);
    showFortunePlaceholder();
    fortuneVideo.removeEventListener('error', onError);
  }, { once: true });
  
  // Update button state
  if (fortuneBtn) {
    fortuneBtn.classList.remove('playing');
    fortuneBtn.textContent = 'reveal your fortune';
  }
}

/**
 * Play the current fortune video
 */
function playFortune() {
  if (!fortuneVideo || hasVideoError) {
    console.log('No video to play - add your videos to media/fortune-videos/');
    return;
  }
  
  fortuneVideo.play().then(() => {
    if (fortuneBtn) {
      fortuneBtn.classList.add('playing');
      fortuneBtn.textContent = 'revealing...';
    }
  }).catch(err => {
    console.error('Fortune playback failed:', err);
  });
}

/**
 * Handle video end - load new random video
 */
function onFortuneEnd() {
  console.log('✨ Fortune revealed! Loading new one...');
  
  // Small delay before loading next fortune
  setTimeout(() => {
    loadRandomFortune();
  }, 500);
}

/**
 * Initialize fortune telling system
 */
function initFortune(container) {
  const root = container || document;
  
  fortuneVideo = root.querySelector('#fortune-video');
  fortuneBtn = root.querySelector('#fortune-btn');
  fortuneWrapper = root.querySelector('.fortune-video-wrapper');
  
  if (!fortuneVideo || !fortuneBtn) {
    console.warn('Fortune elements not found');
    return;
  }
  
  // Video end handler - loads new random video
  fortuneVideo.addEventListener('ended', onFortuneEnd);
  
  // Button click handler
  fortuneBtn.addEventListener('click', () => {
    if (hasVideoError) {
      console.log('Add your fortune videos to media/fortune-videos/');
      return;
    }
    if (fortuneVideo.paused) {
      playFortune();
    }
  });
  
  // Load initial random fortune
  loadRandomFortune();
  
  console.log('✅ Fortune system initialized');
}

// Expose globally
if (typeof window !== 'undefined') {
  window.initFortune = initFortune;
  window.loadRandomFortune = loadRandomFortune;
}