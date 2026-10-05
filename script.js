const toggle = document.querySelector('.menu-toggle');
const menu = document.querySelector('#site-menu');
let menuScrollY = 0;
const pageBehindMenu = [...document.querySelectorAll('main, footer, .skip-link')];
function setMenu(open) {
  if (open === !menu.hidden) return;
  if (open) {
    menuScrollY = scrollY;
    document.body.style.setProperty('--menu-scroll-offset', `${-menuScrollY}px`);
    renderNavigation(0);
  }
  toggle.setAttribute('aria-expanded', String(open));
  toggle.textContent = open ? 'Close' : 'Menu';
  menu.hidden = !open;
  document.body.classList.toggle('menu-open', open);
  pageBehindMenu.forEach(element => { element.inert = open; });
  if (!open) {
    window.scrollTo(0, menuScrollY);
    lastY = menuScrollY;
    toggle.focus({ preventScroll: true });
    requestNavigationUpdate();
  }
}
toggle.addEventListener('click', () => setMenu(menu.hidden));
menu.addEventListener('click', (event) => {
  if (event.target.closest('a')) setMenu(false);
});
document.querySelector('.wordmark').addEventListener('click', () => {
  if (!menu.hidden) setMenu(false);
});
document.addEventListener('keydown', (event) => {
  if (menu.hidden) return;
  if (event.key === 'Escape') {
    event.preventDefault();
    setMenu(false);
  }
  if (event.key === 'Tab') {
    const controls = [document.querySelector('.wordmark'), toggle, ...menu.querySelectorAll('a[href]')];
    const index = controls.indexOf(document.activeElement);
    if (event.shiftKey && index <= 0) {
      event.preventDefault();
      controls.at(-1).focus();
    } else if (!event.shiftKey && (index === controls.length - 1 || index < 0)) {
      event.preventDefault();
      controls[0].focus();
    }
  }
});

// Initial morph follows scroll distance; subsequent upward intent restores navigation.
const header = document.querySelector('.site-header');
const logo = document.querySelector('.scroll-logo');
const mobile = matchMedia('(max-width: 767px)');
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const clamp = (value) => Math.max(0, Math.min(1, value));
let lastY = Math.max(0, scrollY);
let direction = 0;
let travel = 0;
let returning = false;
let downStart = null;
let scheduled = false;

function renderNavigation(progress) {
  const p = reducedMotion.matches ? (progress >= .5 ? 1 : 0) : progress;
  const text = 1 - clamp(p / .55);
  const mark = clamp((p - .45) / .55);
  const style = document.body.style;
  style.setProperty('--nav-text', text);
  style.setProperty('--nav-inset', `${Math.min(innerWidth * .18, 80) * (1 - text)}px`);
  style.setProperty('--nav-background', 1 - clamp((p - .2) / .65));
  style.setProperty('--logo-opacity', mark);
  style.setProperty('--logo-scale', .5 + mark * .5);
  style.setProperty('--logo-rotation', `${mark * 15}deg`);
  header.inert = mobile.matches && text < .1;
  const active = mobile.matches && mark > .9;
  logo.classList.toggle('is-active', active);
  logo.setAttribute('aria-hidden', String(!active));
  logo.tabIndex = active ? 0 : -1;
}

function updateNavigation() {
  scheduled = false;
  const y = Math.max(0, Math.min(scrollY, document.documentElement.scrollHeight - innerHeight));
  const delta = y - lastY;
  lastY = y;
  if (!mobile.matches) {
    returning = false;
    downStart = null;
    document.body.classList.remove('nav-returning');
    renderNavigation(0);
    return;
  }
  // Keep the controls present while their menu is open or keyboard focus is inside.
  if (!menu.hidden || header.contains(document.activeElement) && document.activeElement.matches(':focus-visible')) {
    renderNavigation(0);
    return;
  }
  if (Math.abs(delta) > .5) {
    const nextDirection = Math.sign(delta);
    travel = nextDirection === direction ? travel + Math.abs(delta) : Math.abs(delta);
    direction = nextDirection;
    if (direction < 0 && travel >= 12 && y > 8 && !returning) {
      returning = true;
      downStart = null;
      document.body.classList.add('nav-returning');
    } else if (direction > 0 && travel >= 16 && returning) {
      returning = false;
      downStart = y;
      document.body.classList.remove('nav-returning');
    }
  }
  if (y <= 8) {
    returning = false;
    downStart = null;
    document.body.classList.remove('nav-returning');
  }
  renderNavigation(returning ? 0 : clamp((y - (downStart ?? 8)) / 120));
}
function requestNavigationUpdate() {
  if (!scheduled) {
    scheduled = true;
    requestAnimationFrame(updateNavigation);
  }
}
addEventListener('scroll', requestNavigationUpdate, { passive: true });
addEventListener('resize', requestNavigationUpdate);
mobile.addEventListener('change', requestNavigationUpdate);
reducedMotion.addEventListener('change', requestNavigationUpdate);
header.addEventListener('focusin', () => renderNavigation(0));
header.addEventListener('focusout', requestNavigationUpdate);
logo.addEventListener('click', () => { returning = false; downStart = null; });
updateNavigation();
