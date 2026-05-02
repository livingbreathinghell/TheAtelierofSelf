
/* =========================
   GALLERY SYSTEM
========================= */

function initGallery() {

  const IMAGES_PER_PAGE = 25;

  // ═══════════════════════════════════════
  // ALL IMAGES PAGINATION
  // ═══════════════════════════════════════
  const allGalleryItems = Array.from(document.querySelectorAll("#gallery-masonry .gallery-item"));
  let allImagesLoaded = 0;

  function showMoreAllImages() {
    const nextBatch = allGalleryItems.slice(allImagesLoaded, allImagesLoaded + IMAGES_PER_PAGE);
    nextBatch.forEach(item => {
      item.style.display = "block";
    });
    allImagesLoaded += nextBatch.length;

    const loadMoreBtn = document.getElementById("load-more-all");
    if (allImagesLoaded >= allGalleryItems.length) {
      loadMoreBtn.textContent = "all loaded";
      loadMoreBtn.classList.add("all-loaded");
    }

    initGalleryLightbox();
  }

  allGalleryItems.forEach(item => {
    item.style.display = "none";
  });
  showMoreAllImages();

  document.getElementById("load-more-all").addEventListener("click", function() {
    if (!this.classList.contains("all-loaded")) {
      showMoreAllImages();
    }
  });

  // ═══════════════════════════════════════
  // ALBUM DATA WITH SUB-ALBUMS!
  // ═══════════════════════════════════════
  const albumData = {
    art: {
      name: "art",
      subAlbums: {
        ocs: {
          name: "OC's",
          cover: "media/postmedia/2026/art/drawings/IHAVENONAME-drawing.png",
          images: [
            "media/games/untitledhomepagegame/workinprogress.png",
            "media/games/untitledhomepagegame/titlescreen.png",
            "media/postmedia/2026/art/drawings/IHAVENONAME-drawing.png",
            "media/postmedia/2026/art/drawings/IHAVENONAMEheader-drawing.png",
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
          ]
        },
        fanart: {
          name: "fanart",
          cover: "media/postmedia/2026/art/drawings/manon-pinkyup.jpg",
          images: [
            "media/postmedia/2026/art/drawings/manon-pinkyup.jpg",
            "media/postmedia/2026/art/drawings/manon-pinkyup-teacupheader.jpg"
          ]
        },
        misc: {
          name: "misc",
          cover: "media/basemedia/homepagedecor/wire2.png",
          images: [
            "media/basemedia/homepagedecor/calender/april.png",
            "media/basemedia/homepagedecor/calender/march.png",
            "media/basemedia/homepagedecor/calender/february.png",
            "media/basemedia/homepagedecor/calender/january.png",
            "media/basemedia/homepagedecor/calender/calendernext.png",
            "media/basemedia/homepagedecor/calender/calenderprevious.png",
            "media/basemedia/homepagedecor/darkwire3.png",
            "media/basemedia/homepagedecor/darkwire2.png",
            "media/basemedia/homepagedecor/darkwire1.png",
            "media/basemedia/homepagedecor/wire3.png",
            "media/basemedia/homepagedecor/wire2.png",
          ]
        }
      }
    },


    photography: {
      name: "photography",
      subAlbums: {
        twentysix: {
          name: "2026",
          cover: "media/postmedia/2026/journal/content/photography/goodluckcat.jpg",
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
      }
    },


    stamps: {
      name: "stamps",
      subAlbums: {},
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
      subAlbums: {
        anime: {
          name: "anime",
          cover: "media/basemedia/homepagedecor/welcomepanel.gif",
          images: [
        "media/postmedia/2026/journal/headers/nomnomnom.gif",
        "media/basemedia/homepagedecor/viewcounter.gif",
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
        "media/basemedia/homepagedecor/welcomepanel.gif",
          ]
        },

        cartoons: {
          name: "cartoons",
          cover: "loading.gif",
          images: [
        "media/postmedia/2026/tarot/misc/childlikewhimsy.gif",
        "loading.gif",
          ]
        },


        irl: {
          name: "irl",
          cover: "media/postmedia/2026/tarot/misc/the0banner.gif",
          images: [
        "media/postmedia/2026/tarot/misc/the0banner.gif",
          ]
        },
      }
    },



    collages: {
      name: "collages",
      subAlbums: {
        anime: {
          name: "moodboards",
          cover:"media/postmedia/2026/manifestations/mlmlove-moodboard.png",
          images: [
         "media/postmedia/2026/manifestations/mlmlove-moodboard.png",
          ]
        },

        misc: {
          name: "misc",
          cover: "media/basemedia/homepagedecor/fortune-panel-decor.png",
          images: [
        "media/basemedia/homepagedecor/fortune-panel-decor.png",
          ]
        },
      }
    },
  };


  // ═══════════════════════════════════════
  // HELPER: Get ALL images from an album
  // (combines sub-album images + direct images)
  // ═══════════════════════════════════════
  function getAllAlbumImages(album) {
    let allImages = [];
    
    // Collect from all sub-albums
    Object.values(album.subAlbums || {}).forEach(sub => {
      allImages = allImages.concat(sub.images || []);
    });
    
    // Add direct images too
    if (album.images) {
      allImages = allImages.concat(album.images);
    }
    
    return allImages;
  }

  // ═══════════════════════════════════════
  // NAVIGATION STATE
  // ═══════════════════════════════════════
  let currentAlbumKey = null;
  let currentSubAlbumKey = null;
  let currentAlbumImages = [];
  let albumImagesLoaded = 0;

  // ═══════════════════════════════════════
  // RENDER ALBUM VIEW (with sub-albums + all images!)
  // ═══════════════════════════════════════
  function openAlbum(albumKey) {
    const album = albumData[albumKey];
    if (!album) return;

    currentAlbumKey = albumKey;
    currentSubAlbumKey = null;

    document.getElementById("albums-section").style.display = "none";
    document.getElementById("all-images-section").style.display = "none";

    const albumView = document.getElementById("album-view");
    albumView.style.display = "block";
    document.getElementById("album-title").textContent = album.name;

    // Update back button
    const backBtn = document.getElementById("album-back");
    backBtn.textContent = "← back to gallery";
    backBtn.onclick = closeAlbum;

    // Build sub-albums section
    const subAlbumsContainer = document.getElementById("album-subalbums");
    const subAlbumsDivider = document.getElementById("album-divider");
    const hasSubAlbums = Object.keys(album.subAlbums || {}).length > 0;

    if (hasSubAlbums) {
      subAlbumsContainer.style.display = "block";
      subAlbumsDivider.style.display = "block";
      
      const grid = document.getElementById("subalbums-grid");
      grid.innerHTML = "";

      Object.entries(album.subAlbums).forEach(([key, sub]) => {
        const card = document.createElement("div");
        card.className = "album-card";
        card.dataset.subalbum = key;
        card.innerHTML = `
          <div class="album-cover">
            <img src="${sub.cover}" alt="${sub.name}">
          </div>
          <div class="album-name">${sub.name}</div>
        `;
        card.addEventListener("click", () => openSubAlbum(key));
        grid.appendChild(card);
      });
    } else {
      subAlbumsContainer.style.display = "none";
      subAlbumsDivider.style.display = "none";
    }

    // Show ALL album images below (from all sub-albums combined!)
    const container = document.getElementById("album-images");
    const imagesSection = document.getElementById("album-images-section");
    const loadMoreBtn = document.getElementById("load-more-album");
    
    container.innerHTML = "";
    currentAlbumImages = getAllAlbumImages(album);
    albumImagesLoaded = 0;

    if (currentAlbumImages.length > 0) {
      imagesSection.style.display = "block";
      loadMoreBtn.style.display = "block";
      loadMoreBtn.textContent = "load more";
      loadMoreBtn.classList.remove("all-loaded");
      showMoreAlbumImages();
    } else {
      imagesSection.style.display = "none";
      loadMoreBtn.style.display = "none";
    }
  }

  // ═══════════════════════════════════════
  // OPEN SUB-ALBUM (only shows that category)
  // ═══════════════════════════════════════
  function openSubAlbum(subAlbumKey) {
    const album = albumData[currentAlbumKey];
    const subAlbum = album.subAlbums[subAlbumKey];
    if (!subAlbum) return;

    currentSubAlbumKey = subAlbumKey;

    document.getElementById("album-title").textContent = `${album.name} / ${subAlbum.name}`;

    // Update back button to go back to parent album
    const backBtn = document.getElementById("album-back");
    backBtn.textContent = `← back to ${album.name}`;
    backBtn.onclick = () => openAlbum(currentAlbumKey);

    // Hide sub-albums section
    document.getElementById("album-subalbums").style.display = "none";
    document.getElementById("album-divider").style.display = "none";

    // Show ONLY this sub-album's images
    const container = document.getElementById("album-images");
    const imagesSection = document.getElementById("album-images-section");
    const loadMoreBtn = document.getElementById("load-more-album");

    container.innerHTML = "";
    currentAlbumImages = subAlbum.images;
    albumImagesLoaded = 0;

    imagesSection.style.display = "block";
    loadMoreBtn.style.display = "block";
    loadMoreBtn.textContent = "load more";
    loadMoreBtn.classList.remove("all-loaded");

    showMoreAlbumImages();
  }

  // ═══════════════════════════════════════
  // SHOW MORE ALBUM IMAGES
  // ═══════════════════════════════════════
  function showMoreAlbumImages() {
    const container = document.getElementById("album-images");
    const nextBatch = currentAlbumImages.slice(albumImagesLoaded, albumImagesLoaded + IMAGES_PER_PAGE);
    
    nextBatch.forEach(src => {
      const item = document.createElement("div");
      item.className = "gallery-item";
      item.innerHTML = `<img src="${src}" alt="">`;
      container.appendChild(item);
    });
    
    albumImagesLoaded += nextBatch.length;

    const loadMoreBtn = document.getElementById("load-more-album");
    if (albumImagesLoaded >= currentAlbumImages.length) {
      loadMoreBtn.textContent = "all loaded";
      loadMoreBtn.classList.add("all-loaded");
    } else {
      loadMoreBtn.textContent = "load more";
      loadMoreBtn.classList.remove("all-loaded");
    }

    initGalleryLightbox();
  }

  // ═══════════════════════════════════════
  // ALBUM CLICK HANDLER
  // ═══════════════════════════════════════
  document.querySelectorAll(".album-card").forEach(card => {
    card.addEventListener("click", () => {
      const albumKey = card.dataset.album;
      if (albumKey) openAlbum(albumKey);
    });
  });

  document.getElementById("load-more-album").addEventListener("click", function() {
    if (!this.classList.contains("all-loaded")) {
      showMoreAlbumImages();
    }
  });

  // ═══════════════════════════════════════
  // CLOSE ALBUM
  // ═══════════════════════════════════════
  window.closeAlbum = function() {
    document.getElementById("album-view").style.display = "none";
    document.getElementById("albums-section").style.display = "block";
    document.getElementById("all-images-section").style.display = "block";
    currentAlbumKey = null;
    currentSubAlbumKey = null;
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
      img.onclick = null;
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
  console.log("✅ Gallery initialized with sub-albums!");
}

window.initGallery = initGallery;
