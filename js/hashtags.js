// ==========================
// HASHTAGS
// ==========================
let activeTag = null;
let homepageMode = true;

const posts = Array.from(document.querySelectorAll(".post"));
const tagButtons = document.querySelectorAll(".tag-btn");

/* ---------- TAG BUTTONS ---------- */
tagButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    const tag = btn.dataset.tag;

    if (activeTag === tag) {
      activeTag = null;
      homepageMode = false;
    } else {
      activeTag = tag;
      homepageMode = false;
    }

    updatePosts();
  });
});

/* ---------- MAIN FILTER ---------- */
function updatePosts() {
  let visibleCount = 0;

  const sortedPosts = [...posts].sort((a, b) =>
    new Date(b.dataset.date) - new Date(a.dataset.date)
  );

  sortedPosts.forEach(post => {
    let show = true;

    // TAG FILTER
    if (activeTag) {
      const tags = (post.dataset.tags || "").split(",");
      show = tags.includes(activeTag);
    }

    // HOMEPAGE LIMIT
    if (homepageMode && !activeTag && visibleCount >= 3) {
      show = false;
    }

    post.style.display = show ? "flex" : "none";

    if (show) visibleCount++;
  });
}

/* ---------- INITIAL LOAD ---------- */
updatePosts();
