
// ============================================
// 🌙 UNIFIED SITE SCRIPT
// ============================================

// -------------------------
// PANEL HELPERS
// -------------------------

function openPanel(panel, header) {
  if (!panel) return;

  panel.classList.add("open");
  header?.classList.add("active");

  panel.style.height = "0px";
  panel.style.overflow = "hidden";
  panel.style.transition = "height 0.25s ease";

  requestAnimationFrame(() => {
    panel.style.height = panel.scrollHeight + "px";
  });

  panel.addEventListener("transitionend", function done(e) {
    if (e.target !== panel) return;
    panel.style.height = "auto";
    panel.style.overflow = "visible";
    panel.removeEventListener("transitionend", done);
  });
}

function closePanel(panel, header) {
  if (!panel) return;

  panel.style.overflow = "hidden";
  panel.style.height = panel.scrollHeight + "px";

  requestAnimationFrame(() => {
    panel.style.height = "0px";
    panel.classList.remove("open");
    header?.classList.remove("active");
  });

  // Close nested panels too
  panel.querySelectorAll(".collapsible-panel.open").forEach(nested => {
    closePanel(nested, nested.previousElementSibling);
  });
}


// -------------------------
// HEADER SYSTEM
// -------------------------

function initHeader() {
  const categoryButtons = document.querySelectorAll(".category-btn");
  const subRow = document.getElementById("subcategory-row");
  const monthRow = document.getElementById("month-row");
  const searchInput = document.getElementById("search-input");
  const homepage = document.getElementById("homepage");
  const categoryView = document.getElementById("category-view");
  const allPosts = document.querySelectorAll(".post");

  if (!categoryButtons.length) {
    console.warn("No category buttons found");
    return;
  }

  let activeCategory = "all";
  let activeSub = null;
  let activeMonth = null;
  let searchQuery = "";

  function clearSubAndMonth() {
    activeSub = null;
    activeMonth = null;
    if (subRow) subRow.innerHTML = "";
    if (monthRow) monthRow.innerHTML = "";
  }

  function updateView() {
    const isHome = activeCategory === "all";
    const isSearch = activeCategory === "search";
    if (homepage) homepage.style.display = isHome ? "block" : "none";
    if (categoryView) categoryView.style.display = (!isHome || isSearch) ? "block" : "none";
  }

  function updatePosts() {
    allPosts.forEach(post => {
      const cat = post.dataset.category;
      const sub = post.dataset.subcategory;
      const month = post.dataset.month;
      let show = false;

      if (activeCategory === "search") {
        show = post.innerText.toLowerCase().includes(searchQuery);
      } else if (activeCategory === "all") {
        show = post.dataset.homepage === "true";
      } else if (cat === activeCategory) {
        if (activeSub && sub !== activeSub) show = false;
        else if (activeMonth && month !== activeMonth) show = false;
        else show = true;
      }

      post.style.display = show ? "flex" : "none";
    });
  }

  function loadSubcategories(category) {
    if (!subRow) return;
    subRow.innerHTML = "";
    if (monthRow) monthRow.innerHTML = "";

    const template = document.getElementById(`${category}-subcategories`);
    if (!template) return;

    const clone = template.cloneNode(true);
    clone.style.display = "flex";
    subRow.append(...clone.children);

    subRow.querySelectorAll(".subcategory-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        activeSub = btn.dataset.subcategory;
        activeMonth = null;
        if (monthRow) monthRow.innerHTML = "";

        subRow.querySelectorAll(".subcategory-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        loadMonths(activeSub);
        updatePosts();
      });
    });
  }

  function loadMonths(subcategory) {
    if (!monthRow || !subcategory) return;
    monthRow.innerHTML = "";

    const container = subRow.querySelector(".month-buttons-container");
    if (!container) return;

    const year = subcategory.replace("year-", "");
    container.querySelectorAll(`.month-btn[data-year="${year}"]`).forEach(btn => {
      const clone = btn.cloneNode(true);
      monthRow.appendChild(clone);

      clone.addEventListener("click", () => {
        activeMonth = clone.dataset.month;
        monthRow.querySelectorAll(".month-btn").forEach(b => b.classList.remove("active"));
        clone.classList.add("active");
        updatePosts();
      });
    });
  }

  function setCategory(category) {
    activeCategory = category;
    searchQuery = "";
    if (searchInput) searchInput.value = "";

    clearSubAndMonth();
    loadSubcategories(category);
    updateView();

    categoryButtons.forEach(b => b.classList.remove("active"));
    document.querySelector(`.category-btn[data-category="${category}"]`)?.classList.add("active");

    updatePosts();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (searchInput) {
    searchInput.addEventListener("input", () => {
      searchQuery = searchInput.value.toLowerCase().trim();
      if (!searchQuery) {
        setCategory("all");
        return;
      }
      activeCategory = "search";
      clearSubAndMonth();
      updateView();
      updatePosts();
    });
  }

  categoryButtons.forEach(btn => {
    btn.addEventListener("click", () => setCategory(btn.dataset.category));
  });

  setCategory("all");
  console.log("✅ Header ready");
}




