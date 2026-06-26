/**
 * L'AMBROISIE — Main Application v5
 * Performance-first · Card modal · Smooth marquee · 60fps · Interactive Parallax
 */
'use strict';

gsap.registerPlugin(ScrollTrigger);

const q  = (s, ctx = document) => ctx.querySelector(s);
const qa = (s, ctx = document) => [...ctx.querySelectorAll(s)];

const debounce = (fn, delay) => {
  let timer = null;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
};

/* ═══════════════════════════════════════════════════════
   FOOD DATA — ingredients for each card
   ═══════════════════════════════════════════════════════ */
const FOOD_DATA = {
  'Velvet Flat White':         { ingredients: ['Ristretto', 'Whole Milk', 'Micro-foam', 'Rosetta Latte Art'], price: '₹ 420' },
  'Truffle Wagyu Smash':       { ingredients: ['Wagyu Beef', 'Black Truffle Aioli', 'Aged Cheddar', 'Onion Jam', 'Brioche Bun'], price: '₹ 1,490' },
  'Truffle Pappardelle':       { ingredients: ['Egg Pasta', 'Périgord Truffle', 'Parmesan Foam', 'Sage Butter'], price: '₹ 1,290' },
  'Gold Leaf Tiramisu':        { ingredients: ['Mascarpone', 'Espresso Ladyfingers', 'Dark Cocoa', 'Edible Gold'], price: '₹ 690' },
  'Bloom & Citrus':            { ingredients: ['Elderflower Cordial', 'Yuzu Foam', 'Hibiscus', 'Gold Dust'], price: '₹ 580' },
  'Espresso Macchiato':        { ingredients: ['Ristretto', 'Steamed Milk', 'Warm Ceramic'], price: '₹ 360' },
  'Portobello & Brie':         { ingredients: ['Portobello Mushroom', 'Brie Cheese', 'Roasted Peppers', 'Walnut Herb Spread'], price: '₹ 890' },
  'Molten Chocolate Fondant':  { ingredients: ['Dark Chocolate', 'Salted Caramel Centre', 'Vanilla Ice Cream'], price: '₹ 520' },
};

/* ═══════════════════════════════════════════════════════
   PRELOADER
   ═══════════════════════════════════════════════════════ */
function initPreloader() {
  const pre  = q('#preloader');
  const logo = q('.pre-logo');
  const tag  = q('.pre-tagline');
  const fill = q('.pre-fill');
  const pct  = q('.pre-pct');
  if (!pre) return;

  gsap.timeline()
    .to(logo, { opacity: 1, y: 0, duration: 0.75, ease: 'power3.out' }, 0.15)
    .to(tag,  { opacity: 1, y: 0, duration: 0.65, ease: 'power3.out' }, 0.38);

  let n = 0;
  const tick = setInterval(() => {
    n = Math.min(n + Math.floor(Math.random() * 13) + 3, 100);
    gsap.to(fill, { width: n + '%', duration: 0.28, ease: 'none' });
    if (pct) pct.textContent = n + '%';
    if (n === 100) {
      clearInterval(tick);
      setTimeout(() => {
        gsap.to(pre, {
          opacity: 0, duration: 0.8, ease: 'power2.inOut',
          onComplete() { pre.style.display = 'none'; revealHero(); }
        });
      }, 420);
    }
  }, 80);
}

/* ═══════════════════════════════════════════════════════
   HERO REVEAL — batch into one timeline
   ═══════════════════════════════════════════════════════ */
function revealHero() {
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
  tl.fromTo('.hero-eyebrow',     { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.7 }, 0.12)
    .to('.hero-title .line',      { opacity: 1, y: '0%', stagger: 0.12, duration: 1.0 }, 0.24)
    .fromTo('.hero-sub',         { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.7 }, 0.56)
    .fromTo('.hero-actions',     { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.7 }, 0.72)
    .fromTo('.hero-stats',       { opacity: 0, x: 20 }, { opacity: 1, x: 0, duration: 0.6 }, 0.90)
    .fromTo('.hero-scroll-hint', { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.5 }, 1.08);
}

/* ═══════════════════════════════════════════════════════
   HERO PARALLAX — scroll and interactive mouse movement
   ═══════════════════════════════════════════════════════ */
