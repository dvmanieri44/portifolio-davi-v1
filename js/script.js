import { initFirebase } from "./firebase.js";
import { startSplashTimeline } from "./animations.js";
import { initLanguageSwitcher, t } from "./i18n.js";
import { initMenuPanel } from "./menu.js";
import {
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  collection
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

const db = initFirebase();

let adminMode = false;
let refreshPanel = null;

initLanguageSwitcher();
initThemeSwitcher();
initSecretPrompt();

startSplashTimeline(() => {
  refreshPanel = initMenuPanel(db, {
    getAdminMode: () => adminMode,
    onAdd: (typeKey) => openProjectPopup(db, typeKey, null),
    onEdit: (typeKey, item) => openProjectPopup(db, typeKey, item),
    onDelete: async (typeKey, docId) => {
      try {
        await deleteDoc(doc(db, typeKey, docId));
        refreshPanel?.();
      } catch (error) {
        console.error("Failed to delete document.", error);
      }
    }
  });

  initVisuals();
});

// ─── VISUALS ────────────────────────────────────────────────────────────────

function initVisuals() {
  initLogoHover();
  initSectionIndicator();
  initFooterClock();
  initRipple();
  initCustomCursor();

  // Glitch no h1 após as animações de entrada terminarem
  window.setTimeout(() => {
    const h1 = document.querySelector('h1');
    if (!h1) return;
    h1.classList.add('glitch-active');
    h1.addEventListener('animationend', () => h1.classList.remove('glitch-active'), { once: true });
  }, 1100);
}

function initLogoHover() {
  const logo = document.querySelector('.logo');
  if (!logo || logo.querySelector('.logo-extra')) return;
  const extra = document.createElement('span');
  extra.className = 'logo-extra';
  extra.textContent = 'M';
  logo.appendChild(extra);
}

function initSectionIndicator() {
  if (document.querySelector('.section-indicator')) return;

  const sections = ['home', 'projects', 'certificates', 'experiences', 'contact'];
  const nav = document.createElement('nav');
  nav.className = 'section-indicator';
  nav.setAttribute('aria-hidden', 'true');
  nav.innerHTML = sections
    .map((s) => `<span class="si-dot${s === 'home' ? ' is-active' : ''}" data-section="${s}"></span>`)
    .join('');
  document.body.appendChild(nav);

  document.addEventListener('sectionchange', (e) => {
    nav.querySelectorAll('.si-dot').forEach((dot) => {
      dot.classList.toggle('is-active', dot.dataset.section === e.detail);
    });
  });
}

function initFooterClock() {
  const footer = document.querySelector('.footer');
  if (!footer || footer.querySelector('.footer-clock')) return;

  const clock = document.createElement('span');
  clock.className = 'footer-clock';
  footer.querySelector('span:last-child')?.after(clock);

  const update = () => {
    const time = new Date().toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'America/Sao_Paulo'
    });
    clock.textContent = `· ${time}`;
  };

  update();
  setInterval(update, 1000);
}

function initRipple() {
  document.querySelectorAll('.menu-btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const rect = btn.getBoundingClientRect();
      const ripple = document.createElement('span');
      ripple.className = 'btn-ripple';
      ripple.style.left = `${e.clientX - rect.left}px`;
      ripple.style.top = `${e.clientY - rect.top}px`;
      btn.appendChild(ripple);
      ripple.addEventListener('animationend', () => ripple.remove(), { once: true });
    });
  });
}

function initCustomCursor() {
  // Só em dispositivos com mouse (pointer: fine)
  if (!window.matchMedia('(pointer: fine)').matches) return;

  const cursor = document.createElement('div');
  cursor.className = 'custom-cursor';
  document.body.appendChild(cursor);
  document.body.classList.add('has-custom-cursor');

  document.addEventListener('mousemove', (e) => {
    cursor.style.left = `${e.clientX}px`;
    cursor.style.top = `${e.clientY}px`;
  });

  const interactive = 'a, button, input, textarea, select, label, [role="button"]';

  document.addEventListener('mouseover', (e) => {
    if (e.target.closest(interactive)) cursor.classList.add('is-hover');
  });

  document.addEventListener('mouseout', (e) => {
    if (e.target.closest(interactive)) cursor.classList.remove('is-hover');
  });

  document.addEventListener('mouseleave', () => { cursor.style.opacity = '0'; });
  document.addEventListener('mouseenter', () => { cursor.style.opacity = '1'; });
}

