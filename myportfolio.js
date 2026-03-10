'use strict';

/* ══════════════════════════════════════════════════════════════
   HARSHIT GOYAL — PORTFOLIO ENGINE v4  (all bugs fixed)
══════════════════════════════════════════════════════════════ */


/* ══════════════════════════════════════════════════════════════
   PRELOADER — HG monogram + G-arc progress ring
══════════════════════════════════════════════════════════════ */
(function () {
  const loader = document.getElementById('preloader');
  if (!loader) return;

  // ── Circumference for r=52 circle: 2π×52 ≈ 326.73 ──
  const C = 2 * Math.PI * 52;

  // Inject rich markup (replaces the plain "HG" + bar)
  loader.innerHTML = `
    <div class="pl-bg-grid"></div>

    <div class="pl-scene">
      <!-- Circular arc ring (SVG) -->
      <svg class="pl-ring-svg" viewBox="0 0 120 120" aria-hidden="true">
        <defs>
          <linearGradient id="plGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%"   stop-color="hsl(45,100%,78%)"/>
            <stop offset="100%" stop-color="hsl(35,100%,60%)"/>
          </linearGradient>
        </defs>
        <!-- Track -->
        <circle class="pl-ring-track" cx="60" cy="60" r="52"/>
        <!-- Fill arc — animated via CSS stroke-dashoffset -->
        <circle class="pl-ring-fill" cx="60" cy="60" r="52"
                stroke-dasharray="${C.toFixed(2)}"
                stroke-dashoffset="${C.toFixed(2)}"/>
        <!-- Leading glow dot -->
        <circle class="pl-ring-dot" cx="60" cy="8" r="3.5"/>
      </svg>

      <!-- HG monogram centred inside the ring -->
      <div class="pl-monogram">
        <span class="pl-h">H</span><span class="pl-g">G</span>
      </div>
    </div>

    <!-- Name + subtitle below ring -->
    <div class="pl-name">Harshit Goyal</div>
    <div class="pl-sub">Data Science &nbsp;·&nbsp; ML &nbsp;·&nbsp; AI</div>
  `;
})();

function dismissLoader() {
  const loader = document.getElementById('preloader');
  if (!loader) return;
  setTimeout(() => {
    loader.classList.add('done');
    splitTextInit();
    initRevealObserver();
  }, 1600);   // slightly longer so ring completes before exit
}
if (document.readyState === 'complete') {
  dismissLoader();
} else {
  window.addEventListener('load', dismissLoader);
}


/* ══════════════════════════════════════════════════════════════
   TYPING EFFECT
══════════════════════════════════════════════════════════════ */
const aboutText = "I'm a B.Tech. Information Technology student at Rajasthan Technical University, Kota (CGPA 8.45), with a strong passion for Data Science, Machine Learning, and Generative AI. Currently interning at C-DAC Pune, I work on agricultural yield prediction using NASA + FAOSTAT data, Indian population analysis, and multilingual legal text engineering. I've also built a GPU-accelerated RAG chatbot using LlamaIndex and Mistral-7B that answers questions from Google Drive documents. I love turning complex datasets into meaningful insights and building AI-powered solutions that create real impact.";
const typingText = document.getElementById('typing-text');
let typeIndex = 0;
function typeChar() {
  if (!typingText) return;
  if (typeIndex < aboutText.length) {
    typingText.textContent += aboutText.charAt(typeIndex++);
    setTimeout(typeChar, 16);
  }
}
setTimeout(typeChar, 1200);


/* ══════════════════════════════════════════════════════════════
   PARTICLE CONSTELLATION CANVAS
══════════════════════════════════════════════════════════════ */
(function () {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H;
  const GOLD = 'hsla(45,100%,72%,';
  const BLUE = 'hsla(210,100%,65%,';
  const COUNT = 70, LINK = 130;
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
      this.vx = (Math.random() - 0.5) * 0.4; this.vy = (Math.random() - 0.5) * 0.4;
      this.r = Math.random() * 1.5 + 0.5; this.a = Math.random() * 0.4 + 0.15;
      this.gold = Math.random() > 0.3;
    }
    update() {
      const dx = this.x - mouse.x, dy = this.y - mouse.y, dm = Math.hypot(dx, dy);
      if (dm < 90 && dm > 0) { const f = (90 - dm) / 90 * 0.55; this.vx += dx / dm * f; this.vy += dy / dm * f; }
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
          ctx.strokeStyle = GOLD + (1 - d / LINK) * 0.2 + ')'; ctx.lineWidth = 0.6; ctx.stroke();
        }
      }
      const dm = Math.hypot(p.x - mouse.x, p.y - mouse.y);
      if (dm < LINK * 1.5) {
        ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(mouse.x, mouse.y);
        ctx.strokeStyle = (p.gold ? GOLD : BLUE) + (1 - dm / (LINK * 1.5)) * 0.5 + ')';
        ctx.lineWidth = 0.8; ctx.stroke();
      }
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = (p.gold ? GOLD : BLUE) + p.a + ')'; ctx.fill();
      p.update();
    }
    requestAnimationFrame(frame);
  }
  frame();
})();


