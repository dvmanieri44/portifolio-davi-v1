import { collection, getDocs } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";
import { t } from "./i18n.js";

export function initMenuPanel(db) {
  let currentSection = null;
  const panel = document.querySelector('[data-panel]');
  const buttons = document.querySelectorAll('.menu-btn');
  if (!panel || buttons.length === 0) return;

  function contentMap() {
    return {
      home: t("panelHome"),
      projects: t("panelProjectsLoading"),
      experiences: t("panelExperiencesLoading"),
      certificates: t("panelCertificatesLoading"),
      contact: t("panelContact")
    };
  }

  function setPanel(section) {
    const map = contentMap();
    currentSection = section;
    panel.classList.add('is-animating');
    window.setTimeout(() => {
      if (section === "projects") {
        panel.innerHTML = map[section];
        panel.classList.remove('is-animating');
        loadProjects(panel, db);
        return;
      }
      if (section === "experiences") {
        panel.innerHTML = map[section];
        panel.classList.remove('is-animating');
        loadExperiences(panel, db);
        return;
      }
      if (section === "certificates") {
        panel.innerHTML = map[section];
        panel.classList.remove('is-animating');
        loadCertificates(panel, db);
        return;
      }
      panel.innerHTML = map[section] || section;
      panel.classList.remove('is-animating');
    }, 180);
  }

  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      if (btn.tagName === 'A' && btn.hasAttribute('download')) {
        return;
      }
      const section = btn.dataset.section || btn.textContent.trim();
      setPanel(section);
    });
  });

  document.addEventListener("languagechange", () => {
    if (currentSection) {
      setPanel(currentSection);
    }
  });
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function toDate(value) {
  if (!value) return null;
  if (typeof value.toDate === "function") return value.toDate();
  if (typeof value.seconds === "number") return new Date(value.seconds * 1000);
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function formatDate(value) {
  const date = toDate(value);
  const locale = document.documentElement.lang || "pt-BR";
  return date ? date.toLocaleDateString(locale) : "";
}

async function loadProjects(panel, db) {
  try {
    const snapshot = await getDocs(collection(db, "projects"));
    const items = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

    items.sort((a, b) => {
      const da = toDate(a.dataInicio)?.getTime() ?? 0;
      const dbTime = toDate(b.dataInicio)?.getTime() ?? 0;
      return da - dbTime;
    });

    if (items.length === 0) {
      panel.innerHTML = t("emptyProjects");
      return;
    }

    const html = items.map((item) => {
      const title = escapeHtml(item.title);
      const desc = escapeHtml(item.descricao);
      const url = typeof item.url === "string" ? item.url : "";
      const inicio = formatDate(item.dataInicio);
      const fim = formatDate(item.dataFinal);
      const status = item.finalizado ? t("projectStatusDone") : t("projectStatusOngoing");
      const dateText = [inicio, fim].filter(Boolean).join(" - ");
      const meta = [dateText, status].filter(Boolean).join("  ·  ");
      const link = url
        ? `<a class="project-link" href="${escapeHtml(url)}" target="_blank" rel="noopener">${t("projectLinkOpen")}</a>`
        : "";

      return `
        <li class="project-item">
          <div class="project-title">${title || t("menuProjects")}</div>
          ${meta ? `<div class="project-meta">${meta}</div>` : ""}
          ${desc ? `<div class="project-desc">${desc}</div>` : ""}
          ${link}
        </li>
      `;
    }).join("");

    panel.innerHTML = `<ul class="project-list">${html}</ul>`;
  } catch (error) {
    panel.innerHTML = t("errorProjects");
  }
}

async function loadExperiences(panel, db) {
  try {
    const snapshot = await getDocs(collection(db, "experiences"));
    const items = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

    items.sort((a, b) => {
      const da = toDate(a.dataEntrada)?.getTime() ?? 0;
      const dbTime = toDate(b.dataEntrada)?.getTime() ?? 0;
      return dbTime - da;
    });

    if (items.length === 0) {
      panel.innerHTML = t("emptyExperiences");
      return;
    }

    const html = items.map((item) => {
      const empresa = escapeHtml(item.empresa);
      const cargo = escapeHtml(item.cargo);
      const entrada = formatDate(item.dataEntrada);
      const saida = item.trabalhoAtual ? t("labelCurrent") : formatDate(item.dataSaida);
      const periodo = [entrada, saida].filter(Boolean).join(" - ");
      const status = item.trabalhoAtual ? t("experienceCurrent") : "";
      const meta = [periodo, status].filter(Boolean).join("  ·  ");

      return `
        <li class="experience-item">
          <span class="experience-dot"></span>
          <div class="experience-card">
            <div class="experience-role">${cargo || t("popupLabelRole")}</div>
            <div class="experience-company">${empresa || t("popupLabelCompany")}</div>
            ${meta ? `<div class="experience-meta">${meta}</div>` : ""}
          </div>
        </li>
      `;
    }).join("");

    panel.innerHTML = `<ul class="experience-timeline">${html}</ul>`;
  } catch (error) {
    panel.innerHTML = t("errorExperiences");
  }
}

async function loadCertificates(panel, db) {
  try {
    const snapshot = await getDocs(collection(db, "certificates"));
    const items = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

    items.sort((a, b) => {
      const fa = a.formacao ? 1 : 0;
      const fb = b.formacao ? 1 : 0;
      if (fa !== fb) return fb - fa;
      const da = toDate(a.dataInicio)?.getTime() ?? 0;
      const dbTime = toDate(b.dataInicio)?.getTime() ?? 0;
      return dbTime - da;
    });

    if (items.length === 0) {
      panel.innerHTML = t("emptyCertificates");
      return;
    }

    const html = items.map((item) => {
      const title = escapeHtml(item.title);
      const instituicao = escapeHtml(item.instituicao);
      const inicio = formatDate(item.dataInicio);
      const fim = item.atual ? t("labelCurrent") : formatDate(item.dataFinal);
      const periodo = [inicio, fim].filter(Boolean).join(" - ");
      const status = item.atual ? t("certificateStatusCurrent") : "";
      const formacao = item.formacao ? t("certificateFormacao") : "";
      const meta = [periodo, status, formacao].filter(Boolean).join("  ·  ");

      return `
        <li class="certificate-item">
          <div class="certificate-title">${title || t("menuCertificates")}</div>
          ${instituicao ? `<div class="certificate-org">${instituicao}</div>` : ""}
          ${meta ? `<div class="certificate-meta">${meta}</div>` : ""}
        </li>
      `;
    }).join("");

    panel.innerHTML = `<ul class="certificate-list">${html}</ul>`;
  } catch (error) {
    panel.innerHTML = t("errorCertificates");
  }
}


