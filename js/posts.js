// -------------------------
// LOAD SINGLE POST
// -------------------------
async function loadSinglePost(post) {
  if (!post?.file) {
    console.error("❌ Post missing file property:", post);
    return null;
  }

  const path = post.subcategory
    ? `html/posts/${post.category}/${post.subcategory}/${post.file}`
    : `html/posts/${post.category}/${post.file}`;  

  try {
    console.log("Fetching post:", path);
    const res = await fetch(path, { cache: "no-store" });
    if (!res.ok) {
      console.error(`❌ Post not found: ${path} (Status: ${res.status})`);
      return null;
    }

    const html = await res.text();
    const wrapper = document.createElement("div");
    wrapper.innerHTML = html;
    const postEl = wrapper.querySelector(".post");

    if (!postEl) {
      console.error(`❌ No .post element inside ${path}`);
      console.log("HTML preview:", html.substring(0, 200));
      return null;
    }

    // Apply dataset
    postEl.dataset.date = post.date || "";
    postEl.dataset.time = post.time || "";
    postEl.dataset.category = post.category || "";
    postEl.dataset.subcategory = post.subcategory || "";
    postEl.dataset.month = post.month || "";
    postEl.dataset.homepage = post.homepage ? "true" : "false";

    return postEl;

  } catch (err) {
    console.error(`❌ Error loading post: ${path}`, err.message || err);
    return null;
  }
}

// -------------------------
// LOAD POSTS FROM JSON
// -------------------------
async function loadPostsFromJSON(jsonPath = 'html/posts/posts.json') {
  try {
    console.log("Loading posts from:", jsonPath);
    const res = await fetch(jsonPath, { cache: "no-store" });
    if (!res.ok) {
      console.error(`❌ Could not load ${jsonPath}`);
      return [];
    }

    const data = await res.json();
    const posts = data.posts || [];
    console.log(`Found ${posts.length} posts in JSON`);

    const loadedPosts = await Promise.all(posts.map(post => loadSinglePost(post)));
    const validPosts = loadedPosts.filter(p => p !== null);

    const container = document.getElementById("posts-container");
    if (!container) {
      console.error("❌ #posts-container not found!");
      return validPosts;
    }

    // Append posts
    validPosts.forEach(postEl => container.appendChild(postEl));
    console.log(`✅ Added ${validPosts.length} posts to DOM`);

    // Expandable images
    container.querySelectorAll('.imp-card img.expandable').forEach(img => {
      if (img.dataset.bound) return;
      img.dataset.bound = "true";

      img.addEventListener('click', () => {
        document.body.style.overflow = 'hidden';
        const overlay = document.createElement('div');
        overlay.classList.add('expand-overlay');
        const clone = img.cloneNode();
        clone.classList.add('expanded');
        overlay.appendChild(clone);
        document.body.appendChild(overlay);
        overlay.addEventListener('click', () => {
          overlay.remove();
          document.body.style.overflow = '';
        });
      });
    });

    // Initialize slideshows AFTER posts exist
    if (typeof window.initSlideshows === "function") {
      window.initSlideshows(container);
    }

    // Initialize collapsibles ONCE
    if (typeof window.initCollapsibles === "function") {
      window.initCollapsibles(container);
    }

    // Update display if needed
    if (typeof window.updatePostsDisplay === "function") {
      window.updatePostsDisplay();
    }

    return validPosts;

  } catch (err) {
    console.error("❌ Error loading posts JSON:", err);
    return [];
  }
}

// -------------------------
// INIT SLIDESHOWS
// -------------------------
function initSlideshows(root = document) {
  const slideshows = root.querySelectorAll('.post-slideshow');
  slideshows.forEach(slideshow => {
    const slides = slideshow.querySelectorAll('.slide');
    const leftBtn = slideshow.querySelector('.slide-arrow.left');
    const rightBtn = slideshow.querySelector('.slide-arrow.right');
    let current = 0;

    function showSlide(index) {
      slides.forEach((slide, i) => slide.classList.toggle('active', i === index));
    }

    leftBtn?.addEventListener('click', () => {
      current = (current - 1 + slides.length) % slides.length;
      showSlide(current);
    });

    rightBtn?.addEventListener('click', () => {
      current = (current + 1) % slides.length;
      showSlide(current);
    });

    showSlide(current);
  });
}

// -------------------------
// EXPOSE FUNCTIONS
// -------------------------
window.loadPostsFromJSON = loadPostsFromJSON;
window.loadSinglePost = loadSinglePost;
window.initSlideshows = initSlideshows;

// -------------------------
// EXPOSE FUNCTIONS GLOBALLY
// -------------------------
if (typeof window !== "undefined") {
  window.initCollapsibles = initCollapsibles;
  window.initZodiacPanels = initZodiacPanels;
  window.initLightbox = initLightbox;
}

