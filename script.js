const toggle = document.querySelector('.menu-toggle');
const menu = document.querySelector('#site-menu');
function setMenu(open) {
  toggle.setAttribute('aria-expanded', String(open));
  toggle.textContent = open ? 'Close' : 'Menu';
  menu.hidden = !open;
}
toggle.addEventListener('click', () => setMenu(menu.hidden));
menu.addEventListener('click', (event) => {
  if (event.target.closest('a')) setMenu(false);
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && !menu.hidden) {
    setMenu(false);
    toggle.focus();
  }
});
document.addEventListener('click', (event) => {
  if (!menu.hidden && !menu.contains(event.target) && !toggle.contains(event.target)) setMenu(false);
});
