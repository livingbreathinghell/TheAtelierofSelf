// ===============================
// SIMPLE PARTIAL LOADER (STABLE v4)
// ===============================

// Wait for paint with configurable delay
function waitForPaint(ms = 200) {
  return new Promise(resolve => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setTimeout(resolve, ms);
      });
    });
  });
}

// Wait for all images in a container
async function waitForImages(container, timeout = 5000) {
  if (!container) return;
  
  const images = container.querySelectorAll("img");
  if (images.length === 0) return;
  
  const imagePromises = Array.from(images).map(img => {
    if (img.complete) return Promise.resolve();
    return new Promise(resolve => {
      img.onload = resolve;
      img.onerror = resolve;
    });
  });
  
  await Promise.race([
    Promise.all(imagePromises),
    new Promise(r => setTimeout(r, timeout))
  ]);
}

// Force full page repaint
function forceRepaint() {
  document.body.style.display = 'none';
  void document.body.offsetHeight;
  document.body.style.display = '';
}

// Safe JS init
async function safeInit(name, fn, arg) {
  if (typeof fn === "function") {
    try {
      fn(arg);
      console.log(`✅ ${name} initialized`);
    } catch (e) {
      console.error(`❌ ${name} init failed:`, e);
    }
    await waitForPaint(50);
  }
}

