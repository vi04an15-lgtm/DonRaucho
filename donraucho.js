/* ─── PRODUCTS ────────────────────────────────────────── */
const PRODUCTS = [
  // Piscos Mistral
  { img: 'img/productos/carrusel/licores/nobelclasico.webp',  name: 'Mistral Nobel',  sub: 'Clásico' },
  { img: 'img/productos/carrusel/licores/nobelbarrica.webp',  name: 'Mistral Nobel',  sub: 'Barrica Tostada' },
  { img: 'img/productos/carrusel/licores/nobelapple.webp',    name: 'Mistral Nobel',  sub: 'Apple' },
  // Jack Daniel's
  { img: 'img/productos/carrusel/licores/jackno7.webp',       name: "Jack Daniel's",  sub: 'No. 7' },
  { img: 'img/productos/carrusel/licores/jacapple.webp',      name: "Jack Daniel's",  sub: 'Apple' },
  { img: 'img/productos/carrusel/licores/jackhoney.webp',     name: "Jack Daniel's",  sub: 'Honey' },
  { img: 'img/productos/carrusel/licores/singlebarrel.webp',  name: "Jack Daniel's",  sub: 'Single Barrel' },
  { img: 'img/productos/carrusel/licores/blackberry.webp',    name: "Jack Daniel's",  sub: 'Blackberry' },
  // Johnnie Walker
  { img: 'img/productos/carrusel/licores/blacklabel.webp',    name: 'Johnnie Walker', sub: 'Black Label' },
  { img: 'img/productos/carrusel/licores/blueblabel.webp',    name: 'Johnnie Walker', sub: 'Blue Label' },
  // Don Julio
  { img: 'img/productos/carrusel/licores/donjuliob.webp',     name: 'Don Julio',      sub: 'Reposado' },
  { img: 'img/productos/carrusel/licores/donjulioa.webp',     name: 'Don Julio',      sub: 'Agave' },
  // José Cuervo
  { img: 'img/productos/carrusel/licores/josecuervoa.webp',   name: 'José Cuervo',    sub: 'Reposado' },
  { img: 'img/productos/carrusel/licores/josecuervob.webp',   name: 'José Cuervo',    sub: 'Agave' },
  // Gins
  { img: 'img/productos/carrusel/licores/hendricks.webp',     name: "Hendrick's",     sub: 'Gin' },
  { img: 'img/productos/carrusel/licores/tanqueray.webp',     name: 'Tanqueray',      sub: 'Gin' },
  // Otros
  { img: 'img/productos/carrusel/licores/jager.webp',         name: 'Jägermeister',   sub: 'Licor de Hierbas' },
  { img: 'img/productos/carrusel/licores/absolut.webp',       name: 'Absolut',        sub: 'Vodka' },
];

/* ─── AGE GATE ────────────────────────────────────────── */
(function initAge() {
  const gate = document.getElementById('age-gate');
  if (!gate) return;
  if (localStorage.getItem('dr-age')) {
    gate.classList.add('off');
    return;
  }
  document.getElementById('age-yes').addEventListener('click', () => {
    localStorage.setItem('dr-age', '1');
    gate.classList.add('off');
  });
})();

/* ─── HERO BG ─────────────────────────────────────────── */
(function initHero() {
  const bg = document.getElementById('hero-bg');
  if (!bg) return;
  const img = new Image();
  img.onload = () => bg.classList.add('ready');
  img.src = 'img/bar.webp';
})();

/* ─── MOBILE NAV ──────────────────────────────────────── */
(function initNav() {
  const btn = document.getElementById('hamburger');
  const mob = document.getElementById('nav-mobile');
  if (!btn || !mob) return;

  const close = () => {
    mob.classList.remove('open');
    btn.textContent = '☰';
  };
  btn.addEventListener('click', () => {
    const isOpen = mob.classList.toggle('open');
    btn.textContent = isOpen ? '✕' : '☰';
  });
  mob.querySelectorAll('a').forEach(a => a.addEventListener('click', close));
})();

