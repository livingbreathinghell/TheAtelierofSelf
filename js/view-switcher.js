/* =========================
   VIEW SWITCHER (STABLE)
========================= */

(function () {

  // Handle ALL clicks for data-view links (event delegation)
  document.addEventListener("click", async function (e) {

    const link = e.target.closest("[data-view]");
    if (!link) return;

    e.preventDefault();

    const viewName = link.dataset.view;
    if (!viewName) return;

    const dynamicContainer = document.getElementById("dynamic-view-container");
    const homepageInner = document.querySelector(".homepage-inner");

    if (!dynamicContainer || !homepageInner) return;

try {
  const res = await fetch(`html/views/${viewName}.html`, { cache: "no-store" });
  if (!res.ok) throw new Error("View not found");

  const html = await res.text();

homepageInner.style.display = "none";
dynamicContainer.innerHTML = html;
dynamicContainer.style.display = "block";

// 🌌 wait for DOM to render injected HTML
await new Promise(requestAnimationFrame);

  // 🌌 NEW: set category state
  document.body.setAttribute("data-category", viewName);

  // 🌌 NEW: load custom category content (like music player)
  if (typeof loadCategoryCustom === "function") {
    await loadCategoryCustom(viewName);
  }

  window.scrollTo({ top: 0, behavior: "smooth" });

} catch (err) {
  console.error("View switch failed:", err);
}

  });


  /* =========================
     RETURN TO HOMEPAGE
  ========================= */

window.returnToHomepage = function () {

  const dynamicContainer = document.getElementById("dynamic-view-container");
  const homepageInner = document.querySelector(".homepage-inner");

  if (!dynamicContainer || !homepageInner) return;

  dynamicContainer.innerHTML = "";
  dynamicContainer.style.display = "none";
  homepageInner.style.display = "block";

  // 🌌 CLEAR CATEGORY STATE
  document.body.removeAttribute("data-category");

  window.scrollTo({ top: 0, behavior: "smooth" });

};

})();
