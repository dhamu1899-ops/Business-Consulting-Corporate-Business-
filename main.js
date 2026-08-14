/* ============================================================
   STACKLY - PREMIUM JAVASCRIPT INTERACTIONS v2
   ============================================================ */

'use strict';

/* ----------------------------------------------------------
   1. CUSTOM CURSOR & MOUSE POINTER ANIMATION
   ---------------------------------------------------------- */
function initCursor() {
  let cursor = document.getElementById('custom-cursor');
  let cursorDot = document.getElementById('cursor-dot');
  
  if (!cursor) {
    cursor = document.createElement('div');
    cursor.id = 'custom-cursor';
    document.body.appendChild(cursor);
  }
  if (!cursorDot) {
    cursorDot = document.createElement('div');
    cursorDot.id = 'cursor-dot';
    document.body.appendChild(cursorDot);
  }

  let mouseX = -100, mouseY = -100, curX = -100, curY = -100;
  let hasMoved = false;

  document.addEventListener('mousemove', (e) => {
    if (!hasMoved) {
      hasMoved = true;
      cursor.style.opacity = '1';
      cursorDot.style.opacity = '1';
    }
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursorDot.style.left = mouseX + 'px';
    cursorDot.style.top = mouseY + 'px';
  });

  function animateCursor() {
    curX += (mouseX - curX) * 0.18;
    curY += (mouseY - curY) * 0.18;
    cursor.style.left = curX + 'px';
    cursor.style.top = curY + 'px';
    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  document.querySelectorAll('a, button, input, select, textarea, .service-card, .team-card, .pricing-card, .blog-card').forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('cursor-expanded'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('cursor-expanded'));
  });
}

/* ----------------------------------------------------------
   2. PRELOADER
   ---------------------------------------------------------- */
function initPreloader() {
  const preloader = document.getElementById('preloader');
  if (!preloader) return;

  function hidePreloader() {
    setTimeout(() => {
      preloader.classList.add('preloader-hidden');
      setTimeout(() => {
        preloader.style.display = 'none';
      }, 400);
    }, 1200);
  }

  if (document.readyState === 'complete') {
    hidePreloader();
  } else {
    window.addEventListener('load', hidePreloader);
  }

  // Fast Page Navigation: Show 1.2-second loading transition on link click
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href]');
    if (!link) return;

    const href = link.getAttribute('href');
    if (
      !href ||
      href.startsWith('#') ||
      href.startsWith('javascript') ||
      href.startsWith('tel:') ||
      href.startsWith('mailto:') ||
      link.getAttribute('target') === '_blank'
    ) {
      return;
    }

    e.preventDefault();
    preloader.style.display = 'flex';
    preloader.classList.remove('preloader-hidden');

    // Reset progress bar animation
    const bar = preloader.querySelector('.preloader-bar');
    if (bar) {
      bar.style.animation = 'none';
      void bar.offsetWidth;
      bar.style.animation = 'preloaderFill 1.2s cubic-bezier(0.22, 1, 0.36, 1) forwards';
    }

    setTimeout(() => {
      window.location.href = href;
    }, 1200);
  });
}

/* ----------------------------------------------------------
   3. NAVBAR – Scroll Shadow & Active Link
   ---------------------------------------------------------- */
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('navbar-scrolled', window.scrollY > 60);
  });

  // Hamburger toggle with body scroll locking and backdrop
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('.nav-menu');
  if (hamburger && navMenu) {
    let backdrop = document.querySelector('.nav-backdrop');
    if (!backdrop) {
      backdrop = document.createElement('div');
      backdrop.className = 'nav-backdrop';
      document.body.appendChild(backdrop);
    }

    function closeMenu() {
      hamburger.classList.remove('open');
      navMenu.classList.remove('nav-open');
      backdrop.classList.remove('active');
      document.body.classList.remove('no-scroll');
      document.documentElement.classList.remove('no-scroll');
    }

    function openMenu() {
      hamburger.classList.add('open');
      navMenu.classList.add('nav-open');
      backdrop.classList.add('active');
      document.body.classList.add('no-scroll');
      document.documentElement.classList.add('no-scroll');
    }

    hamburger.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = navMenu.classList.contains('nav-open');
      if (isOpen) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    backdrop.addEventListener('click', closeMenu);

    navMenu.querySelectorAll('.nav-link, .mobile-login-btn').forEach(link => {
      link.addEventListener('click', closeMenu);
    });

    document.addEventListener('click', (e) => {
      if (navMenu.classList.contains('nav-open') && !navMenu.contains(e.target) && !hamburger.contains(e.target)) {
        closeMenu();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navMenu.classList.contains('nav-open')) {
        closeMenu();
      }
    });
  }
}

/* ----------------------------------------------------------
   4. SCROLL REVEAL
   ---------------------------------------------------------- */
