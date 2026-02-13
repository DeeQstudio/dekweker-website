(() => {
  document.documentElement.classList.add('js');

  const year = document.getElementById('year');
  if (year) {
    year.textContent = new Date().getFullYear();
  }

  const header = document.querySelector('.site-header');
  const navToggle = document.querySelector('.nav-toggle');
  const navPanel = document.getElementById('nav-panel');
  if (header && navToggle && navPanel) {
    const closeNav = () => {
      header.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
    };

    navToggle.addEventListener('click', () => {
      const isOpen = header.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });

    navPanel.addEventListener('click', (event) => {
      const target = event.target;
      if (target instanceof Element && target.closest('a')) {
        closeNav();
      }
    });

    document.addEventListener('click', (event) => {
      if (!header.classList.contains('is-open')) return;
      if (!header.contains(event.target)) {
        closeNav();
      }
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        closeNav();
      }
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 900) {
        closeNav();
      }
    });
  }

  const bioDetails = document.querySelector('.bio-details');
  if (bioDetails) {
    const mq = window.matchMedia('(max-width: 700px)');
    const syncBioState = () => {
      if (mq.matches) {
        bioDetails.removeAttribute('open');
      } else {
        bioDetails.setAttribute('open', '');
      }
    };
    syncBioState();
    if (typeof mq.addEventListener === 'function') {
      mq.addEventListener('change', syncBioState);
    } else if (typeof mq.addListener === 'function') {
      mq.addListener(syncBioState);
    }
  }

  const reveals = document.querySelectorAll('.reveal');
  if (!reveals.length) return;

  if (!('IntersectionObserver' in window)) {
    reveals.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  let revealedAny = false;
  const markVisible = (el) => {
    if (!el.classList.contains('is-visible')) {
      el.classList.add('is-visible');
      revealedAny = true;
    }
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          markVisible(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0 }
  );

  const revealInView = () => {
    reveals.forEach((el) => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        markVisible(el);
        observer.unobserve(el);
      }
    });
  };

  reveals.forEach((el) => observer.observe(el));

  requestAnimationFrame(revealInView);
  window.addEventListener(
    'hashchange',
    () => requestAnimationFrame(revealInView),
    { passive: true }
  );

  setTimeout(() => {
    if (!revealedAny) {
      reveals.forEach(markVisible);
    }
  }, 1200);
})();
