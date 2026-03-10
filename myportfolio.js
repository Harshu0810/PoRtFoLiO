'use strict';

/* ══════════════════════════════════════════════════════
   HARSHIT GOYAL — PORTFOLIO ANIMATION ENGINE v3
══════════════════════════════════════════════════════ */


/* ── LOADER ── */
// Script runs after DOM — 'load' may have already fired, so check readyState
function dismissLoader() {
  const loader = document.getElementById('loaderScreen');
  if (!loader) return;
  setTimeout(() => {
    loader.classList.add('hidden');
    splitTextInit();
  }, 800);
}
if (document.readyState === 'complete') {
  dismissLoader();
} else {
  window.addEventListener('load', dismissLoader);
}


/* ── TYPING EFFECT ── */
const aboutText = "I'm a B.Tech. Information Technology student at Rajasthan Technical University, Kota (CGPA 8.45), with a strong passion for Data Science, Machine Learning, and Generative AI. Currently interning at C-DAC Pune, I work on agricultural yield prediction using NASA + FAOSTAT data, Indian population analysis, and multilingual legal text engineering. I've also built a GPU-accelerated RAG chatbot using LlamaIndex and Mistral-7B that answers questions from Google Drive documents. I love turning complex datasets into meaningful insights and building AI-powered solutions that create real impact.";
const typingText = document.getElementById('typing-text');
let typeIndex = 0;
function typeChar() {
  if (typeIndex < aboutText.length) {
    typingText.textContent += aboutText.charAt(typeIndex++);
    setTimeout(typeChar, 17);
  }
}
setTimeout(typeChar, 1100);


/* ══════════════════════════════════════════════════════
   PARTICLE CONSTELLATION CANVAS
══════════════════════════════════════════════════════ */
(function () {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H;
  const GOLD = 'hsla(45,100%,72%,';
  const BLUE = 'hsla(210,100%,65%,';
  const COUNT = 75, LINK = 140;
  const mouse = { x: -9999, y: -9999 };
  const pts = [];

  const resize = () => { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; };
  resize();
  window.addEventListener('resize', resize);
  document.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });
  document.addEventListener('mouseleave', () => { mouse.x = mouse.y = -9999; });

  class P {
    constructor() { this.init(); }
    init() {
      this.x = Math.random() * W; this.y = Math.random() * H;
      this.vx = (Math.random() - 0.5) * 0.45; this.vy = (Math.random() - 0.5) * 0.45;
      this.r = Math.random() * 1.6 + 0.5; this.a = Math.random() * 0.45 + 0.15;
      this.gold = Math.random() > 0.3;
    }
    update() {
      const dx = this.x - mouse.x, dy = this.y - mouse.y, dm = Math.hypot(dx, dy);
      if (dm < 90 && dm > 0) { const f = (90 - dm) / 90 * 0.6; this.vx += dx / dm * f; this.vy += dy / dm * f; }
      this.vx *= 0.992; this.vy *= 0.992;
      this.x += this.vx; this.y += this.vy;
      if (this.x < 0 || this.x > W) this.vx *= -1;
      if (this.y < 0 || this.y > H) this.vy *= -1;
    }
  }
  for (let i = 0; i < COUNT; i++) pts.push(new P());

  function frame() {
    ctx.clearRect(0, 0, W, H);
    for (let i = 0; i < pts.length; i++) {
      const p = pts[i];
      for (let j = i + 1; j < pts.length; j++) {
        const q = pts[j], d = Math.hypot(p.x - q.x, p.y - q.y);
        if (d < LINK) {
          ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y);
          ctx.strokeStyle = GOLD + (1 - d / LINK) * 0.22 + ')'; ctx.lineWidth = 0.7; ctx.stroke();
        }
      }
      const dm = Math.hypot(p.x - mouse.x, p.y - mouse.y);
      if (dm < LINK * 1.6) {
        ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(mouse.x, mouse.y);
        ctx.strokeStyle = (p.gold ? GOLD : BLUE) + (1 - dm / (LINK * 1.6)) * 0.55 + ')';
        ctx.lineWidth = 0.9; ctx.stroke();
      }
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = (p.gold ? GOLD : BLUE) + p.a + ')'; ctx.fill();
      p.update();
    }
    requestAnimationFrame(frame);
  }
  frame();
})();