function initScrollReveal() {
  const els = document.querySelectorAll(
    'section, .section-header, .section-tag, .section-title, .section-desc, ' +
    '.service-item, .service-card, .team-card, .pricing-card, .blog-card, ' +
    '.benefit-item, .case-card, .case-study-card, .about-intro-col, .about-visual, ' +
    '.why-choose-content, .why-choose-visual, .partner-strip, .testimonials-section, ' +
    '.testimonial-card, .cta-banner-section, .contact-left, .contact-sidebar, ' +
    '.hero-text, .hero-visual, .page-banner-content, .accordion-item, .footer-col, ' +
    '.custom-stat-card, .info-card, .sidebar-widget, ' +
    '.reveal, .reveal-up, .reveal-scale, .reveal-left, .reveal-right'
  );

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target); // Trigger scroll animation ONLY ONCE on first scroll into view
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -20px 0px' });

  els.forEach((el) => {
    if (!el.classList.contains('reveal') && !el.classList.contains('reveal-left') && !el.classList.contains('reveal-right') && !el.classList.contains('reveal-scale')) {
      el.classList.add('reveal');
    }
    const siblings = [...(el.parentElement?.children || [])].filter(c => c.classList.contains(el.classList[0]));
    const idx = siblings.indexOf(el);
    if (idx > 0 && idx < 8) {
      el.style.transitionDelay = (idx * 0.08) + 's';
    }
    observer.observe(el);
  });
}

/* ----------------------------------------------------------
   5. ANIMATED COUNTERS
   ---------------------------------------------------------- */
function initCounters() {
  const counters = document.querySelectorAll('.testi-num, .stat-number, .hero-stat-value, .dark-stat-num');
  if (!counters.length) return;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const raw = el.textContent.trim();
      const suffix = raw.replace(/[\d.]/g, '');
      const target = parseFloat(raw.replace(/[^\d.]/g, ''));
      if (isNaN(target)) return;
      const startTime = performance.now();
      const duration = 2000;
      function update(now) {
        const ease = 1 - Math.pow(1 - Math.min((now - startTime) / duration, 1), 3);
        const val = target * ease;
        el.textContent = (Number.isInteger(target) ? Math.round(val) : val.toFixed(2)) + suffix;
        if (ease < 1) requestAnimationFrame(update);
      }
      requestAnimationFrame(update);
      observer.unobserve(el);
    });
  }, { threshold: 0.3 });
  counters.forEach(c => observer.observe(c));
}

/* ----------------------------------------------------------
   6. 3D CARD TILT
   ---------------------------------------------------------- */
function initCardTilt() {
  document.querySelectorAll('.service-card, .pricing-card, .team-card, .blog-card, .case-study-card, .why-choose-item').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const r = card.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width - 0.5) * 10;
      const y = ((e.clientY - r.top) / r.height - 0.5) * -10;
      card.style.transform = `perspective(900px) rotateX(${y}deg) rotateY(${x}deg) translateY(-8px) scale(1.02)`;
    });
    card.addEventListener('mouseleave', () => { card.style.transform = ''; });
  });
}

/* ----------------------------------------------------------
   7. MAGNETIC BUTTONS
   ---------------------------------------------------------- */
function initMagneticButtons() {
  document.querySelectorAll('.btn-primary, .btn-back-home, .btn-subscribe, .btn-auth-primary, .btn-primary-filled').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const r = btn.getBoundingClientRect();
      btn.style.transform = `translate(${(e.clientX - r.left - r.width/2) * 0.22}px, ${(e.clientY - r.top - r.height/2) * 0.22}px)`;
    });
    btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
  });
}

/* ----------------------------------------------------------
   8. BACK TO TOP
   ---------------------------------------------------------- */