function initHeroParallax() {
  const hero = q('#hero'); if (!hero) return;
  const bg   = q('#hero-bg');
  const content = q('.hero-content');
  const canvas = q('#hero-canvas');
  
  let mx = 0, my = 0, px = 0, py = 0;
  const isTouch = window.matchMedia('(pointer:coarse)').matches;
  
  if (!isTouch) {
    hero.addEventListener('mousemove', e => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      mx = (e.clientX / w - 0.5) * 32;
      my = (e.clientY / h - 0.5) * 32;
    }, { passive: true });
    hero.addEventListener('mouseleave', () => {
      mx = 0; my = 0;
    }, { passive: true });
  }
  
  const loop = () => {
    const sy = window.scrollY;
    if (sy < window.innerHeight * 1.2) {
      px += (mx - px) * 0.08;
      py += (my - py) * 0.08;
      
      const scrollOffset = sy * 0.08;
      
      if (bg) {
        bg.style.transform = `scale(1.12) translate(${px * 0.4}px, ${py * 0.4 + scrollOffset}px)`;
      }
      // On touch devices, don't override CSS transform (which centres content via translateY(-50%))
      if (content && !isTouch) {
        content.style.transform = `translate(${px * -0.6}px, ${py * -0.6}px)`;
      }
      if (canvas) {
        canvas.style.transform = `translate(${px * 0.2}px, ${py * 0.2}px)`;
      }
    }
    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);
}

/* ═══════════════════════════════════════════════════════
   CURSOR — rAF loop, transform only
   ═══════════════════════════════════════════════════════ */
function initCursor() {
  const dot  = q('.cursor-dot');
  const ring = q('.cursor-ring');
  if (!dot || window.matchMedia('(pointer:coarse)').matches) {
    dot?.remove(); ring?.remove(); return;
  }
  let mx = -200, my = -200, rx = -200, ry = -200;
  window.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; }, { passive: true });
  const move = () => {
    rx += (mx - rx) * 0.11;
    ry += (my - ry) * 0.11;
    dot.style.transform  = `translate(calc(${mx}px - 50%), calc(${my}px - 50%))`;
    ring.style.transform = `translate(calc(${rx}px - 50%), calc(${ry}px - 50%))`;
    requestAnimationFrame(move);
  };
  requestAnimationFrame(move);
  qa('a,button,[data-cursor-hover]').forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'), { passive: true });
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'), { passive: true });
  });
}

/* ═══════════════════════════════════════════════════════
   NAV — Scrolled Observer
   ═══════════════════════════════════════════════════════ */
function initNav() {
  const nav    = q('nav'); if (!nav) return;
  const hero   = q('#hero'); if (!hero) return;
  const sentinel = document.createElement('div');
  sentinel.style.cssText = 'position:absolute;top:80px;left:0;width:1px;height:1px;';
  hero.appendChild(sentinel);
  new IntersectionObserver(([e]) => {
    nav.classList.toggle('scrolled', !e.isIntersecting);
  }, { threshold: 0 }).observe(sentinel);
}

/* ═══════════════════════════════════════════════════════
   CSS AROMA PARTICLES
   ═══════════════════════════════════════════════════════ */
function initCSSParticles() {
  const c = q('.css-particles'); if (!c) return;
  for (let i = 0; i < 22; i++) {
    const p = document.createElement('div');
    p.className = 'css-particle';
    const size  = 2 + Math.random() * 3;
    const dur   = 9 + Math.random() * 11;
    const drift = (Math.random() - 0.5) * 36;
    p.style.cssText = `
      width:${size}px;height:${size}px;
      left:${Math.random() * 100}%;bottom:${-size}px;
      --drift:${drift}px;
      animation-duration:${dur}s;
      animation-delay:${Math.random() * -dur}s;
    `;
    c.appendChild(p);
  }
}

/* ═══════════════════════════════════════════════════════
   MARQUEE — CSS-transform based, smooth 60fps
   ═══════════════════════════════════════════════════════ */
