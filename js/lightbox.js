// ═══════════════════════════════════════
// EXPANDABLE IMAGE LIGHTBOX v2.5
// Plain image default + "[ see more ]" above image!
// ═══════════════════════════════════════

function initExpandableLightbox() {
  let currentExpandImages = [];
  let currentExpandIndex = 0;
  let currentConfig = null;

  const lightbox = document.getElementById("expand-lightbox");
  const backdrop = document.getElementById("expand-backdrop");
  if (!lightbox || !backdrop) return;

  const lightboxImg = document.getElementById("expand-img");
  const lightboxText = document.getElementById("expand-text");
  const lightboxContent = document.getElementById("expand-content");

  let wheelHandler = null;
  let touchHandler = null;

  const imgWrapper = document.createElement("div");
  imgWrapper.id = "expand-img-wrapper";
  Object.assign(imgWrapper.style, {
    position: "relative",
    display: "inline-flex",
  });

  const seeMoreBtn = document.createElement("button");
  seeMoreBtn.id = "expand-see-more";
  seeMoreBtn.textContent = "[ see more ]";
  Object.assign(seeMoreBtn.style, {
    position: "absolute",
    bottom: "100%",
    right: "0",
    background: "none",
    border: "none",
    color: "#ffffff",
    fontStyle: "italic",
    textDecoration: "underline",
    fontSize: "0.82rem",
    fontFamily: "inherit",
    cursor: "pointer",
    padding: "0 0 4px 0",
    margin: "0",
    display: "none",
    opacity: "0.85",
    whiteSpace: "nowrap",
    transition: "opacity 0.2s ease",
  });
  seeMoreBtn.addEventListener("mouseenter", () => { seeMoreBtn.style.opacity = "1"; });
  seeMoreBtn.addEventListener("mouseleave", () => { seeMoreBtn.style.opacity = "0.85"; });

  imgWrapper.appendChild(seeMoreBtn);
  imgWrapper.appendChild(lightboxImg);

  seeMoreBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    if (!currentConfig) return;
    lightboxContent.insertBefore(lightboxImg, lightboxText);
    if (imgWrapper.parentNode) imgWrapper.remove();
    const layoutClass = currentConfig.layout || "text-wrap";
    const imagePosClass = currentConfig.imagePosition ? `image-${currentConfig.imagePosition}` : "";
    lightboxContent.className = `with-text ${layoutClass} ${imagePosClass}`.trim();
    lightboxText.innerHTML = buildContentHTML(currentConfig);
    seeMoreBtn.style.display = "none";
  });

  function lockScroll() {
    wheelHandler = (e) => { e.preventDefault(); };
    touchHandler = (e) => {
      if (e.target.closest("#expand-content")) return;
      e.preventDefault();
    };
    window.addEventListener("wheel", wheelHandler, { passive: false });
    window.addEventListener("touchmove", touchHandler, { passive: false });
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
  }

  function unlockScroll() {
    if (wheelHandler) { window.removeEventListener("wheel", wheelHandler, { passive: false }); wheelHandler = null; }
    if (touchHandler) { window.removeEventListener("touchmove", touchHandler, { passive: false }); touchHandler = null; }
    document.body.style.overflow = "";
    document.documentElement.style.overflow = "";
  }

  function parseLightboxContent(img) {
    const card = img.closest(".imp-card");
    if (!card) return null;
    const scriptTag = card.querySelector('script[type="text/lightbox-content"]');
    if (!scriptTag) {
      return img.dataset.description ? {
        layout: "text-wrap", imagePosition: "left",
        sections: [{ type: "text", content: img.dataset.description }],
      } : null;
    }
    try { return JSON.parse(scriptTag.textContent); }
    catch (e) { console.warn("Failed to parse lightbox content:", e); return null; }
  }

  function buildContentHTML(config) {
    if (!config || !config.sections) return "";
    return config.sections.map((section) => {
      switch (section.type) {
        case "header": return `<h3 class="lb-header">${section.content}</h3>`;
        case "divider":
          const dividerClass = section.style ? `lb-divider ${section.style}` : "lb-divider";
          return `<div class="${dividerClass}"></div>`;
        case "text":
        default:
          const content = section.content || section;
          return `<p class="lb-paragraph">${content}</p>`;
      }
    }).join("");
  }

  function openExpandLightbox(img) {
    const parent = img.closest(".imp-row") || img.closest(".imp-section") || img.parentElement.parentElement;
    currentExpandImages = Array.from(parent.querySelectorAll("img.expandable"));
    currentExpandIndex = currentExpandImages.indexOf(img);
    updateExpandLightbox();
    document.body.appendChild(backdrop);
    document.body.appendChild(lightbox);
    requestAnimationFrame(() => {
      backdrop.classList.add("active");
      lightbox.classList.add("active");
      document.body.classList.add("lightbox-active");
      lockScroll();
    });
  }

  function updateExpandLightbox() {
    const img = currentExpandImages[currentExpandIndex];
    lightboxImg.src = img.src;

    currentConfig = parseLightboxContent(img);

    if (currentConfig && currentConfig.panelDefault) {
      // Panel-first mode: open straight to the panel, skip the plain image view
      if (lightboxImg.parentNode !== lightboxContent) {
        lightboxContent.insertBefore(lightboxImg, lightboxText);
      }
      if (imgWrapper.parentNode) imgWrapper.remove();
      const layoutClass = currentConfig.layout || "text-wrap";
      const imagePosClass = currentConfig.imagePosition ? `image-${currentConfig.imagePosition}` : "";
      lightboxContent.className = `with-text ${layoutClass} ${imagePosClass}`.trim();
      lightboxText.innerHTML = buildContentHTML(currentConfig);
      seeMoreBtn.style.display = "none";
    } else {
      // Default: plain centered image, with "[ see more ]" if there's a config
      lightboxContent.className = "centered";
      lightboxText.innerHTML = "";
      if (lightboxImg.parentNode !== imgWrapper) imgWrapper.appendChild(lightboxImg);
      if (!lightboxContent.contains(imgWrapper)) lightboxContent.insertBefore(imgWrapper, lightboxContent.firstChild);
      seeMoreBtn.style.display = currentConfig ? "block" : "none";
    }
  }

  function closeExpandLightbox() {
    lightbox.classList.remove("active");
    backdrop.classList.remove("active");
    document.body.classList.remove("lightbox-active");
    seeMoreBtn.style.display = "none";
    unlockScroll();
  }

  document.querySelectorAll("img.expandable").forEach((img) => {
    if (img.dataset.expandBound) return;
    img.dataset.expandBound = "true";
    img.style.cursor = "zoom-in";
    img.addEventListener("click", (e) => { e.preventDefault(); e.stopPropagation(); openExpandLightbox(img); });
  });

  document.getElementById("expand-close").addEventListener("click", closeExpandLightbox);
  lightbox.addEventListener("click", (e) => { if (e.target === lightbox) closeExpandLightbox(); });
  backdrop.addEventListener("click", (e) => { if (e.target === backdrop) closeExpandLightbox(); });

  document.getElementById("expand-prev").addEventListener("click", (e) => {
    e.stopPropagation();
    currentExpandIndex = (currentExpandIndex - 1 + currentExpandImages.length) % currentExpandImages.length;
    updateExpandLightbox();
  });
  document.getElementById("expand-next").addEventListener("click", (e) => {
    e.stopPropagation();
    currentExpandIndex = (currentExpandIndex + 1) % currentExpandImages.length;
    updateExpandLightbox();
  });

  document.addEventListener("keydown", (e) => {
    if (!lightbox.classList.contains("active")) return;
    if (e.key === "Escape") closeExpandLightbox();
    if (e.key === "ArrowLeft") document.getElementById("expand-prev").click();
    if (e.key === "ArrowRight") document.getElementById("expand-next").click();
  });

  console.log("✅ Expandable lightbox v2.5 ready!");
}

window.initExpandableLightbox = initExpandableLightbox;