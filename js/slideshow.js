function initSlideshows() {
  document.querySelectorAll('.post-slideshow').forEach(slideshow => {
    const slides = slideshow.querySelectorAll('.slide');
    const prev = slideshow.querySelector('.slide-arrow.left');
    const next = slideshow.querySelector('.slide-arrow.right');

    if (!slides.length || !prev || !next) return;

    let index = 0;

    function showSlide(i) {
      slides.forEach(slide => slide.classList.remove('active'));
      slides[i].classList.add('active');
    }

    showSlide(index);

    prev.addEventListener('click', () => {
      index = (index - 1 + slides.length) % slides.length;
      showSlide(index);
    });

    next.addEventListener('click', () => {
      index = (index + 1) % slides.length;
      showSlide(index);
    });
  });
}