function initMarquee() {
  const track = q('.marquee-track'); if (!track) return;
  const orig  = qa('.menu-card', track);
  if (!orig.length) return;

  // Clone once — one set is enough for a seamless loop
  orig.forEach(c => {
    const cl = c.cloneNode(true);
    cl.setAttribute('aria-hidden', 'true');
    track.appendChild(cl);
  });

  const SPEED = 1.4; // px per frame at 60fps
  let x = 0;
  let paused = false;
  let lastTime = performance.now();

  let resetW = 0;
  const calculateResetW = () => {
    if (track.children.length > orig.length) {
      resetW = track.children[orig.length].offsetLeft - track.children[0].offsetLeft;
    }
  };

  // Compute reset width after layout
  requestAnimationFrame(calculateResetW);

  // Debounced resize to recalculate resetW
  const handleResize = debounce(calculateResetW, 150);
  window.addEventListener('resize', handleResize, { passive: true });

  track.addEventListener('mouseenter', () => { paused = true; }, { passive: true });
  track.addEventListener('mouseleave', () => { paused = false; }, { passive: true });

  const loop = (now) => {
    if (!paused) {
      const dt = Math.min((now - lastTime) / 16.67, 2); // cap delta
      x -= SPEED * dt;
      if (resetW && Math.abs(x) >= resetW) x = 0;
      track.style.transform = `translateX(${x}px)`;
    }
    lastTime = now;
    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);

  // 3D tilt on hover — on all cards (original + clones)
  const cards = qa('.menu-card', track);
  cards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const r  = card.getBoundingClientRect();
      const cx = (e.clientX - r.left) / r.width  - 0.5;
      const cy = (e.clientY - r.top)  / r.height - 0.5;
      gsap.to(card, { rotateY: cx * 14, rotateX: -cy * 10, duration: 0.38, ease: 'power2.out', overwrite: true });
    }, { passive: true });
    
    card.addEventListener('mouseleave', () => {
      gsap.to(card, { rotateY: 0, rotateX: 0, duration: 0.65, ease: 'elastic.out(1,.5)', overwrite: true });
    }, { passive: true });
  });
}

function initMenuModal() {
  const modal = q('#card-modal');
  const closeBtn = q('.modal-close', modal);
  const track = q('.marquee-track');
  if (!modal || !track) return;

  const modalImg = q('#modal-img', modal);
  const modalTag = q('#modal-tag', modal);
  const modalTitle = q('#modal-title', modal);
  const modalDesc = q('#modal-desc', modal);
  const modalIngredients = q('#modal-ingredients', modal);
  const modalPrice = q('#modal-price', modal);

  function openModal(card) {
    const titleText = q('.card-name', card).textContent.trim();
    const tagText = q('.card-tag', card).textContent.trim();
    const descText = q('.card-desc', card).textContent.trim();
    const priceText = q('.card-price', card).textContent.trim();
    const imgSrc = q('img', card).src;

    modalImg.src = imgSrc;
    modalImg.alt = titleText;
    modalTag.textContent = tagText;
    modalTitle.textContent = titleText;
    modalDesc.textContent = descText;
    modalPrice.textContent = priceText;

    // Clear and build ingredients
    modalIngredients.innerHTML = '';
    const data = FOOD_DATA[titleText];
    if (data && data.ingredients) {
      data.ingredients.forEach(ing => {
        const tag = document.createElement('span');
        tag.className = 'modal-ingredient-tag';
        tag.textContent = ing;
        modalIngredients.appendChild(tag);
      });
    }

    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden'; // Lock body scroll
  }

  function closeModal() {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = ''; // Unlock body scroll
  }

  // Bind click event to all cards inside the marquee-track
  track.addEventListener('click', e => {
    const card = e.target.closest('.menu-card');
    if (!card) return;
    openModal(card);
  });

  closeBtn?.addEventListener('click', closeModal);
  modal.addEventListener('click', e => {
    if (e.target === modal) closeModal();
  });

  // Close with Esc key
  window.addEventListener('keydown', e => {
    if (e.key === 'Escape' && modal.classList.contains('active')) closeModal();
  });

  // Connect "Book a Table" inside modal to close the modal
  const modalBookBtn = q('.modal-btn-book', modal);
  modalBookBtn?.addEventListener('click', closeModal);
}



/* ═══════════════════════════════════════════════════════
   MOBILE NAVIGATION
   ═══════════════════════════════════════════════════════ */
