export default function initHero() {
  const bg = document.getElementById('hero-bg');
  if (!bg) return;

  const img = new Image();
  img.onload = () => bg.classList.add('ready');
  img.src = '/img/bar.webp';
}