/* ══════════════════════════════════════════════════════
   DUAL CURSOR SYSTEM
══════════════════════════════════════════════════════ */
(function () {
  const dot = document.getElementById('cursorGlow');
  const ring = document.getElementById('cursorRing');
  if (!dot || !ring) return;
  let dx = 0, dy = 0, rx = 0, ry = 0, tx = window.innerWidth / 2, ty = window.innerHeight / 2;
  document.addEventListener('mousemove', e => { tx = e.clientX; ty = e.clientY; });
  document.addEventListener('mousedown', () => ring.classList.add('clicking'));
  document.addEventListener('mouseup', () => ring.classList.remove('clicking'));
  const hoverEls = 'a, button, .project-item, .skill-tag, .cert-item, .service-item, .tools-category';
  document.querySelectorAll(hoverEls).forEach(el => {
    el.addEventListener('mouseenter', () => { ring.classList.add('hovering'); });
    el.addEventListener('mouseleave', () => { ring.classList.remove('hovering'); });
  });
  function loop() {
    dx += (tx - dx) * 0.65; dy += (ty - dy) * 0.65;
    rx += (tx - rx) * 0.10; ry += (ty - ry) * 0.10;
    dot.style.left = dx + 'px'; dot.style.top = dy + 'px';
    ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
    requestAnimationFrame(loop);
  }
  loop();
})();


/* ══════════════════════════════════════════════════════
   RIPPLE ON CLICK
══════════════════════════════════════════════════════ */
document.addEventListener('click', function (e) {
  const t = e.target.closest('button, .project-item > a, .navbar-link, .cert-item');
  if (!t) return;
  t.style.position = 'relative'; t.style.overflow = 'hidden';
  const r = t.getBoundingClientRect(), sz = Math.max(r.width, r.height) * 1.5;
  const dot = document.createElement('span');
  dot.className = 'ripple-dot';
  dot.style.cssText = `width:${sz}px;height:${sz}px;left:${e.clientX - r.left - sz / 2}px;top:${e.clientY - r.top - sz / 2}px;`;
  t.appendChild(dot);
  dot.addEventListener('animationend', () => dot.remove());
});


/* ══════════════════════════════════════════════════════
   MAGNETIC BUTTONS
══════════════════════════════════════════════════════ */
function initMagnetic() {
  document.querySelectorAll('[data-magnetic]').forEach(el => {
    el.addEventListener('mousemove', e => {
      const r = el.getBoundingClientRect();
      const dx = (e.clientX - (r.left + r.width / 2)) * 0.36;
      const dy = (e.clientY - (r.top + r.height / 2)) * 0.36;
      el.style.transform = `translate(${dx}px, ${dy}px)`;
    });
    el.addEventListener('mouseleave', () => {
      el.style.transform = 'translate(0,0)';
      el.style.transition = 'transform 0.5s cubic-bezier(0.22,1,0.36,1)';
      setTimeout(() => el.style.transition = '', 500);
    });
  });
}
initMagnetic();
window._initMagnetic = initMagnetic;


/* ══════════════════════════════════════════════════════
   SPLIT TEXT — letter-by-letter reveal
══════════════════════════════════════════════════════ */
function splitTextInit() {
  document.querySelectorAll('[data-split]:not([data-split-done])').forEach(el => {
    el.dataset.splitDone = '1';
    const words = el.textContent.trim().split(' ');
    el.innerHTML = '';
    words.forEach((word, wi) => {
      [...word].forEach((ch, ci) => {
        const s = document.createElement('span');
        s.className = 'split-char';
        s.textContent = ch;
        s.style.transitionDelay = ((wi * 5 + ci) * 0.028) + 's';
        el.appendChild(s);
      });
      if (wi < words.length - 1) {
        const sp = document.createElement('span');
        sp.className = 'split-char space';
        sp.innerHTML = '&nbsp;';
        el.appendChild(sp);
      }
    });
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.querySelectorAll('.split-char').forEach(c => c.classList.add('visible'));
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.5 });
    obs.observe(el);
  });
}


/* ══════════════════════════════════════════════════════
   TEXT SCRAMBLE on name hover
══════════════════════════════════════════════════════ */
(function () {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$';
  document.querySelectorAll('[data-scramble]').forEach(el => {
    const orig = el.textContent;
    let raf, f = 0;
    el.addEventListener('mouseenter', () => {
      cancelAnimationFrame(raf); f = 0;
      function tick() {
        const p = f / 18;
        el.textContent = orig.split('').map((c, i) => {
          if (c === ' ') return ' ';
          return i / orig.length < p ? orig[i] : chars[Math.floor(Math.random() * chars.length)];
        }).join('');
        f++;
        if (f <= 18) raf = requestAnimationFrame(tick);
        else el.textContent = orig;
      }
      tick();
    });
  });
})();