function initMobileNav() {
  const toggle = q('.nav-toggle');
  const links  = q('.nav-links');
  if (!toggle || !links) return;
  
  toggle.addEventListener('click', () => {
    const isOpen = toggle.classList.toggle('active');
    links.classList.toggle('active', isOpen);
    toggle.setAttribute('aria-expanded', isOpen);
  });
  
  qa('a', links).forEach(link => {
    link.addEventListener('click', () => {
      toggle.classList.remove('active');
      links.classList.remove('active');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
}

/* ═══════════════════════════════════════════════════════
   SCROLL ANIMATIONS
   ═══════════════════════════════════════════════════════ */
function initScrollAnimations() {
  const revealTargets = [
    { selector: '.about-text-col', anim: { opacity: 0, x: -40, duration: 0.8 } },
    { selector: '.about-photo-col', anim: { opacity: 0, x: 40, duration: 0.9, delay: 0.1 } },
    { selector: '.amb-intro',        anim: { opacity: 0, y: 30, duration: 0.8 } },
    { selector: '.res-photo-side',   anim: { opacity: 0, x: -40, duration: 0.9 } },
    { selector: '.res-form-col',     anim: { opacity: 0, x: 40, duration: 0.9, delay: 0.12 } },
  ];

  revealTargets.forEach(({ selector, anim }) => {
    const els = qa(selector);
    els.forEach(el => {
      gsap.set(el, { opacity: 0, x: anim.x || 0, y: anim.y || 0 });
      const io = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) {
          gsap.to(el, { opacity: 1, x: 0, y: 0, duration: anim.duration, delay: anim.delay || 0, ease: 'power3.out' });
          io.disconnect();
        }
      }, { threshold: 0.15 });
      io.observe(el);
    });
  });

  const cells = qa('.amb-cell');
  if (cells.length) {
    gsap.set(cells, { opacity: 0, y: 22, scale: 0.97 });
    ScrollTrigger.create({
      trigger: '.amb-grid', start: 'top 82%',
      onEnter: () => gsap.to(cells, { opacity: 1, y: 0, scale: 1, stagger: 0.07, duration: 0.7, ease: 'power3.out' })
    });
  }

  // Scroll scrub zoom on About image
  const aboutImg = q('.about-photo-col img');
  if (aboutImg) {
    gsap.to(aboutImg, {
      scale: 1.1,
      scrollTrigger: {
        trigger: '#about',
        start: 'top bottom',
        end: 'bottom top',
        scrub: true
      }
    });
  }

  // Scroll scrub zoom on Reservation image
  const resImg = q('.res-photo-side img');
  if (resImg) {
    gsap.to(resImg, {
      scale: 1.1,
      scrollTrigger: {
        trigger: '#reservation',
        start: 'top bottom',
        end: 'bottom top',
        scrub: true
      }
    });
  }

  const sRows = qa('.special-row');
  if (sRows.length) {
    gsap.set(sRows, { opacity: 0, x: -28 });
    ScrollTrigger.create({
      trigger: '#specials', start: 'top 80%',
      onEnter: () => gsap.to(sRows, { opacity: 1, x: 0, stagger: 0.08, duration: 0.65, ease: 'power3.out' })
    });
    const sv = q('.specials-visual');
    if (sv) {
      gsap.set(sv, { opacity: 0, scale: 0.93 });
      ScrollTrigger.create({
        trigger: '#specials', start: 'top 80%',
        onEnter: () => gsap.to(sv, { opacity: 1, scale: 1, duration: 1, ease: 'power3.out' })
      });
    }
  }

  gsap.to('.hero-content', {
    y: 70, opacity: 0.05, ease: 'none',
    scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: 0.8 }
  });

  gsap.set('#menu .menu-header', { opacity: 0, y: 24 });
  ScrollTrigger.create({
    trigger: '#menu', start: 'top 82%',
    onEnter: () => gsap.to('#menu .menu-header', { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' })
  });

  const twrap = q('.testimonials-wrap');
  if (twrap) {
    gsap.set(twrap, { opacity: 0, scale: 0.96 });
    ScrollTrigger.create({
      trigger: '#testimonials', start: 'top 82%',
      onEnter: () => gsap.to(twrap, { opacity: 1, scale: 1, duration: 0.8, ease: 'back.out(1.2)' })
    });
  }

  ScrollTrigger.create({
    trigger: '#cta', start: 'top 80%',
    onEnter: () => {
      gsap.from('#cta .section-title--light', { opacity: 0, y: 40, duration: 0.9, ease: 'power3.out' });
      gsap.from('#cta .section-body--light',  { opacity: 0, y: 20, duration: 0.7, delay: 0.2, ease: 'power3.out' });
      gsap.from('#cta .cta-actions',           { opacity: 0, y: 16, duration: 0.7, delay: 0.38, ease: 'power3.out' });
    }
  });
}

/* ═══════════════════════════════════════════════════════
   HERO STAT COUNTERS
   ═══════════════════════════════════════════════════════ */
function initCounters() {
  qa('[data-count]').forEach(el => {
    const target = +el.dataset.count;
    const suffix = el.dataset.suffix || '';
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        const obj = { val: 0 };
        gsap.to(obj, {
          val: target, duration: 1.8, ease: 'power2.out',
          onUpdate() { el.textContent = Math.floor(obj.val).toLocaleString() + suffix; }
        });
        io.disconnect();
      }
    }, { threshold: 0.5 });
    io.observe(el);
  });
}