/* ─── SCROLL REVEAL ───────────────────────────────────── */
(function initReveal() {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in'); });
  }, { threshold: 0.1 });
  els.forEach(el => io.observe(el));
})();

/* ─── CAROUSEL ────────────────────────────────────────── */
(function initCarousel() {
  const track  = document.getElementById('carousel-track');
  const dotsEl = document.getElementById('c-dots');
  const prev   = document.getElementById('c-prev');
  const next   = document.getElementById('c-next');
  if (!track) return;

  /* Build items */
  PRODUCTS.forEach(p => {
    const item = document.createElement('div');
    item.className = 'c-item';
    item.innerHTML =
      `<div class="c-img-wrap"><img class="c-img" src="${p.img}" alt="${p.name} ${p.sub}" loading="lazy"></div>` +
      `<div class="c-caption"><div class="c-name">${p.name}</div><div class="c-sub">${p.sub}</div></div>`;
    track.appendChild(item);
  });

  const itemW    = () => (track.querySelector('.c-item')?.offsetWidth || 230) + 3;
  const visCount = () => Math.max(1, Math.round(track.offsetWidth / itemW()));
  const total    = () => Math.ceil(PRODUCTS.length / visCount());

  function buildDots() {
    dotsEl.innerHTML = '';
    for (let i = 0; i < total(); i++) {
      const d = document.createElement('div');
      d.className = 'c-dot' + (i === 0 ? ' on' : '');
      dotsEl.appendChild(d);
    }
  }
  function updateDots() {
    const idx = Math.round(track.scrollLeft / itemW() / visCount());
    dotsEl.querySelectorAll('.c-dot').forEach((d, i) => d.classList.toggle('on', i === idx));
  }

  buildDots();
  track.addEventListener('scroll', updateDots, { passive: true });
  window.addEventListener('resize', buildDots);

  prev.addEventListener('click', () => track.scrollBy({ left: -(itemW() * visCount()), behavior: 'smooth' }));
  next.addEventListener('click', () => track.scrollBy({ left:   itemW() * visCount(),  behavior: 'smooth' }));

  /* Mouse drag */
  let drag = false, sx = 0, sl = 0;
  track.addEventListener('mousedown', e => {
    drag = true; sx = e.pageX - track.offsetLeft; sl = track.scrollLeft;
    track.classList.add('dragging');
  });
  document.addEventListener('mouseup', () => { drag = false; track.classList.remove('dragging'); });
  track.addEventListener('mousemove', e => {
    if (!drag) return;
    e.preventDefault();
    track.scrollLeft = sl - (e.pageX - track.offsetLeft - sx) * 1.4;
  });

  /* Touch drag (mobile) */
  let tx = 0, tsl = 0;
  track.addEventListener('touchstart', e => {
    tx = e.touches[0].pageX; tsl = track.scrollLeft;
  }, { passive: true });
  track.addEventListener('touchmove', e => {
    track.scrollLeft = tsl - (e.touches[0].pageX - tx) * 1.2;
  }, { passive: true });
  track.addEventListener('touchend', updateDots, { passive: true });
})();

/* ─── TWEAKS PANEL ────────────────────────────────────── */
(function initTweaks() {
  const panel = document.getElementById('tweaks');
  if (!panel) return;
  const saved = localStorage.getItem('dr-theme') || 'default';
  applyTheme(saved);
  panel.querySelectorAll('.tw-btn').forEach(b => b.classList.toggle('on', b.dataset.t === saved));
  panel.querySelectorAll('.tw-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const t = btn.dataset.t;
      applyTheme(t);
      localStorage.setItem('dr-theme', t);
      panel.querySelectorAll('.tw-btn').forEach(b => b.classList.toggle('on', b === btn));
    });
  });
  window.addEventListener('message', e => {
    if (e.data?.type === 'tweaks:show') panel.classList.add('show');
    if (e.data?.type === 'tweaks:hide') panel.classList.remove('show');
  });
})();

function applyTheme(t) {
  if (t === 'default') delete document.documentElement.dataset.theme;
  else document.documentElement.dataset.theme = t;
}
