const menuButton = document.querySelector('.menu-button');
const navigation = document.querySelector('.site-nav');

menuButton.addEventListener('click', () => {
  const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!isOpen));
  menuButton.querySelector('.sr-only').textContent = isOpen ? 'Öppna meny' : 'Stäng meny';
  navigation.classList.toggle('open', !isOpen);
  document.body.classList.toggle('menu-open', !isOpen);
});

navigation.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
  menuButton.setAttribute('aria-expanded', 'false');
  navigation.classList.remove('open');
  document.body.classList.remove('menu-open');
}));

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));

document.querySelector('#quote-form').addEventListener('submit', async (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const button = form.querySelector('button[type="submit"]');
  const status = form.querySelector('#form-status');
  const originalButtonText = button.innerHTML;

  button.disabled = true;
  button.textContent = 'Skickar...';
  status.className = 'form-note';
  status.textContent = 'Skickar din förfrågan...';

  try {
    const response = await fetch(form.action, {
      method: 'POST',
      body: new FormData(form),
      headers: { Accept: 'application/json' }
    });

    if (!response.ok) throw new Error('Formspree rejected the request');

    form.reset();
    status.className = 'form-note form-success';
    status.textContent = 'Tack! Din förfrågan är skickad. Vi återkommer inom 24 timmar.';
  } catch (error) {
    status.className = 'form-note form-error';
    status.textContent = 'Det gick inte att skicka just nu. Mejla oss på info@lyfthem.se eller ring 070-719 04 41.';
  } finally {
    button.disabled = false;
    button.innerHTML = originalButtonText;
  }
});
