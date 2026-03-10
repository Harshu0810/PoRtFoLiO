'use strict';

/* ═══════════════════════════════════════════
   TYPING EFFECT
═══════════════════════════════════════════ */
const text = "I'm a B.Tech. Information Technology student at Rajasthan Technical University, Kota (CGPA 8.45), with a strong passion for Data Science, Machine Learning, and Generative AI. Currently interning at C-DAC Pune, I work on agricultural yield prediction using NASA + FAOSTAT data, Indian population analysis, and multilingual legal text engineering. I've also built a GPU-accelerated RAG chatbot using LlamaIndex and Mistral-7B that answers questions from Google Drive documents. I love turning complex datasets into meaningful insights and building AI-powered solutions that create real impact.";
const typingText = document.getElementById('typing-text');
const cursor = document.getElementById('cursor');
let index = 0;
function type() {
  if (index < text.length) {
    typingText.textContent += text.charAt(index);
    index++;
    setTimeout(type, 18);
  }
}
type();


/* ═══════════════════════════════════════════
   PARTICLE CANVAS BACKGROUND
═══════════════════════════════════════════ */
(function () {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, particles = [], mouse = { x: -999, y: -999 };
  const PARTICLE_COUNT = 70;
  const MAX_DIST = 130;
  const GOLD = 'hsla(45,100%,72%,';

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  document.addEventListener('mousemove', e => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });
  document.addEventListener('mouseleave', () => { mouse.x = -999; mouse.y = -999; });

  function Particle() {
    this.reset();
  }
  Particle.prototype.reset = function () {
    this.x  = Math.random() * W;
    this.y  = Math.random() * H;
    this.vx = (Math.random() - 0.5) * 0.4;
    this.vy = (Math.random() - 0.5) * 0.4;
    this.r  = Math.random() * 1.8 + 0.6;
    this.a  = Math.random() * 0.5 + 0.2;
  };
  Particle.prototype.update = function () {
    this.x += this.vx;
    this.y += this.vy;
    if (this.x < 0 || this.x > W) this.vx *= -1;
    if (this.y < 0 || this.y > H) this.vy *= -1;
  };

  for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(new Particle());

  function dist(a, b) {
    return Math.hypot(a.x - b.x, a.y - b.y);
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    // Draw connecting lines
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const d = dist(particles[i], particles[j]);
        if (d < MAX_DIST) {
          const alpha = (1 - d / MAX_DIST) * 0.25;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = GOLD + alpha + ')';
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
      // Mouse connections
      const dm = Math.hypot(particles[i].x - mouse.x, particles[i].y - mouse.y);
      if (dm < MAX_DIST * 1.4) {
        const alpha = (1 - dm / (MAX_DIST * 1.4)) * 0.5;
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(mouse.x, mouse.y);
        ctx.strokeStyle = GOLD + alpha + ')';
        ctx.lineWidth = 0.9;
        ctx.stroke();
      }
    }

    // Draw particles
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = GOLD + p.a + ')';
      ctx.fill();
      p.update();
    });

    requestAnimationFrame(draw);
  }
  draw();
})();


/* ═══════════════════════════════════════════
   CUSTOM CURSOR GLOW
═══════════════════════════════════════════ */
(function () {
  const cursor = document.getElementById('cursorGlow');
  if (!cursor) return;
  let cx = 0, cy = 0, tx = 0, ty = 0;
  document.addEventListener('mousemove', e => { tx = e.clientX; ty = e.clientY; });
  function animateCursor() {
    cx += (tx - cx) * 0.18;
    cy += (ty - cy) * 0.18;
    cursor.style.left = cx + 'px';
    cursor.style.top  = cy + 'px';
    requestAnimationFrame(animateCursor);
  }
  animateCursor();
  // Expand on interactive elements
  document.querySelectorAll('a, button, .project-item, .skill-tag, .cert-item').forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.style.width  = '40px';
      cursor.style.height = '40px';
    });
    el.addEventListener('mouseleave', () => {
      cursor.style.width  = '20px';
      cursor.style.height = '20px';
    });
  });
})();


/* ═══════════════════════════════════════════
   SCROLL REVEAL (IntersectionObserver)
═══════════════════════════════════════════ */
(function () {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  function observeAll() {
    document.querySelectorAll('.reveal').forEach(el => {
      observer.observe(el);
    });
  }
  observeAll();

  // Re-observe when switching pages
  window._revealObserver = observer;
  window._reObserve = observeAll;
})();


/* ═══════════════════════════════════════════
   SKILL BAR ANIMATION (scroll-triggered)
═══════════════════════════════════════════ */
(function () {
  // Store original target widths from data-target attribute on first run
  document.querySelectorAll('.skill-progress-fill').forEach(fill => {
    if (!fill.dataset.target) {
      // fallback: read from inline style if data-target not set
      const m = fill.getAttribute('style') && fill.getAttribute('style').match(/width:\s*([\d.]+%)/);
      if (m) fill.dataset.target = m[1];
    }
    fill.style.width = '0';
    fill.classList.remove('animated');
  });

  function initSkillBars() {
    // Reset all bars
    document.querySelectorAll('.skill-progress-fill').forEach(fill => {
      fill.style.width = '0';
      fill.classList.remove('animated');
    });

    const barObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const fills = entry.target.querySelectorAll('.skill-progress-fill');
          fills.forEach((fill, i) => {
            setTimeout(() => {
              fill.style.setProperty('--target-width', fill.dataset.target || '0%');
              fill.classList.add('animated');
            }, i * 130);
          });
          barObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    document.querySelectorAll('.skills-list').forEach(el => barObserver.observe(el));
  }
  initSkillBars();
  window._initSkillBars = initSkillBars;
})();