/* ══════════════════════════════════════════════════════
   SCROLL REVEAL
══════════════════════════════════════════════════════ */
const revObs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

function observeReveal() {
  document.querySelectorAll('.reveal, .reveal-left').forEach(el => revObs.observe(el));
}
observeReveal();
window._reObserve = observeReveal;


/* ══════════════════════════════════════════════════════
   SKILL BARS
══════════════════════════════════════════════════════ */
document.querySelectorAll('.skill-progress-fill').forEach(fill => {
  if (!fill.dataset.target) {
    const m = (fill.getAttribute('style') || '').match(/width:\s*([\d.]+%)/);
    if (m) fill.dataset.target = m[1];
  }
  fill.style.width = '0'; fill.classList.remove('animated');
});

function initSkillBars() {
  document.querySelectorAll('.skill-progress-fill').forEach(fill => {
    fill.style.width = '0'; fill.classList.remove('animated');
  });
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      e.target.querySelectorAll('.skill-progress-fill').forEach((fill, i) => {
        setTimeout(() => {
          fill.style.setProperty('--target-width', fill.dataset.target || '0%');
          fill.classList.add('animated');
        }, i * 140);
      });
      obs.unobserve(e.target);
    });
  }, { threshold: 0.25 });
  document.querySelectorAll('.skills-list').forEach(el => obs.observe(el));
}
initSkillBars();
window._initSkillBars = initSkillBars;


/* ══════════════════════════════════════════════════════
   ANIMATED COUNTER
══════════════════════════════════════════════════════ */
(function () {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const end = parseFloat(el.dataset.count), dec = +el.dataset.dec || 0, suf = el.dataset.suf || '';
      const start = performance.now();
      function tick(now) {
        const t = Math.min((now - start) / 1600, 1);
        const ease = 1 - Math.pow(1 - t, 4);
        el.textContent = (end * ease).toFixed(dec) + suf;
        t < 1 ? requestAnimationFrame(tick) : (el.textContent = end.toFixed(dec) + suf, el.classList.add('counted'));
      }
      requestAnimationFrame(tick);
      obs.unobserve(el);
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('[data-count]').forEach(el => obs.observe(el));
})();


/* ══════════════════════════════════════════════════════
   3D CARD TILT + GLARE
══════════════════════════════════════════════════════ */
function initTilt() {
  document.querySelectorAll('.project-item > a').forEach(card => {
    const glare = card.closest('.project-item')?.querySelector('.card-glare');
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const x = e.clientX - r.left, y = e.clientY - r.top;
      const rx = ((y - r.height / 2) / (r.height / 2)) * -7;
      const ry = ((x - r.width  / 2) / (r.width  / 2)) *  7;
      card.style.transform = `perspective(700px) rotateX(${rx}deg) rotateY(${ry}deg) scale(1.03)`;
      if (glare) { glare.style.setProperty('--mx', x / r.width * 100 + '%'); glare.style.setProperty('--my', y / r.height * 100 + '%'); }
    });
    card.addEventListener('mouseleave', () => {
      card.style.transition = 'transform 0.5s cubic-bezier(0.22,1,0.36,1)';
      card.style.transform = 'perspective(700px) rotateX(0) rotateY(0) scale(1)';
      setTimeout(() => card.style.transition = '', 500);
    });
  });
}
initTilt();
window._initTilt = initTilt;


/* ══════════════════════════════════════════════════════
   PARALLAX SIDEBAR
══════════════════════════════════════════════════════ */
(function () {
  const sb = document.querySelector('.sidebar');
  if (!sb) return;
  document.addEventListener('mousemove', e => {
    const xP = (e.clientX / window.innerWidth  - 0.5) * 7;
    const yP = (e.clientY / window.innerHeight - 0.5) * 5;
    sb.style.transform = `translateX(${xP}px) translateY(${yP}px)`;
    sb.style.transition = 'transform 0.9s cubic-bezier(0.22,1,0.36,1)';
  });
})();


/* ══════════════════════════════════════════════════════
   PAGE WIPE TRANSITION
══════════════════════════════════════════════════════ */
const wipeEl = document.getElementById('pageWipe');
function runWipe(cb) {
  if (!wipeEl) { cb(); return; }
  wipeEl.classList.remove('leave');
  wipeEl.classList.add('enter');
  setTimeout(() => {
    cb();
    wipeEl.classList.remove('enter');
    wipeEl.classList.add('leave');
    setTimeout(() => wipeEl.classList.remove('leave'), 420);
  }, 400);
}


