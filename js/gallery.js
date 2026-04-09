
/* =========================
   GALLERY SYSTEM
========================= */

function initGallery() {

  // ═══════════════════════════════════════
  // ALBUM DATA - customize your albums here!
  // ═══════════════════════════════════════
  const albumData = {
    art: {
      name: "art",
        images: [
       "media/postmedia/2026/art/drawings/manon-pinkyup.jpg",
       "media/postmedia/2026/art/drawings/manon-pinkyup-teacupheader.jpg",
        "media/basemedia/homepagedecor/calender/april.png",
        "media/basemedia/homepagedecor/calender/march.png",
        "media/basemedia/homepagedecor/calender/february.png",
        "media/basemedia/homepagedecor/calender/january.png",
        "media/basemedia/homepagedecor/calender/calendernext.png",
        "media/basemedia/homepagedecor/calender/calenderprevious.png",
        "media/postmedia/2026/art/drawings/fortunebear-header.png",
        "media/postmedia/2026/art/drawings/fortunebear-drawing.png",
       "media/postmedia/2026/art/drawings/mercuryimpcloseup.jpg",
        "media/postmedia/2026/art/concepts/genesis/mercury/mercuryimp-writer.jpg",
        "media/postmedia/2026/art/concepts/genesis/mercury/mercuryimp-sailor.jpg",
        "media/postmedia/2026/art/concepts/genesis/mercury/mercuryimp-merchant.jpg",
        "media/postmedia/2026/art/concepts/genesis/mercury/mercuryimp-financebro.jpg",
        "media/postmedia/2026/art/concepts/genesis/mercury/mercuryimp-engineer.jpg",
        "media/postmedia/2026/art/concepts/genesis/mercury/mercuryimp-base.jpg",
        "media/postmedia/2026/art/drawings/fishman.png",
        "media/postmedia/2026/art/drawings/Fishmansfish.jpg",
        "media/postmedia/2026/art/drawings/sailordemons.jpg",
        "media/postmedia/2026/art/drawings/sailors.png",
        "media/basemedia/homepagedecor/darkwire3.png",
        "media/basemedia/homepagedecor/darkwire2.png",
        "media/basemedia/homepagedecor/darkwire1.png",
        "media/basemedia/homepagedecor/wire3.png",
        "media/basemedia/homepagedecor/wire2.png",
        // add more images here!
      ]

    },
    photography: {
      name: "photography",
      images: [
        "media/postmedia/2026/journal/content/photography/goodluckcat.jpg",
        "media/postmedia/2026/journal/content/photography/goodluckcatSWING.jpg",
        "media/postmedia/2026/journal/content/photography/whiteysriver.jpg",
        "media/postmedia/2026/journal/content/photography/whiteysgator.jpg",
        "media/postmedia/2026/journal/content/photography/whiteysdecor.jpg",
        "media/postmedia/2026/journal/content/photography/whiteysshrimp.jpg",
        "media/postmedia/2026/journal/content/photography/whiteysentre.jpg",
        "media/postmedia/2026/journal/content/photography/whiteysdiningtree.jpg",
      ]
    },



    stamps: {
      name: "stamps",
      images: [
        "media/basemedia/homepagedecor/stamps/DELETE-stamp.gif",
        "media/basemedia/homepagedecor/stamps/flutterbateman-STAMP.gif",
        "media/basemedia/homepagedecor/stamps/fuckcensorship-STAMP.gif",
        "media/basemedia/homepagedecor/stamps/gorillaz-STAMP.gif",
        "media/basemedia/homepagedecor/stamps/iloveeatingmeat-STAMP.gif",
        "media/basemedia/homepagedecor/stamps/itsokpluto-STAMP.png",
        "media/basemedia/homepagedecor/stamps/karkatbucket-STAMP.gif",
        "media/basemedia/homepagedecor/stamps/music-STAMP.gif",
        "media/basemedia/homepagedecor/stamps/NONO-STAMP.gif",
        "media/basemedia/homepagedecor/stamps/pikachu-STAMP.gif",
        "media/basemedia/homepagedecor/stamps/radio-stamp.gif",
        "media/basemedia/homepagedecor/stamps/RISEOFTHEDEAD-STAMP.gif",
        "media/basemedia/homepagedecor/stamps/seeyouspacecowboy-STAMP.gif",
        "media/basemedia/homepagedecor/stamps/totoro-STAMP.gif",
        "media/basemedia/homepagedecor/stamps/yay-stamp.gif",
        "media/basemedia/globaldecor/deviantart_stamp.png",
        
      ]
    },

    gifs: {
      name: "gifs",
      images: [
        "media/postmedia/2026/journal/headers/nomnomnom.gif",
        "media/basemedia/homepagedecor/viewcounter.gif",
        "media/postmedia/2026/tarot/misc/the0banner.gif",
        "media/postmedia/2026/tarot/misc/childlikewhimsy.gif",
        "media/postmedia/2026/tarot/misc/thefoolbanner.gif",
        "media/postmedia/2026/journal/headers/torture.gif",
        "media/postmedia/2026/astrology/planets/house.gif",
        "media/postmedia/2026/astrology/planets/triplicity.gif",
        "media/postmedia/2026/astrology/planets/bound.gif",
        "media/postmedia/2026/astrology/planets/decans.gif",
        "media/postmedia/2026/astrology/planets/detriment.gif",
        "media/postmedia/2026/astrology/planets/fall.gif",
        "media/postmedia/2026/astrology/planets/exaltation.gif",
        "media/postmedia/2026/astrology/planets/domicile.gif",
        "media/postmedia/2026/astrology/planets/dignitybanner.gif",
        "media/postmedia/2026/astrology/planets/dignityheader.gif",
        "media/postmedia/2026/astrology/planets/moonheaderpanel.gif",
        "media/postmedia/2026/astrology/planets/moon.gif",
        "loading.gif",
        "media/basemedia/homepagedecor/welcomepanel.gif",
      ]
    }
  };

  // ═══════════════════════════════════════
  // ALBUM CLICK HANDLER
  // ═══════════════════════════════════════
  document.querySelectorAll(".album-card").forEach(card => {
    card.addEventListener("click", () => {
      const albumKey = card.dataset.album;
      const album = albumData[albumKey];
      if (!album) return;

      document.getElementById("albums-section").style.display = "none";
      document.getElementById("all-images-section").style.display = "none";

      const albumView = document.getElementById("album-view");
      albumView.style.display = "block";
      document.getElementById("album-title").textContent = album.name;

      const container = document.getElementById("album-images");
      container.innerHTML = "";
      album.images.forEach(src => {
        const item = document.createElement("div");
        item.className = "gallery-item";
        item.innerHTML = `<img src="${src}" alt="">`;
        container.appendChild(item);
      });

      initGalleryLightbox();
    });
  });

  // ═══════════════════════════════════════
  // CLOSE ALBUM
  // ═══════════════════════════════════════
  window.closeAlbum = function() {
    document.getElementById("album-view").style.display = "none";
    document.getElementById("albums-section").style.display = "block";
    document.getElementById("all-images-section").style.display = "block";
  };

  // ═══════════════════════════════════════
  // LIGHTBOX
  // ═══════════════════════════════════════
  let currentImages = [];
  let currentIndex = 0;

  function initGalleryLightbox() {
    const lightbox = document.getElementById("gallery-lightbox");
    const lightboxImg = document.getElementById("lightbox-img");

    document.querySelectorAll(".gallery-item img").forEach(img => {
      img.style.cursor = "zoom-in";
      img.addEventListener("click", () => {
        currentImages = Array.from(document.querySelectorAll(".gallery-item img"))
          .filter(i => i.offsetParent !== null)
          .map(i => i.src);
        currentIndex = currentImages.indexOf(img.src);

        lightboxImg.src = img.src;
lightbox.classList.add("active");
document.body.style.overflow = "hidden";
document.body.classList.add("lightbox-open");
      });
    });
  }

function closeLightbox() {
  document.getElementById("gallery-lightbox").classList.remove("active");
  document.body.style.overflow = "";
  document.body.classList.remove("lightbox-open");
}

  document.getElementById("lightbox-close").addEventListener("click", closeLightbox);
  document.getElementById("gallery-lightbox").addEventListener("click", (e) => {
    if (e.target.id === "gallery-lightbox") closeLightbox();
  });

  document.getElementById("lightbox-prev").addEventListener("click", (e) => {
    e.stopPropagation();
    currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length;
    document.getElementById("lightbox-img").src = currentImages[currentIndex];
  });

  document.getElementById("lightbox-next").addEventListener("click", (e) => {
    e.stopPropagation();
    currentIndex = (currentIndex + 1) % currentImages.length;
    document.getElementById("lightbox-img").src = currentImages[currentIndex];
  });

  document.addEventListener("keydown", (e) => {
    const lightbox = document.getElementById("gallery-lightbox");
    if (!lightbox.classList.contains("active")) return;

    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft") document.getElementById("lightbox-prev").click();
    if (e.key === "ArrowRight") document.getElementById("lightbox-next").click();
  });

  initGalleryLightbox();
  console.log("✅ Gallery initialized");
}

// expose globally
window.initGallery = initGallery;
