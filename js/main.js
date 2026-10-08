const year = document.querySelector('#year');
if (year) year.textContent = new Date().getFullYear();

// A small, optional portrait tilt; content never depends on animation.
const portrait = document.querySelector('.portrait-composition');
const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');

if (portrait) {
  const resetPortrait = () => {
    portrait.style.removeProperty('--portrait-x');
    portrait.style.removeProperty('--portrait-y');
  };

  portrait.addEventListener('pointermove', (event) => {
    if (motionPreference.matches || !finePointer.matches || event.pointerType === 'touch') return;
    const bounds = portrait.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    portrait.style.setProperty('--portrait-x', `${x * 7}deg`);
    portrait.style.setProperty('--portrait-y', `${-y * 5}deg`);
  });
  portrait.addEventListener('pointerleave', resetPortrait);
  motionPreference.addEventListener('change', resetPortrait);
  finePointer.addEventListener('change', resetPortrait);
}

const copyButton = document.querySelector('.copy-email');
const copyLabel = document.querySelector('.copy-label');
const copyStatus = document.querySelector('.copy-status');
const emailLink = document.querySelector('.email-link');

// Email remains usable when JavaScript or clipboard access is unavailable.
if (copyButton && navigator.clipboard?.writeText) {
  copyButton.hidden = false;
  let resetTimer;

  copyButton.addEventListener('click', async () => {
    clearTimeout(resetTimer);
    try {
      await navigator.clipboard.writeText(emailLink.textContent.trim());
      copyLabel.textContent = 'Copiado!';
      copyStatus.textContent = 'E-mail copiado. Vamos conversar!';
    } catch {
      copyLabel.textContent = 'Copiar';
      copyStatus.textContent = 'Não foi possível copiar. Selecione o e-mail ou clique para enviar uma mensagem.';
    }
    resetTimer = setTimeout(() => {
      copyLabel.textContent = 'Copiar';
      copyStatus.textContent = '';
    }, 5000);
  });
}
