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
  
  await loadHTML("welcome-panel-container", "html/coding-html/homepage/welcome-panel.html");

  const miniView = await loadHTML("mini-view-container", "html/coding-html/homepage/mini-view-feature.html");

  // ❌ REMOVED PLAYLIST FROM HOMEPAGE

  const rotating = await loadHTML("rotating-playlists-container", "html/coding-html/homepage/rotating-playlists.html");
  
  await loadHTML("footer-container", "html/coding-html/footer.html");

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
