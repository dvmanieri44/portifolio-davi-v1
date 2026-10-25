const year = document.querySelector('#year');
if (year) year.textContent = new Date().getFullYear();

// Each language has a real URL. Content and navigation work without JavaScript.
const language = document.documentElement.lang.split('-')[0];
const feedback = {
  pt: ['E-mail copiado.', 'Não foi possível copiar. Use o link de e-mail.'],
  en: ['Email copied.', 'Could not copy. Use the email link.'],
  es: ['Correo copiado.', 'No se pudo copiar. Utiliza el enlace de correo.'],
}[language] || ['Email copied.', 'Could not copy. Use the email link.'];
const copyButton = document.querySelector('.copy-email');
const copyStatus = document.querySelector('.copy-status');
const emailLink = document.querySelector('.email-link');
let resetTimer;
if (copyButton && copyStatus && emailLink && navigator.clipboard?.writeText) {
  copyButton.hidden = false;
  copyButton.addEventListener('click', async () => {
    clearTimeout(resetTimer);
    copyStatus.textContent = '';
    try {
      await navigator.clipboard.writeText(emailLink.textContent.trim());
      copyStatus.textContent = feedback[0];
    } catch {
      copyStatus.textContent = feedback[1];
    }
    resetTimer = setTimeout(() => { copyStatus.textContent = ''; }, 5000);
  });
}
