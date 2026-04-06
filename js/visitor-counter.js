// ===============================
// 🌙 VISITOR COUNTER (GoatCounter)
// ===============================

(function() {

  const GOATCOUNTER_SITE = "theatelierofself";

  async function fetchStats() {
    try {
      // Fetch total pageviews from GoatCounter
      const res = await fetch(`https://${GOATCOUNTER_SITE}.goatcounter.com/counter/.json`);
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      return {
        total: data.count || "~",
        unique: data.count_unique || "~"
      };
    } catch (err) {
      console.warn("Counter fetch failed:", err);
      return { total: "~", unique: "~" };
    }
  }

  async function renderCounter() {
    const container = document.getElementById("visitor-counter-container");
    if (!container) return;

    // Position the counter
    container.style.cssText = `
      position: absolute;
      top: 1050px;
      left: 40px;
      z-index: 5;
    `;

    // Show loading state
    container.innerHTML = `
      <div style="
        font-family: monospace;
        font-size: 0.75rem;
        color: #ffffff;
        opacity: 0.8;
        display: flex;
        flex-direction: column;
        gap: 4px;
      ">
        <span>✦ loading...</span>
      </div>
    `;

    // Fetch real stats
    const stats = await fetchStats();

    // Render the counter
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

    console.log("✅ Visitor counter loaded");
  }

  // Init when DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", renderCounter);
  } else {
    renderCounter();
  }

  window.initVisitorCounter = renderCounter;

})();