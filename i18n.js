const translations = {
  pt: {
    splash: "PortfÇülio de<br><strong>Davi Manieri</strong>",
    name: "DAVI MANIERI",
    role: "ENGENHEIRO DE COMPUTAÇÎÇŸO",
    subtitle: "Interfaces silenciosas.<br>CÇüdigo com propÇüsito.",
    enter: "Entrar",
    copyright: "¶¸ 2026",
    location: "Brasil"
  },
  en: {
    splash: "Portfolio of<br><strong>Davi Manieri</strong>",
    name: "DAVI MANIERI",
    role: "COMPUTER ENGINEER",
    subtitle: "Silent interfaces.<br>Purpose-driven code.",
    enter: "Enter",
    copyright: "¶¸ 2026",
    location: "Brazil"
  }
};

export function initLanguageSwitcher() {
  const switcher = document.getElementById("language-switcher");
  if (!switcher) return;

  switcher.addEventListener("change", (e) => {
    setLanguage(e.target.value);
  });
}

function setLanguage(lang) {
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    el.innerHTML = translations[lang][key];
  });
}