/* ═══════════════════════════════════════════
   PROJECT CARD 3D TILT
═══════════════════════════════════════════ */
(function () {
  function initTilt() {
    document.querySelectorAll('.project-item > a').forEach(card => {
      card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const cx = rect.width  / 2;
        const cy = rect.height / 2;
        const rotX = ((y - cy) / cy) * -6;
        const rotY = ((x - cx) / cx) * 6;
        card.style.transform = `perspective(600px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(1.02)`;
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(600px) rotateX(0) rotateY(0) scale(1)';
      });
    });
  }
  initTilt();
  window._initTilt = initTilt;
})();


/* ═══════════════════════════════════════════
   SIDEBAR TOGGLE
═══════════════════════════════════════════ */
const elementToggleFunc = function (elem) { elem.classList.toggle("active"); };
const sidebar    = document.querySelector("[data-sidebar]");
const sidebarBtn = document.querySelector("[data-sidebar-btn]");
sidebarBtn.addEventListener("click", function () { elementToggleFunc(sidebar); });


/* ═══════════════════════════════════════════
   MODAL (dummy — needed for JS not to error)
═══════════════════════════════════════════ */
const testimonialsItem = document.querySelectorAll("[data-testimonials-item]");
const modalContainer   = document.querySelector("[data-modal-container]");
const modalCloseBtn    = document.querySelector("[data-modal-close-btn]");
const overlay          = document.querySelector("[data-overlay]");
const modalImg         = document.querySelector("[data-modal-img]");
const modalTitle       = document.querySelector("[data-modal-title]");
const modalText        = document.querySelector("[data-modal-text]");

const testimonialsModalFunc = function () {
  modalContainer.classList.toggle("active");
  overlay.classList.toggle("active");
};
for (let i = 0; i < testimonialsItem.length; i++) {
  testimonialsItem[i].addEventListener("click", function () {
    modalImg.src   = this.querySelector("[data-testimonials-avatar]").src;
    modalImg.alt   = this.querySelector("[data-testimonials-avatar]").alt;
    modalTitle.innerHTML = this.querySelector("[data-testimonials-title]").innerHTML;
    modalText.innerHTML  = this.querySelector("[data-testimonials-text]").innerHTML;
    testimonialsModalFunc();
  });
}
modalCloseBtn.addEventListener("click", testimonialsModalFunc);
overlay.addEventListener("click", testimonialsModalFunc);


/* ═══════════════════════════════════════════
   PORTFOLIO FILTER
═══════════════════════════════════════════ */
const select      = document.querySelector("[data-select]");
const selectItems = document.querySelectorAll("[data-select-item]");
const selectValue = document.querySelector("[data-selecct-value]");
const filterBtn   = document.querySelectorAll("[data-filter-btn]");
const filterItems = document.querySelectorAll("[data-filter-item]");

select.addEventListener("click", function () { elementToggleFunc(this); });

for (let i = 0; i < selectItems.length; i++) {
  selectItems[i].addEventListener("click", function () {
    let selectedValue = this.innerText.toLowerCase();
    selectValue.innerText = this.innerText;
    elementToggleFunc(select);
    filterFunc(selectedValue);
  });
}

const filterFunc = function (selectedValue) {
  for (let i = 0; i < filterItems.length; i++) {
    if (selectedValue === "all") {
      filterItems[i].classList.add("active");
    } else if (selectedValue === filterItems[i].dataset.category) {
      filterItems[i].classList.add("active");
    } else {
      filterItems[i].classList.remove("active");
    }
  }
  // Re-observe new items after filter
  if (window._reObserve) window._reObserve();
  if (window._initTilt)   window._initTilt();
};

let lastClickedBtn = filterBtn[0];
for (let i = 0; i < filterBtn.length; i++) {
  filterBtn[i].addEventListener("click", function () {
    let selectedValue = this.innerText.toLowerCase();
    selectValue.innerText = this.innerText;
    filterFunc(selectedValue);
    lastClickedBtn.classList.remove("active");
    this.classList.add("active");
    lastClickedBtn = this;
  });
}


/* ═══════════════════════════════════════════
   CONTACT FORM
═══════════════════════════════════════════ */
const form       = document.querySelector("[data-form]");
const formInputs = document.querySelectorAll("[data-form-input]");
const formBtn    = document.querySelector("[data-form-btn]");

for (let i = 0; i < formInputs.length; i++) {
  formInputs[i].addEventListener("input", function () {
    if (form.checkValidity()) {
      formBtn.removeAttribute("disabled");
    } else {
      formBtn.setAttribute("disabled", "");
    }
  });
}


/* ═══════════════════════════════════════════
   PAGE NAVIGATION
═══════════════════════════════════════════ */
const navigationLinks = document.querySelectorAll("[data-nav-link]");
const pages           = document.querySelectorAll("[data-page]");

for (let i = 0; i < navigationLinks.length; i++) {
  navigationLinks[i].addEventListener("click", function () {
    for (let j = 0; j < pages.length; j++) {
      if (this.innerHTML.toLowerCase() === pages[j].dataset.page) {
        pages[j].classList.add("active");
        navigationLinks[j].classList.add("active");
        window.scrollTo(0, 0);
        // Re-trigger reveals and skill bars on new page
        setTimeout(() => {
          if (window._reObserve)     window._reObserve();
          if (window._initSkillBars) window._initSkillBars();
          if (window._initTilt)      window._initTilt();
        }, 50);
      } else {
        pages[j].classList.remove("active");
        navigationLinks[j].classList.remove("active");
      }
    }
  });
}
