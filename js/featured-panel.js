// ===============================
// FEATURED PANEL — Carousel + Reactions
// ===============================

window.initFeaturedPanel = function () {

  const items = [
    { name: "The Fool - Deepdive",    url: "#", img: "media/basemedia/homepagedecor/featuredcontent/thefool-preview.png", gradient: null },
    { name: "bass cover — kyoto",     url: "#", img: null, gradient: "linear-gradient(135deg, #1a0c10 0%, #2a1018 100%)" },
    { name: "tarot — the moon",       url: "#", img: null, gradient: "linear-gradient(135deg, #08101e 0%, #0e1830 100%)" },
    { name: "art — starfield sketch", url: "#", img: null, gradient: "linear-gradient(135deg, #0c1a10 0%, #122018 100%)" },
    { name: "journal — may 1st",      url: "#", img: null, gradient: "linear-gradient(135deg, #1a180c 0%, #22200e 100%)" },
    { name: "playlist — 2am vibes",   url: "#", img: null, gradient: "linear-gradient(135deg, #180c1e 0%, #22122a 100%)" },
  ];

  const track        = document.getElementById("featured-carousel-track");
  const dotsWrap     = document.getElementById("featured-dots");
  const tabName      = document.getElementById("featured-tab-name");
  const enterLink    = document.getElementById("featured-enter-link");
  const likeBtn      = document.getElementById("featured-like");
  const dislikeBtn   = document.getElementById("featured-dislike");
  const likeCount    = document.getElementById("featured-like-count");
  const dislikeCount = document.getElementById("featured-dislike-count");

  if (!track || !dotsWrap) return;

  let current  = 0;
  let autoTimer;
  let reactions = JSON.parse(localStorage.getItem("featured-reactions") || "{}");

  // ── Build slides + dots ──
  items.forEach((item, i) => {
    const slide = document.createElement("div");
    slide.className = "featured-slide" + (i === 0 ? " active" : "");

if (item.img) {
  slide.style.backgroundImage    = `url('${item.img}')`;
  slide.style.backgroundSize     = "contain";
  slide.style.backgroundPosition = "center";
  slide.style.backgroundRepeat   = "no-repeat";
  slide.style.backgroundColor    = "rgba(0, 0, 0, 0.88)";
} else {
      slide.style.background = item.gradient;
    }

    track.appendChild(slide);

    const dot = document.createElement("button");
    dot.className = "featured-dot" + (i === 0 ? " active" : "");
    dot.setAttribute("aria-label", `Slide ${i + 1}`);
    dot.addEventListener("click", () => goTo(i));
    dotsWrap.appendChild(dot);
  });

  // ── Navigation ──
  function goTo(index) {
    const slides = track.querySelectorAll(".featured-slide");
    const dots   = dotsWrap.querySelectorAll(".featured-dot");

    slides[current].classList.remove("active");
    dots[current].classList.remove("active");

    current = (index + items.length) % items.length;

    slides[current].classList.add("active");
    dots[current].classList.add("active");

    if (tabName)  tabName.textContent  = items[current].name;
    if (enterLink) enterLink.href      = items[current].url;

    updateReactionDisplay();
    resetAutoAdvance();
  }

  // ── Auto-advance ──
  function startAutoAdvance() {
    autoTimer = setInterval(() => goTo(current + 1), 5000);
  }

  function resetAutoAdvance() {
    clearInterval(autoTimer);
    startAutoAdvance();
  }

  startAutoAdvance();

  // ── Set initial tab name ──
  if (tabName)  tabName.textContent  = items[0].name;
  if (enterLink) enterLink.href      = items[0].url;

  // ── Reactions ──
  function getReactions(i) {
    return reactions[i] || { likes: 0, dislikes: 0, voted: null };
  }

  function saveReactions() {
    localStorage.setItem("featured-reactions", JSON.stringify(reactions));
  }

  function updateReactionDisplay() {
    const r = getReactions(current);
    if (likeCount)    likeCount.textContent    = r.likes;
    if (dislikeCount) dislikeCount.textContent = r.dislikes;
    if (likeBtn)    likeBtn.classList.toggle("active",    r.voted === "like");
    if (dislikeBtn) dislikeBtn.classList.toggle("active", r.voted === "dislike");
  }

  if (likeBtn) {
    likeBtn.addEventListener("click", () => {
      if (!reactions[current]) reactions[current] = { likes: 0, dislikes: 0, voted: null };
      const r = reactions[current];
      if (r.voted === "like") {
        r.likes--; r.voted = null;
      } else {
        if (r.voted === "dislike") r.dislikes--;
        r.likes++; r.voted = "like";
      }
      saveReactions();
      updateReactionDisplay();
    });
  }

  if (dislikeBtn) {
    dislikeBtn.addEventListener("click", () => {
      if (!reactions[current]) reactions[current] = { likes: 0, dislikes: 0, voted: null };
      const r = reactions[current];
      if (r.voted === "dislike") {
        r.dislikes--; r.voted = null;
      } else {
        if (r.voted === "like") r.likes--;
        r.dislikes++; r.voted = "dislike";
      }
      saveReactions();
      updateReactionDisplay();
    });
  }

  updateReactionDisplay();
};