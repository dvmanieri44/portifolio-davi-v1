const year = document.querySelector('#year');
if (year) year.textContent = new Date().getFullYear();

const copyButton = document.querySelector('.copy-email');
const copyLabel = document.querySelector('.copy-label');
const copyStatus = document.querySelector('.copy-status');
const emailLink = document.querySelector('.email-link');
const languageSelect = document.querySelector('#language-select');
const languages = { pt: 'pt-BR', en: 'en', es: 'es' };
let currentLanguage = 'pt';
let resetTimer;

const portugueseFeedback = {
  'copy.button': copyLabel.textContent,
  'copy.done': 'Copiado!',
  'copy.success': 'E-mail copiado. Vamos conversar!',
  'copy.error': 'Não foi possível copiar. Selecione o e-mail ou clique para enviar uma mensagem.',
};

// Captura os textos originais uma vez para restaurar o português sem duplicá-los.
const translationBindings = [];
for (const [dataAttribute, attribute] of [
  ['data-i18n', null],
  ['data-i18n-aria-label', 'aria-label'],
  ['data-i18n-alt', 'alt'],
  ['data-i18n-content', 'content'],
]) {
  for (const element of document.querySelectorAll(`[${dataAttribute}]`)) {
    translationBindings.push({
      element,
      attribute,
      key: element.getAttribute(dataAttribute),
      original: attribute ? element.getAttribute(attribute) : element.textContent,
    });
  }
}

const translateFeedback = key => portfolioTranslations[currentLanguage]?.[key] ?? portugueseFeedback[key];

function applyLanguage(language) {
  currentLanguage = Object.hasOwn(languages, language) ? language : 'pt';
  document.documentElement.lang = languages[currentLanguage];
  languageSelect.value = currentLanguage;
  for (const binding of translationBindings) {
    const text = portfolioTranslations[currentLanguage]?.[binding.key] ?? binding.original;
    if (binding.attribute) binding.element.setAttribute(binding.attribute, text);
    else binding.element.textContent = text;
  }
  clearTimeout(resetTimer);
  copyStatus.textContent = '';
}

let savedLanguage = 'pt';
try { savedLanguage = localStorage.getItem('portfolio-language') || 'pt'; } catch { /* A preferência é opcional. */ }
applyLanguage(savedLanguage);
document.querySelector('.language-switcher').hidden = false;
languageSelect.addEventListener('change', () => {
  applyLanguage(languageSelect.value);
  try { localStorage.setItem('portfolio-language', currentLanguage); } catch { /* Funciona também sem armazenamento. */ }
});

// Email remains usable when JavaScript or clipboard access is unavailable.
if (copyButton && navigator.clipboard?.writeText) {
  copyButton.hidden = false;
  copyButton.addEventListener('click', async () => {
    clearTimeout(resetTimer);
    try {
      await navigator.clipboard.writeText(emailLink.textContent.trim());
      copyLabel.textContent = translateFeedback('copy.done');
      copyStatus.textContent = translateFeedback('copy.success');
    } catch {
      copyLabel.textContent = translateFeedback('copy.button');
      copyStatus.textContent = translateFeedback('copy.error');
    }
    resetTimer = setTimeout(() => {
      copyLabel.textContent = translateFeedback('copy.button');
      copyStatus.textContent = '';
    }, 5000);
  });
}
