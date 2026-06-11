import PRODUCTS from '../data/products.js';

export default function initCarousel() {
  const track = document.getElementById('carousel-track');
  if (!track) return;

  // Dos copias exactas → el loop CSS translateX(-50%) es perfecto
  [...PRODUCTS, ...PRODUCTS].forEach(p => {
    const slide = document.createElement('div');
    slide.className = 'c-item';
    slide.innerHTML =
      `<div class="c-img-wrap"><img class="c-img" src="${p.img}" alt="${p.name} ${p.sub}"></div>` +
      `<div class="c-caption"><div class="c-name">${p.name}</div><div class="c-sub">${p.sub}</div></div>`;
    track.appendChild(slide);
  });

  const embla = track.parentElement;

  // Pausa al tocar en móvil, reanuda 1.5s después de soltar
  embla.addEventListener('touchstart', () => {
    track.style.animationPlayState = 'paused';
  }, { passive: true });

  embla.addEventListener('touchend', () => {
    setTimeout(() => { track.style.animationPlayState = 'running'; }, 1500);
  });
}
