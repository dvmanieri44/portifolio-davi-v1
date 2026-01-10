import { initFirebase } from "./firebase.js";
import { startSplashTimeline } from "./animations.js";
import { initLanguageSwitcher } from "./i18n.js";
import { initMenuPanel } from "./menu.js";
import { addDoc, collection } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

const db = initFirebase();

initLanguageSwitcher();
initThemeSwitcher();
initSecretPrompt();

startSplashTimeline(() => {
  initMenuPanel(db);
});

function initSecretPrompt() {
  const target = document.querySelector(".footer span");
  if (!target) return;

  let clicks = 0;
  target.addEventListener("click", () => {
    clicks += 1;
    if (clicks < 5) return;
    clicks = 0;
    const answer = window.prompt("Digite a senha");
    if (answer === "2040") {
      openProjectPopup(db);
    } else if (answer !== null) {
      window.alert("Senha incorreta.");
    }
  });
}

function initThemeSwitcher() {
  const switcher = document.getElementById("theme-switcher");
  if (!switcher) return;

  const stored = window.localStorage.getItem("theme");
  const prefersDark = window.matchMedia
    ? window.matchMedia("(prefers-color-scheme: dark)").matches
    : true;
  const initial = stored || (prefersDark ? "dark" : "light");
  applyTheme(initial);
  switcher.value = initial;

  switcher.addEventListener("change", (event) => {
    applyTheme(event.target.value);
  });
}

function applyTheme(value) {
  const theme = value === "light" ? "light" : "dark";
  if (theme === "light") {
    document.body.dataset.theme = "light";
  } else {
    document.body.removeAttribute("data-theme");
  }
  window.localStorage.setItem("theme", theme);
  document.dispatchEvent(new CustomEvent("themechange", { detail: theme }));
}

