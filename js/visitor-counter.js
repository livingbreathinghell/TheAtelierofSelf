// ===============================
// 🌙 VISITOR COUNTER (GoatCounter)
// ===============================

(function() {

  const GOATCOUNTER_SITE = "theatelierofself";

  async function fetchStats() {
    try {
      // Try fetching the homepage count (path = /)
      const res = await fetch(`https://${GOATCOUNTER_SITE}.goatcounter.com/counter/%2F.json`);
      
      console.log("📊 Counter response status:", res.status);
      
      if (!res.ok) {
        // If homepage doesn't work, try without path
        const res2 = await fetch(`https://${GOATCOUNTER_SITE}.goatcounter.com/counter/.json`);
        if (!res2.ok) throw new Error("API not available");
        const data2 = await res2.json();
        console.log("📊 Counter data:", data2);
        return { total: data2.count || "~", unique: data2.count_unique || "~" };
      }
      
      const data = await res.json();
      console.log("📊 Counter data:", data);
      
      return {
        total: data.count || "~",
        unique: data.count_unique || "~"
      };
    } catch (err) {
      console.warn("❌ Counter fetch failed:", err);
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

    console.log("✅ Visitor counter rendered");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", renderCounter);
  } else {
    renderCounter();
  }

  window.initVisitorCounter = renderCounter;

})();
