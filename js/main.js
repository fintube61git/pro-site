
document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('.nav-toggle');
  const menu = document.getElementById('nav-menu');
  if (toggle && menu) {
    toggle.addEventListener('click', () => {
      const expanded = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!expanded));
      if (menu.hasAttribute('hidden')) menu.removeAttribute('hidden');
      else menu.setAttribute('hidden','');
    });
  }
  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
});