function initBackToTop() {
  const btn = document.createElement('button');
  btn.id = 'back-to-top';
  btn.setAttribute('aria-label', 'Back to top');
  btn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="18 15 12 9 6 15"/></svg>`;
  document.body.appendChild(btn);
  window.addEventListener('scroll', () => btn.classList.toggle('btt-visible', window.scrollY > 400));
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

/* ----------------------------------------------------------
   9. SMOOTH SCROLL
   ---------------------------------------------------------- */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
    });
  });
}

/* ----------------------------------------------------------
   10. ACCORDION
   ---------------------------------------------------------- */
function initAccordion() {
  const items = document.querySelectorAll('.accordion-item');
  items.forEach(item => {
    const trigger = item.querySelector('.accordion-trigger');
    const body = item.querySelector('.accordion-body');
    if (!trigger || !body) return;
    body.style.maxHeight = item.classList.contains('active') ? body.scrollHeight + 'px' : '0px';
    trigger.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      items.forEach(i => {
        i.classList.remove('active');
        const b = i.querySelector('.accordion-body');
        if (b) b.style.maxHeight = '0px';
        const icon = i.querySelector('.accordion-icon');
        if (icon) icon.style.transform = 'rotate(0deg)';
      });
      if (!isActive) {
        item.classList.add('active');
        body.style.maxHeight = body.scrollHeight + 'px';
        const icon = item.querySelector('.accordion-icon');
        if (icon) icon.style.transform = 'rotate(180deg)';
      }
    });
  });
}

/* ----------------------------------------------------------
   11. RIPPLE EFFECT
   ---------------------------------------------------------- */
function initRipple() {
  document.querySelectorAll('.btn-primary, .btn-back-home, .btn-login, .btn-auth-primary, .btn-subscribe, .btn-primary-filled, .blog-arrow').forEach(btn => {
    btn.style.position = 'relative';
    btn.style.overflow = 'hidden';
    btn.addEventListener('click', (e) => {
      const ripple = document.createElement('span');
      ripple.classList.add('ripple-wave');
      const r = btn.getBoundingClientRect();
      const size = Math.max(r.width, r.height);
      Object.assign(ripple.style, {
        width: size + 'px', height: size + 'px',
        left: (e.clientX - r.left - size/2) + 'px',
        top: (e.clientY - r.top - size/2) + 'px'
      });
      btn.appendChild(ripple);
      setTimeout(() => ripple.remove(), 700);
    });
  });
}

/* ----------------------------------------------------------
   12. PARALLAX HERO
   ---------------------------------------------------------- */
function initParallax() {
  const heroVisual = document.querySelector('.hero-visual');
  if (!heroVisual) return;
  window.addEventListener('scroll', () => {
    if (window.scrollY < window.innerHeight) {
      heroVisual.style.transform = `translateY(${window.scrollY * 0.1}px)`;
    }
  });
}

/* ----------------------------------------------------------
   13. ACTIVE NAV LINK
   ---------------------------------------------------------- */
function initActiveNavLink() {
  const page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    link.classList.toggle('active', href === page || (page === '' && href === 'index.html'));
  });
}

/* ----------------------------------------------------------
   14. BLOG INFINITE AUTO-SLIDER  ← MAIN NEW FEATURE
   ---------------------------------------------------------- */
function initBlogSlider() {
  const track = document.getElementById('blogTrack');
  const viewport = document.getElementById('blogViewport');
  const prevBtn = document.getElementById('blogPrev');
  const nextBtn = document.getElementById('blogNext');
  const dotsContainer = document.getElementById('blogDots');
  if (!track || !viewport) return;

  const slides = Array.from(track.querySelectorAll('.blog-slide'));
  if (!slides.length) return;

  // How many visible at once (responsive)
  function visibleCount() {
    const w = viewport.offsetWidth;
    if (w < 600) return 1;
    if (w < 900) return 2;
    return 3;
  }

  let current = 0;
  let autoTimer = null;
  let isDragging = false, startX = 0, dragOffset = 0;

  // Build dots
  const totalDots = slides.length - visibleCount() + 1;
  function buildDots() {
    if (!dotsContainer) return;
    dotsContainer.innerHTML = '';
    const count = slides.length - visibleCount() + 1;
    for (let i = 0; i < count; i++) {
      const dot = document.createElement('button');
      dot.className = 'blog-dot' + (i === current ? ' active' : '');
      dot.setAttribute('aria-label', 'Go to slide ' + (i + 1));
      dot.addEventListener('click', () => goTo(i));
      dotsContainer.appendChild(dot);
    }
  }

  function updateDots() {
    if (!dotsContainer) return;
    dotsContainer.querySelectorAll('.blog-dot').forEach((d, i) => d.classList.toggle('active', i === current));
  }

  function slideWidth() {
    const gap = 24;
    const n = visibleCount();
    return (viewport.offsetWidth - gap * (n - 1)) / n;
  }

  function goTo(idx, animated = true) {
    const max = slides.length - visibleCount();
    current = Math.max(0, Math.min(idx, max));
    const offset = current * (slideWidth() + 24);
    track.style.transition = animated ? 'transform 0.6s cubic-bezier(0.22, 1, 0.36, 1)' : 'none';
    track.style.transform = `translateX(-${offset}px)`;
    updateDots();
  }

  function next() { goTo(current + 1 > slides.length - visibleCount() ? 0 : current + 1); }
  function prev() { goTo(current - 1 < 0 ? slides.length - visibleCount() : current - 1); }

  if (prevBtn) prevBtn.addEventListener('click', () => { prev(); restartAuto(); });
  if (nextBtn) nextBtn.addEventListener('click', () => { next(); restartAuto(); });

  // Auto-play every 3.5 seconds
  function startAuto() { autoTimer = setInterval(next, 3500); }
  function stopAuto() { clearInterval(autoTimer); }
  function restartAuto() { stopAuto(); startAuto(); }

  // Pause on hover
  viewport.addEventListener('mouseenter', stopAuto);
  viewport.addEventListener('mouseleave', startAuto);

  // Touch/drag support
  viewport.addEventListener('mousedown', (e) => {
    isDragging = true; startX = e.clientX; dragOffset = 0;
    viewport.classList.add('dragging');
    track.style.transition = 'none';
    stopAuto();
  });
  document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    dragOffset = e.clientX - startX;
    const base = current * (slideWidth() + 24);
    track.style.transform = `translateX(${-base + dragOffset}px)`;
  });
  document.addEventListener('mouseup', () => {
    if (!isDragging) return;
    isDragging = false;
    viewport.classList.remove('dragging');
    if (dragOffset < -60) next();
    else if (dragOffset > 60) prev();
    else goTo(current);
    restartAuto();
  });

  viewport.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX; dragOffset = 0;
    track.style.transition = 'none'; stopAuto();
  }, { passive: true });
  viewport.addEventListener('touchmove', (e) => {
    dragOffset = e.touches[0].clientX - startX;
    const base = current * (slideWidth() + 24);
    track.style.transform = `translateX(${-base + dragOffset}px)`;
  }, { passive: true });
  viewport.addEventListener('touchend', () => {
    if (dragOffset < -50) next();
    else if (dragOffset > 50) prev();
    else goTo(current);
    restartAuto();
  });

  // Keyboard support
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') { prev(); restartAuto(); }
    if (e.key === 'ArrowRight') { next(); restartAuto(); }
  });

  // Recalculate on resize
  window.addEventListener('resize', () => { buildDots(); goTo(0, false); });

  // Init
  buildDots();
  goTo(0, false);
  startAuto();
}

/* ----------------------------------------------------------
   15. (TESTIMONIALS - kept as original CSS-only design)
   ---------------------------------------------------------- */

/* ----------------------------------------------------------
   16. IMAGE HOVER OVERLAY (Case Studies, Blog)
   ---------------------------------------------------------- */
function initImageOverlay() {
  document.querySelectorAll('.case-study-card, .blog-card').forEach(card => {
    const img = card.querySelector('img');
    if (!img) return;
    // Shimmer on hover already handled by CSS image scale
    img.addEventListener('mouseenter', () => img.style.filter = 'brightness(1.05) saturate(1.1)');
    img.addEventListener('mouseleave', () => img.style.filter = '');
  });
}

/* ----------------------------------------------------------
   17. NEWSLETTER FORM – Toast Feedback
   ---------------------------------------------------------- */
function initNewsletterForm() {
  document.querySelectorAll('.newsletter-form').forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      form.reset();
      window.location.href = '404.html';
    });
  });

  document.querySelectorAll('.contact-form-card').forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      form.reset();
      showToast('✓ Successfully Registered!');
    });
  });
}

function showToast(msg) {
  const toast = document.createElement('div');
  toast.textContent = msg;
  Object.assign(toast.style, {
    position: 'fixed', bottom: '90px', right: '32px',
    background: '#00A2CF', color: '#fff',
    padding: '14px 24px', borderRadius: '10px',
    fontWeight: '600', fontSize: '14px',
    boxShadow: '0 8px 28px rgba(0,162,207,0.35)',
    zIndex: '9999', opacity: '0',
    transform: 'translateY(16px)',
    transition: 'all 0.4s cubic-bezier(0.22,1,0.36,1)'
  });
  document.body.appendChild(toast);
  requestAnimationFrame(() => {
    toast.style.opacity = '1';
    toast.style.transform = 'translateY(0)';
  });
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(16px)';
    setTimeout(() => toast.remove(), 400);
  }, 3000);
}

/* ----------------------------------------------------------
   18. SECTION PROGRESS BAR (Top of page)
   ---------------------------------------------------------- */
function initProgressBar() {
  const bar = document.createElement('div');
  bar.id = 'scroll-progress';
  Object.assign(bar.style, {
    position: 'fixed', top: '0', left: '0', height: '3px',
    background: 'linear-gradient(90deg, #00A2CF, #55B9DA)',
    zIndex: '9997', width: '0%', transition: 'width 0.1s linear',
    transformOrigin: 'left'
  });
  document.body.appendChild(bar);
  window.addEventListener('scroll', () => {
    const scrolled = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
    bar.style.width = scrolled + '%';
  });
}

/* ----------------------------------------------------------
   19. TESTIMONIALS GRID PAGINATION (3 Cards per page)
   ---------------------------------------------------------- */
function initTestimonialsGridPagination() {
  const sections = document.querySelectorAll('.testimonials-section');
  sections.forEach(sec => {
    const grid = sec.querySelector('.testimonials-grid');
    const cards = sec.querySelectorAll('.testimonial-card');
    const dots = sec.querySelectorAll('.pagination-dots .dot');
    const prevBtn = sec.querySelector('.testi-prev');
    const nextBtn = sec.querySelector('.testi-next');
    if (!cards.length) return;

    const pageSize = 3;
    let currentPage = 0;
    const totalPages = Math.ceil(cards.length / pageSize);

    function showPage(pageIndex, direction = 'next') {
      currentPage = pageIndex;
      cards.forEach((card, idx) => {
        const pageOfCard = Math.floor(idx / pageSize);
        if (pageOfCard === currentPage) {
          card.style.display = 'flex';
          card.style.opacity = '0';
          card.style.transform = direction === 'next' ? 'translateX(24px)' : 'translateX(-24px)';
          requestAnimationFrame(() => {
            card.style.transition = 'opacity 0.4s cubic-bezier(0.22, 1, 0.36, 1), transform 0.4s cubic-bezier(0.22, 1, 0.36, 1)';
            card.style.opacity = '1';
            card.style.transform = 'translateX(0)';
          });
        } else {
          card.style.display = 'none';
        }
      });

      dots.forEach((dot, idx) => {
        dot.classList.toggle('active', idx === currentPage);
      });
    }

    function goNext() {
      const nextP = (currentPage + 1) % totalPages;
      showPage(nextP, 'next');
    }

    function goPrev() {
      const prevP = (currentPage - 1 + totalPages) % totalPages;
      showPage(prevP, 'prev');
    }

    if (nextBtn) nextBtn.addEventListener('click', () => { goNext(); resetAuto(); });
    if (prevBtn) prevBtn.addEventListener('click', () => { goPrev(); resetAuto(); });

    dots.forEach((dot, idx) => {
      dot.addEventListener('click', () => {
        showPage(idx, idx > currentPage ? 'next' : 'prev');
        resetAuto();
      });
    });

    let autoTimer = setInterval(goNext, 6000);
    function resetAuto() {
      clearInterval(autoTimer);
      autoTimer = setInterval(goNext, 6000);
    }

    if (grid) {
      grid.addEventListener('mouseenter', () => clearInterval(autoTimer));
      grid.addEventListener('mouseleave', resetAuto);
    }

    showPage(0, 'next');
  });
}

/* ----------------------------------------------------------
   20. INTERACTIVE LETTER-BY-LETTER HOVER ZOOM ANIMATION
   ---------------------------------------------------------- */
function initLetterHoverZoom() {
  const headings = document.querySelectorAll(
    '.hero-title, .section-title, .page-banner-title, ' +
    '.service-heading, .plan-title, .team-name, .blog-title, ' +
    '.case-client, .user-name, .auth-heading, .map-heading, .letter-zoom'
  );

  headings.forEach(heading => {
    if (heading.dataset.letterZoomed) return;
    heading.dataset.letterZoomed = 'true';

    function wrapTextNode(text) {
      const words = text.split(' ');
      const wordNodes = words.map(word => {
        if (!word) return '';
        const chars = Array.from(word).map(char => `<span class="zoom-char">${char}</span>`).join('');
        return `<span class="zoom-word">${chars}</span>`;
      });
      return wordNodes.join(' ');
    }

    function process(element) {
      const children = Array.from(element.childNodes);
      children.forEach(child => {
        if (child.nodeType === Node.TEXT_NODE) {
          const text = child.textContent;
          if (text && text.trim().length > 0) {
            const temp = document.createElement('span');
            temp.innerHTML = wrapTextNode(text);
            child.replaceWith(...temp.childNodes);
          }
        } else if (child.nodeType === Node.ELEMENT_NODE && !child.classList.contains('zoom-char') && !child.classList.contains('zoom-word') && !child.classList.contains('arrow')) {
          process(child);
        }
      });
    }

    process(heading);
  });
}

/* ----------------------------------------------------------
   21. MONTHLY / YEARLY PRICING BILLING TOGGLE
   ---------------------------------------------------------- */
function initPricingBillingToggle() {
  const pricingSections = document.querySelectorAll('.pricing-section');
  pricingSections.forEach(sec => {
    const titleBox = sec.querySelector('.pricing-title-box');
    if (!titleBox || sec.querySelector('.billing-toggle-container')) return;

    const toggleHTML = `
      <div class="billing-toggle-container mt-24">
        <span class="billing-label monthly-label active">Monthly Billing</span>
        <label class="billing-switch">
          <input type="checkbox" class="billing-checkbox">
          <span class="billing-slider"></span>
        </label>
        <span class="billing-label yearly-label">Yearly Billing <span class="discount-badge">Save 20%</span></span>
      </div>
    `;
    titleBox.insertAdjacentHTML('beforeend', toggleHTML);

    const checkbox = sec.querySelector('.billing-checkbox');
    const monthlyLabel = sec.querySelector('.monthly-label');
    const yearlyLabel = sec.querySelector('.yearly-label');
    const cards = sec.querySelectorAll('.pricing-card');

    const monthlyPrices = ['$49', '$69', '$99'];
    const yearlyPrices = ['$39', '$55', '$79'];

    checkbox.addEventListener('change', () => {
      const isYearly = checkbox.checked;
      monthlyLabel.classList.toggle('active', !isYearly);
      yearlyLabel.classList.toggle('active', isYearly);

      cards.forEach((card, idx) => {
        const amountEl = card.querySelector('.amount');
        if (amountEl) {
          amountEl.style.transform = 'scale(0.8)';
          amountEl.style.opacity = '0';
          setTimeout(() => {
            amountEl.textContent = isYearly ? yearlyPrices[idx].replace('$', '') : monthlyPrices[idx].replace('$', '');
            amountEl.style.transform = 'scale(1)';
            amountEl.style.opacity = '1';
          }, 180);
        }
      });
    });
  });
}

/* ----------------------------------------------------------
   22. CATEGORY FILTERS (SERVICES & BLOG PAGES)
   ---------------------------------------------------------- */
function initCategoryFilters() {
  // Services filter bar removed as requested

  // Blog Category Filter
  const blogGrid = document.querySelector('.blog-grid');
  if (blogGrid && !document.querySelector('.blog-filter-bar')) {
    const filterHTML = `
      <div class="blog-filter-bar text-center mt-24 mb-36">
        <button class="filter-btn active" data-blog-filter="all">All Articles</button>
        <button class="filter-btn" data-blog-filter="marketing">Digital Marketing</button>
        <button class="filter-btn" data-blog-filter="business">Business Strategy</button>
        <button class="filter-btn" data-blog-filter="tech">Tech Tools</button>
      </div>
    `;
    blogGrid.insertAdjacentHTML('beforebegin', filterHTML);

    const filterBtns = document.querySelectorAll('[data-blog-filter]');
    const cards = blogGrid.querySelectorAll('.blog-card');

    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.getAttribute('data-blog-filter');

        cards.forEach((card, idx) => {
          if (filter === 'all' || idx % 2 === (filter === 'marketing' ? 0 : 1)) {
            card.style.display = 'flex';
            card.style.opacity = '0';
            setTimeout(() => { card.style.opacity = '1'; }, 50);
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }
}

/* ----------------------------------------------------------
   23. UNIVERSAL MODAL SYSTEM (QUICK CONSULTATION, SERVICE & CASE DETAILS)
   ---------------------------------------------------------- */
function initModalPopups() {
  if (document.getElementById('siteModal')) return;

  const modalHTML = `
  `;
  document.body.insertAdjacentHTML('beforeend', modalHTML);

  const backdrop = document.getElementById('siteModal');
  const body = document.getElementById('modalBody');
  const closeBtn = document.getElementById('modalCloseBtn');

  function openModal(htmlContent) {
    body.innerHTML = htmlContent;
    backdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    backdrop.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (backdrop) {
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) closeModal();
    });
  }
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && backdrop.classList.contains('active')) closeModal();
  });

  // Attach triggers to CTA, Pricing, Service, and Case Study buttons
  document.addEventListener('click', (e) => {
    // 1. Service "Learn More ↗" links
    const serviceLink = e.target.closest('.service-link, .other-service-link');
    if (serviceLink && (serviceLink.getAttribute('href') === '#' || !serviceLink.getAttribute('href'))) {
      e.preventDefault();
      const serviceCard = serviceLink.closest('.service-item, .service-card, li');
      const title = serviceCard ? serviceCard.querySelector('.service-heading, h3, span')?.textContent || 'Service Details' : 'Strategic Planning Service';
      const cleanTitle = title.replace(/↗/g, '').trim();
      openModal(`
        <span class="section-tag">Service Details</span>
        <h3 class="modal-title">${cleanTitle}</h3>
        <p class="modal-subtitle">Tailored business advisory &amp; operational growth solutions.</p>
        <div style="color: var(--slate-body); font-size: 14px; line-height: 1.6; margin-bottom: 20px;">
          Our ${cleanTitle} team works closely with your leadership to optimize core workflows, analyze competitive intelligence, and deliver measurable growth.
        </div>
        <form class="modal-form" id="serviceBookForm">
          <input type="text" class="modal-input" placeholder="Your Name" required>
          <input type="email" class="modal-input" placeholder="Email Address" required>
          <button type="submit" class="btn-get-started w-full">REQUEST CONSULTATION</button>
        </form>
      `);
      const form = document.getElementById('serviceBookForm');
      if (form) {
        form.addEventListener('submit', (fe) => {
          fe.preventDefault();
          closeModal();
          showToast(`✓ Consultation requested for ${cleanTitle}!`);
        });
      }
      return;
    }

    // 2. Case Study "Read More ↗" & Section Read More links
    const caseLink = e.target.closest('.case-link, .btn-read-more, .btn-case-study');
    if (caseLink && (caseLink.getAttribute('href') === '#' || !caseLink.getAttribute('href'))) {
      e.preventDefault();
      const caseCard = caseLink.closest('.case-card, .why-choose-content');
      const title = caseCard ? caseCard.querySelector('.case-client, .section-title')?.textContent || 'Case Study Overview' : 'Case Study Breakdown';
      const cleanTitle = title.replace(/↗/g, '').trim();
      openModal(`
        <span class="section-tag">Case Study Breakdown</span>
        <h3 class="modal-title">${cleanTitle}</h3>
        <p class="modal-subtitle">Comprehensive business outcome and strategic results report.</p>
        <div style="color: var(--slate-body); font-size: 14px; line-height: 1.6; margin-bottom: 16px;">
          In this engagement, we conducted an end-to-end digital modernization program, unlocking scalable revenue growth and reducing operational overhead by 38%.
        </div>
        <div style="display: flex; gap: 12px; margin-top: 16px;">
          <div style="flex: 1; background: #F1F5F9; padding: 14px; border-radius: 10px; text-align: center;">
            <span style="font-size: 20px; font-weight: 800; color: #00A2CF; display: block;">+145%</span>
            <span style="font-size: 11px; color: #64748B;">Growth</span>
          </div>
          <div style="flex: 1; background: #F1F5F9; padding: 14px; border-radius: 10px; text-align: center;">
            <span style="font-size: 20px; font-weight: 800; color: #00A2CF; display: block;">3.2x</span>
            <span style="font-size: 11px; color: #64748B;">ROI Boost</span>
          </div>
        </div>
      `);
      return;
    }

    // 3. Hero CTA & Consultation buttons
    const ctaBtn = e.target.closest('.btn-get-started, .btn-discover, .btn-request-cta');
    if (ctaBtn) {
      e.preventDefault();
      openModal(`
        <span class="section-tag">Quick Consultation</span>
        <h3 class="modal-title">Book a Free Strategic Consultation</h3>
        <p class="modal-subtitle">Fill in your details below and our team will get in touch within 24 hours.</p>
        <form class="modal-form" id="consultForm">
          <input type="text" class="modal-input" placeholder="Your Full Name" required>
          <input type="email" class="modal-input" placeholder="Your Email Address" required>
          <input type="tel" class="modal-input" placeholder="Phone Number" required>
          <textarea class="modal-textarea" placeholder="How can we help your business?" rows="3" required></textarea>
          <button type="submit" class="btn-get-started w-full">SUBMIT REQUEST</button>
        </form>
      `);

      const form = document.getElementById('consultForm');
      if (form) {
        form.addEventListener('submit', (fe) => {
          fe.preventDefault();
          closeModal();
          showToast('✓ Request Submitted Successfully! We will contact you soon.');
        });
      }
      return;
    }

    // 4. VIEW ALL buttons
    const viewAllBtn = e.target.closest('.btn-view-all');
    if (viewAllBtn && (viewAllBtn.getAttribute('href') === '#' || !viewAllBtn.getAttribute('href'))) {
      e.preventDefault();
      window.location.href = 'services.html';
      return;
    }

    // 5. Pricing Plan buttons
    const planBtn = e.target.closest('.btn-plan-outline, .btn-plan-filled');
    if (planBtn) {
      e.preventDefault();
      const card = planBtn.closest('.pricing-card');
      const title = card ? card.querySelector('.plan-title')?.textContent || 'Plan' : 'Plan';
      const amount = card ? card.querySelector('.amount')?.textContent || '49' : '49';

      openModal(`
        <span class="section-tag">Subscription</span>
        <h3 class="modal-title">Selected: ${title}</h3>
        <p class="modal-subtitle">Starting at <strong>$${amount}/session</strong>. Complete your registration to activate your plan.</p>
        <form class="modal-form" id="planForm">
          <input type="text" class="modal-input" placeholder="Company Name" required>
          <input type="email" class="modal-input" placeholder="Work Email" required>
          <input type="tel" class="modal-input" placeholder="Phone Number" required>
          <button type="submit" class="btn-get-started w-full">CONFIRM &amp; PROCEED</button>
        </form>
      `);

      const form = document.getElementById('planForm');
      if (form) {
        form.addEventListener('submit', (fe) => {
          fe.preventDefault();
          closeModal();
          showToast(`✓ Registered for ${title}! Check your email for next steps.`);
        });
      }
      return;
    }

    // 6. Dashboard Action Buttons (+ New Project, + Add Client, etc.)
    const primaryDashBtn = e.target.closest('.primary-dash-btn');
    if (primaryDashBtn) {
      e.preventDefault();
      const label = primaryDashBtn.textContent.trim();
      openModal(`
        <span class="section-tag">Dashboard Action</span>
        <h3 class="modal-title">${label}</h3>
        <p class="modal-subtitle">Enter details to save a new item.</p>
        <form class="modal-form" id="dashActionForm">
          <input type="text" class="modal-input" placeholder="Title / Name" required>
          <input type="text" class="modal-input" placeholder="Category / Description" required>
          <button type="submit" class="btn-get-started w-full">SAVE ENTRY</button>
        </form>
      `);
      const form = document.getElementById('dashActionForm');
      if (form) {
        form.addEventListener('submit', (fe) => {
          fe.preventDefault();
          closeModal();
          showToast(`✓ Saved entry for ${label}!`);
        });
      }
      return;
    }

    // 7. Dashboard Logout Redirect
    const logoutBtn = e.target.closest('.admin-logout, [data-admin-tab="logout"], [data-user-tab="logout"]');
    if (logoutBtn) {
      e.preventDefault();
      window.location.href = 'index.html';
      return;
    }
  });
}

/* ----------------------------------------------------------
   24. TOAST NOTIFICATION SYSTEM
   ---------------------------------------------------------- */
function showToast(message) {
  let container = document.getElementById('toastContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toastContainer';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'toast-msg';
  toast.textContent = message;
  container.appendChild(toast);

  requestAnimationFrame(() => {
    toast.classList.add('show');
  });

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 400);
  }, 3500);
}

/* ----------------------------------------------------------
   25. PASSWORD SHOW/HIDE TOGGLE (LOGIN & SIGNUP PAGES)
   ---------------------------------------------------------- */
function initPasswordToggle() {
  document.querySelectorAll('.password-toggle, .pwd-toggle-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const input = btn.parentElement ? btn.parentElement.querySelector('input') : null;
      if (!input) return;
      const isPwd = input.type === 'password';
      input.type = isPwd ? 'text' : 'password';
      btn.classList.toggle('active', isPwd);
      btn.innerHTML = isPwd ? `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
      ` : `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
      `;
    });
  });

  document.querySelectorAll('input[type="password"]').forEach(input => {
    const parent = input.parentElement;
    if (!parent || parent.querySelector('.password-toggle, .pwd-toggle-btn')) return;

    parent.style.position = 'relative';
    const toggleBtn = document.createElement('button');
    toggleBtn.type = 'button';
    toggleBtn.className = 'password-toggle';
    toggleBtn.setAttribute('aria-label', 'Toggle Password Visibility');
    toggleBtn.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
    `;
    parent.appendChild(toggleBtn);

    toggleBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const isPwd = input.type === 'password';
      input.type = isPwd ? 'text' : 'password';
      toggleBtn.classList.toggle('active', isPwd);
      toggleBtn.innerHTML = isPwd ? `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
      ` : `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
      `;
    });
  });
}

