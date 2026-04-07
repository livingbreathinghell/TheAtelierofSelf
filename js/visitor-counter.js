// ===============================
// 🌙 VISITOR COUNTER (GoatCounter)
// ===============================

(function() {

  const GOATCOUNTER_SITE = "theatelierofself";
  const PAGE_PATH = "TheAtelierofSelf";

  async function fetchStats() {
    try {
      const res = await fetch(`https://${GOATCOUNTER_SITE}.goatcounter.com/counter/${PAGE_PATH}.json`);
      if (!res.ok) throw new Error("API not available");
      const data = await res.json();
      return {
        visitors: data.count_unique || data.count || "~",
        pageviews: data.count || "~"
      };
    } catch (err) {
      return { visitors: "~", pageviews: "~" };
    }
  }

  async function renderCounter() {
    const container = document.getElementById("visitor-counter-container");
    if (!container) return;

    container.style.cssText = `
      position: absolute;
      top: 495px;
      left: 40px;
      z-index: 5;
    `;

    container.innerHTML = `
      <div style="
        font-family: monospace;
        font-size: 0.75rem;
        color: #ffffff;
        opacity: 0.9;
      ">
        <span>✦ loading...</span>
      </div>
    `;

    const stats = await fetchStats();

    container.innerHTML = `
      <div class="visitor-container">

        <img src="media/basemedia/homepagedecor/cattyping.gif" class="visitor-cat">

        <div class="visitor-wrapper">

          <div class="visitor-title">stats:</div>

          <!-- VISITORS -->
          <div class="visitor-box">
            <div class="visitor-overlay"></div>

            <div class="visitor-text">
              [ ${stats.visitors} ] <span class="visitor-label">total visitors</span>
            </div>

            <div class="scanlines"></div>
          </div>

          <!-- PAGEVIEWS -->
          <div class="visitor-box pageview-box">
            <div class="visitor-overlay"></div>

            <div class="visitor-text">
              [ ${stats.pageviews} ] <span class="visitor-label">page views</span>
            </div>

            <div class="scanlines"></div>
          </div>

        </div>

      </div>
    `;
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", renderCounter);
  } else {
    renderCounter();
  }

  window.initVisitorCounter = renderCounter;

})();
