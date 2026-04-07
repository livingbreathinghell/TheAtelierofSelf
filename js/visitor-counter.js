
// ===============================
// 🌙 VISITOR COUNTER (GoatCounter API)
// ===============================

(function() {

  const GOATCOUNTER_SITE = "theatelierofself";
  const API_TOKEN = "18ge04hv2pfqxcicdn9336pa81lyob8y41019m161hnab9meomx";

  async function fetchStats() {
    try {
      // Fetch pageviews from full API
      const res = await fetch(`https://${GOATCOUNTER_SITE}.goatcounter.com/api/v0/stats/total`, {
        headers: {
          'Authorization': `Bearer ${API_TOKEN}`
        }
      });
      
      if (!res.ok) throw new Error("API error");
      const data = await res.json();
      
      // Also fetch the simple counter for unique visitors
      const counterRes = await fetch(`https://${GOATCOUNTER_SITE}.goatcounter.com/counter/TheAtelierofSelf.json`);
      const counterData = await counterRes.json();
      
      return {
        visitors: counterData.count_unique || counterData.count || "~",
        pageviews: data.total || "~"
      };
    } catch (err) {
      console.warn("Stats fetch error:", err);
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
