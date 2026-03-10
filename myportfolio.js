'use strict';

/* ═══════════════════════════════════════════════════════════
   1. PRELOADER
═══════════════════════════════════════════════════════════ */
const preloader = document.getElementById('preloader');
window.addEventListener('load', () => {
  setTimeout(() => {
    preloader.classList.add('done');
    setTimeout(() => preloader.remove(), 700);
  }, 900);
});


/* ═══════════════════════════════════════════════════════════
   2. TYPING EFFECT
═══════════════════════════════════════════════════════════ */
const text = "I'm a B.Tech. Information Technology student at Rajasthan Technical University, Kota (CGPA 8.45), with a strong passion for Data Science, Machine Learning, and Generative AI. Currently interning at C-DAC Pune, I work on agricultural yield prediction using NASA + FAOSTAT data, Indian population analysis, and multilingual legal text engineering. I've also built a GPU-accelerated RAG chatbot using LlamaIndex and Mistral-7B that answers questions from Google Drive documents. I love turning complex datasets into meaningful insights and building AI-powered solutions that create real impact.";
const typingText = document.getElementById('typing-text');
let typingIndex = 0;
function type() {
  if (typingIndex < text.length) {
    typingText.textContent += text.charAt(typingIndex++);
    setTimeout(type, 18);
  }
}
setTimeout(type, 1200);


/* ═══════════════════════════════════════════════════════════
   3. PARTICLE CONSTELLATION
═══════════════════════════════════════════════════════════ */
(function () {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, mouse = { x: -9999, y: -9999 };
  const COUNT = 80, MAX_D = 140, GOLD = 'hsla(45,100%,72%,';

  function resize() { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; }
  resize();
  window.addEventListener('resize', resize);
  document.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });
  document.addEventListener('mouseleave', () => { mouse.x = -9999; mouse.y = -9999; });

  const pts = Array.from({ length: COUNT }, () => ({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    vx: (Math.random() - .5) * .45,
    vy: (Math.random() - .5) * .45,
    r: Math.random() * 1.6 + .5,
    a: Math.random() * .5 + .2
  }));

  function loop() {
    ctx.clearRect(0, 0, W, H);
    for (let i = 0; i < COUNT; i++) {
      const p = pts[i];
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;
      for (let j = i + 1; j < COUNT; j++) {
        const q = pts[j], d = Math.hypot(p.x - q.x, p.y - q.y);
        if (d < MAX_D) {
          ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y);
          ctx.strokeStyle = GOLD + (1 - d / MAX_D) * .22 + ')';
          ctx.lineWidth = .7; ctx.stroke();
        }
      }
      const dm = Math.hypot(p.x - mouse.x, p.y - mouse.y);
      if (dm < MAX_D * 1.5) {
        ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(mouse.x, mouse.y);
        ctx.strokeStyle = GOLD + (1 - dm / (MAX_D * 1.5)) * .5 + ')';
        ctx.lineWidth = .9; ctx.stroke();
      }
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = GOLD + p.a + ')'; ctx.fill();
    }
    requestAnimationFrame(loop);
  }
  loop();
})();


/* ═══════════════════════════════════════════════════════════
   4. CUSTOM MAGNETIC CURSOR
═══════════════════════════════════════════════════════════ */
(function () {
  const dot   = document.getElementById('cursorDot');
  const ring  = document.getElementById('cursorRing');
  if (!dot || !ring) return;
  let mx = 0, my = 0, rx = 0, ry = 0;

  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

  function animCursor() {
    dot.style.transform   = `translate(${mx}px,${my}px)`;
    rx += (mx - rx) * .13;
    ry += (my - ry) * .13;
    ring.style.transform  = `translate(${rx}px,${ry}px)`;
    requestAnimationFrame(animCursor);
  }
  animCursor();

  const magnetTargets = document.querySelectorAll(
    'button, a, .project-item, .skill-tag, .cert-item, .service-item, .navbar-link'
  );
  magnetTargets.forEach(el => {
    el.addEventListener('mouseenter', () => {
      ring.classList.add('hovered');
      dot.classList.add('hovered');
    });
    el.addEventListener('mouseleave', () => {
      ring.classList.remove('hovered');
      dot.classList.remove('hovered');
    });
  });

  document.addEventListener('mousedown', () => ring.classList.add('clicked'));
  document.addEventListener('mouseup',   () => ring.classList.remove('clicked'));
})();


