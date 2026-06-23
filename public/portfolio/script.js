/* ═══════════════════════════════════════════════════
   CHANDRU G — PORTFOLIO  |  script.js
   Features: Canvas particles, typing anim, scroll
   reveal, skill bars, stat counters, form validation
   ═══════════════════════════════════════════════════ */

'use strict';

/* ── 1. CANVAS BACKGROUND ─────────────────────────── */
(function initCanvas() {
  const canvas = document.getElementById('heroCanvas');
  const ctx    = canvas.getContext('2d');

  let W, H, nodes = [], animId;

  const NODE_COUNT = 80;
  const MAX_DIST   = 130;
  const CYAN       = '0, 212, 255';
  const PURPLE     = '124, 58, 237';

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function createNode() {
    return {
      x:  Math.random() * W,
      y:  Math.random() * H,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      r:  Math.random() * 2 + 1,
      hue: Math.random() > 0.5 ? CYAN : PURPLE,
    };
  }

  function initNodes() {
    nodes = Array.from({ length: NODE_COUNT }, createNode);
  }

  function drawNode(n) {
    ctx.beginPath();
    ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${n.hue}, 0.7)`;
    ctx.fill();
  }

  function drawLine(a, b, dist) {
    const alpha = (1 - dist / MAX_DIST) * 0.25;
    const grad  = ctx.createLinearGradient(a.x, a.y, b.x, b.y);
    grad.addColorStop(0, `rgba(${a.hue}, ${alpha})`);
    grad.addColorStop(1, `rgba(${b.hue}, ${alpha})`);
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.strokeStyle = grad;
    ctx.lineWidth   = 0.8;
    ctx.stroke();
  }

  function tick() {
    ctx.clearRect(0, 0, W, H);

    /* faint radial overlay */
    const overlay = ctx.createRadialGradient(W*0.5, H*0.5, 0, W*0.5, H*0.5, W*0.7);
    overlay.addColorStop(0, 'rgba(0,212,255,0.02)');
    overlay.addColorStop(1, 'transparent');
    ctx.fillStyle = overlay;
    ctx.fillRect(0, 0, W, H);

    nodes.forEach((n, i) => {
      n.x += n.vx;
      n.y += n.vy;
      if (n.x < 0 || n.x > W) n.vx *= -1;
      if (n.y < 0 || n.y > H) n.vy *= -1;

      drawNode(n);

      for (let j = i + 1; j < nodes.length; j++) {
        const b  = nodes[j];
        const dx = n.x - b.x, dy = n.y - b.y;
        const d  = Math.sqrt(dx*dx + dy*dy);
        if (d < MAX_DIST) drawLine(n, b, d);
      }
    });

    animId = requestAnimationFrame(tick);
  }

  window.addEventListener('resize', () => {
    resize();
    initNodes();
  });

  resize();
  initNodes();
  tick();
})();

/* ── 2. NAVBAR SCROLL EFFECT ─────────────────────── */
(function initNavbar() {
  const navbar = document.getElementById('navbar');
  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

/* ── 3. HAMBURGER MENU ───────────────────────────── */
(function initMenu() {
  const btn  = document.getElementById('hamburger');
  const menu = document.getElementById('mobileMenu');
  const links = menu.querySelectorAll('.mob-link');

  function close() {
    btn.classList.remove('open');
    menu.classList.remove('open');
    document.body.style.overflow = '';
  }

  btn.addEventListener('click', () => {
    const isOpen = menu.classList.toggle('open');
    btn.classList.toggle('open', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  links.forEach(l => l.addEventListener('click', close));
})();

/* ── 4. TYPING ANIMATION ─────────────────────────── */
(function initTyping() {
  const el = document.getElementById('typedText');
  let roles = ['Full Stack Developer', 'Backend Engineer', 'Freelance Developer', 'API Specialist', 'Web Architect'];
  let roleIdx = 0, charIdx = 0, deleting = false;
  let timerId = null;
  const SPEED = 110, PAUSE = 1500, SWITCH = 300;

  function type() {
    const role = roles[roleIdx];
    if (!deleting) {
      charIdx++;
      el.textContent = role.slice(0, charIdx);
      if (charIdx === role.length) { deleting = true; timerId = setTimeout(type, PAUSE); return; }
    } else {
      charIdx--;
      el.textContent = role.slice(0, charIdx);
      if (charIdx === 0) { deleting = false; roleIdx = (roleIdx + 1) % roles.length; timerId = setTimeout(type, SWITCH); return; }
    }
    timerId = setTimeout(type, SPEED);
  }

  // Expose restart function for dynamic role updates
  window._typingRestart = function(newRoles) {
    if (timerId) clearTimeout(timerId);
    roles = newRoles;
    roleIdx = 0; charIdx = 0; deleting = false;
    el.textContent = '';
    type();
  };

  type();
})();

/* ── 5. SCROLL REVEAL ────────────────────────────── */
(function initReveal() {
  const els = document.querySelectorAll('.reveal, .reveal-right');

  function check() {
    const trigger = window.innerHeight * 0.88;
    els.forEach(el => {
      if (el.getBoundingClientRect().top < trigger) {
        el.classList.add('visible');
      }
    });
  }

  window.addEventListener('scroll', check, { passive: true });
  check();
})();

/* ── 6. SKILL BAR ANIMATION ──────────────────────── */
(function initSkillBars() {
  const fills = document.querySelectorAll('.skill-fill');
  let animated = false;

  function animateBars() {
    fills.forEach(fill => {
      fill.style.width = fill.dataset.width + '%';
    });
    animated = true;
  }

  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting && !animated) animateBars();
    });
  }, { threshold: 0.2 });

  const section = document.getElementById('skills');
  if (section) observer.observe(section);
})();

/* ── 7. STAT COUNTERS ────────────────────────────── */
(function initCounters() {
  const items = document.querySelectorAll('.stat-number');
  let started = false;

  function easeOut(t) { return 1 - Math.pow(1 - t, 3); }

  function animateCounter(el) {
    const target   = parseInt(el.dataset.target, 10);
    const duration = 1800;
    const start    = performance.now();

    function step(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      el.textContent = Math.round(easeOut(progress) * target);
      if (progress < 1) requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
  }

  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting && !started) {
        started = true;
        items.forEach(animateCounter);
      }
    });
  }, { threshold: 0.4 });

  const section = document.getElementById('stats');
  if (section) observer.observe(section);
})();

/* ── 8. FORM VALIDATION ──────────────────────────── */
function handleSubmit() {
  const nameEl    = document.getElementById('name');
  const emailEl   = document.getElementById('email');
  const phoneEl   = document.getElementById('phone');
  const projectEl = document.getElementById('project');
  const nameErr   = document.getElementById('nameError');
  const emailErr  = document.getElementById('emailError');
  const phoneErr  = document.getElementById('phoneError');
  const projectErr= document.getElementById('projectError');
  const msgEl     = document.getElementById('formMsg');
  const submitBtn = document.getElementById('submitBtn');

  let valid = true;

  /* reset */
  [nameEl, emailEl, phoneEl, projectEl].forEach(el => el.classList.remove('error'));
  [nameErr, emailErr, phoneErr, projectErr].forEach(el => el.textContent = '');
  msgEl.style.display = 'none';

  /* name */
  if (nameEl.value.trim().length < 2) {
    nameEl.classList.add('error');
    nameErr.textContent = 'Please enter your full name.';
    valid = false;
  }

  /* email */
  const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRx.test(emailEl.value.trim())) {
    emailEl.classList.add('error');
    emailErr.textContent = 'Enter a valid email address.';
    valid = false;
  }

  /* phone — optional but validate format if provided */
  const phoneVal = phoneEl ? phoneEl.value.trim() : '';
  if (phoneVal && phoneVal.replace(/[\s\+\-\(\)]/g, '').length < 7) {
    phoneEl.classList.add('error');
    phoneErr.textContent = 'Enter a valid contact number (min 7 digits).';
    valid = false;
  }

  /* project */
  if (projectEl.value.trim().length < 20) {
    projectEl.classList.add('error');
    projectErr.textContent = 'Please describe your project in at least 20 characters.';
    valid = false;
  }

  if (!valid) return;

  submitBtn.textContent = 'Sending…';
  submitBtn.disabled    = true;

  fetch('/api/contact', {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name:    nameEl.value.trim(),
      email:   emailEl.value.trim(),
      phone:   phoneVal,
      project: projectEl.value.trim()
    })
  })
  .then(r => r.json())
  .then(data => {
    if (data.success) {
      msgEl.className   = 'form-msg success';
      msgEl.textContent = '✅ ' + data.message;
      msgEl.style.display = 'block';
      nameEl.value = emailEl.value = projectEl.value = '';
      if (phoneEl) phoneEl.value = '';
    } else {
      throw new Error(data.error || 'Failed to send');
    }
  })
  .catch(err => {
    msgEl.className   = 'form-msg error';
    msgEl.textContent = '❌ ' + err.message;
    msgEl.style.display = 'block';
  })
  .finally(() => {
    submitBtn.textContent = 'Send Message →';
    submitBtn.disabled    = false;
  });
}

/* ── 9. SMOOTH ACTIVE NAV HIGHLIGHT ─────────────── */
(function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');

  function onScroll() {
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 140) current = sec.id;
    });
    navLinks.forEach(a => {
      a.style.color = a.getAttribute('href') === `#${current}` ? 'var(--cyan)' : '';
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
})();
/* ── 10. TESTIMONIALS ────────────────────────────── */
(function initTestimonials() {
  async function loadTestimonials() {
    const grid = document.getElementById('testimonialsGrid');
    if (!grid) return;
    try {
      const res     = await fetch('/api/reviews');
      const reviews = await res.json();
      if (!reviews.length) {
        grid.innerHTML = '<div class="testimonials-empty">No reviews yet. Be the first to leave one!</div>';
        return;
      }
      grid.innerHTML = reviews.map(r => {
        const stars    = Array.from({ length: 5 }, (_, i) =>
          `<span class="${i < r.rating ? 'star-filled' : 'star-empty'}">★</span>`
        ).join('');
        const initials = (r.name || '?').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
        const company  = r.company ? `<div class="testimonial-company">${esc(r.company)}</div>` : '';
        return `
          <div class="testimonial-card reveal">
            <div class="testimonial-stars">${stars}</div>
            <p class="testimonial-message">${esc(r.message)}</p>
            <div class="testimonial-author">
              <div class="testimonial-avatar">${initials}</div>
              <div>
                <div class="testimonial-name">${esc(r.name)}</div>
                ${company}
              </div>
            </div>
          </div>`;
      }).join('');
      /* trigger reveal for dynamically added cards */
      document.querySelectorAll('.testimonial-card.reveal').forEach(el => {
        if (el.getBoundingClientRect().top < window.innerHeight * 0.88) {
          el.classList.add('visible');
        }
      });
    } catch {
      grid.innerHTML = '<div class="testimonials-empty">Could not load reviews.</div>';
    }
  }

  function esc(str) {
    return String(str || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  loadTestimonials();
})();

/* ── 11. REVIEW MODAL ────────────────────────────── */
let selectedRating = 0;

function openReviewModal() {
  document.getElementById('reviewModalOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
  resetReviewForm();
}

function closeReviewModal(e) {
  if (e && e.target !== document.getElementById('reviewModalOverlay') && !e.target.classList.contains('review-modal-close')) return;
  if (!e) {
    document.getElementById('reviewModalOverlay').classList.remove('open');
    document.body.style.overflow = '';
    return;
  }
  document.getElementById('reviewModalOverlay').classList.remove('open');
  document.body.style.overflow = '';
}

function resetReviewForm() {
  ['reviewName','reviewCompany','reviewMessage'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
  ['reviewNameError','reviewRatingError','reviewMessageError'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = '';
  });
  const msg = document.getElementById('reviewFormMsg');
  if (msg) { msg.style.display = 'none'; msg.textContent = ''; }
  selectedRating = 0;
  updateStars(0);
  const btn = document.getElementById('reviewSubmitBtn');
  if (btn) { btn.textContent = 'Submit Review →'; btn.disabled = false; }
}

function updateStars(val) {
  document.querySelectorAll('#starRating .star').forEach((s, i) => {
    s.classList.toggle('selected', i < val);
    s.classList.remove('hovered');
  });
}

/* Star interactions */
document.addEventListener('DOMContentLoaded', () => {
  const stars = document.querySelectorAll('#starRating .star');
  stars.forEach(s => {
    s.addEventListener('mouseover', () => {
      const v = parseInt(s.dataset.val);
      stars.forEach((st, i) => st.classList.toggle('hovered', i < v));
    });
    s.addEventListener('mouseleave', () => {
      stars.forEach(st => st.classList.remove('hovered'));
    });
    s.addEventListener('click', () => {
      selectedRating = parseInt(s.dataset.val);
      updateStars(selectedRating);
    });
  });

  /* Close modal on Escape */
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeReviewModal();
  });
});

async function submitReview() {
  const nameEl    = document.getElementById('reviewName');
  const msgEl     = document.getElementById('reviewMessage');
  const nameErr   = document.getElementById('reviewNameError');
  const ratingErr = document.getElementById('reviewRatingError');
  const msgErr    = document.getElementById('reviewMessageError');
  const formMsg   = document.getElementById('reviewFormMsg');
  const btn       = document.getElementById('reviewSubmitBtn');

  /* reset errors */
  [nameErr, ratingErr, msgErr].forEach(el => { if (el) el.textContent = ''; });
  if (formMsg) formMsg.style.display = 'none';

  let valid = true;
  if (!nameEl.value.trim() || nameEl.value.trim().length < 2) {
    nameErr.textContent = 'Please enter your name.'; valid = false;
  }
  if (!selectedRating) {
    ratingErr.textContent = 'Please select a star rating.'; valid = false;
  }
  if (!msgEl.value.trim() || msgEl.value.trim().length < 10) {
    msgErr.textContent = 'Review must be at least 10 characters.'; valid = false;
  }
  if (!valid) return;

  btn.textContent = 'Submitting…';
  btn.disabled    = true;

  try {
    const res  = await fetch('/api/reviews', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name:    nameEl.value.trim(),
        company: document.getElementById('reviewCompany').value.trim(),
        rating:  selectedRating,
        message: msgEl.value.trim()
      })
    });
    const data = await res.json();
    if (data.success) {
      formMsg.className   = 'form-msg success';
      formMsg.textContent = '✅ ' + data.message;
      formMsg.style.display = 'block';
      nameEl.value = '';
      document.getElementById('reviewCompany').value = '';
      msgEl.value  = '';
      selectedRating = 0;
      updateStars(0);
      btn.textContent = 'Submitted!';
      setTimeout(() => closeReviewModal(), 2800);
    } else {
      throw new Error(data.error || 'Submission failed');
    }
  } catch (err) {
    formMsg.className   = 'form-msg error';
    formMsg.textContent = '❌ ' + err.message;
    formMsg.style.display = 'block';
    btn.textContent = 'Submit Review →';
    btn.disabled    = false;
  }
}