/* ═══════════════════════════════════════════════════════
   SPECIALS HOVER PREVIEW
   ═══════════════════════════════════════════════════════ */
function initSpecials() {
  const rows  = qa('.special-row');
  const imgs  = qa('.special-img');
  const title = q('.specials-visual-title');
  const desc  = q('.specials-visual-desc');
  if (!rows.length) return;

  let current = 0;
  function show(i) {
    if (i === current && imgs[i]?.classList.contains('active')) return;
    imgs.forEach(img => img.classList.remove('active'));
    imgs[i]?.classList.add('active');
    current = i;
    
    if (title && rows[i]) {
      const nameVal = rows[i].dataset.name || '';
      const descVal = rows[i].dataset.desc || '';
      
      gsap.timeline()
        .to([title, desc], { opacity: 0, y: 8, duration: 0.15, ease: 'power2.in', onComplete() {
          title.textContent = nameVal;
          if (desc) desc.textContent = descVal;
        }})
        .to([title, desc], { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out' });
    }
  }
  rows.forEach((r, i) => r.addEventListener('mouseenter', () => show(i), { passive: true }));
  show(0);
}

/* ═══════════════════════════════════════════════════════
   AMBIENCE TABS
   ═══════════════════════════════════════════════════════ */
function initAmbience() {
  const tabs = qa('.amb-tab-item');
  const cells = qa('.amb-cell');
  if (!tabs.length || !cells.length) return;

  const areaMapping = ['lounge', 'bar', 'terrace', 'work', 'lounge'];
  cells.forEach((cell, idx) => {
    if (!cell.dataset.area) {
      cell.dataset.area = areaMapping[idx];
    }
  });

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetArea = tab.id.replace('tab-', '');
      const isAlreadyActive = tab.classList.contains('active');

      tabs.forEach(t => { t.classList.remove('active'); t.setAttribute('aria-selected', 'false'); });

      if (isAlreadyActive) {
        // Reset: show all cells
        cells.forEach(cell => cell.classList.remove('dimmed'));
      } else {
        tab.classList.add('active');
        tab.setAttribute('aria-selected', 'true');
        cells.forEach(cell => {
          if (cell.dataset.area === targetArea) {
            cell.classList.remove('dimmed');
            gsap.fromTo(cell, { scale: 0.98 }, { scale: 1, duration: 0.5, ease: 'back.out(1.5)', overwrite: 'auto' });
          } else {
            cell.classList.add('dimmed');
          }
        });
      }
    });
  });

  // Sync initial state on page load based on default active tab
  const activeTab = q('.amb-tab-item.active');
  if (activeTab) {
    const targetArea = activeTab.id.replace('tab-', '');
    cells.forEach(cell => {
      if (cell.dataset.area !== targetArea) {
        cell.classList.add('dimmed');
      }
    });
  }
}

/* ═══════════════════════════════════════════════════════
   TESTIMONIALS
   ═══════════════════════════════════════════════════════ */