/* ═══════════════════════════════════════════════════════════
   5. SCROLL REVEAL (IntersectionObserver)
═══════════════════════════════════════════════════════════ */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

function observeReveal() {
  document.querySelectorAll('.reveal, .reveal-left, .reveal-scale').forEach(el => {
    el.classList.remove('visible');
    revealObserver.observe(el);
  });
}
observeReveal();
window._reObserve = observeReveal;


/* ═══════════════════════════════════════════════════════════
   6. SKILL BARS (data-target based)
═══════════════════════════════════════════════════════════ */
(function () {
  document.querySelectorAll('.skill-progress-fill').forEach(fill => {
    fill.style.width = '0';
    fill.classList.remove('animated');
  });

  function initSkillBars() {
    document.querySelectorAll('.skill-progress-fill').forEach(fill => {
      fill.style.width = '0';
      fill.classList.remove('animated');
    });
    const obs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.querySelectorAll('.skill-progress-fill').forEach((fill, i) => {
            setTimeout(() => {
              fill.style.setProperty('--tw', fill.dataset.target || '0%');
              fill.classList.add('animated');
            }, i * 140);
          });
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.25 });
    document.querySelectorAll('.skills-list').forEach(el => obs.observe(el));
  }
  initSkillBars();
  window._initSkillBars = initSkillBars;
})();


/* ═══════════════════════════════════════════════════════════
   7. ANIMATED STAT COUNTERS
═══════════════════════════════════════════════════════════ */
(function () {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;
  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el  = entry.target;
      const end = +el.dataset.count;
      const dur = 1800;
      const step = 16;
      const inc  = end / (dur / step);
      let cur = 0;
      const timer = setInterval(() => {
        cur += inc;
        if (cur >= end) { cur = end; clearInterval(timer); }
        el.textContent = Math.floor(cur) + (el.dataset.suffix || '');
      }, step);
      obs.unobserve(el);
    });
  }, { threshold: 0.6 });
  counters.forEach(el => obs.observe(el));
})();


/* ═══════════════════════════════════════════════════════════
   8. TEXT SCRAMBLE (name heading)
═══════════════════════════════════════════════════════════ */
(function () {
  const el = document.querySelector('.name');
  if (!el) return;
  const original = el.textContent.trim();
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let frame = 0, iteration = 0;
  let interval = null;

  function scramble() {
    clearInterval(interval);
    iteration = 0;
    interval = setInterval(() => {
      el.textContent = original.split('').map((char, idx) => {
        if (idx < iteration) return original[idx];
        if (char === ' ') return ' ';
        return chars[Math.floor(Math.random() * chars.length)];
      }).join('');
      if (iteration >= original.length) clearInterval(interval);
      iteration += 0.35;
    }, 28);
  }

  // Run once on load after a delay, then on hover
  setTimeout(scramble, 1500);
  el.addEventListener('mouseenter', scramble);
})();


