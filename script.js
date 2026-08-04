document.addEventListener('DOMContentLoaded', () => {
  const slides = document.querySelectorAll('.slide');
  const progressBar = document.getElementById('progress-bar');
  const slideCounter = document.getElementById('slide-counter');
  const deckLogo = document.getElementById('deck-logo');
  const demoLevels = document.querySelectorAll('[data-demo-level]');
  let currentSlide = 0;
  let currentDemoLevel = 1;

  const DEMO_SLIDE_INDEX = 7;
  const total = slides.length;

  function pad(n) {
    return String(n).padStart(2, '0');
  }

  function updateSlides() {
    slides.forEach((slide, index) => {
      slide.classList.toggle('active', index === currentSlide);
    });

    const progress = ((currentSlide + 1) / total) * 100;
    if (progressBar) progressBar.style.width = `${progress}%`;
    if (slideCounter) {
      slideCounter.textContent = `${pad(currentSlide + 1)} / ${pad(total)}`;
    }
    // Logo global solo fuera de portada
    if (deckLogo) {
      deckLogo.hidden = currentSlide === 0;
    }
  }

  function nextSlide() {
    if (currentSlide < total - 1) {
      currentSlide++;
      updateSlides();
    }
  }

  function prevSlide() {
    if (currentSlide > 0) {
      currentSlide--;
      updateSlides();
    }
  }

  function goToSlide(index) {
    if (index >= 0 && index < total) {
      currentSlide = index;
      updateSlides();
    }
  }

  function setDemoLevel(level) {
    currentDemoLevel = level;
    demoLevels.forEach((el) => {
      el.classList.toggle('is-active', Number(el.dataset.demoLevel) === level);
    });
  }

  function toggleFullScreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.log(`Error al intentar activar pantalla completa: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  }

  function isInteractiveTarget(target) {
    const tag = target.tagName ? target.tagName.toLowerCase() : '';
    return tag === 'a' || tag === 'button' || tag === 'input' || tag === 'textarea' || tag === 'iframe';
  }

  document.addEventListener('keydown', (e) => {
    switch (e.key) {
      case 'ArrowRight':
      case 'PageDown':
        e.preventDefault();
        nextSlide();
        break;
      case ' ':
        e.preventDefault();
        nextSlide();
        break;
      case 'ArrowLeft':
      case 'PageUp':
        e.preventDefault();
        prevSlide();
        break;
      case 'Home':
        e.preventDefault();
        goToSlide(0);
        break;
      case 'End':
        e.preventDefault();
        goToSlide(total - 1);
        break;
      case 'd':
      case 'D':
        goToSlide(DEMO_SLIDE_INDEX);
        break;
      case '1':
      case '2':
      case '3':
        setDemoLevel(Number(e.key));
        if (currentSlide !== DEMO_SLIDE_INDEX) goToSlide(DEMO_SLIDE_INDEX);
        break;
      case 'f':
      case 'F':
        toggleFullScreen();
        break;
      default:
        break;
    }
  });

  document.addEventListener('mousedown', (e) => {
    if (isInteractiveTarget(e.target)) return;
    if (e.target.closest && e.target.closest('#demo-mockup')) return;
    if (e.button === 0) nextSlide();
  });

  let touchstartX = 0;
  let touchendX = 0;

  document.addEventListener('touchstart', (e) => {
    touchstartX = e.changedTouches[0].screenX;
  }, { passive: true });

  document.addEventListener('touchend', (e) => {
    touchendX = e.changedTouches[0].screenX;
    if (touchendX < touchstartX - 50) nextSlide();
    if (touchendX > touchstartX + 50) prevSlide();
  }, { passive: true });

  setDemoLevel(currentDemoLevel);
  updateSlides();
});
