/* ============================
   GUESTBOOK
   Saves entries to localStorage
   so they persist on reload
============================ */

(function () {
  const STORAGE_KEY = "atelier_guestbook_entries";

  const months = ["jan","feb","mar","apr","may","jun","jul","aug","sep","oct","nov","dec"];

  function loadEntries() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch (e) {
      return [];
    }
  }

  function saveEntries(entries) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  }

  function formatDate(d) {
    return `${months[d.getMonth()]} ${d.getDate()}`;
  }

  function renderEntries(entriesEl) {
    const entries = loadEntries();
    entriesEl.innerHTML = "";
    entries.forEach((entry) => {
      const div = document.createElement("div");
      div.className = "guestbook-entry";

      const meta = document.createElement("div");
      meta.className = "entry-meta";

      const name = document.createElement("span");
      name.className = "entry-name";
      name.textContent = entry.name;

      const date = document.createElement("span");
      date.className = "entry-date";
      date.textContent = entry.date;

      meta.appendChild(name);
      meta.appendChild(date);

      const msg = document.createElement("div");
      msg.className = "entry-message";
      msg.textContent = entry.message;

      div.appendChild(meta);
      div.appendChild(msg);
      entriesEl.appendChild(div);
    });
  }

  function setupGuestbook(form, entriesEl) {
    renderEntries(entriesEl);

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const nameInput = document.getElementById("guestbook-name");
      const messageInput = document.getElementById("guestbook-message");

      const name = nameInput.value.trim();
      const message = messageInput.value.trim();
      if (!name || !message) return;

      const entries = loadEntries();
      entries.unshift({
        name,
        message,
        date: formatDate(new Date()),
      });
      saveEntries(entries);

      nameInput.value = "";
      messageInput.value = "";
      renderEntries(entriesEl);
    });
  }

  function waitForElements() {
    const form = document.getElementById("guestbook-form");
    const entriesEl = document.getElementById("guestbook-entries");
    if (!form || !entriesEl) {
      setTimeout(waitForElements, 200);
      return;
    }
    setupGuestbook(form, entriesEl);
  }

  document.addEventListener("DOMContentLoaded", waitForElements);
})();