/* ══════════════════════════════════════════════════════════════
   SCROLL PROGRESS BAR
══════════════════════════════════════════════════════════════ */
const scrollBar = document.getElementById('scroll-progress');
window.addEventListener('scroll', () => {
  if (!scrollBar) return;
  const max = document.documentElement.scrollHeight - window.innerHeight;
  scrollBar.style.width = (max > 0 ? (window.scrollY / max) * 100 : 0) + '%';
}, { passive: true });


/* ══════════════════════════════════════════════════════════════
   DUAL CURSOR  — FIX: correct id ('cursorDot', not 'cursorGlow')
══════════════════════════════════════════════════════════════ */
(function () {
  const dot  = document.getElementById('cursorDot');   // was 'cursorGlow'
  const ring = document.getElementById('cursorRing');
  if (!dot || !ring) return;
  let dx = 0, dy = 0, rx = 0, ry = 0;
  let tx = window.innerWidth / 2, ty = window.innerHeight / 2;

  document.addEventListener('mousemove', e => { tx = e.clientX; ty = e.clientY; });
  document.addEventListener('mousedown', () => ring.classList.add('clicked'));
  document.addEventListener('mouseup',   () => ring.classList.remove('clicked'));

  const hoverSel = 'a, button, .pf-card, .skill-tag, .cert-item, .service-item, .tools-category, .stat-box';
  document.querySelectorAll(hoverSel).forEach(el => {
    el.addEventListener('mouseenter', () => { dot.classList.add('hovered'); ring.classList.add('hovered'); });
    el.addEventListener('mouseleave', () => { dot.classList.remove('hovered'); ring.classList.remove('hovered'); });
  });

  function loop() {
    dx += (tx - dx) * 0.65; dy += (ty - dy) * 0.65;
    rx += (tx - rx) * 0.10; ry += (ty - ry) * 0.10;
    dot.style.left  = dx + 'px'; dot.style.top  = dy + 'px';
    ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
    requestAnimationFrame(loop);
  }
  loop();
})();


/* ══════════════════════════════════════════════════════════════
   RIPPLE ON CLICK
══════════════════════════════════════════════════════════════ */
document.addEventListener('click', function (e) {
  const t = e.target.closest('button, .pf-card > a, .navbar-link, .cert-item');
  if (!t) return;
  t.style.position = 'relative'; t.style.overflow = 'hidden';
  const r = t.getBoundingClientRect();
  const sz = Math.max(r.width, r.height) * 1.5;
  const dot = document.createElement('span');
  dot.className = 'ripple-dot';
  dot.style.cssText = `width:${sz}px;height:${sz}px;left:${e.clientX - r.left - sz / 2}px;top:${e.clientY - r.top - sz / 2}px;`;
  t.appendChild(dot);
  dot.addEventListener('animationend', () => dot.remove());
});


