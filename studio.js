const studio = document.querySelector('.studio-player');
const studioPlay = document.querySelector('.studio-play');
const studioExpand = document.querySelector('.studio-expand');
const studioPanel = document.querySelector('#studio-panel');
const studioLabel = document.querySelector('#studio-label');
let spotifyController;
let currentTrack = '';
let playbackPaused = true;

function setStudioPanel(open) {
  studioPanel.hidden = !open;
  studioExpand.setAttribute('aria-expanded', String(open));
}
studioExpand.addEventListener('click', () => setStudioPanel(studioPanel.hidden));
studio.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    setStudioPanel(false);
    studioExpand.focus();
  }
});
studioPlay.addEventListener('click', () => {
  if (!spotifyController) return;
  spotifyController.togglePlay();
  // Keep Spotify's own controls available for sign-in or playback restrictions.
  if (!currentTrack) setStudioPanel(true);
});

function syncStudio(data) {
  if (data.playingURI) currentTrack = data.playingURI;
  if (typeof data.isPaused === 'boolean') playbackPaused = data.isPaused;
  const track = studioTracks[currentTrack];
  const state = data.isBuffering ? 'BUFFERING' : playbackPaused ? 'PAUSED' : 'LIVE AT STUDIO';
  const label = track ? `${state}: ${track}` : currentTrack ? `${state}: Spotify` : 'STUDIO: Après coup by Laurie Torres';
  if (studioLabel.textContent !== label) studioLabel.textContent = label;
  studio.classList.toggle('is-playing', !playbackPaused && !data.isBuffering);
  studioPlay.setAttribute('aria-label', playbackPaused ? 'Play Spotify music' : 'Pause Spotify music');
  studioPlay.querySelector('img').hidden = !playbackPaused;
  studioPlay.querySelector('.pause-symbol').hidden = playbackPaused;
}
window.onSpotifyIframeApiReady = (api) => {
  api.createController(document.querySelector('#spotify-embed'), {
    url: 'https://open.spotify.com/album/7KX1ViCFuWN77rGG4KREKQ?theme=0',
    width: '100%', height: 352,
  }, (controller) => {
    spotifyController = controller;
    controller.addListener('ready', () => { studioPlay.disabled = false; });
    controller.addListener('playback_started', (event) => syncStudio({ ...event.data, isPaused: false }));
    controller.addListener('playback_update', (event) => syncStudio(event.data));
  });
};