// Load HTML partial
async function loadHTML(containerId, filePath) {
  const container = document.getElementById(containerId);
  if (!container) {
    console.warn(`⚠️ #${containerId} not found.`);
    return null;
  }

  try {
    const res = await fetch(filePath, { cache: "no-store" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const html = await res.text();
    container.innerHTML = html;

    await waitForImages(container);
    await waitForPaint(200);

    console.log(`✅ Loaded ${containerId}`);
    return container;
  } catch (err) {
    console.error(`❌ Failed loading ${filePath}`, err);
    return null;
  }
}

// ===============================
// STAMP MARQUEE INIT ✨
// ===============================

function initStampMarquee() {
  const tracks = document.querySelectorAll(".stamp-track");

  tracks.forEach((track, index) => {
    const speed = index === 0 ? 0.3 : -0.3;

    let x = 0;

    // 👇 LOCK WIDTH ONCE (no mid-animation recalcs)
    const totalWidth = track.scrollWidth / 2;

    function animate() {
      x += speed;

      // 👇 SMOOTH LOOP (no snapping)
      if (x <= -totalWidth) x += totalWidth;
      if (x >= 0) x -= totalWidth;

      track.style.transform = `translate3d(${x}px, 0, 0)`;

      requestAnimationFrame(animate);
    }

    animate();
  });
}

// ===============================
// GAME PANEL INIT 🎮
// ===============================

function initGamePanel() {
  const playBtn = document.getElementById("play-btn");
  const overlay = document.getElementById("fade-overlay");
  const panel = document.getElementById("game-panel");
  const img1 = document.getElementById("panel-img-1");
  const img2 = document.getElementById("panel-img-2");

  if (!playBtn || !overlay || !panel || !img1 || !img2) {
    console.warn("⚠️ Game panel elements not found");
    return;
  }

  const FADE_DURATION = 1400; // must match the CSS transition on #fade-overlay

  playBtn.addEventListener("click", function () {
    playBtn.classList.add("hidden");

    // blur the images as they fade to black
    panel.classList.add("transitioning");
    overlay.classList.add("fade-in");

    setTimeout(function () {
      // swap images instantly while hidden behind the black overlay
      img1.style.transition = "none";
      img2.style.transition = "none";

      img1.classList.remove("visible");
      img1.classList.add("hidden");
      img2.classList.remove("hidden");
      img2.classList.add("visible");

      // force reflow so the instant swap registers before transitions re-enable
      void img2.offsetHeight;

      img1.style.transition = "";
      img2.style.transition = "";

      // remove blur and fade back from black
      panel.classList.remove("transitioning");
      overlay.classList.remove("fade-in");
    }, FADE_DURATION);
  });

  console.log("✅ Game panel initialized");
}

// ===============================
// CATEGORY CUSTOM LOADER 🌙
// ===============================

async function loadCategoryCustom(category) {

  // 🌌 wait a tiny bit more (extra safety)
  await new Promise(requestAnimationFrame);

  // 🎯 find container INSIDE dynamic view
  const container = document.querySelector("#dynamic-view-container #category-custom-container");

  console.log("🎯 container:", container);

  if (!container) {
    console.warn("❌ category container not found");
    return;
  }

  container.innerHTML = "";

  const categoryMap = {
    music: "html/coding-html/categories/music.html",
  };

  const filePath = categoryMap[category];
  console.log("📁 file:", filePath);

  if (!filePath) return;

  try {
    const res = await fetch(filePath, { cache: "no-store" });
    console.log("📡 status:", res.status);

    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const html = await res.text();

    container.innerHTML = html;

    console.log("✅ injected music.html");

    await waitForImages(container);
    await waitForPaint(150);

    await safeInit("Playlist", window.initPlaylist, container);

  } catch (err) {
    console.error("❌ Category custom load failed:", err);
  }
}

// ===============================
// MAIN LOAD SEQUENCE
// ===============================

async function loadAllPartials() {
  console.log("🚀 Starting load sequence...");

  // Wait for full load
  if (document.readyState !== "complete") {
    await new Promise(r => window.addEventListener("load", r, { once: true }));
  }
  
  await waitForPaint(300);

  console.log("✅ Starting partials...");

  // Core layout
  const header = await loadHTML("header-container", "html/coding-html/header.html");
  
  // Welcome panel (NO YTPlayer here anymore!)
  const welcomePanel = await loadHTML("welcome-panel-container", "html/coding-html/homepage/welcome-panel.html");

  const miniView = await loadHTML("mini-view-container", "html/coding-html/homepage/mini-view-feature.html");
  
  // Load fortune panel
  const fortunePanel = await loadHTML("fortune-panel-container", "html/coding-html/homepage/fortune-panel.html");
  
  // 🎵 Load playlist panel (NEW - next to fortune!)
  const playlistPanel = await loadHTML("playlist-panel-container", "html/coding-html/homepage/playlist-panel.html");
  if (playlistPanel) await safeInit("YTPlayer", window.initYTPlayer, playlistPanel);

  const rotating = await loadHTML("rotating-playlists-container", "html/coding-html/homepage/rotating-playlists.html");
  
  // ✨ Stamp Marquee
  const stampMarquee = await loadHTML(
    "stamp-marquee-container",
    "html/coding-html/homepage/stamp-marquee.html"
  );

const contentHub = await loadHTML("content-hub-container", "html/coding-html/homepage/content-hub.html");


  if (stampMarquee) {
    const inner = stampMarquee.querySelector("#stamp-marquee");

    await waitForImages(inner);
    await waitForPaint(200);

    inner.classList.add("ready");
  }

  initStampMarquee();

  
  await loadHTML("footer-container", "html/coding-html/footer.html");

  // 🎮 Load left featured panel (game panel)
  await loadHTML("featured-panel-container-left", "html/coding-html/homepage/GAME-featured-panel-left.html");
  initGamePanel();

const featuredPanel = await loadHTML("featured-panel-container", "html/coding-html/homepage/featured-panel.html");
  if (featuredPanel) await safeInit("FeaturedPanel", window.initFeaturedPanel, null);

  // Load posts
  if (typeof window.loadPostsFromJSON === "function") {
    await window.loadPostsFromJSON();
    await waitForPaint(200);
  }

  // Pre-JS repaint
  forceRepaint();
  await waitForPaint(200);

  console.log("⚙️ Initializing JS modules...");

  // Init core systems
  await safeInit("Header", window.initHeader, header);
  await safeInit("MiniView", window.initMiniView, miniView);
  await safeInit("RotatingPlaylists", window.initRotatingPlaylists, rotating);
  await safeInit("Collapsibles", window.initCollapsibles, document);
  await safeInit("ZodiacPanels", window.initZodiacPanels, document);
  await safeInit("Lightbox", window.initLightbox, document);
  await safeInit("ViewSwitcher", window.initViewSwitcher, document);
  
  // ✅ Mark posts as ready AFTER load + processing
  document.body.classList.add("posts-ready");
  
  await safeInit("Fortune", window.initFortune, fortunePanel);
  
  // ⏳ WAIT FOR FORTUNE VIDEO
  if (window.fortuneReadyPromise) {
    console.log("⏳ waiting for fortune video...");
    await window.fortuneReadyPromise;
    console.log("✅ fortune ready");
  }

  // Post-JS repaint
  forceRepaint();
  await waitForPaint(300);

  console.log("✨ Revealing page...");

  // Fade in
  const loadingScreen = document.getElementById("loading-screen");
  if (loadingScreen) {
    loadingScreen.classList.add("fade-out");
    setTimeout(() => loadingScreen.remove(), 600);
  }

  document.body.classList.add("loaded");

  console.log("✅ Done!");
}

// ===============================
// START
// ===============================

document.addEventListener("DOMContentLoaded", loadAllPartials);
