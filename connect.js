const film = document.querySelector('#about-film');
const filmToggle = document.querySelector('.film-toggle');
const filmContainer = document.querySelector('.connect-film');
const motionPreference = matchMedia('(prefers-reduced-motion: reduce)');
function updateFilmControl() {
  filmToggle.textContent = film.paused ? 'Play' : 'Pause';
  filmToggle.setAttribute('aria-label', film.paused ? 'Play studio video' : 'Pause studio video');
  filmContainer.classList.toggle('is-paused', film.paused);
}
film.addEventListener('play', updateFilmControl);
film.addEventListener('pause', updateFilmControl);
film.addEventListener('error', () => {
  filmToggle.textContent = 'Video unavailable';
  filmToggle.disabled = true;
  filmContainer.classList.add('is-paused');
});
filmToggle.addEventListener('click', () => {
  if (film.paused) film.play().catch(updateFilmControl);
  else film.pause();
});
motionPreference.addEventListener('change', () => {
  if (motionPreference.matches) film.pause();
});
if (!motionPreference.matches) film.play().catch(updateFilmControl);
else updateFilmControl();

