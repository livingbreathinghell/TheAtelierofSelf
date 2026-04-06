
// ===============================
// 🌙 VISITOR COUNTER (GoatCounter)
// ===============================

(function() {

  const GOATCOUNTER_SITE = "theatelierofself";
  const PAGE_PATH = "TheAtelierofSelf"; // 👈 matches your GoatCounter path!

  async function fetchStats() {
    try {
      const res = await fetch(`https://${GOATCOUNTER_SITE}.goatcounter.com/counter/${PAGE_PATH}.json`);
      
      if (!res.ok) throw new Error("API not available");
      
      const data = await res.json();
      
      return {
        total: data.count || "~",
        unique: data.count_unique || "~"
      };
    } catch (err) {
      return { total: "~", unique: "~" };
    }
  }

  async function renderCounter() {
    const container = document.getElementById("visitor-counter-container");
    if (!container) return;

    container.style.cssText = `
      position: absolute;
      top: 1050px;
      left: 40px;
      z-index: 5;
    `;

    container.innerHTML = `
      <div style="
        font-family: monospace;
        font-size: 0.75rem;
        color: #ffffff;
        opacity: 0.8;
      ">
        <span>✦ loading...</span>
      </div>
    `;

    const stats = await fetchStats();

    container.innerHTML = `
      <div style="
        font-family: monospace;
        font-size: 0.75rem;
        color: #ffffff;
        display: flex;
        flex-direction: column;
        gap: 4px;
      ">
        <span style="opacity: 0.9;">✦ ${stats.total} total views</span>
        <span style="opacity: 0.7;">✦ ${stats.unique} unique visitors</span>
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
