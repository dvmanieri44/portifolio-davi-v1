import { initFirebase } from "./firebase.js";
import { startSplashTimeline } from "./animations.js";
import { initLanguageSwitcher } from "./i18n.js";
import { initMenuPanel } from "./menu.js";
import { addDoc, collection } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

const db = initFirebase();

initLanguageSwitcher();
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

function openProjectPopup(db) {
  if (!db) return;
  if (document.querySelector(".project-popup-overlay")) return;

  ensureProjectPopupStyles();

  const overlay = document.createElement("div");
  overlay.className = "project-popup-overlay";

  const card = document.createElement("div");
  card.className = "project-popup-card";
  card.innerHTML = `
    <div class="project-popup-title">Novo projeto</div>
    <form class="project-popup-form">
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
      <div class="project-popup-actions">
        <button type="button" class="project-popup-cancel">Cancelar</button>
        <button type="submit" class="project-popup-submit">Salvar</button>
      </div>
      <div class="project-popup-status" aria-live="polite"></div>
    </form>
  `;

  overlay.appendChild(card);
  document.body.appendChild(overlay);

  const form = card.querySelector(".project-popup-form");
  const cancelBtn = card.querySelector(".project-popup-cancel");
  const statusEl = card.querySelector(".project-popup-status");

  function close() {
    overlay.remove();
  }

  cancelBtn.addEventListener("click", close);
  overlay.addEventListener("click", (event) => {
    if (event.target === overlay) {
      close();
    }
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (form.dataset.submitting === "true") return;
    form.dataset.submitting = "true";
    statusEl.textContent = "Salvando...";

    const formData = new FormData(form);
    const inicio = formData.get("dataInicio");
    const fim = formData.get("dataFinal");

    const payload = {
      title: String(formData.get("title") || ""),
      descricao: String(formData.get("descricao") || ""),
      url: String(formData.get("url") || ""),
      dataInicio: inicio ? new Date(String(inicio)) : null,
      dataFinal: fim ? new Date(String(fim)) : null,
      finalizado: formData.get("finalizado") === "on"
    };

    try {
      await addDoc(collection(db, "projects"), payload);
      statusEl.textContent = "Projeto salvo.";
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
      width: min(520px, 92vw);
      background: #0f1115;
      color: #f4f6fb;
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 16px;
      padding: 20px;
      box-shadow: 0 20px 50px rgba(0, 0, 0, 0.35);
      font-family: inherit;
    }
    .project-popup-title {
      font-size: 18px;
      margin-bottom: 12px;
      text-transform: uppercase;
      letter-spacing: 0.08em;
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
  `;
  document.head.appendChild(style);
}
