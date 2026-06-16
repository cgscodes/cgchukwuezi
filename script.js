const cursor = document.querySelector('.cursor-dot');
let pointerX = window.innerWidth / 2;
let pointerY = window.innerHeight / 2;
let cursorX = pointerX;
let cursorY = pointerY;

function renderCursor() {
  if (!cursor) return;
  cursorX += (pointerX - cursorX) * 0.18;
  cursorY += (pointerY - cursorY) * 0.18;
  cursor.style.left = `${cursorX}px`;
  cursor.style.top = `${cursorY}px`;
  requestAnimationFrame(renderCursor);
}

function parseRgb(value) {
  const match = value && value.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
  if (!match) return null;
  return {
    r: Number(match[1]),
    g: Number(match[2]),
    b: Number(match[3]),
    a: match[4] === undefined ? 1 : Number(match[4])
  };
}

function luminance({ r, g, b }) {
  const values = [r, g, b].map((channel) => {
    const c = channel / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * values[0] + 0.7152 * values[1] + 0.0722 * values[2];
}

function setCursorContrastAt(x, y) {
  if (!cursor) return;
  let element = document.elementFromPoint(x, y);
  let color = null;

  while (element && element !== document.documentElement) {
    const background = window.getComputedStyle(element).backgroundColor;
    const parsed = parseRgb(background);
    if (parsed && parsed.a > 0.2) {
      color = parsed;
      break;
    }
    element = element.parentElement;
  }

  const isLightSurface = color ? luminance(color) > 0.42 : false;
  cursor.classList.toggle('is-on-light', isLightSurface);
}

window.addEventListener('pointermove', (event) => {
  pointerX = event.clientX;
  pointerY = event.clientY;
  setCursorContrastAt(pointerX, pointerY);
});

if (cursor && window.matchMedia('(pointer: fine)').matches) {
  renderCursor();

  document.querySelectorAll('.experience-card, .project-card').forEach((element) => {
    element.addEventListener('pointerenter', () => cursor.classList.add('is-view'));
    element.addEventListener('pointerleave', () => cursor.classList.remove('is-view'));
  });
}

const mobileMenu = document.querySelector('#mobile-menu');
const mobileMenuButton = document.querySelector('.mobile-menu-button');
const mobileMenuClose = document.querySelector('.mobile-menu-close');
const mobileMenuLinks = document.querySelectorAll('.mobile-menu-links a');

function setMobileMenu(open) {
  if (!mobileMenu || !mobileMenuButton) return;
  mobileMenu.hidden = !open;
  mobileMenuButton.setAttribute('aria-expanded', String(open));
  document.body.classList.toggle('menu-open', open);
  if (open) {
    const firstLink = mobileMenu.querySelector('a, button');
    firstLink?.focus();
  } else {
    mobileMenuButton.focus();
  }
}

mobileMenuButton?.addEventListener('click', () => setMobileMenu(true));
mobileMenuClose?.addEventListener('click', () => setMobileMenu(false));
mobileMenuLinks.forEach((link) => link.addEventListener('click', () => setMobileMenu(false)));

window.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && mobileMenu && !mobileMenu.hidden) {
    setMobileMenu(false);
  }
});

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.16 }
);

document.querySelectorAll('.reveal').forEach((element, index) => {
  element.style.transitionDelay = `${Math.min(index % 4, 3) * 90}ms`;
  observer.observe(element);
});
