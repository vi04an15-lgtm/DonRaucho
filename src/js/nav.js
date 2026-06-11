export default function initNav() {
  const btn = document.getElementById('hamburger');
  const mob = document.getElementById('nav-mobile');
  if (!btn || !mob) return;

  const close = () => {
    mob.classList.remove('open');
    btn.textContent = '☰';
    document.body.style.overflow = '';
  };

  const open = () => {
    mob.classList.add('open');
    btn.textContent = '✕';
    document.body.style.overflow = 'hidden';
  };

  btn.addEventListener('click', () => {
    mob.classList.contains('open') ? close() : open();
  });

  mob.querySelectorAll('a').forEach(a => a.addEventListener('click', close));
}
