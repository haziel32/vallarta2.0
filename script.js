/* ── 1. Navbar ──────────────────────────────────────────── */
const navbar    = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const navLinks  = document.getElementById('navLinks');

function handleNavbar() {
  window.scrollY > 60
    ? navbar.classList.add('scrolled')
    : navbar.classList.remove('scrolled');
}

navToggle.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  navToggle.classList.toggle('open', isOpen);
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.classList.remove('open');
    document.body.style.overflow = '';
  });
});

document.addEventListener('click', (e) => {
  if (!navbar.contains(e.target) && navLinks.classList.contains('open')) {
    navLinks.classList.remove('open');
    navToggle.classList.remove('open');
    document.body.style.overflow = '';
  }
});

/* ── 2. Parallax Hero ───────────────────────────────────── */
const heroBg = document.querySelector('.hero-bg');

function handleParallax() {
  if (!heroBg) return;
  const scrolled = window.scrollY;
  const heroHeight = document.getElementById('hero').offsetHeight;
  if (scrolled < heroHeight) {
    heroBg.style.transform = `translateY(${scrolled * 0.3}px)`;
  }
}

/* ── 3. Reveal on scroll ────────────────────────────────── */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ── 4. Back to Top ─────────────────────────────────────── */
const backTop = document.getElementById('backTop');

function handleBackTop() {
  window.scrollY > 600
    ? backTop.classList.add('show')
    : backTop.classList.remove('show');
}

backTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ── 5. Scroll loop (rAF) ───────────────────────────────── */
let ticking = false;
window.addEventListener('scroll', () => {
  if (!ticking) {
    window.requestAnimationFrame(() => {
      handleNavbar();
      handleParallax();
      handleBackTop();
      updateActiveNav();
      ticking = false;
    });
    ticking = true;
  }
}, { passive: true });
handleNavbar();

/* ── 6. Lightbox ────────────────────────────────────────── */
const lightbox      = document.getElementById('lightbox');
const lightboxImg   = document.getElementById('lightboxImg');
const lightboxCap   = document.getElementById('lightboxCaption');
const lightboxClose = document.getElementById('lightboxClose');
const lightboxPrev  = document.getElementById('lightboxPrev');
const lightboxNext  = document.getElementById('lightboxNext');
const galleryItems  = Array.from(document.querySelectorAll('.gallery-item'));
let currentIndex    = 0;

function openLightbox(index) {
  currentIndex = index;
  const img = galleryItems[index].querySelector('img');
  const cap = galleryItems[index].querySelector('.gallery-caption');
  lightboxImg.src = img.src;
  lightboxImg.alt = img.alt;
  lightboxCap.textContent = cap ? cap.textContent.trim() : '';
  lightbox.classList.add('active');
  document.body.style.overflow = 'hidden';
}
function closeLightbox() {
  lightbox.classList.remove('active');
  document.body.style.overflow = '';
}
function showPrev() { openLightbox((currentIndex - 1 + galleryItems.length) % galleryItems.length); }
function showNext() { openLightbox((currentIndex + 1) % galleryItems.length); }

galleryItems.forEach((item, i) => item.addEventListener('click', () => openLightbox(i)));
lightboxClose.addEventListener('click', closeLightbox);
lightboxPrev.addEventListener('click', showPrev);
lightboxNext.addEventListener('click', showNext);
lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });

document.addEventListener('keydown', (e) => {
  if (!lightbox.classList.contains('active')) return;
  if (e.key === 'Escape')     closeLightbox();
  if (e.key === 'ArrowLeft')  showPrev();
  if (e.key === 'ArrowRight') showNext();
});

let touchStartX = 0;
lightbox.addEventListener('touchstart', (e) => { touchStartX = e.changedTouches[0].screenX; }, { passive: true });
lightbox.addEventListener('touchend',   (e) => {
  const delta = e.changedTouches[0].screenX - touchStartX;
  if (Math.abs(delta) > 50) delta < 0 ? showNext() : showPrev();
}, { passive: true });

/* ── 7. Formulario → WhatsApp ───────────────────────────── */
const form        = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');

if (form) {
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    let valid = true;

    form.querySelectorAll('[required]').forEach(field => {
      field.classList.remove('error');
      if (!field.value.trim()) { field.classList.add('error'); valid = false; }
    });

    const emailField = form.querySelector('#email');
    if (emailField?.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailField.value)) {
      emailField.classList.add('error'); valid = false;
    }
    if (!valid) return;

    const nombre  = form.querySelector('#nombre').value.trim();
    const tel     = form.querySelector('#telefono').value.trim();
    const email   = form.querySelector('#email').value.trim();
    const interes = form.querySelector('#interes').value;
    const mensaje = form.querySelector('#mensaje').value.trim();

    const waMsg = encodeURIComponent(
      `Hola, me interesa el departamento en Puerto Vallarta.\n\n` +
      `👤 Nombre: ${nombre}\n📞 Teléfono: ${tel}\n✉️ Email: ${email}\n` +
      `💼 Interés: ${interes || 'No especificado'}\n` +
      (mensaje ? `💬 Mensaje: ${mensaje}` : '')
    );

    const btn = form.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.textContent = 'Enviando…';

    setTimeout(() => {
      formSuccess.classList.add('show');
      form.reset();
      btn.disabled = false;
      btn.textContent = 'Enviar solicitud';
      setTimeout(() => window.open(`https://wa.me/523311854720?text=${waMsg}`, '_blank'), 1000);
    }, 800);
  });

  form.querySelectorAll('input, select, textarea').forEach(f => {
    f.addEventListener('input', () => f.classList.remove('error'));
  });
}

/* ── 8. Smooth scroll ───────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    const target = document.querySelector(link.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const top = target.getBoundingClientRect().top + window.scrollY - navbar.offsetHeight - 16;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* ── 9. Contador animado ────────────────────────────────── */
function animateCounter(el, target) {
  const start = performance.now();
  const duration = 1200;
  (function step(now) {
    const p = Math.min((now - start) / duration, 1);
    el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
    if (p < 1) requestAnimationFrame(step);
  })(start);
}

const statsBar = document.querySelector('.stats-bar');
let statsAnimated = false;
if (statsBar) {
  new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !statsAnimated) {
      statsAnimated = true;
      const valores = [92, 2, 1, 6];
      statsBar.querySelectorAll('.stat-num').forEach((el, i) => animateCounter(el, valores[i]));
    }
  }, { threshold: 0.5 }).observe(statsBar);
}

/* ── 10. Nav link activo ────────────────────────────────── */
const sections   = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

function updateActiveNav() {
  const pos = window.scrollY + navbar.offsetHeight + 80;
  sections.forEach(sec => {
    if (pos >= sec.offsetTop && pos < sec.offsetTop + sec.offsetHeight) {
      navAnchors.forEach(a => a.classList.remove('active'));
      document.querySelector(`.nav-links a[href="#${sec.id}"]`)?.classList.add('active');
    }
  });
}