/* ══════════════════════════════════════════════════════════════
   MAGNETIC BUTTONS
══════════════════════════════════════════════════════════════ */
function initMagnetic() {
  document.querySelectorAll('[data-magnetic]').forEach(el => {
    el.addEventListener('mousemove', e => {
      const r = el.getBoundingClientRect();
      const dx = (e.clientX - (r.left + r.width  / 2)) * 0.36;
      const dy = (e.clientY - (r.top  + r.height / 2)) * 0.36;
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


/* ══════════════════════════════════════════════════════════════
   SPLIT TEXT  — letter-by-letter reveal
══════════════════════════════════════════════════════════════ */
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


/* ══════════════════════════════════════════════════════════════
   TEXT SCRAMBLE on name hover
══════════════════════════════════════════════════════════════ */
(function () {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%';
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


/* ══════════════════════════════════════════════════════════════
   SCROLL REVEAL
══════════════════════════════════════════════════════════════ */
let revObserver;
function initRevealObserver() {
  revObserver = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); revObserver.unobserve(e.target); }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });
  observeReveal();
}
function observeReveal() {
  document.querySelectorAll('.reveal, .reveal-left, .reveal-scale').forEach(el => {
    if (revObserver) revObserver.observe(el);
  });
}
window._reObserve = observeReveal;
initRevealObserver();


/* ══════════════════════════════════════════════════════════════
   SKILL BARS — FIX: --target-width matches CSS variable name
══════════════════════════════════════════════════════════════ */
function initSkillBars() {
  document.querySelectorAll('.skill-progress-fill').forEach(fill => {
    if (!fill.dataset.target) {
      const m = (fill.getAttribute('style') || '').match(/width:\s*([\d.]+%)/);
      if (m) fill.dataset.target = m[1];
    }
    fill.style.removeProperty('width');
    fill.classList.remove('animated');
  });

  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      e.target.querySelectorAll('.skill-progress-fill').forEach((fill, i) => {
        setTimeout(() => {
          fill.style.setProperty('--target-width', fill.dataset.target || '0%');
          fill.classList.add('animated');
        }, i * 150);
      });
      obs.unobserve(e.target);
    });
  }, { threshold: 0.25 });

  document.querySelectorAll('.skills-list').forEach(el => obs.observe(el));
}
initSkillBars();
window._initSkillBars = initSkillBars;


/* ══════════════════════════════════════════════════════════════
   ANIMATED COUNTERS — FIX: reads data-suffix (HTML) not data-suf
══════════════════════════════════════════════════════════════ */
(function () {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el  = e.target;
      const end = parseFloat(el.dataset.count);
      const dec = el.dataset.dec ? +el.dataset.dec :
                  (el.dataset.count.includes('.') ? el.dataset.count.split('.')[1].length : 0);
      const suf = el.dataset.suffix || el.dataset.suf || ''; // FIX: read both attrs
      const start = performance.now();
      function tick(now) {
        const t    = Math.min((now - start) / 1600, 1);
        const ease = 1 - Math.pow(1 - t, 4);
        el.textContent = (end * ease).toFixed(dec) + suf;
        if (t < 1) requestAnimationFrame(tick);
        else { el.textContent = end.toFixed(dec) + suf; el.classList.add('counted'); }
      }
      requestAnimationFrame(tick);
      obs.unobserve(el);
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('[data-count]').forEach(el => obs.observe(el));
})();


