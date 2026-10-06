const mobileMenu = document.querySelector('#mobile-menu');
const mobileMenuButton = document.querySelector('.mobile-menu-button');
const mobileMenuClose = document.querySelector('.mobile-menu-close');
const main = document.querySelector('main');
const footer = document.querySelector('footer');

function setMobileMenu(open, restoreFocus = true) {
  if (!mobileMenu || !mobileMenuButton) return;
  mobileMenu.hidden = !open;
  mobileMenuButton.setAttribute('aria-expanded', String(open));
  document.body.classList.toggle('menu-open', open);
  main.inert = open;
  footer.inert = open;
  if (open) mobileMenuClose?.focus();
  else if (restoreFocus) mobileMenuButton.focus();
}

mobileMenuButton?.addEventListener('click', () => setMobileMenu(true));
mobileMenuClose?.addEventListener('click', () => setMobileMenu(false));
mobileMenu.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    setMobileMenu(false, false);
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
    }
  });
});

window.addEventListener('keydown', (event) => {
  if (!mobileMenu || mobileMenu.hidden) return;
  if (event.key === 'Escape') setMobileMenu(false);
  if (event.key === 'Tab') {
    const items = [...mobileMenu.querySelectorAll('a, button')];
    const first = items[0];
    const last = items[items.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }
});

window.matchMedia('(min-width: 768px)').addEventListener('change', (event) => {
  if (event.matches && !mobileMenu.hidden) setMobileMenu(false, false);
});

// Clear the missing-resume notice automatically once the real PDF is supplied.
fetch('assets/Chigekwu-Chukwuezi-Resume.pdf', { method: 'HEAD' })
  .then((response) => {
    if (response.ok && response.headers.get('content-type')?.includes('application/pdf')) {
      document.querySelector('#resume-status').hidden = true;
      document.querySelectorAll('[aria-describedby="resume-status"]').forEach((link) => {
        link.removeAttribute('aria-describedby');
      });
    }
  })
  .catch(() => {});
