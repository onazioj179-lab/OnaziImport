'use strict';

// Older Safari and embedded browsers use addListener for media queries.
function watchMedia(query, listener) {
  if (typeof window.matchMedia !== 'function') return { matches: false };
  const media = window.matchMedia(query);
  if (typeof media.addEventListener === 'function') media.addEventListener('change', listener);
  else if (typeof media.addListener === 'function') media.addListener(listener);
  return media;
}

// Navigation remains usable when JavaScript is unavailable.
const burger = document.getElementById('burger');
const links = document.getElementById('navLinks');
if (burger && links) {
  document.documentElement.classList.add('nav-ready');
  burger.hidden = false;
  const closeMenu = (restoreFocus = false) => {
    links.classList.remove('open');
    burger.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
    burger.setAttribute('aria-label', 'Open menu');
    if (restoreFocus) burger.focus();
  };
  burger.addEventListener('click', () => {
    const open = burger.getAttribute('aria-expanded') !== 'true';
    links.classList.toggle('open', open);
    burger.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  });
  links.querySelectorAll('a').forEach(link => link.addEventListener('click', () => closeMenu()));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && burger.getAttribute('aria-expanded') === 'true') closeMenu(true);
  });
  document.addEventListener('click', event => {
    if (!event.target.closest('nav')) closeMenu();
  });
  links.addEventListener('focusout', event => {
    if (!links.contains(event.relatedTarget) && event.relatedTarget !== burger) closeMenu();
  });
  watchMedia('(min-width: 901px)', () => closeMenu());
}

const motionPreference = watchMedia('(prefers-reduced-motion: reduce)', event => {
  motionPaused = event.matches;
  applyMotionPreference();
});
const motionToggle = document.getElementById('motionToggle');
const flightpath = document.querySelector('.flightpath');
let motionPaused = motionPreference.matches;
function applyMotionPreference() {
  document.documentElement.dataset.motion = motionPaused ? 'paused' : 'playing';
  if (motionToggle) {
    motionToggle.textContent = motionPaused ? 'Enable motion' : 'Pause motion';
  }
  if (flightpath && typeof flightpath.pauseAnimations === 'function') {
    if (motionPaused) flightpath.pauseAnimations();
    else flightpath.unpauseAnimations();
  }
  if (motionPaused) document.querySelectorAll('.reveal.animate').forEach(el => el.classList.add('in'));
}
applyMotionPreference();
if (motionToggle) {
  motionToggle.hidden = false;
  motionToggle.addEventListener('click', () => {
    motionPaused = !motionPaused;
    applyMotionPreference();
  });
}
const marquee = document.getElementById('mq');
if (marquee) marquee.append(marquee.firstElementChild.cloneNode(true));

// Only enhance offscreen content; the page is readable without an observer.
if ('IntersectionObserver' in window && !motionPaused) {
  try {
    const reveals = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          reveals.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });
    document.querySelectorAll('.reveal').forEach(element => {
      if (element.getBoundingClientRect().top > window.innerHeight) {
        element.classList.add('animate');
        reveals.observe(element);
      }
    });
  } catch {
    document.querySelectorAll('.reveal').forEach(element => element.classList.remove('animate'));
  }
}

const nav = document.querySelector('nav');
let scrollPending = false;
function updateScroll() {
  if (nav) nav.classList.toggle('scrolled', window.scrollY > 20);
  const distance = document.documentElement.scrollHeight - window.innerHeight;
  document.documentElement.style.setProperty('--scroll-progress', `${distance > 0 ? Math.min(100, window.scrollY / distance * 100) : 0}%`);
  scrollPending = false;
}
updateScroll();
window.addEventListener('scroll', () => {
  if (!scrollPending) {
    scrollPending = true;
    window.requestAnimationFrame(updateScroll);
  }
}, { passive: true });
window.addEventListener('resize', updateScroll);

const year = document.getElementById('yr');
if (year) year.textContent = new Date().getFullYear();