function initTestimonials() {
  const slides = qa('.testimonial-slide');
  const dots   = qa('.t-dot');
  const prev   = q('#t-prev');
  const next   = q('#t-next');
  if (!slides.length) return;
  let cur = 0, auto;

  function goTo(i) {
    slides.forEach(s => {
      s.classList.remove('active');
      s.setAttribute('aria-hidden', 'true');
    });
    dots.forEach(d => {
      d.classList.remove('active');
      d.setAttribute('aria-selected', 'false');
    });
    cur = ((i % slides.length) + slides.length) % slides.length;
    slides[cur].classList.add('active');
    slides[cur].removeAttribute('aria-hidden');
    if (dots[cur]) {
      dots[cur].classList.add('active');
      dots[cur].setAttribute('aria-selected', 'true');
    }
  }
  function startAuto() { auto = setInterval(() => goTo(cur + 1), 6000); }
  function resetAuto() { clearInterval(auto); startAuto(); }

  dots.forEach((d, i) => d.addEventListener('click', () => { goTo(i); resetAuto(); }));
  prev?.addEventListener('click', () => { goTo(cur - 1); resetAuto(); });
  next?.addEventListener('click', () => { goTo(cur + 1); resetAuto(); });

  const wrap = q('.testimonials-wrap');
  wrap?.addEventListener('mouseenter', () => clearInterval(auto), { passive: true });
  wrap?.addEventListener('mouseleave', startAuto, { passive: true });

  goTo(0);
  startAuto();
}

/* ═══════════════════════════════════════════════════════
   RESERVATION FORM
   ═══════════════════════════════════════════════════════ */
function initReservation() {
  const form    = q('#reservation-form');
  const success = q('.form-success');
  const submit  = q('#res-submit-btn');
  if (!form) return;

  const dateInput = q('#res-date');
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);
  }

  form.addEventListener('submit', e => {
    e.preventDefault();

    // Reset previous error classes
    const inputs = qa('.form-input, .form-select', form);
    inputs.forEach(input => input.classList.remove('input-error'));

    if (!form.checkValidity()) {
      const invalidInputs = inputs.filter(input => !input.validity.valid);
      invalidInputs.forEach(input => {
        input.classList.add('input-error');
        // Visual shake animation using GSAP
        gsap.fromTo(input, { x: -6 }, { x: 6, duration: 0.08, repeat: 5, yoyo: true, onComplete() { input.style.transform = ''; } });
      });
      if (invalidInputs[0]) invalidInputs[0].focus();
      return;
    }

    if (submit) {
      const span = submit.querySelector('span') || submit;
      span.textContent = 'Confirming…';
      submit.disabled = true;
    }
    setTimeout(() => {
      gsap.to(form, {
        opacity: 0, y: -14, duration: 0.4, ease: 'power2.in',
        onComplete() {
          form.style.display = 'none';
          success?.classList.add('visible');
        }
      });
    }, 900);
  });
}

/* ═══════════════════════════════════════════════════════
   MAGNETIC BUTTONS — lightweight version
   ═══════════════════════════════════════════════════════ */
function initMagnetic() {
  if (window.matchMedia('(pointer:coarse)').matches) return;
  qa('.btn-primary,.btn-ghost,.nav-cta').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const r  = btn.getBoundingClientRect();
      const dx = (e.clientX - r.left - r.width  * 0.5) * 0.2;
      const dy = (e.clientY - r.top  - r.height * 0.5) * 0.2;
      btn.style.transform = `translate(${dx}px,${dy}px)`;
    }, { passive: true });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    }, { passive: true });
  });
}

/* ═══════════════════════════════════════════════════════
   BOOT
   ═══════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  initPreloader();
  initCursor();
  initNav();
  initCSSParticles();
  initHeroParallax();
  initMagnetic();
  initMarquee();
  initMenuModal();
  initMobileNav();
  initAmbience();
  initSpecials();
  initTestimonials();
  initReservation();
  initScrollAnimations();
  initCounters();

  if ('requestIdleCallback' in window) {
    requestIdleCallback(() => {
      qa('.amb-cell').forEach(cell => {
        cell.addEventListener('mouseenter', () => { cell.style.transform = 'scale(1.018)'; cell.style.transition = 'transform .4s'; }, { passive: true });
        cell.addEventListener('mouseleave', () => { cell.style.transform = ''; }, { passive: true });
      });
    });
  }
});

// Sync ScrollTrigger calculations on full window load
window.addEventListener('load', () => {
  ScrollTrigger.refresh();
});
