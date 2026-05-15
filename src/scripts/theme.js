const root = document.documentElement;
const toggle = document.querySelector('[data-theme-toggle]');

function current_theme() {
  const explicit = root.dataset.theme;
  if (explicit === 'light' || explicit === 'dark') return explicit;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

toggle?.addEventListener('click', () => {
  const next = current_theme() === 'dark' ? 'light' : 'dark';
  root.dataset.theme = next;
  localStorage.setItem('theme', next);
});