/* ----------------------------------------------------------
   26. INTERACTIVE ABOUT VISION TABS
   ---------------------------------------------------------- */
function initAboutVisionTabs() {
  const introCol = document.querySelector('.about-intro-col');
  if (introCol && !introCol.querySelector('.about-tabs')) {
    const tabsHTML = `
      <div class="about-tabs mt-24">
        <button class="about-tab-btn active" data-tab="vision">Our Vision</button>
        <button class="about-tab-btn" data-tab="mission">Our Mission</button>
        <button class="about-tab-btn" data-tab="values">Core Values</button>
      </div>
      <div class="about-tab-content active" id="tab-vision">
        <p class="tab-text">To empower modern organizations to break boundaries, unlock exponential value, and build lasting legacy in an evolving digital market.</p>
      </div>
      <div class="about-tab-content" id="tab-mission" style="display: none;">
        <p class="tab-text">Delivering data-driven insights, agile consulting solutions, and customized business transformation strategies tailored for sustainable growth.</p>
      </div>
      <div class="about-tab-content" id="tab-values" style="display: none;">
        <p class="tab-text">Uncompromising integrity, relentless innovation, client-centric excellence, and collaborative partnership in everything we do.</p>
      </div>
    `;
    introCol.insertAdjacentHTML('beforeend', tabsHTML);

    const btns = introCol.querySelectorAll('.about-tab-btn');
    const contents = introCol.querySelectorAll('.about-tab-content');

    btns.forEach(btn => {
      btn.addEventListener('click', () => {
        btns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const tabId = 'tab-' + btn.getAttribute('data-tab');
        contents.forEach(c => {
          if (c.id === tabId) {
            c.style.display = 'block';
            c.style.opacity = '0';
            setTimeout(() => c.style.opacity = '1', 50);
          } else {
            c.style.display = 'none';
          }
        });
      });
    });
  }
}