function openProjectPopup(db) {
  if (!db) return;
  if (document.querySelector(".project-popup-overlay")) return;

  ensureProjectPopupStyles();

  const overlay = document.createElement("div");
  overlay.className = "project-popup-overlay";

  const types = [
    { key: "projects", label: "Projetos", title: "Novo projeto", success: "Projeto salvo." },
    { key: "certificates", label: "Certificados", title: "Novo certificado", success: "Certificado salvo." },
    { key: "experiences", label: "Experiencia", title: "Nova experiencia", success: "Experiencia salva." }
  ];
  const typeMap = new Map(types.map((type) => [type.key, type]));

  const card = document.createElement("div");
  card.className = "project-popup-card";
  card.innerHTML = `
    <div class="project-popup-shell">
      <nav class="project-popup-nav" aria-label="Adicionar">
        ${types
          .map((type, index) => `
            <button type="button" class="project-popup-tab${index === 0 ? " is-active" : ""}" data-type="${type.key}">
              ${type.label}
            </button>
          `)
          .join("")}
      </nav>
      <div class="project-popup-body">
        <div class="project-popup-title" data-popup-title>${types[0].title}</div>
        <form class="project-popup-form" data-type="${types[0].key}">
          <div class="project-popup-section" data-section="projects">
            <label>
              Titulo
              <input name="title" type="text" autocomplete="off" required>
            </label>
            <label>
              Descricao
              <textarea name="descricao" rows="3"></textarea>
            </label>
            <label>
              URL
              <input name="url" type="url" autocomplete="off">
            </label>
            <div class="project-popup-row">
              <label>
                Inicio
                <input name="dataInicio" type="date">
              </label>
              <label>
                Fim
                <input name="dataFinal" type="date">
              </label>
            </div>
            <label class="project-popup-check">
              <input name="finalizado" type="checkbox">
              Finalizado
            </label>
          </div>
          <div class="project-popup-section is-hidden" data-section="certificates">
            <label>
              Titulo
              <input name="certTitulo" type="text" autocomplete="off" required>
            </label>
            <label>
              Instituicao emissora
              <input name="certInstituicao" type="text" autocomplete="off" required>
            </label>
            <label class="project-popup-check">
              <input name="certFormacao" type="checkbox">
              Formacao
            </label>
            <div class="project-popup-row">
              <label>
                Data de inicio
                <input name="certInicio" type="date" required>
              </label>
              <label>
                Data de fim
                <input name="certFim" type="date">
              </label>
            </div>
            <label class="project-popup-check">
              <input name="certAtual" type="checkbox">
              Fazendo atualmente
            </label>
          </div>
          <div class="project-popup-section is-hidden" data-section="experiences">
            <label>
              Nome da empresa
              <input name="empresa" type="text" autocomplete="off" required>
            </label>
            <label>
              Nome do cargo
              <input name="cargo" type="text" autocomplete="off" required>
            </label>
            <div class="project-popup-row">
              <label>
                Data de entrada
                <input name="entrada" type="date" required>
              </label>
              <label>
                Data de saida
                <input name="saida" type="date">
              </label>
            </div>
            <label class="project-popup-check">
              <input name="trabalhoAtual" type="checkbox">
              Trabalho atual
            </label>
          </div>
          <div class="project-popup-actions">
            <button type="button" class="project-popup-cancel">Cancelar</button>
            <button type="submit" class="project-popup-submit">Salvar</button>
          </div>
          <div class="project-popup-status" aria-live="polite"></div>
        </form>
      </div>
    </div>
  `;

  overlay.appendChild(card);
  document.body.appendChild(overlay);

  const form = card.querySelector(".project-popup-form");
  const cancelBtn = card.querySelector(".project-popup-cancel");
  const statusEl = card.querySelector(".project-popup-status");
  const titleEl = card.querySelector("[data-popup-title]");
  const tabs = Array.from(card.querySelectorAll(".project-popup-tab"));
  const sections = Array.from(card.querySelectorAll(".project-popup-section"));
  const saidaInput = card.querySelector('input[name="saida"]');
  const trabalhoAtualInput = card.querySelector('input[name="trabalhoAtual"]');
  const certFimInput = card.querySelector('input[name="certFim"]');
  const certAtualInput = card.querySelector('input[name="certAtual"]');
  const setActiveSection = (typeKey) => {
    sections.forEach((section) => {
      const isActive = section.dataset.section === typeKey;
      section.classList.toggle("is-hidden", !isActive);
      section.querySelectorAll("input, textarea, select").forEach((field) => {
        field.disabled = !isActive;
      });
    });
  };

  function close() {
    overlay.remove();
  }

  cancelBtn.addEventListener("click", close);
  overlay.addEventListener("click", (event) => {
    if (event.target === overlay) {
      close();
    }
  });

  if (trabalhoAtualInput && saidaInput) {
    const syncSaidaState = () => {
      const isCurrent = trabalhoAtualInput.checked;
      saidaInput.disabled = isCurrent;
      if (isCurrent) {
        saidaInput.value = "";
      }
    };
    trabalhoAtualInput.addEventListener("change", syncSaidaState);
    syncSaidaState();
  }

  if (certAtualInput && certFimInput) {
    const syncCertFimState = () => {
      const isCurrent = certAtualInput.checked;
      certFimInput.disabled = isCurrent;
      if (isCurrent) {
        certFimInput.value = "";
      }
    };
    certAtualInput.addEventListener("change", syncCertFimState);
    syncCertFimState();
  }

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const typeKey = tab.dataset.type;
      if (!typeMap.has(typeKey)) return;
      tabs.forEach((btn) => btn.classList.toggle("is-active", btn === tab));
      const type = typeMap.get(typeKey);
      titleEl.textContent = type.title;
      form.dataset.type = typeKey;
      setActiveSection(typeKey);
      statusEl.textContent = "";
    });
  });
  setActiveSection(form.dataset.type || "projects");

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (form.dataset.submitting === "true") return;
    form.dataset.submitting = "true";
    statusEl.textContent = "Salvando...";

    const typeKey = form.dataset.type || "projects";
    const type = typeMap.get(typeKey) || types[0];
    const formData = new FormData(form);

    let payload = {};
    if (typeKey === "projects") {
      const inicio = formData.get("dataInicio");
      const fim = formData.get("dataFinal");
      payload = {
        title: String(formData.get("title") || ""),
        descricao: String(formData.get("descricao") || ""),
        url: String(formData.get("url") || ""),
        dataInicio: inicio ? new Date(String(inicio)) : null,
        dataFinal: fim ? new Date(String(fim)) : null,
        finalizado: formData.get("finalizado") === "on"
      };
    } else if (typeKey === "certificates") {
      const inicio = formData.get("certInicio");
      const fim = formData.get("certFim");
      const certAtual = formData.get("certAtual") === "on";
      payload = {
        title: String(formData.get("certTitulo") || ""),
        instituicao: String(formData.get("certInstituicao") || ""),
        dataInicio: inicio ? new Date(String(inicio)) : null,
        dataFinal: certAtual ? null : (fim ? new Date(String(fim)) : null),
        atual: certAtual,
        formacao: formData.get("certFormacao") === "on"
      };
    } else if (typeKey === "experiences") {
      const entrada = formData.get("entrada");
      const saida = formData.get("saida");
      const trabalhoAtual = formData.get("trabalhoAtual") === "on";
      payload = {
        empresa: String(formData.get("empresa") || ""),
        cargo: String(formData.get("cargo") || ""),
        dataEntrada: entrada ? new Date(String(entrada)) : null,
        dataSaida: trabalhoAtual ? null : (saida ? new Date(String(saida)) : null),
        trabalhoAtual
      };
    }

    try {
      await addDoc(collection(db, typeKey), payload);
      statusEl.textContent = type.success;
      form.reset();
      window.setTimeout(close, 800);
    } catch (error) {
      statusEl.textContent = "Erro ao salvar o projeto.";
    } finally {
      form.dataset.submitting = "false";
    }
  });
}