// ─── ADMIN ───────────────────────────────────────────────────────────────────

function enableAdminMode() {
  adminMode = true;
  const navRight = document.querySelector('.nav-right');
  if (navRight && !navRight.querySelector('.admin-badge')) {
    const badge = document.createElement('span');
    badge.className = 'admin-badge';
    badge.textContent = t('adminModeActive');
    navRight.appendChild(badge);
  }
  refreshPanel?.();
}

function initSecretPrompt() {
  const target = document.querySelector(".footer span");
  if (!target) return;

  let clicks = 0;
  target.addEventListener("click", () => {
    clicks += 1;
    if (clicks < 5) return;
    clicks = 0;
    const answer = window.prompt(t("promptPassword"));
    if (answer === "2040") {
      if (adminMode) {
        openProjectPopup(db, "projects", null);
      } else {
        enableAdminMode();
      }
    } else if (answer !== null) {
      window.alert(t("promptWrongPassword"));
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

// ─── CRUD POPUP ──────────────────────────────────────────────────────────────

function toDateInputValue(value) {
  if (!value) return "";
  let date;
  if (typeof value.toDate === "function") date = value.toDate();
  else if (typeof value.seconds === "number") date = new Date(value.seconds * 1000);
  else date = new Date(value);
  if (isNaN(date.getTime())) return "";
  return date.toISOString().split("T")[0];
}

function openProjectPopup(db, initialTypeKey = "projects", existingDoc = null) {
  if (!db) return;
  if (document.querySelector(".project-popup-overlay")) return;

  ensureProjectPopupStyles();

  const isEditing = !!existingDoc;
  const overlay = document.createElement("div");
  overlay.className = "project-popup-overlay";

  const types = [
    {
      key: "projects",
      label: t("popupTabProjects"),
      title: isEditing ? t("popupTitleEditProject") : t("popupTitleProject"),
      success: t("popupStatusProjectSaved"),
      updated: t("popupStatusProjectUpdated")
    },
    {
      key: "certificates",
      label: t("popupTabCertificates"),
      title: isEditing ? t("popupTitleEditCertificate") : t("popupTitleCertificate"),
      success: t("popupStatusCertificateSaved"),
      updated: t("popupStatusCertificateUpdated")
    },
    {
      key: "experiences",
      label: t("popupTabExperiences"),
      title: isEditing ? t("popupTitleEditExperience") : t("popupTitleExperience"),
      success: t("popupStatusExperienceSaved"),
      updated: t("popupStatusExperienceUpdated")
    }
  ];
  const typeMap = new Map(types.map((type) => [type.key, type]));

  const activeTypeKey = initialTypeKey || "projects";
  const activeType = typeMap.get(activeTypeKey) || types[0];

  const card = document.createElement("div");
  card.className = "project-popup-card";
  card.innerHTML = `
    <div class="project-popup-shell">
      <nav class="project-popup-nav" aria-label="${t("popupAriaAdd")}">
        ${types.map((type) => `
          <button type="button"
            class="project-popup-tab${type.key === activeTypeKey ? " is-active" : ""}${isEditing && type.key !== activeTypeKey ? " is-disabled" : ""}"
            data-type="${type.key}"
            ${isEditing && type.key !== activeTypeKey ? "disabled" : ""}>
            ${type.label}
          </button>
        `).join("")}
      </nav>
      <div class="project-popup-body">
        <div class="project-popup-title" data-popup-title>${activeType.title}</div>
        <form class="project-popup-form" data-type="${activeTypeKey}">
          <div class="project-popup-section${activeTypeKey !== "projects" ? " is-hidden" : ""}" data-section="projects">
            <label>${t("popupLabelTitle")}<input name="title" type="text" autocomplete="off" required></label>
            <label>${t("popupLabelDescription")}<textarea name="descricao" rows="3"></textarea></label>
            <label>${t("popupLabelUrl")}<input name="url" type="url" autocomplete="off"></label>
            <div class="project-popup-row">
              <label>${t("popupLabelStart")}<input name="dataInicio" type="date"></label>
              <label>${t("popupLabelEnd")}<input name="dataFinal" type="date"></label>
            </div>
            <label class="project-popup-check">
              <input name="finalizado" type="checkbox"> ${t("popupLabelFinished")}
            </label>
          </div>
          <div class="project-popup-section${activeTypeKey !== "certificates" ? " is-hidden" : ""}" data-section="certificates">
            <label>${t("popupLabelTitle")}<input name="certTitulo" type="text" autocomplete="off" required></label>
            <label>${t("popupLabelInstitution")}<input name="certInstituicao" type="text" autocomplete="off" required></label>
            <label>${t("popupLabelLogoUrl")}<input name="certLogo" type="url" autocomplete="off"></label>
            <label class="project-popup-check">
              <input name="certFormacao" type="checkbox"> ${t("certificateFormacao")}
            </label>
            <div class="project-popup-row">
              <label>${t("popupLabelStart")}<input name="certInicio" type="date" required></label>
              <label>${t("popupLabelEnd")}<input name="certFim" type="date"></label>
            </div>
            <label class="project-popup-check">
              <input name="certAtual" type="checkbox"> ${t("popupLabelCurrent")}
            </label>
          </div>
          <div class="project-popup-section${activeTypeKey !== "experiences" ? " is-hidden" : ""}" data-section="experiences">
            <label>${t("popupLabelCompany")}<input name="empresa" type="text" autocomplete="off" required></label>
            <label>${t("popupLabelRole")}<input name="cargo" type="text" autocomplete="off" required></label>
            <div class="project-popup-row">
              <label>${t("popupLabelEntryDate")}<input name="entrada" type="date" required></label>
              <label>${t("popupLabelExitDate")}<input name="saida" type="date"></label>
            </div>
            <label class="project-popup-check">
              <input name="trabalhoAtual" type="checkbox"> ${t("popupLabelCurrentJob")}
            </label>
          </div>
          <div class="project-popup-actions">
            <button type="button" class="project-popup-cancel">${t("popupButtonCancel")}</button>
            <button type="submit" class="project-popup-submit">
              ${isEditing ? t("popupButtonUpdate") : t("popupButtonSave")}
            </button>
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
      section.querySelectorAll("input, textarea, select").forEach((f) => { f.disabled = !isActive; });
    });
  };

  // Pré-preencher ao editar
  if (isEditing && existingDoc) {
    if (activeTypeKey === "projects") {
      card.querySelector('[name="title"]').value = existingDoc.title || "";
      card.querySelector('[name="descricao"]').value = existingDoc.descricao || "";
      card.querySelector('[name="url"]').value = existingDoc.url || "";
      card.querySelector('[name="dataInicio"]').value = toDateInputValue(existingDoc.dataInicio);
      card.querySelector('[name="dataFinal"]').value = toDateInputValue(existingDoc.dataFinal);
      card.querySelector('[name="finalizado"]').checked = !!existingDoc.finalizado;
    } else if (activeTypeKey === "certificates") {
      card.querySelector('[name="certTitulo"]').value = existingDoc.title || "";
      card.querySelector('[name="certInstituicao"]').value = existingDoc.instituicao || "";
      card.querySelector('[name="certLogo"]').value = existingDoc.logoUrl || "";
      card.querySelector('[name="certFormacao"]').checked = !!existingDoc.formacao;
      card.querySelector('[name="certInicio"]').value = toDateInputValue(existingDoc.dataInicio);
      card.querySelector('[name="certFim"]').value = toDateInputValue(existingDoc.dataFinal);
      card.querySelector('[name="certAtual"]').checked = !!existingDoc.atual;
    } else if (activeTypeKey === "experiences") {
      card.querySelector('[name="empresa"]').value = existingDoc.empresa || "";
      card.querySelector('[name="cargo"]').value = existingDoc.cargo || "";
      card.querySelector('[name="entrada"]').value = toDateInputValue(existingDoc.dataEntrada);
      card.querySelector('[name="saida"]').value = toDateInputValue(existingDoc.dataSaida);
      card.querySelector('[name="trabalhoAtual"]').checked = !!existingDoc.trabalhoAtual;
    }
  }

  function close() { overlay.remove(); }

  cancelBtn.addEventListener("click", close);
  overlay.addEventListener("click", (e) => { if (e.target === overlay) close(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") close(); }, { once: true });

  if (trabalhoAtualInput && saidaInput) {
    const sync = () => { saidaInput.disabled = trabalhoAtualInput.checked; if (trabalhoAtualInput.checked) saidaInput.value = ""; };
    trabalhoAtualInput.addEventListener("change", sync);
    sync();
  }

  if (certAtualInput && certFimInput) {
    const sync = () => { certFimInput.disabled = certAtualInput.checked; if (certAtualInput.checked) certFimInput.value = ""; };
    certAtualInput.addEventListener("change", sync);
    sync();
  }

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      if (tab.disabled || isEditing) return;
      const typeKey = tab.dataset.type;
      if (!typeMap.has(typeKey)) return;
      tabs.forEach((btn) => btn.classList.toggle("is-active", btn === tab));
      titleEl.textContent = typeMap.get(typeKey).title;
      form.dataset.type = typeKey;
      setActiveSection(typeKey);
      statusEl.textContent = "";
    });
  });

  setActiveSection(form.dataset.type || "projects");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (form.dataset.submitting === "true") return;
    form.dataset.submitting = "true";
    statusEl.textContent = t("popupStatusSaving");

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
        logoUrl: String(formData.get("certLogo") || ""),
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
      if (isEditing && existingDoc?.id) {
        await updateDoc(doc(db, typeKey, existingDoc.id), payload);
        statusEl.textContent = type.updated;
      } else {
        await addDoc(collection(db, typeKey), payload);
        statusEl.textContent = type.success;
      }
      form.reset();
      window.setTimeout(() => { close(); refreshPanel?.(); }, 800);
    } catch (error) {
      statusEl.textContent = t("popupStatusError");
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
      background: rgba(0, 0, 0, 0.65);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 24px;
      z-index: 9999;
    }
    .project-popup-card {
      width: min(760px, 94vw);
      background: var(--bg);
      color: var(--text);
      border: 1px solid var(--line);
      border-radius: 16px;
      padding: 20px;
      box-shadow: 0 24px 60px rgba(0, 0, 0, 0.4);
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
      min-width: 155px;
      padding-right: 16px;
      border-right: 1px solid var(--line);
    }
    .project-popup-tab {
      border: 1px solid var(--line);
      background: transparent;
      color: var(--text);
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
      border-color: var(--muted);
      background: var(--input-bg);
    }
    .project-popup-tab.is-disabled,
    .project-popup-tab:disabled {
      opacity: 0.3;
      cursor: default;
    }
    .project-popup-body { flex: 1; min-width: 0; }
    .project-popup-title {
      font-size: 17px;
      margin-bottom: 12px;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: var(--text-strong);
    }
    .project-popup-section.is-hidden { display: none; }
    .project-popup-form label {
      display: flex;
      flex-direction: column;
      gap: 6px;
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      margin-bottom: 10px;
      color: var(--muted);
    }
    .project-popup-form input,
    .project-popup-form textarea {
      background: var(--input-bg);
      border: 1px solid var(--line);
      border-radius: 8px;
      padding: 9px 11px;
      color: var(--text);
      font-size: 14px;
      font-family: inherit;
      transition: border-color 0.2s;
    }
    .project-popup-form input:focus,
    .project-popup-form textarea:focus {
      outline: none;
      border-color: var(--muted);
    }
    .project-popup-form textarea { resize: vertical; }
    .project-popup-row {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
      gap: 12px;
    }
    .project-popup-check {
      flex-direction: row !important;
      align-items: center;
      gap: 8px;
      font-size: 11px;
      margin-bottom: 14px;
    }
    .project-popup-check input { width: 15px; height: 15px; margin: 0; }
    .project-popup-actions {
      display: flex;
      justify-content: flex-end;
      gap: 10px;
      margin-top: 10px;
    }
    .project-popup-actions button {
      border: none;
      border-radius: 999px;
      padding: 8px 18px;
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      cursor: pointer;
      font-family: inherit;
      transition: opacity 0.2s;
    }
    .project-popup-actions button:hover { opacity: 0.8; }
    .project-popup-cancel {
      background: transparent;
      color: var(--text);
      border: 1px solid var(--line) !important;
    }
    .project-popup-submit {
      background: var(--text-strong);
      color: var(--bg);
    }
    .project-popup-status {
      margin-top: 10px;
      font-size: 11px;
      min-height: 16px;
      opacity: 0.75;
      letter-spacing: 0.05em;
    }
    @media (max-width: 640px) {
      .project-popup-shell { flex-direction: column; }
      .project-popup-nav {
        flex-direction: row;
        padding-right: 0;
        padding-bottom: 12px;
        border-right: none;
        border-bottom: 1px solid var(--line);
      }
      .project-popup-tab { flex: 1; text-align: center; }
    }
  `;
  document.head.appendChild(style);
}