/* ----------------------------------------------------------
   27. GLOBAL FORM MANDATORY & EMAIL VALIDATION
   ---------------------------------------------------------- */
function initFormValidations() {
  document.querySelectorAll('form').forEach(form => {
    form.addEventListener('submit', (e) => {
      const emailInputs = form.querySelectorAll('input[type="email"]');
      let valid = true;
      emailInputs.forEach(emailInput => {
        const val = emailInput.value.trim();
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (val && !emailRegex.test(val)) {
          valid = false;
          emailInput.setCustomValidity('Please enter a valid email address (e.g., name@example.com)');
          emailInput.reportValidity();
        } else {
          emailInput.setCustomValidity('');
        }
      });
      if (!valid) {
        e.preventDefault();
      }
    });

    form.querySelectorAll('input[type="email"]').forEach(emailInput => {
      emailInput.addEventListener('input', () => {
        emailInput.setCustomValidity('');
      });
    });
  });
}

/* ----------------------------------------------------------
   28. TIMELINE SCROLL ANIMATION
   ---------------------------------------------------------- */
function initTimelineScrollAnimation() {
  const timelineItems = document.querySelectorAll('.timeline-section .timeline-item, .timeline-item');
  if (!timelineItems.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        const node = entry.target.querySelector('.timeline-node');
        if (node) node.classList.add('node-active');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2, rootMargin: '0px 0px -30px 0px' });

  timelineItems.forEach((item, idx) => {
    item.classList.add('reveal-up');
    item.style.transitionDelay = (idx * 0.12) + 's';
    observer.observe(item);
  });
}