// Prepare a draft only. Visitors choose whether to open WhatsApp and send it.
const form = document.getElementById('enquiryForm');
if (form) {
  const category = document.getElementById('category');
  const quantity = document.getElementById('quantity');
  const notes = document.getElementById('notes');
  const result = document.getElementById('enquiryResult');
  const draft = document.getElementById('whatsappDraft');
  const categoryHint = document.getElementById('categoryHint');
  const notesHint = document.getElementById('notesHint');
  const notesCount = document.getElementById('notesCount');
  const quantityButtons = form.querySelectorAll('[data-quantity-step]');
  const collectionHints = {
    'Home Accessories': 'For example: a bedside lamp, mirror or storage basket. Add a colour or style if you have one in mind.',
    'Home Appliances': 'Tell us the appliance, preferred brand or model, capacity and any power requirements.',
    'Kitchen Wares': 'Tell us the cookware or utensils, material, size and number of pieces you need.',
    "Men's Wear": 'Tell us the clothing item, size, colour and preferred style.',
    "Ladies' Wear": 'Tell us the clothing item, size, colour, fabric or preferred style.',
    'Bags': 'Tell us the bag type, size and colour, and whether it is for everyday use or travel.',
    'Gadgets': 'Tell us the device or accessory and the brand or model it needs to work with.',
    'Bulk Orders': 'List the items and quantities you need. The quantity field can show your total number of pieces.'
  };
  const setFieldError = field => {
    const error = document.getElementById(`${field.id}Error`);
    const valid = field.validity.valid;
    if (error) error.hidden = valid;
    if (valid) field.removeAttribute('aria-invalid');
    else field.setAttribute('aria-invalid', 'true');
    return valid;
  };
  const updateControls = () => {
    notesCount.textContent = `${notes.value.length} / 600`;
    const hint = collectionHints[category.value];
    categoryHint.textContent = category.value ? `Enquiring about ${category.value.toLowerCase()}.` : 'Choose the range you would like to ask about.';
    notesHint.textContent = hint || 'Add any product details that will help us check stock.';
    quantityButtons.forEach(button => {
      const value = quantity.valueAsNumber;
      button.disabled = quantity.validity.valid && (Number(button.dataset.quantityStep) < 0 ? value <= 1 : value >= 10000);
    });
  };
  const clearDraft = () => {
    result.hidden = true;
    draft.removeAttribute('href');
  };
  form.noValidate = true;
  quantityButtons.forEach(button => {
    button.hidden = false;
    button.addEventListener('click', () => {
      const current = quantity.valueAsNumber;
      quantity.value = Number.isInteger(current) ? Math.max(1, Math.min(10000, current + Number(button.dataset.quantityStep))) : 1;
      clearDraft();
      updateControls();
      setFieldError(quantity);
    });
  });
  document.querySelectorAll('[data-category]').forEach(link => {
    link.addEventListener('click', () => {
      category.value = link.dataset.category;
      clearDraft();
      updateControls();
      setFieldError(category);
    });
  });
  const onEdit = event => {
    clearDraft();
    updateControls();
    if (event.target.getAttribute('aria-invalid') === 'true') setFieldError(event.target);
  };
  form.addEventListener('input', onEdit);
  form.addEventListener('change', onEdit);
  [category, quantity].forEach(field => field.addEventListener('blur', () => setFieldError(field)));
  form.addEventListener('reset', clearDraft);
  form.addEventListener('submit', event => {
    event.preventDefault();
    const categoryValid = setFieldError(category);
    const quantityValid = setFieldError(quantity);
    if (!categoryValid || !quantityValid) {
      (categoryValid ? quantity : category).focus();
      return;
    }
    if (!form.reportValidity()) return;
    const message = ["Hello Onazi's Import, I'd like to enquire about:", `Collection: ${category.value}`, `Quantity: ${quantity.value}`, notes.value.trim() ? `Details: ${notes.value.trim()}` : '', 'Please confirm availability, price and collection or delivery options.'].filter(Boolean).join('\n');
    draft.href = `https://wa.me/2348164043196?text=${encodeURIComponent(message)}`;
    result.hidden = false;
    draft.focus();
  });
  updateControls();
  form.hidden = false;
}

// No optional tracking is installed. Both choices remember only this notice.
const cookieBanner = document.getElementById('cookieBanner');
const settingsButtons = document.querySelectorAll('[data-cookie-settings]');
const privacyKey = 'onazi:privacy-choice';
const preferenceLifetime = 180 * 24 * 60 * 60 * 1000;
let settingsTrigger;
if (cookieBanner) {
  let saved;
  try {
    saved = JSON.parse(localStorage.getItem(privacyKey));
  } catch { /* A visitor may block browser storage. The notice still works. */ }
  const valid = saved && saved.version === 1 && ['necessary', 'accepted'].includes(saved.choice) && Number.isFinite(saved.expires) && saved.expires > Date.now();
  cookieBanner.hidden = valid;
  settingsButtons.forEach(button => {
    button.hidden = false;
    button.addEventListener('click', () => {
      settingsTrigger = button;
      cookieBanner.hidden = false;
      cookieBanner.querySelector('button').focus();
    });
  });
  cookieBanner.querySelectorAll('[data-cookie-choice]').forEach(button => {
    button.addEventListener('click', () => {
      try {
        localStorage.setItem(privacyKey, JSON.stringify({ version: 1, choice: button.dataset.cookieChoice, expires: Date.now() + preferenceLifetime }));
      } catch { /* Without storage, the choice lasts for the current page visit. */ }
      cookieBanner.hidden = true;
      if (settingsTrigger) settingsTrigger.focus();
      else if (document.activeElement === button) document.querySelector('.brand').focus();
    });
  });
}
