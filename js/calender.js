
// ===============================
// 🌙 HAND-DRAWN CALENDAR WITH NOTES
// ===============================

(function() {

  const MONTH_NAMES = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const MONTH_IMAGES = {
    0: "media/basemedia/homepagedecor/calender/january.png",
    1: "media/basemedia/homepagedecor/calender/february.png",
    2: "media/basemedia/homepagedecor/calender/march.png",
    3: "media/basemedia/homepagedecor/calender/april.png",
    4: "media/basemedia/homepagedecor/calender/may.png",
    5: null, 6: null, 7: null, 8: null, 9: null, 10: null, 11: null
  };

  const NAV_IMAGES = {
    prev: "media/basemedia/homepagedecor/calender/calenderprevious.png",
    next: "media/basemedia/homepagedecor/calender/calendernext.png"
  };

  const NOTES_FILE = "html/coding-html/homepage/calendar-notes.html";

  let currentDate = new Date();
  let displayMonth = currentDate.getMonth();
  let displayYear = currentDate.getFullYear();
  let notesData = {};

  function getDaysInMonth(month, year) {
    return new Date(year, month + 1, 0).getDate();
  }

  async function loadNotes() {
    try {
      const res = await fetch(NOTES_FILE, { cache: "no-store" });
      if (!res.ok) return;
      
      const html = await res.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      const notes = doc.querySelectorAll('[data-date]');
      
      notes.forEach(note => {
        const date = note.getAttribute('data-date');
        notesData[date] = note.innerHTML;
      });
      
      console.log(`✅ Loaded ${Object.keys(notesData).length} calendar notes`);
    } catch (err) {
      console.warn('📝 No notes file found (optional)');
    }
  }

  function hasNote(year, month, day) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return notesData[dateStr] !== undefined;
  }

  function getNote(year, month, day) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return notesData[dateStr] || null;
  }

  // 📝 Close popup - FIXED: immediate removal
  function closeNotePopup() {
    const existingPopups = document.querySelectorAll('.calendar-note-popup');
    existingPopups.forEach(popup => {
      popup.remove();
    });
  }

  // 📝 Show popup - FIXED: proper positioning & single instance
  function showNotePopup(year, month, day, event) {
    event.preventDefault();
    event.stopPropagation();
    
    // Remove ALL existing popups immediately
    closeNotePopup();
    
    const container = document.getElementById("calendar-container");
    if (!container) return;

    const dateStr = `${MONTH_NAMES[month]} ${day}, ${year}`;
    const noteContent = getNote(year, month, day);
    
    const popup = document.createElement('div');
    popup.className = 'calendar-note-popup';
    
    // 🎯 INLINE STYLES to guarantee positioning
    popup.style.cssText = `
      position: absolute;
      left: 240px;
      top: 50%;
      transform: translateY(-50%);
      width: 180px;
      min-height: 80px;
      background: rgba(12, 13, 18, 0.92);
      border: 2px solid rgba(255, 255, 255, 0.20);
      border-radius: 6px;
      padding: 12px;
      z-index: 100;
      opacity: 0;
      transition: opacity 0.25s ease;
    `;
    
    popup.innerHTML = `
      <button class="calendar-note-close" style="
        position: absolute;
        top: 5px;
        right: 8px;
        background: none;
        border: none;
        color: rgba(255, 255, 255, 0.5);
        font-size: 1rem;
        cursor: pointer;
        padding: 4px 8px;
        line-height: 1;
      ">✕</button>
      <div style="
        font-family: Georgia, serif;
        font-size: 0.85rem;
        color: #F9E5B8;
        margin-bottom: 8px;
        padding-bottom: 6px;
        border-bottom: 1px dashed rgba(255, 255, 255, 0.15);
      ">${dateStr}</div>
      <div class="calendar-note-content" style="
        font-size: 0.75rem;
        color: #e6e6f0;
        line-height: 1.5;
      ">
        ${noteContent 
          ? noteContent 
          : `<div style="font-size:0.7rem; opacity:0.4; font-style:italic; text-align:center; padding:10px 0;">no notes for this day~</div>`
        }
      </div>
    `;
    
    container.appendChild(popup);
    
    // Fade in
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        popup.style.opacity = '1';
      });
    });
    
    // Close button handler
    const closeBtn = popup.querySelector('.calendar-note-close');
    closeBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      closeNotePopup();
    });
  }

  // Close when clicking outside
  document.addEventListener('click', (e) => {
    const popup = document.querySelector('.calendar-note-popup');
    if (popup && !popup.contains(e.target) && !e.target.closest('.calendar-day-link')) {
      closeNotePopup();
    }
  });

  function renderCalendar() {
    const container = document.getElementById("calendar-container");
    if (!container) return;

    // 🎯 IMPORTANT: position relative so popup positions correctly!
    container.style.cssText = `
      position: absolute;
      top: 1050px;
      left: 25px;
      width: 230px;
      z-index: 5;
    `;

    const daysInMonth = getDaysInMonth(displayMonth, displayYear);
    const today = new Date();
    const isCurrentMonth = today.getMonth() === displayMonth && today.getFullYear() === displayYear;

    const monthImg = MONTH_IMAGES[displayMonth];
    const monthImageHTML = monthImg 
      ? `<img src="${monthImg}" alt="${MONTH_NAMES[displayMonth]}" style="width:100%; height:100%; object-fit:contain; display:block;">`
      : `<span style="font-size:0.7rem; opacity:0.3; font-style:italic;">[ ${MONTH_NAMES[displayMonth]} ]</span>`;

    const prevBtnContent = NAV_IMAGES.prev 
      ? `<img src="${NAV_IMAGES.prev}" alt="Prev" style="width:20px; height:20px; object-fit:contain;">`
      : `◀`;
    
    const nextBtnContent = NAV_IMAGES.next 
      ? `<img src="${NAV_IMAGES.next}" alt="Next" style="width:20px; height:20px; object-fit:contain;">`
      : `▶`;

    let daysHTML = "";
    
    for (let day = 1; day <= daysInMonth; day++) {
      const isToday = isCurrentMonth && day === today.getDate();
      const dayHasNote = hasNote(displayYear, displayMonth, day);
      const bgColor = isToday ? "rgba(249,229,184,0.25)" : "transparent";
      const fontWeight = isToday ? "bold" : "normal";
      
      const noteIndicator = dayHasNote 
        ? `<span style="position:absolute; top:-1px; right:1px; font-size:0.35rem; color:#F9E5B8; opacity:0.8;">✦</span>` 
        : '';
      
      daysHTML += `
        <div style="aspect-ratio:1; display:flex; align-items:center; justify-content:center; position:relative;">
          ${noteIndicator}
          <a href="#" 
             class="calendar-day-link" 
             data-year="${displayYear}" 
             data-month="${displayMonth}" 
             data-day="${day}"
             style="
               color: #ffffff;
text-shadow:
  0 0 4px rgba(255,255,255,0.8),
  0 0 8px rgba(255,255,255,0.6),
  0 0 12px rgba(180,200,255,0.4);
  
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
               transition: background 0.2s ease, transform 0.15s ease;
             ">${day}</a>
        </div>
      `;
    }

    container.innerHTML = `
      <div style="position: relative; width: 100%;">
        
 
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

        <!-- NAV ROW -->
        <div style="
          position: absolute;
          top: 5%;
          left: 50%;
          transform: translateX(-50%);
          width: 70%;
          display: flex;
          justify-content: space-between;
          align-items: center;
        ">
          <button id="cal-prev" style="background:none; border:none; padding:0; cursor:pointer;">
            ${prevBtnContent}
          </button>
          
          <span style="
  font-family:Georgia,serif;
  font-size:0.95rem;
  color:#ffffff;
  text-shadow:
    0 0 6px rgba(255,255,255,0.9),
    0 0 12px rgba(200,220,255,0.5),
    0 0 18px rgba(150,180,255,0.3);
  opacity:0.95;
">
            ${MONTH_NAMES[displayMonth]} ${displayYear}
          </span>
          
          <button id="cal-next" style="background:none; border:none; padding:0; cursor:pointer;">
            ${nextBtnContent}
          </button>
        </div>
<!-- DAY GRID -->
        <div style="
          position: absolute;
          top: 56%;
          left: 50%;
          transform: translate(-50%, -48%);
          width: 60.5%;
        ">

          <div style="
            display: grid;
            grid-template-columns: repeat(7, 1fr);
            grid-template-rows: repeat(6, 1fr); /* 👈 LOCK HEIGHT */
            column-gap: 8px;
            row-gap: 5.5px;
          ">
            ${daysHTML}
          </div>

        </div>

        <!-- 🌙 CALENDAR NAV LINKS -->
        <nav id="calendar-links" style="
          margin-top: 10px;
          display: flex;
          justify-content: center;
          gap: 4px;
          flex-wrap: wrap;
          font-size: 0.55rem;
          font-weight: 470;
        ">
          <a href="#" data-view="transits" style="
            color: #F9E5B8;
            text-decoration: none;
            border: none;
            border-bottom: none;
            margin: 0 3px;
          ">transits<span style="margin-left:6px; opacity:0.6;"> |</span></a>
          <a href="#" data-view="all-notes" style="
            color: #F9E5B8;
            text-decoration: none;
            border: none;
            border-bottom: none;
            margin: 0 3px;
          ">all notes</a>
        </nav>

        <!-- 🌙 NOTE HINT -->
        <div style="
          margin-top: 10px;
          text-align: center;
          font-size: 8px;
          letter-spacing: 0.08em;
          opacity: 0.40;
          font-family: monospace;
          text-transform: lowercase;
          color: #ffffff;
        ">
          click days to see notes
        </div>

      </div>
      
    `;
    // Nav buttons
    document.getElementById("cal-prev")?.addEventListener("click", () => {
      closeNotePopup();
      displayMonth--;
      if (displayMonth < 0) { displayMonth = 11; displayYear--; }
      renderCalendar();
    });

    document.getElementById("cal-next")?.addEventListener("click", () => {
      closeNotePopup();
      displayMonth++;
      if (displayMonth > 11) { displayMonth = 0; displayYear++; }
      renderCalendar();
    });

    // Day click handlers
    container.querySelectorAll('.calendar-day-link').forEach(link => {
      link.addEventListener('click', (e) => {
        const year = parseInt(link.dataset.year);
        const month = parseInt(link.dataset.month);
        const day = parseInt(link.dataset.day);
        showNotePopup(year, month, day, e);
      });
      
      link.addEventListener('mouseenter', () => {
        link.style.background = 'rgba(249, 229, 184, 0.15)';
        link.style.transform = 'scale(1.1)';
      });
      link.addEventListener('mouseleave', () => {
        const isToday = link.dataset.month == currentDate.getMonth() 
                     && link.dataset.year == currentDate.getFullYear()
                     && link.dataset.day == currentDate.getDate();
        link.style.background = isToday ? 'rgba(249,229,184,0.25)' : 'transparent';
        link.style.transform = 'scale(1)';
      });
    });
  }

  async function initCalendar() {
    const container = document.getElementById("calendar-container");
    if (container) {
      await loadNotes();
      renderCalendar();
      console.log("✅ Calendar initialized with notes");
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initCalendar);
  } else {
    initCalendar();
  }

  window.initCalendar = initCalendar;

})();