/* ----------------------------------------------------------
   29. STRATEGIC FORM & BUTTON FUNCTIONALITY
   ---------------------------------------------------------- */
function initStrategicFormInteractions() {
  // Service selection links (Service Cards & Sidebar)
  document.querySelectorAll('[data-service]').forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (targetId && targetId.startsWith('#')) {
        const section = document.querySelector(targetId);
        if (section) {
          e.preventDefault();
          section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
      const serviceVal = link.getAttribute('data-service');
      const selectEl = document.getElementById('service-select');
      if (selectEl && serviceVal) {
        selectEl.value = serviceVal;
        selectEl.dispatchEvent(new Event('change'));
      }
    });
  });

  // CTA Contact Us button
  const ctaBtn = document.getElementById('btn-contact-us');
  if (ctaBtn) {
    ctaBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const form = document.getElementById('service-request-form');
      if (form) {
        form.scrollIntoView({ behavior: 'smooth', block: 'center' });
        const nameInput = document.getElementById('user-name');
        if (nameInput) setTimeout(() => nameInput.focus(), 600);
      }
    });
  }

  // Registration Form Submission
  const regForm = document.getElementById('service-request-form');
  if (regForm) {
    regForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const nameInput = document.getElementById('user-name');
      const name = nameInput && nameInput.value.trim() ? nameInput.value.trim() : 'Client';
      showToast(`✓ Registration Successful! Thank you ${name}, our strategic team will contact you shortly.`);
      regForm.reset();
    });
  }
}

/* ----------------------------------------------------------
   INIT ALL
   ---------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {
  initCursor();
  initPreloader();
  initNavbar();
  initScrollReveal();
  initCounters();
  initCardTilt();
  initMagneticButtons();
  initBackToTop();
  initSmoothScroll();
  initAccordion();
  initParallax();
  initRipple();
  initActiveNavLink();
  initImageOverlay();
  initNewsletterForm();
  initProgressBar();
  initTestimonialsGridPagination();
  initLetterHoverZoom();
  initPricingBillingToggle();
  initCategoryFilters();
  initModalPopups();
  initPasswordToggle();
  initAboutVisionTabs();
  initFormValidations();
  initTimelineScrollAnimation();
  initStrategicFormInteractions();
});




