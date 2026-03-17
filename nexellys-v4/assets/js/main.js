
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