/* ══════════════════════════════════════════════════════════════
   3D CARD TILT
══════════════════════════════════════════════════════════════ */
function initTilt() {
  document.querySelectorAll('.pf-card-inner, .pf-featured').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r  = card.getBoundingClientRect();
      const rx = ((e.clientY - r.top  - r.height / 2) / (r.height / 2)) * -6;
      const ry = ((e.clientX - r.left - r.width  / 2) / (r.width  / 2)) *  6;
      card.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg) scale(1.02)`;
      card.style.transition = 'transform 0.1s ease';
    });
    card.addEventListener('mouseleave', () => {
      card.style.transition = 'transform 0.5s cubic-bezier(0.22,1,0.36,1)';
      card.style.transform  = 'perspective(800px) rotateX(0) rotateY(0) scale(1)';
      setTimeout(() => card.style.transition = '', 500);
    });
  });
}
initTilt();
window._initTilt = initTilt;


/* ══════════════════════════════════════════════════════════════
   SIDEBAR PARALLAX
══════════════════════════════════════════════════════════════ */
(function () {
  const sb = document.querySelector('.sidebar');
  if (!sb) return;
  document.addEventListener('mousemove', e => {
    const xP = (e.clientX / window.innerWidth  - 0.5) * 6;
    const yP = (e.clientY / window.innerHeight - 0.5) * 4;
    sb.style.transform  = `translateX(${xP}px) translateY(${yP}px)`;
    sb.style.transition = 'transform 1s cubic-bezier(0.22,1,0.36,1)';
  });
})();


/* ══════════════════════════════════════════════════════════════
   PAGE WIPE TRANSITION
══════════════════════════════════════════════════════════════ */
const wipeEl = document.getElementById('pageWipe');
function runWipe(cb) {
  if (!wipeEl) { cb(); return; }
  wipeEl.classList.remove('leave');
  wipeEl.classList.add('enter');
  setTimeout(() => {
    cb();
    wipeEl.classList.remove('enter');
    wipeEl.classList.add('leave');
    setTimeout(() => wipeEl.classList.remove('leave'), 430);
  }, 400);
}


/* ══════════════════════════════════════════════════════════════
   CORE PORTFOLIO LOGIC
══════════════════════════════════════════════════════════════ */
const elementToggleFunc = el => el.classList.toggle('active');

const sidebar    = document.querySelector('[data-sidebar]');
const sidebarBtn = document.querySelector('[data-sidebar-btn]');
if (sidebarBtn) sidebarBtn.addEventListener('click', () => {
  elementToggleFunc(sidebar);
  // Re-trigger staggered entrance animations each time sidebar is opened
  if (sidebar.classList.contains('active')) {
    const replayEls = sidebar.querySelectorAll('.contact-item, .social-item, .sidebar-info_more .separator');
    replayEls.forEach(el => {
      el.style.animation = 'none';
      el.offsetHeight;          // force reflow — restarts animation
      el.style.animation = '';  // re-arm the CSS @keyframes
    });
  }
});

/* modal */
const testimonialsItem = document.querySelectorAll('[data-testimonials-item]');
const modalContainer   = document.querySelector('[data-modal-container]');
const modalCloseBtn    = document.querySelector('[data-modal-close-btn]');
const overlay          = document.querySelector('[data-overlay]');
const modalImg         = document.querySelector('[data-modal-img]');
const modalTitle       = document.querySelector('[data-modal-title]');
const modalText        = document.querySelector('[data-modal-text]');
const toggleModal      = () => {
  if (modalContainer) modalContainer.classList.toggle('active');
  if (overlay)        overlay.classList.toggle('active');
};
testimonialsItem.forEach(item => {
  item.addEventListener('click', function () {
    if (modalImg)   { modalImg.src = this.querySelector('[data-testimonials-avatar]').src; modalImg.alt = this.querySelector('[data-testimonials-avatar]').alt; }
    if (modalTitle) modalTitle.innerHTML = this.querySelector('[data-testimonials-title]').innerHTML;
    if (modalText)  modalText.innerHTML  = this.querySelector('[data-testimonials-text]').innerHTML;
    toggleModal();
  });
});
if (modalCloseBtn) modalCloseBtn.addEventListener('click', toggleModal);
if (overlay)       overlay.addEventListener('click', toggleModal);


/* ══════════════════════════════════════════════════════════════
   PORTFOLIO FILTER + FEATURED CARD
══════════════════════════════════════════════════════════════ */
const projectData = [
  { idx:0, title:'Crop Yield Prediction &amp; Climate Analysis',
    desc:'Multi-model ML pipeline on NASA + FAOSTAT data to forecast agricultural yield across Indian states. Combines Random Forest, XGBoost and climate regression.',
    tags:['Python','XGBoost','NASA Data','Matplotlib'], badge:'data science',
    link:'https://colab.research.google.com/drive/11_9lmqIMm7xJDoiCLmp3HZDzxtpFGG5P?usp=sharing',
    img:'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=900&q=85' },
  { idx:1, title:'Indian Geographic Population Analysis',
    desc:'EDA on Census 2011 data with district-level heatmaps, density plots, and demographic trend visualizations.',
    tags:['Pandas','Sweetviz','Matplotlib','Power BI'], badge:'data science',
    link:'https://colab.research.google.com/drive/1bXTndwO2oWoxVOADHSSX71iyyYo4I0qH?usp=sharing',
    img:'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=900&q=85' },
  { idx:2, title:'Universal Drive RAG Chatbot',
    desc:'GPU-accelerated RAG pipeline with LlamaIndex + Mistral-7B that reads and answers questions from Google Drive documents.',
    tags:['LlamaIndex','Mistral-7B','HuggingFace','RAG'], badge:'data science',
    link:'https://github.com/Harshu0810/Q-A-with-files',
    img:'https://res.cloudinary.com/dvkp0p3wc/image/upload/v1772554081/unnamed_ivslqr.jpg' },
  { idx:3, title:'Multilingual Legal Judgement Engineering',
    desc:'NLP pipeline for Indian Supreme Court judgements — multilingual tokenization, named-entity extraction, and dataset curation.',
    tags:['NLP','HuggingFace','Python','Dataset'], badge:'data science',
    link:'https://github.com/Harshu0810/indian-kanoon-sci-dataset',
    img:'https://images.unsplash.com/photo-1589998059171-988d887df646?w=900&q=85' },
  { idx:4, title:'Automated Personality Classification',
    desc:'MBTI-based personality predictor using ML + a clean React frontend with detailed personality type breakdown.',
    tags:['Python','React','scikit-learn','Vercel'], badge:'web development',
    link:'https://autopersonal.vercel.app/',
    img:'https://res.cloudinary.com/dvkp0p3wc/image/upload/v1772132141/image_e8c8c9ac_skav80.png' },
  { idx:5, title:'CGPA-SGPA Calculator &amp; Converter',
    desc:'Smart GPA calculator supporting RTU Kota grading system — converts between CGPA, SGPA and percentage with animated results.',
    tags:['HTML','CSS','JavaScript','Vercel'], badge:'web development',
    link:'https://cgpa-scpa-magic-amber.vercel.app/',
    img:'https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?w=900&q=85' },
  { idx:6, title:'AlgoViz — Algorithm Performance Analyzer',
    desc:'Client-side benchmarking tool that visualises sorting & searching algorithm runtime with animated bar charts.',
    tags:['JavaScript','Canvas','HTML','CSS'], badge:'web development',
    link:'https://github.com/Harshu0810/Algorithm-analyzer',
    img:'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=900&q=85' },
  { idx:7, title:'Weather-Check App',
    desc:'Real-time weather app using OpenWeatherMap API — temperature, humidity, wind, and 5-day forecast with animated icons.',
    tags:['Python','API','Gradio','Colab'], badge:'web development',
    link:'https://github.com/Harshu0810/Weather-fetch-colab',
    img:'https://i.postimg.cc/yWvwCj43/weather-APP.jpg' }
];

let featuredIndex = 0;
let featAutoTimer = null;

function setFeatured(idx, animate = true) {
  const p         = projectData[idx];
  const featImg   = document.getElementById('feat-img');
  const featTitle = document.getElementById('feat-title');
  const featDesc  = document.getElementById('feat-desc');
  const featTags  = document.getElementById('feat-tags');
  const featBadge = document.getElementById('feat-badge');
  const featLink  = document.getElementById('feat-link');
  const featDots  = document.querySelectorAll('.pf-dot');
  if (!featImg) return;

  if (animate) {
    const title   = document.querySelector('.pf-featured-title');
    const tags    = document.querySelector('.pf-featured-tags');
    const badge   = document.getElementById('feat-badge');
    const imgWrap = document.querySelector('.pf-featured-img-wrap');

    // Fade out image + slide out text
    if (imgWrap)  { imgWrap.style.opacity = '0.5'; imgWrap.style.transform = 'scale(0.97)'; imgWrap.style.transition = 'opacity .3s ease, transform .3s ease'; }
    [title, tags, badge].forEach(el => { if (el) { el.style.opacity = '0'; el.style.transform = 'translateX(8px)'; el.style.transition = 'opacity .2s ease, transform .2s ease'; } });

    setTimeout(() => {
      updateFeaturedDOM(p, featImg, featTitle, featDesc, featTags, featBadge, featLink, featDots, idx);
      // Slide in new content
      if (imgWrap)  { imgWrap.style.opacity = '1'; imgWrap.style.transform = 'scale(1)'; }
      [document.querySelector('.pf-featured-title'), document.querySelector('.pf-featured-tags'), document.getElementById('feat-badge')]
        .forEach((el, i) => { if (el) { setTimeout(() => { el.style.opacity = '1'; el.style.transform = 'translateX(0)'; }, i * 40); } });
      setTimeout(() => {
        if (imgWrap) { imgWrap.style.transition = ''; imgWrap.style.transform = ''; }
        [document.querySelector('.pf-featured-title'), document.querySelector('.pf-featured-tags'), document.getElementById('feat-badge')]
          .forEach(el => { if (el) { el.style.transition = ''; el.style.transform = ''; } });
      }, 400);
    }, 220);
  } else {
    updateFeaturedDOM(p, featImg, featTitle, featDesc, featTags, featBadge, featLink, featDots, idx);
  }
  featuredIndex = idx;
}

function updateFeaturedDOM(p, featImg, featTitle, featDesc, featTags, featBadge, featLink, featDots, idx) {
  featImg.src           = p.img;
  featImg.alt           = p.title;
  featTitle.innerHTML   = p.title;
  featDesc.textContent  = p.desc;
  featTags.innerHTML    = p.tags.map(t => `<span class="pf-tag">${t}</span>`).join('');
  featBadge.textContent = p.badge === 'data science' ? 'Data Science' : 'Web Dev';
  featBadge.className   = 'pf-badge ' + (p.badge === 'data science' ? 'pf-badge-ds' : 'pf-badge-web');
  featLink.href         = p.link;
  featDots.forEach((d, i) => d.classList.toggle('active', i === idx));
}

function startFeatAuto() {
  clearInterval(featAutoTimer);
  featAutoTimer = setInterval(() => {
    const visible = Array.from(document.querySelectorAll('.pf-card.active'));
    if (!visible.length) return;
    const indices    = visible.map(c => +c.dataset.idx);
    const currentPos = indices.indexOf(featuredIndex);
    const nextIdx    = indices[(currentPos + 1) % indices.length];
    setFeatured(nextIdx);
  }, 4000);
}

document.querySelectorAll('.pf-card').forEach(card => {
  card.addEventListener('mouseenter', () => { clearInterval(featAutoTimer); setFeatured(+card.dataset.idx); });
  card.addEventListener('mouseleave', () => startFeatAuto());
});
document.querySelectorAll('.pf-dot').forEach(dot => {
  dot.addEventListener('click', () => { clearInterval(featAutoTimer); setFeatured(+dot.dataset.idx); startFeatAuto(); });
});

const filterBtns  = document.querySelectorAll('[data-filter-btn]');
const selectEl    = document.querySelector('[data-select]');
const selectValue = document.querySelector('[data-selecct-value]');
const selectItems = document.querySelectorAll('[data-select-item]');
if (selectEl) selectEl.addEventListener('click', () => elementToggleFunc(selectEl));
selectItems.forEach(item => {
  item.addEventListener('click', function () {
    if (selectValue) selectValue.innerText = this.innerText;
    elementToggleFunc(selectEl);
    runFilter(this.innerText.toLowerCase());
  });
});

function runFilter(val) {
  let count = 0;
  document.querySelectorAll('.pf-card').forEach(card => {
    const show = val === 'all' || card.dataset.category === val;
    card.classList.toggle('active', show);
    if (show) { card.style.animationDelay = (count * 0.07) + 's'; count++; }
  });
  document.querySelectorAll('.pf-dot').forEach(dot => {
    const card = document.querySelector(`.pf-card[data-idx="${dot.dataset.idx}"]`);
    dot.style.display = (card && card.classList.contains('active')) ? '' : 'none';
  });
  const first = document.querySelector('.pf-card.active');
  if (first) { setFeatured(+first.dataset.idx, false); startFeatAuto(); }
  setTimeout(() => { observeReveal(); initTilt(); }, 80);
}

let lastFilterBtn = filterBtns[0];
filterBtns.forEach(btn => {
  btn.addEventListener('click', function () {
    const val = (this.dataset.pfFilter || this.innerText).toLowerCase().trim();
    runFilter(val);
    if (lastFilterBtn) lastFilterBtn.classList.remove('active');
    this.classList.add('active');
    lastFilterBtn = this;
    if (selectValue) selectValue.innerText = this.innerText;
  });
});

// Featured strip removed — no label injection needed

setFeatured(0, false);
// startFeatAuto disabled — featured strip is hidden


/* ══════════════════════════════════════════════════════════════
   CONTACT FORM
══════════════════════════════════════════════════════════════ */
const form       = document.querySelector('[data-form]');
const formInputs = document.querySelectorAll('[data-form-input]');
const formBtn    = document.querySelector('[data-form-btn]');
if (form && formBtn) {
  formInputs.forEach(inp => inp.addEventListener('input', () => formBtn.toggleAttribute('disabled', !form.checkValidity())));
}


/* ══════════════════════════════════════════════════════════════
   NAVIGATION
══════════════════════════════════════════════════════════════ */
const navLinks = document.querySelectorAll('[data-nav-link]');
const pages    = document.querySelectorAll('[data-page]');

navLinks.forEach(link => {
  link.addEventListener('click', function () {
    const target = this.innerHTML.trim().toLowerCase();
    runWipe(() => {
      pages.forEach((page, i) => {
        const match = target === page.dataset.page;
        page.classList.toggle('active', match);
        if (navLinks[i]) navLinks[i].classList.toggle('active', match);
      });
      window.scrollTo({ top: 0, behavior: 'instant' });
      setTimeout(() => {
        observeReveal();
        initSkillBars();
        initTilt();
        splitTextInit();
        initMagnetic();
      }, 60);
    });
  });
});
