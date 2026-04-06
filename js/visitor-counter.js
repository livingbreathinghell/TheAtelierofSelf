
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
      return data.count || "~";
    } catch (err) {
      return "~";
    }
  }

  async function renderCounter() {
    const container = document.getElementById("visitor-counter-container");
    if (!container) return;

    container.style.cssText = `
      position: absolute;
      top: 490px;
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

    const views = await fetchStats();

container.innerHTML = `
  <div class="visitor-box">
    <div class="visitor-overlay"></div>
    <div class="visitor-text">
      [ ${views} ] <span class="visitor-label">total visitors</span>
    </div>
    <div class="scanlines"></div>
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