function ensureProjectPopupStyles() {
  if (document.getElementById("project-popup-styles")) return;
  const style = document.createElement("style");
  style.id = "project-popup-styles";
  style.textContent = `
    .project-popup-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.6);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 24px;
      z-index: 9999;
    }
    .project-popup-card {
      width: min(760px, 94vw);
      background: #0f1115;
      color: #f4f6fb;
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 16px;
      padding: 20px;
      box-shadow: 0 20px 50px rgba(0, 0, 0, 0.35);
      font-family: inherit;
    }
    .project-popup-shell {
      display: flex;
      gap: 18px;
      align-items: stretch;
    }
    .project-popup-nav {
      display: flex;
      flex-direction: column;
      gap: 8px;
      min-width: 160px;
      padding-right: 16px;
      border-right: 1px solid rgba(255, 255, 255, 0.12);
    }
    .project-popup-tab {
      border: 1px solid rgba(255, 255, 255, 0.15);
      background: transparent;
      color: inherit;
      padding: 8px 10px;
      text-align: left;
      font-size: 12px;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      cursor: pointer;
      border-radius: 10px;
      transition: border-color 0.2s ease, background 0.2s ease;
      font-family: inherit;
    }
    .project-popup-tab.is-active {
      border-color: rgba(255, 255, 255, 0.45);
      background: rgba(255, 255, 255, 0.08);
    }
    .project-popup-body {
      flex: 1;
      min-width: 0;
    }
    .project-popup-title {
      font-size: 18px;
      margin-bottom: 12px;
      text-transform: uppercase;
      letter-spacing: 0.08em;
    }
    .project-popup-section.is-hidden {
      display: none;
    }
    .project-popup-form label {
      display: flex;
      flex-direction: column;
      gap: 6px;
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      margin-bottom: 12px;
    }
    .project-popup-form input,
    .project-popup-form textarea {
      background: rgba(255, 255, 255, 0.06);
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 8px;
      padding: 10px 12px;
      color: inherit;
      font-size: 14px;
      font-family: inherit;
    }
    .project-popup-form textarea {
      resize: vertical;
    }
    .project-popup-row {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
      gap: 12px;
    }
    .project-popup-check {
      flex-direction: row;
      align-items: center;
      gap: 8px;
      font-size: 12px;
      margin-bottom: 16px;
    }
    .project-popup-check input {
      width: 16px;
      height: 16px;
      margin: 0;
    }
    .project-popup-actions {
      display: flex;
      justify-content: flex-end;
      gap: 10px;
      margin-top: 8px;
    }
    .project-popup-actions button {
      border: none;
      border-radius: 999px;
      padding: 8px 18px;
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      cursor: pointer;
      font-family: inherit;
    }
    .project-popup-cancel {
      background: transparent;
      color: inherit;
      border: 1px solid rgba(255, 255, 255, 0.2);
    }
    .project-popup-submit {
      background: #f4f6fb;
      color: #0f1115;
    }
    .project-popup-status {
      margin-top: 10px;
      font-size: 12px;
      min-height: 16px;
      opacity: 0.8;
    }
    @media (max-width: 640px) {
      .project-popup-shell {
        flex-direction: column;
      }
      .project-popup-nav {
        flex-direction: row;
        padding-right: 0;
        padding-bottom: 12px;
        border-right: none;
        border-bottom: 1px solid rgba(255, 255, 255, 0.12);
      }
      .project-popup-tab {
        flex: 1;
        text-align: center;
      }
    }
  `;
  document.head.appendChild(style);
}
