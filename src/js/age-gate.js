export default function initAgeGate() {
  const gate = document.getElementById('age-gate');
  if (!gate) return;

  if (localStorage.getItem('dr-age')) {
    gate.classList.add('off');
    return;
  }

  document.getElementById('age-yes').addEventListener('click', () => {
    gate.classList.add('off');
    try { localStorage.setItem('dr-age', '1'); } catch (_) {}
  });
}