// -------------------------
// COLLAPSIBLES
// -------------------------

function initCollapsibles(root = document) {
  if (!root) return;

  // Set initial state for panels
  root.querySelectorAll(".collapsible-panel").forEach(panel => {
    const zodiacParent = panel.closest(".zodiac-panel");
    if (zodiacParent && zodiacParent.style.display === "none") return;

    const header = panel.previousElementSibling;
    const parentSection = panel.parentElement;
    const isPermaOpen = parentSection && parentSection.classList.contains("perma-open");

    if (isPermaOpen) {
      panel.classList.add("open");
      header?.classList.add("active");
      panel.style.height = "auto";
      panel.style.overflow = "visible";
    } else {
      panel.classList.remove("open");
      header?.classList.remove("active");
      panel.style.height = "0px";
      panel.style.overflow = "hidden";
    }
  });

  // Global click handler (only bind once)
  if (document._collapsibleBound) return;
  document._collapsibleBound = true;

  document.addEventListener("click", (e) => {
    const header = e.target.closest(".collapsible-header");
    if (!header) return;

    // CSS already blocks clicks on perma-open headers (pointer-events: none)
    // So we don't need to check here!

    const panel = header.nextElementSibling;
    if (!panel || !panel.classList.contains("collapsible-panel")) return;

    if (panel.classList.contains("open")) {
      closePanel(panel, header);
    } else {
      openPanel(panel, header);
    }
  });

  console.log("✅ Collapsibles ready");
}

// -------------------------
// ZODIAC PANELS
// -------------------------

function initZodiacPanels() {
  const buttons = document.querySelectorAll(".zodiac-grid button[data-zodiac]");
  const panels = document.querySelectorAll(".zodiac-panel");

  // Hide all panels initially
  panels.forEach(p => p.style.display = "none");

  buttons.forEach(btn => {
    if (btn.dataset.bound) return;
    btn.dataset.bound = "true";

    btn.addEventListener("click", () => {
      const targetId = btn.dataset.zodiac;
      const targetPanel = document.getElementById(targetId);
      if (!targetPanel) return;

      const isOpen = targetPanel.style.display === "block";

      // Close all panels & remove active from buttons
      panels.forEach(p => p.style.display = "none");
      buttons.forEach(b => b.classList.remove("active"));

      // If wasn't open, open it
      if (!isOpen) {
        btn.classList.add("active");
        targetPanel.style.display = "block";
        // Initialize collapsibles inside this panel
        initCollapsibles(targetPanel);
      }
    });
  });

  console.log("✅ Zodiac panels ready");
}


// -------------------------
// LIGHTBOX
// -------------------------

function initLightbox() {
  document.querySelectorAll(".post-image img").forEach(img => {
    if (img.dataset.bound) return;
    img.dataset.bound = "true";

    img.addEventListener("click", () => {
      const overlay = document.createElement("div");
      overlay.className = "image-lightbox";
      overlay.appendChild(img.cloneNode(true));
      document.body.appendChild(overlay);
      document.body.style.overflow = "hidden";

      overlay.addEventListener("click", () => {
        overlay.remove();
        document.body.style.overflow = "";
      });
    });
  });

  console.log("✅ Lightbox ready");
}


// -------------------------
// 🚀 INIT EVERYTHING
// -------------------------

document.addEventListener("DOMContentLoaded", () => {
  initHeader();
  initCollapsibles();
  initZodiacPanels();
  initLightbox();
});

// -------------------------
// EXPOSE FUNCTIONS GLOBALLY
// -------------------------
if (typeof window !== "undefined") {
  window.initCollapsibles = initCollapsibles;
  window.initZodiacPanels = initZodiacPanels;
  window.initLightbox = initLightbox;
}