/* ═══════════════════════════════════════════════════════════
   9. TILT CARDS (3-D on mouse)
═══════════════════════════════════════════════════════════ */
function initTilt() {
  document.querySelectorAll('.project-item > a').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const rotX = ((e.clientY - r.top)  / r.height - .5) * -10;
      const rotY = ((e.clientX - r.left) / r.width  - .5) *  10;
      card.style.transform = `perspective(700px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(1.03)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(700px) rotateX(0) rotateY(0) scale(1)';
    });
  });
}
initTilt();
window._initTilt = initTilt;


/* ═══════════════════════════════════════════════════════════
   10. RIPPLE EFFECT on buttons / links
═══════════════════════════════════════════════════════════ */
document.addEventListener('click', e => {
  const target = e.target.closest('button, .navbar-link, .form-btn, .filter-item button');
  if (!target) return;
  const rect = target.getBoundingClientRect();
  const ripple = document.createElement('span');
  ripple.className = 'ripple-fx';
  ripple.style.cssText = `
    left:${e.clientX - rect.left}px;
    top:${e.clientY - rect.top}px;
  `;
  target.style.position = 'relative';
  target.style.overflow = 'hidden';
  target.appendChild(ripple);
  setTimeout(() => ripple.remove(), 700);
});


/* ═══════════════════════════════════════════════════════════
   11. ANIMATED GRADIENT BORDER on sidebar
═══════════════════════════════════════════════════════════ */
(function () {
  const sidebar = document.querySelector('.sidebar');
  if (!sidebar) return;
  let angle = 0;
  function rotateBorder() {
    angle = (angle + 0.4) % 360;
    sidebar.style.borderImage = `linear-gradient(${angle}deg,
      hsl(45,100%,72%) 0%,
      hsl(240,1%,25%) 40%,
      hsl(35,100%,68%) 80%,
      hsl(45,100%,72%) 100%) 1`;
    requestAnimationFrame(rotateBorder);
  }
  rotateBorder();
})();


/* ═══════════════════════════════════════════════════════════
   12. SECTION HEADER CHAR SPLIT ANIMATION
═══════════════════════════════════════════════════════════ */
(function () {
  document.querySelectorAll('.article-title, .h3.service-title, .h3.skills-title, .h3.testimonials-title').forEach(el => {
    if (el.dataset.split) return;
    el.dataset.split = '1';
    const words = el.textContent.trim().split(' ');
    el.innerHTML = words.map((w, wi) =>
      w.split('').map((c, ci) =>
        `<span class="char" style="animation-delay:${(wi * 5 + ci) * 38}ms">${c === ' ' ? '&nbsp;' : c}</span>`
      ).join('') + (wi < words.length - 1 ? '<span class="char">&nbsp;</span>' : '')
    ).join('');
  });
})();


/* ═══════════════════════════════════════════════════════════
   13. SMOOTH AURORA BACKGROUND SHIFT
═══════════════════════════════════════════════════════════ */
(function () {
  const body = document.body;
  let t = 0;
  function aurora() {
    t += 0.003;
    const h1 = 240 + Math.sin(t)       * 8;
    const h2 = 240 + Math.sin(t + 2)   * 6;
    const s  =   2 + Math.sin(t * 1.3) * 1;
    body.style.background = `
      radial-gradient(ellipse at 20% 50%, hsl(${h1},${s}%,9%) 0%, transparent 60%),
      radial-gradient(ellipse at 80% 20%, hsl(${h2},${s+1}%,8%) 0%, transparent 55%),
      hsl(0,0%,7%)
    `;
    requestAnimationFrame(aurora);
  }
  aurora();
})();


/* ═══════════════════════════════════════════════════════════
   14. NAVBAR ACTIVE INDICATOR SLIDE
═══════════════════════════════════════════════════════════ */
(function () {
  const navLinks = document.querySelectorAll('.navbar-link');
  const indicator = document.getElementById('nav-indicator');
  if (!indicator) return;

  function moveIndicator(el) {
    const rect = el.getBoundingClientRect();
    const navRect = el.closest('.navbar-list').getBoundingClientRect();
    indicator.style.width  = rect.width + 'px';
    indicator.style.left   = (rect.left - navRect.left) + 'px';
    indicator.style.opacity = '1';
  }

  const activeLink = document.querySelector('.navbar-link.active');
  if (activeLink) setTimeout(() => moveIndicator(activeLink), 100);

  navLinks.forEach(link => {
    link.addEventListener('mouseenter', () => moveIndicator(link));
    link.addEventListener('mouseleave', () => {
      const active = document.querySelector('.navbar-link.active');
      if (active) moveIndicator(active); else indicator.style.opacity = '0';
    });
  });
  window._moveNavIndicator = moveIndicator;
})();


/* ═══════════════════════════════════════════════════════════
   15. SCROLL PROGRESS BAR
═══════════════════════════════════════════════════════════ */
(function () {
  const bar = document.getElementById('scroll-progress');
  if (!bar) return;
  window.addEventListener('scroll', () => {
    const pct = window.scrollY / (document.body.scrollHeight - window.innerHeight) * 100;
    bar.style.width = Math.min(pct, 100) + '%';
  }, { passive: true });
})();


/* ═══════════════════════════════════════════════════════════
   SIDEBAR TOGGLE
═══════════════════════════════════════════════════════════ */
const elementToggleFunc = el => el.classList.toggle('active');
const sidebar    = document.querySelector('[data-sidebar]');
const sidebarBtn = document.querySelector('[data-sidebar-btn]');
sidebarBtn.addEventListener('click', () => elementToggleFunc(sidebar));


/* ═══════════════════════════════════════════════════════════
   MODAL (stub — no testimonials, prevents JS errors)
═══════════════════════════════════════════════════════════ */
const testimonialsItem = document.querySelectorAll('[data-testimonials-item]');
const modalContainer   = document.querySelector('[data-modal-container]');
const modalCloseBtn    = document.querySelector('[data-modal-close-btn]');
const overlay          = document.querySelector('[data-overlay]');
const modalImg         = document.querySelector('[data-modal-img]');
const modalTitle       = document.querySelector('[data-modal-title]');
const modalText        = document.querySelector('[data-modal-text]');
const testimonialsModalFunc = () => {
  modalContainer.classList.toggle('active');
  overlay.classList.toggle('active');
};
testimonialsItem.forEach(item => {
  item.addEventListener('click', function () {
    modalImg.src = this.querySelector('[data-testimonials-avatar]').src;
    modalImg.alt = this.querySelector('[data-testimonials-avatar]').alt;
    modalTitle.innerHTML = this.querySelector('[data-testimonials-title]').innerHTML;
    modalText.innerHTML  = this.querySelector('[data-testimonials-text]').innerHTML;
    testimonialsModalFunc();
  });
});
modalCloseBtn.addEventListener('click', testimonialsModalFunc);
overlay.addEventListener('click', testimonialsModalFunc);


/* ═══════════════════════════════════════════════════════════
   PORTFOLIO FILTER
═══════════════════════════════════════════════════════════ */
const select      = document.querySelector('[data-select]');
const selectItems = document.querySelectorAll('[data-select-item]');
const selectValue = document.querySelector('[data-selecct-value]');
const filterBtn   = document.querySelectorAll('[data-filter-btn]');
const filterItems = document.querySelectorAll('[data-filter-item]');

select.addEventListener('click', function () { elementToggleFunc(this); });
selectItems.forEach(item => {
  item.addEventListener('click', function () {
    selectValue.innerText = this.innerText;
    elementToggleFunc(select);
    filterFunc(this.innerText.toLowerCase());
  });
});

const filterFunc = selectedValue => {
  filterItems.forEach(item => {
    const match = selectedValue === 'all' || item.dataset.category === selectedValue;
    item.classList.toggle('active', match);
    item.style.animation = match ? 'scaleUp 0.3s ease forwards' : '';
  });
  setTimeout(() => { if (window._reObserve) window._reObserve(); if (window._initTilt) window._initTilt(); }, 50);
};

let lastBtn = filterBtn[0];
filterBtn.forEach(btn => {
  btn.addEventListener('click', function () {
    selectValue.innerText = this.innerText;
    filterFunc(this.innerText.toLowerCase());
    lastBtn.classList.remove('active');
    this.classList.add('active');
    lastBtn = this;
  });
});


/* ═══════════════════════════════════════════════════════════
   CONTACT FORM
═══════════════════════════════════════════════════════════ */
const form       = document.querySelector('[data-form]');
const formInputs = document.querySelectorAll('[data-form-input]');
const formBtn    = document.querySelector('[data-form-btn]');
formInputs.forEach(input => {
  input.addEventListener('input', () => {
    form.checkValidity() ? formBtn.removeAttribute('disabled') : formBtn.setAttribute('disabled', '');
  });
});


/* ═══════════════════════════════════════════════════════════
   PAGE NAVIGATION
═══════════════════════════════════════════════════════════ */
const navigationLinks = document.querySelectorAll('[data-nav-link]');
const pages           = document.querySelectorAll('[data-page]');

navigationLinks.forEach((link, i) => {
  link.addEventListener('click', function () {
    pages.forEach((page, j) => {
      const isMatch = this.innerHTML.toLowerCase() === page.dataset.page;
      page.classList.toggle('active', isMatch);
      navigationLinks[j].classList.toggle('active', isMatch);
      if (isMatch) {
        window.scrollTo(0, 0);
        setTimeout(() => {
          if (window._reObserve)     window._reObserve();
          if (window._initSkillBars) window._initSkillBars();
          if (window._initTilt)      window._initTilt();
          // Move nav indicator
          const activeLink = document.querySelector('.navbar-link.active');
          if (window._moveNavIndicator && activeLink) window._moveNavIndicator(activeLink);
        }, 60);
      }
    });
  });
});
