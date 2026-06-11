function applyTheme(t) {
  if (t === 'default') delete document.documentElement.dataset.theme;
  else document.documentElement.dataset.theme = t;
}

export default function initTweaks() {
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
}
