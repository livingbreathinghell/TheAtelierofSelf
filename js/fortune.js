
// ===============================
// FORTUNE TELLING VIDEO SYSTEM (STABLE v4 - FIXED)
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
let isLoadingVideo = false; // 🆕 Prevent double loads

// 🛡️ Prevent double init
let fortuneInitialized = false;

// ===============================
// 🌍 GLOBAL READY PROMISE
// ===============================
let fortuneReadyResolver;

const fortuneReadyPromise = new Promise(resolve => {
  fortuneReadyResolver = resolve;
});

window.fortuneReadyPromise = fortuneReadyPromise;

// ===============================
// 🎲 Pick random video (improved)
// ===============================
function getRandomFortuneVideo() {
  if (FORTUNE_VIDEOS.length === 0) return null;
  if (FORTUNE_VIDEOS.length === 1) return FORTUNE_VIDEOS[0];

  let newIndex;
  let attempts = 0;
  
  do {
    newIndex = Math.floor(Math.random() * FORTUNE_VIDEOS.length);
    attempts++;
  } while (newIndex === currentFortuneIndex && attempts < 10);

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
  isLoadingVideo = false;

  // 🔓 Don't block page forever
  if (fortuneReadyResolver) {
    fortuneReadyResolver();
    fortuneReadyResolver = null;
  }
}

// ===============================
// 🎥 Load video (FIXED)
// ===============================
function loadRandomFortune(retryCount = 0) {
  // 🆕 Prevent overlapping loads
  if (isLoadingVideo) {
    console.log('⏳ Already loading, skipping...');
    return;
  }

  if (!fortuneVideo || !fortuneWrapper) {
    console.warn('⚠️ Fortune elements not ready');
    return;
  }

  const videoSrc = getRandomFortuneVideo();

  if (!videoSrc) {
    console.warn('No fortune videos available');
    showFortunePlaceholder();
    return;
  }

  console.log(`🎬 Loading fortune: ${videoSrc} (attempt ${retryCount + 1})`);
  
  isLoadingVideo = true;
  hasVideoError = false;

  // Remove placeholder if exists
  const placeholder = fortuneWrapper.querySelector('.fortune-placeholder');
  if (placeholder) placeholder.remove();

  fortuneVideo.style.display = 'block';

  // 🆕 Clean up old handlers completely
  fortuneVideo.onloadeddata = null;
  fortuneVideo.oncanplaythrough = null;
  fortuneVideo.onerror = null;
  fortuneVideo.oncanplay = null;

  let readyFired = false;

  function markReady() {
    if (readyFired) return;
    readyFired = true;
    isLoadingVideo = false;

    console.log(`✨ Ready: ${videoSrc}`);
    
    // 🆕 Ensure we're at frame 0 and paused
    try {
      fortuneVideo.currentTime = 0;
      fortuneVideo.pause();
    } catch (e) {
      console.warn('Could not reset video position:', e);
    }

    // Reset button state
    if (fortuneBtn) {
      fortuneBtn.classList.remove('playing');
      fortuneBtn.textContent = 'reveal your fortune';
      fortuneBtn.disabled = false;
    }

    // Resolve global promise (only first time)
    if (fortuneReadyResolver) {
      fortuneReadyResolver();
      fortuneReadyResolver = null;
    }
  }

  function handleError() {
    if (readyFired) return;
    
    console.warn(`⚠️ Error loading: ${videoSrc}`);
    isLoadingVideo = false;

    // 🆕 Retry up to 3 times with increasing delay
    if (retryCount < 3) {
      const delay = 300 * (retryCount + 1);
      console.log(`🔄 Retrying in ${delay}ms...`);
      
      setTimeout(() => {
        loadRandomFortune(retryCount + 1);
      }, delay);
    } else {
      console.error('❌ Failed after 3 retries');
      showFortunePlaceholder();
    }
  }

  // Event handlers
  fortuneVideo.onloadeddata = markReady;
  fortuneVideo.oncanplay = markReady; // 🆕 Additional trigger
  fortuneVideo.onerror = handleError;

  // 🆕 Timeout fallback - if nothing happens in 5 seconds
  const loadTimeout = setTimeout(() => {
    if (!readyFired && !hasVideoError) {
      console.warn('⏱️ Load timeout, checking state...');
      
      // Check if video is actually ready despite no event
      if (fortuneVideo.readyState >= 2) {
        markReady();
      } else {
        handleError();
      }
    }
  }, 5000);

  // 🆕 Clear timeout when ready
  const originalMarkReady = markReady;
  markReady = function() {
    clearTimeout(loadTimeout);
    originalMarkReady();
  };

  // 🆕 Force fresh load by removing and re-adding src
  fortuneVideo.removeAttribute('src');
  fortuneVideo.load(); // Clear buffer
  
  // Small delay then set new source
  requestAnimationFrame(() => {
    fortuneVideo.src = videoSrc;
    fortuneVideo.load();
  });
}

// ===============================
// ▶️ Play video
// ===============================
function playFortune() {
  if (!fortuneVideo || hasVideoError || isLoadingVideo) return;

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

  // 🆕 Small delay before loading next
  setTimeout(() => {
    loadRandomFortune();
  }, 200);
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
    console.warn('⏳ Fortune elements not found, retrying...');
    setTimeout(() => initFortune(container), 100);
    return;
  }

  fortuneInitialized = true;

  // Clean slate
  fortuneVideo.removeEventListener('ended', onFortuneEnd);
  fortuneVideo.addEventListener('ended', onFortuneEnd);

  // Button click handler
  fortuneBtn.addEventListener('click', () => {
    if (hasVideoError || isLoadingVideo) {
      console.log('⚠️ Video not ready or loading');
      return;
    }

    // 🆕 Check if video is actually ready
    if (fortuneVideo.readyState < 2) {
      console.warn('⚠️ Video not loaded, reloading...');
      fortuneBtn.disabled = true;
      loadRandomFortune();
      return;
    }

    fortuneVideo.play()
      .then(() => {
        fortuneBtn.classList.add('playing');
        fortuneBtn.textContent = 'revealing...';
      })
      .catch((err) => {
        console.warn('⚠️ Play failed:', err);
        // Try reloading
        setTimeout(() => loadRandomFortune(), 200);
      });
  });

  // Initial load
  loadRandomFortune();

  console.log('✅ Fortune system initialized');
}

// ===============================
// 🌍 Expose globally
// ===============================
window.initFortune = initFortune;
window.loadRandomFortune = loadRandomFortune;
