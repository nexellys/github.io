
document.addEventListener('DOMContentLoaded', function () {
  const filters = document.querySelectorAll('[data-filter]');
  const items = document.querySelectorAll('.project-item');

  filters.forEach(btn => {
    btn.addEventListener('click', function () {
      filters.forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      const filter = this.getAttribute('data-filter');

      items.forEach(item => {
        const category = item.getAttribute('data-category');
        item.style.display = (filter === 'all' || category === filter) ? '' : 'none';
      });
    });
  });

  const counters = document.querySelectorAll('[data-counter]');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.getAttribute('data-counter'), 10);
      let current = 0;
      const step = Math.max(1, Math.floor(target / 60));
      const timer = setInterval(() => {
        current += step;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }
        el.textContent = current;
      }, 22);
      observer.unobserve(el);
    });
  }, { threshold: 0.35 });

  counters.forEach(c => observer.observe(c));

  const video = document.querySelector('video.hero-video');
  if (video) {
    video.play().catch(() => {});
  }
});

  const track = document.getElementById("carouselTrack");
  const wrapper = document.getElementById("cardsCarousel");

  const originalItems = Array.from(track.children);
  originalItems.forEach(item => {
    const clone = item.cloneNode(true);
    track.appendChild(clone);
  });

  let position = 0;
  let animationFrame;
  let autoSpeed = 0.45;
  let isPaused = false;

  let isDragging = false;
  let startX = 0;
  let startY = 0;
  let startPosition = 0;

  function getFirstSetWidth() {
    return track.scrollWidth / 2;
  }

  function normalizePosition() {
    const firstSetWidth = getFirstSetWidth();

    while (position < 0) {
      position += firstSetWidth;
    }

    while (position >= firstSetWidth) {
      position -= firstSetWidth;
    }
  }

  function renderCarousel() {
    normalizePosition();
    track.style.transform = `translateX(-${position}px)`;
    updateActiveCard();
  }

  function animateCarousel() {
    if (!isPaused && !isDragging) {
      position += autoSpeed;
      renderCarousel();
    }

    animationFrame = requestAnimationFrame(animateCarousel);
  }

  function moveCarousel(direction) {
    const item = track.querySelector(".scroll-item");
    const gap = 24;
    const moveAmount = item.offsetWidth + gap;

    if (direction === "right") {
      position += moveAmount;
    } else {
      position -= moveAmount;
    }

    renderCarousel();
  }

  function updateActiveCard() {
    const wrapperRect = wrapper.getBoundingClientRect();
    const wrapperCenter = wrapperRect.left + wrapperRect.width / 2;

    const cards = track.querySelectorAll(".premium-card");
    let closestCard = null;
    let closestDistance = Infinity;

    cards.forEach(card => {
      card.classList.remove("is-active");

      const rect = card.getBoundingClientRect();
      const cardCenter = rect.left + rect.width / 2;
      const distance = Math.abs(wrapperCenter - cardCenter);

      if (distance < closestDistance) {
        closestDistance = distance;
        closestCard = card;
      }
    });

    if (closestCard) {
      closestCard.classList.add("is-active");
    }
  }

  wrapper.addEventListener("mouseenter", () => {
    if (!isDragging) isPaused = true;
  });

  wrapper.addEventListener("mouseleave", () => {
    if (!isDragging) isPaused = false;
  });

  wrapper.addEventListener("mousedown", (e) => {
    isDragging = true;
    isPaused = true;
    wrapper.classList.add("dragging");
    startX = e.pageX;
    startPosition = position;
  });

  window.addEventListener("mousemove", (e) => {
    if (!isDragging) return;

    const deltaX = e.pageX - startX;
    position = startPosition - deltaX;
    renderCarousel();
  });

  window.addEventListener("mouseup", () => {
    if (!isDragging) return;

    isDragging = false;
    wrapper.classList.remove("dragging");

    setTimeout(() => {
      isPaused = false;
    }, 700);
  });

  wrapper.addEventListener("touchstart", (e) => {
    isDragging = true;
    isPaused = true;
    startX = e.touches[0].pageX;
    startY = e.touches[0].pageY;
    startPosition = position;
  }, { passive: true });

  wrapper.addEventListener("touchmove", (e) => {
    if (!isDragging) return;

    const touchX = e.touches[0].pageX;
    const deltaX = touchX - startX;
    position = startPosition - deltaX;
    renderCarousel();
  }, { passive: true });

  wrapper.addEventListener("touchend", () => {
    isDragging = false;

    setTimeout(() => {
      isPaused = false;
    }, 900);
  });

  wrapper.addEventListener("wheel", (e) => {
    if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
      position += e.deltaY;
    } else {
      position += e.deltaX;
    }

    isPaused = true;
    renderCarousel();

    clearTimeout(wrapper.wheelTimeout);
    wrapper.wheelTimeout = setTimeout(() => {
      isPaused = false;
    }, 800);

    e.preventDefault();
  }, { passive: false });

  window.addEventListener("resize", renderCarousel);

  renderCarousel();
  animateCarousel();
