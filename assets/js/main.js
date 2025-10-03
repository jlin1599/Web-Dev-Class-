// Header interactions
const nav = document.getElementById('site-nav');
const hamburger = document.getElementById('hamburger');
if (hamburger && nav) {
  hamburger.addEventListener('click', () => {
    const expanded = hamburger.getAttribute('aria-expanded') === 'true';
    hamburger.setAttribute('aria-expanded', String(!expanded));
    nav.classList.toggle('open');
  });
}

// Year in footer
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Simple slider
const slider = document.getElementById('gallery-slider');
if (slider) {
  const track = slider.querySelector('.slides');
  const images = Array.from(track.querySelectorAll('img'));
  const prevBtn = slider.querySelector('.prev');
  const nextBtn = slider.querySelector('.next');
  let index = 0;

  function update() {
    track.style.transform = `translateX(${-index * 100}%)`;
  }

  function go(delta) {
    index = (index + delta + images.length) % images.length;
    update();
  }

  prevBtn?.addEventListener('click', () => go(-1));
  nextBtn?.addEventListener('click', () => go(1));

  let auto = setInterval(() => go(1), 4000);
  slider.addEventListener('mouseenter', () => clearInterval(auto));
  slider.addEventListener('mouseleave', () => (auto = setInterval(() => go(1), 4000)));
}

// Contact form validation (client-side only)
const form = document.getElementById('contact-form');
if (form) {
  const nameEl = document.getElementById('name');
  const emailEl = document.getElementById('email');
  const messageEl = document.getElementById('message');
  const successEl = document.getElementById('form-success');

  function setError(id, msg) {
    const el = document.querySelector(`.error[data-for="${id}"]`);
    if (el) el.textContent = msg || '';
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let valid = true;
    setError('name', '');
    setError('email', '');
    setError('message', '');

    if (!nameEl.value.trim()) {
      setError('name', 'Please enter your name.');
      valid = false;
    }
    const email = emailEl.value.trim();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('email', 'Please enter a valid email.');
      valid = false;
    }
    if (!messageEl.value.trim()) {
      setError('message', 'Please enter a message.');
      valid = false;
    }

    if (valid) {
      successEl.textContent = 'Thanks! Your message has been sent.';
      form.reset();
    }
  });
}


