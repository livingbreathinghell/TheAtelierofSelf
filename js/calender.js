
// ===============================
// 🌙 HAND-DRAWN CALENDAR
// ===============================

(function() {

  const MONTH_NAMES = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  // 🎨 MONTH IMAGES - your hand-drawn backgrounds!
  const MONTH_IMAGES = {
    0: "media/basemedia/homepagedecor/calender/january.png",
    1: null,
    2: null,
    3: null,
    4: null,
    5: null,
    6: null,
    7: null,
    8: null,
    9: null,
    10: null,
    11: null
  };

  // 🎨 NAVIGATION BUTTONS
  const NAV_IMAGES = {
    prev: "media/basemedia/homepagedecor/calender/calenderprevious.png",
    next: null
  };

  let currentDate = new Date();
  let displayMonth = currentDate.getMonth();
  let displayYear = currentDate.getFullYear();

  function getDaysInMonth(month, year) {
    return new Date(year, month + 1, 0).getDate();
  }

  function renderCalendar() {
    const container = document.getElementById("calendar-container");
    if (!container) return;

    container.style.cssText = `
      position: absolute;
      top: 838px;
      left: 40px;
      width: 200px;
      z-index: 5;
    `;

    const daysInMonth = getDaysInMonth(displayMonth, displayYear);
    const today = new Date();
    const isCurrentMonth = today.getMonth() === displayMonth && today.getFullYear() === displayYear;

    // Month image
    const monthImg = MONTH_IMAGES[displayMonth];
    const monthImageHTML = monthImg 
      ? `<img src="${monthImg}" alt="${MONTH_NAMES[displayMonth]}" style="width:100%; height:100%; object-fit:contain; display:block;">`
      : `<span style="font-size:0.7rem; opacity:0.3; font-style:italic;">[ ${MONTH_NAMES[displayMonth]} ]</span>`;

    // Nav buttons - with fixed size for images!
    const prevBtnContent = NAV_IMAGES.prev 
      ? `<img src="${NAV_IMAGES.prev}" alt="Prev" style="width:20px; height:20px; object-fit:contain;">`
      : `◀`;
    
    const nextBtnContent = NAV_IMAGES.next 
      ? `<img src="${NAV_IMAGES.next}" alt="Next" style="width:20px; height:20px; object-fit:contain;">`
      : `▶`;

    // Day cells
    let daysHTML = "";
    
    for (let day = 1; day <= daysInMonth; day++) {
      const isToday = isCurrentMonth && day === today.getDate();
      const bgColor = isToday ? "rgba(249,229,184,0.25)" : "transparent";
      const fontWeight = isToday ? "bold" : "normal";
      const link = `#day-${displayMonth + 1}-${day}`;
      
      daysHTML += `
        <div style="aspect-ratio:1; display:flex; align-items:center; justify-content:center;">
          <a href="${link}" style="
            color: #F9E5B8;
            text-decoration: none;
            border: none;
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 3px;
            font-size: 0.65rem;
            background: ${bgColor};
            font-weight: ${fontWeight};
          ">${day}</a>
        </div>
      `;
    }

    container.innerHTML = `
      <div style="
        position: relative;
        width: 100%;
      ">
        
        <!-- MONTH IMAGE -->
        <div style="
          width: 100%;
          height: 180px;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        ">
          ${monthImageHTML}
        </div>

        <!-- NAV ROW - SEPARATE, position independently! -->
        <div style="
          position: absolute;
          top: 5%;
          left: 50%;
          transform: translateX(-50%);
          width: 80%;
          display: flex;
          justify-content: space-between;
          align-items: center;
        ">
          <button id="cal-prev" style="
            background: none;
            border: none;
            padding: 2px;
            cursor: pointer;
          ">${prevBtnContent}</button>
          
          <span style="
            font-family: Georgia, serif;
            font-size: 0.95rem;
            color: #F9E5B8;
            opacity: 0.9;
          ">${MONTH_NAMES[displayMonth]} ${displayYear}</span>
          
          <button id="cal-next" style="
            background: none;
            border: none;
            padding: 2px;
            cursor: pointer;
          ">${nextBtnContent}</button>
        </div>




        <!-- DAY GRID - SEPARATE, position independently! -->
        <div style="
          position: absolute;
          top: 55%;
          left: 45%;
          transform: translate(-50%, -48%);
          width: 55%;
        ">
          <div style="
            display: grid;
            grid-template-columns: repeat(7, 1fr);
            column-gap: 9px;
            row-gap: 6px;
          ">
            ${daysHTML}
          </div>
        </div>

      </div>
    `;

    // Bind nav buttons
    document.getElementById("cal-prev")?.addEventListener("click", () => {
      displayMonth--;
      if (displayMonth < 0) {
        displayMonth = 11;
        displayYear--;
      }
      renderCalendar();
    });

    document.getElementById("cal-next")?.addEventListener("click", () => {
      displayMonth++;
      if (displayMonth > 11) {
        displayMonth = 0;
        displayYear++;
      }
      renderCalendar();
    });
  }

  function initCalendar() {
    const container = document.getElementById("calendar-container");
    if (container) {
      renderCalendar();
      console.log("✅ Calendar initialized");
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initCalendar);
  } else {
    initCalendar();
  }

  window.initCalendar = initCalendar;

})();