/* ══════════════════════════════════════════════════════
   CORE PORTFOLIO LOGIC
══════════════════════════════════════════════════════ */
const elementToggleFunc = el => el.classList.toggle('active');

const sidebar    = document.querySelector('[data-sidebar]');
const sidebarBtn = document.querySelector('[data-sidebar-btn]');
sidebarBtn.addEventListener('click', () => elementToggleFunc(sidebar));

/* modal */
const testimonialsItem  = document.querySelectorAll('[data-testimonials-item]');
const modalContainer    = document.querySelector('[data-modal-container]');
const modalCloseBtn     = document.querySelector('[data-modal-close-btn]');
const overlay           = document.querySelector('[data-overlay]');
const modalImg          = document.querySelector('[data-modal-img]');
const modalTitle        = document.querySelector('[data-modal-title]');
const modalText         = document.querySelector('[data-modal-text]');
const toggleModal       = () => { modalContainer.classList.toggle('active'); overlay.classList.toggle('active'); };
testimonialsItem.forEach(item => {
  item.addEventListener('click', function () {
    modalImg.src = this.querySelector('[data-testimonials-avatar]').src;
    modalImg.alt = this.querySelector('[data-testimonials-avatar]').alt;
    modalTitle.innerHTML = this.querySelector('[data-testimonials-title]').innerHTML;
    modalText.innerHTML  = this.querySelector('[data-testimonials-text]').innerHTML;
    toggleModal();
  });
});
modalCloseBtn.addEventListener('click', toggleModal);
overlay.addEventListener('click', toggleModal);

/* filter */
const select      = document.querySelector('[data-select]');
const selectItems = document.querySelectorAll('[data-select-item]');
const selectValue = document.querySelector('[data-selecct-value]');
const filterBtn   = document.querySelectorAll('[data-filter-btn]');
const filterItems = document.querySelectorAll('[data-filter-item]');
select.addEventListener('click', () => elementToggleFunc(select));
selectItems.forEach(item => {
  item.addEventListener('click', function () {
    selectValue.innerText = this.innerText;
    elementToggleFunc(select);
    filterFunc(this.innerText.toLowerCase());
  });
});

if (!document.getElementById('filterAnim')) {
  const s = document.createElement('style'); s.id = 'filterAnim';
  s.textContent = '@keyframes filterIn{from{opacity:0;transform:scale(0.9) translateY(14px)}to{opacity:1;transform:scale(1) translateY(0)}}';
  document.head.appendChild(s);
}

function filterFunc(val) {
  filterItems.forEach((item, i) => {
    const show = val === 'all' || val === item.dataset.category;
    if (show) {
      item.classList.add('active');
      item.style.animation = `filterIn 0.4s cubic-bezier(0.22,1,0.36,1) ${i * 0.06}s both`;
    } else {
      item.classList.remove('active');
      item.style.animation = '';
    }
  });
  setTimeout(() => { observeReveal(); initTilt(); }, 80);
}

let lastBtn = filterBtn[0];
filterBtn.forEach(btn => {
  btn.addEventListener('click', function () {
    selectValue.innerText = this.innerText;
    filterFunc(this.innerText.toLowerCase());
    lastBtn.classList.remove('active'); this.classList.add('active'); lastBtn = this;
  });
});

/* form */
const form       = document.querySelector('[data-form]');
const formInputs = document.querySelectorAll('[data-form-input]');
const formBtn    = document.querySelector('[data-form-btn]');
formInputs.forEach(inp => inp.addEventListener('input', () => formBtn.toggleAttribute('disabled', !form.checkValidity())));

/* navigation */
const navLinks = document.querySelectorAll('[data-nav-link]');
const pages    = document.querySelectorAll('[data-page]');
navLinks.forEach(link => {
  link.addEventListener('click', function () {
    const target = this.innerHTML.toLowerCase();
    runWipe(() => {
      pages.forEach((page, i) => {
        const match = target === page.dataset.page;
        page.classList.toggle('active', match);
        navLinks[i].classList.toggle('active', match);
      });
      window.scrollTo(0, 0);
      setTimeout(() => {
        observeReveal(); initSkillBars(); initTilt();
        splitTextInit(); initMagnetic();
      }, 60);
    });
  });
});
