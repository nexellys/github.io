
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

  function getFirstSetWidth() {
    return track.scrollWidth / 2;
  }

  function animateCarousel() {
    if (!isPaused) {
      position += autoSpeed;

      const firstSetWidth = getFirstSetWidth();
      if (position >= firstSetWidth) {
        position = 0;
      }

      track.style.transform = `translateX(-${position}px)`;
      updateActiveCard();
    }

    animationFrame = requestAnimationFrame(animateCarousel);
  }

  function moveCarousel(direction) {
    const item = track.querySelector(".scroll-item");
    const gap = 24;
    const moveAmount = item.offsetWidth + gap;
    const firstSetWidth = getFirstSetWidth();

    if (direction === "right") {
      position += moveAmount;
      if (position >= firstSetWidth) position -= firstSetWidth;
    } else {
      position -= moveAmount;
      if (position < 0) position += firstSetWidth;
    }

    track.style.transform = `translateX(-${position}px)`;
    updateActiveCard();
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
    isPaused = true;
  });

  wrapper.addEventListener("mouseleave", () => {
    isPaused = false;
  });

  wrapper.addEventListener("touchstart", () => {
    isPaused = true;
  });

  wrapper.addEventListener("touchend", () => {
    setTimeout(() => {
      isPaused = false;
    }, 1200);
  });

  window.addEventListener("resize", updateActiveCard);

  updateActiveCard();
  animateCarousel();
