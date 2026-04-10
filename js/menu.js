import { collection, getDocs } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";
import { t } from "./i18n.js";

const itemCache = {};

export function initMenuPanel(db, options = {}) {
  let currentSection = null;
  let initialized = false;
  const panel = document.querySelector('[data-panel]');
  const buttons = document.querySelectorAll('.menu-btn[data-section]');
  if (!panel || buttons.length === 0) return () => {};

  function contentMap() {
    return {
      projects: t("panelProjectsLoading"),
      experiences: t("panelExperiencesLoading"),
      certificates: t("panelCertificatesLoading"),
      contact: t("panelContact")
    };
  }

  function updateActiveButton(section) {
    buttons.forEach((btn) => {
      btn.classList.toggle('is-active', btn.dataset.section === section);
    });
  }

  function pulseFrame() {
    const frame = document.querySelector('.hero-frame');
    if (!frame) return;
    frame.classList.remove('is-pulsing');
    void frame.offsetWidth;
    frame.classList.add('is-pulsing');
    frame.addEventListener('animationend', () => frame.classList.remove('is-pulsing'), { once: true });
  }

  function setPanel(section) {
    // Limpa terminal se estava na home
    if (panel._terminalCleanup) {
      panel._terminalCleanup();
      delete panel._terminalCleanup;
    }

    const map = contentMap();
    const wasInitialized = initialized;
    currentSection = section;
    initialized = true;

    updateActiveButton(section);
    if (wasInitialized) pulseFrame();
    document.dispatchEvent(new CustomEvent('sectionchange', { detail: section }));

    panel.classList.add('is-animating');
    window.setTimeout(() => {
      if (section === "home") {
        panel.innerHTML = '';
        panel.classList.remove('is-animating');
        loadHome(panel, db).catch(console.error);
        return;
      }
      if (section === "projects") {
        panel.innerHTML = map["projects"];
        panel.classList.remove('is-animating');
        loadProjects(panel, db, options);
        return;
      }
      if (section === "experiences") {
        panel.innerHTML = map["experiences"];
        panel.classList.remove('is-animating');
        loadExperiences(panel, db, options);
        return;
      }
      if (section === "certificates") {
        panel.innerHTML = map["certificates"];
        panel.classList.remove('is-animating');
        loadCertificates(panel, db, options);
        return;
      }
      if (section === "contact") {
        panel.innerHTML = '';
        panel.classList.remove('is-animating');
        loadContact(panel);
        return;
      }
      panel.innerHTML = map[section] || section;
      panel.classList.remove('is-animating');
    }, 180);
  }

  setPanel("home");

  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const section = btn.dataset.section;
      if (section) setPanel(section);
    });
  });

  // Delegação de eventos para botões admin
  panel.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-action]');
    if (!btn) return;
    const action = btn.dataset.action;
    const typeKey = btn.dataset.type;
    const docId = btn.dataset.id;

    if (action === 'add') { options.onAdd?.(typeKey); return; }

    if (action === 'edit') {
      const item = itemCache[typeKey]?.find((i) => i.id === docId);
      if (item) options.onEdit?.(typeKey, item);
      return;
    }

    if (action === 'delete') {
      if (btn.dataset.confirming) {
        options.onDelete?.(typeKey, docId);
      } else {
        btn.dataset.confirming = '1';
        btn.textContent = t('adminDeleteConfirm');
        btn.classList.add('is-confirming');
        window.setTimeout(() => {
          if (btn.dataset.confirming) {
            delete btn.dataset.confirming;
            btn.textContent = t('adminDelete');
            btn.classList.remove('is-confirming');
          }
        }, 3000);
      }
    }
  });

  document.addEventListener("languagechange", () => {
    if (currentSection) setPanel(currentSection);
  });

  return () => { if (currentSection) setPanel(currentSection); };
}

// ─── HOME / TERMINAL ─────────────────────────────────────────────────────────

async function loadHome(panel, db) {
  panel.innerHTML = `
    <div class="terminal">
      <div class="terminal-output"></div>
      <div class="terminal-history"></div>
      <div class="terminal-input-line" style="display:none" data-terminal-input>
        <span class="terminal-prompt">&gt;&nbsp;</span>
        <span class="terminal-typed" data-typed></span><span class="terminal-cursor">▌</span>
      </div>
    </div>
  `;

  const terminal    = panel.querySelector('.terminal');
  const output      = panel.querySelector('.terminal-output');
  const history     = panel.querySelector('.terminal-history');
  const inputLine   = panel.querySelector('[data-terminal-input]');
  const typedSpan   = panel.querySelector('[data-typed]');

  // Typewriter e, em paralelo, busca contagem de projetos
  await typewriterEffect(output, t('panelHome'));
  animateCounters(output);
  fetchProjectCount(output, db);

  // Mostra linha de input
  inputLine.style.display = 'flex';
  terminal.scrollTop = terminal.scrollHeight;

  // Controle do input do terminal
  let currentInput = '';

  const handleKey = (e) => {
    // Ignora se o foco está num input real (popup, select, etc.)
    const focused = document.activeElement;
    if (focused && focused !== document.body && !focused.closest('.terminal')) return;
    if (e.ctrlKey || e.altKey || e.metaKey) return;

    if (e.key === 'Enter') {
      e.preventDefault();
      const cmd = currentInput.trim();
      currentInput = '';
      typedSpan.textContent = '';
      runCommand(cmd, history, terminal);
    } else if (e.key === 'Backspace') {
      e.preventDefault();
      currentInput = currentInput.slice(0, -1);
      typedSpan.textContent = currentInput;
    } else if (e.key.length === 1) {
      currentInput += e.key;
      typedSpan.textContent = currentInput;
    }
  };

  document.addEventListener('keydown', handleKey);

  // Cleanup ao sair da home
  panel._terminalCleanup = () => document.removeEventListener('keydown', handleKey);
}

// Efeito typewriter: digita o texto visível e depois faz fade para versão HTML
function typewriterEffect(container, html) {
  return new Promise((resolve) => {
    const temp = document.createElement('div');
    temp.innerHTML = html;
    const plain = temp.textContent;

    let i = 0;
    container.textContent = '';

    // Qualquer tecla visível pula a animação
    const onSkip = (e) => {
      if (e.key.length === 1 || e.key === 'Enter') {
        clearInterval(timer);
        finalize();
      }
    };
    document.addEventListener('keydown', onSkip);

    const finalize = () => {
      document.removeEventListener('keydown', onSkip);
      container.style.transition = 'opacity 0.12s ease';
      container.style.opacity = '0';
      setTimeout(() => {
        container.innerHTML = html;
        container.style.opacity = '1';
        resolve();
      }, 110);
    };

    // Velocidade: 3 chars / 18ms ≈ ~1.7s para 280 chars
    const timer = setInterval(() => {
      i += 3;
      container.textContent = plain.slice(0, i);
      if (i >= plain.length) {
        clearInterval(timer);
        finalize();
      }
    }, 18);
  });
}

function runCommand(cmd, history, terminal) {
  const cmdLower = cmd.toLowerCase();

  if (!cmdLower) return;

  const cmdLine = document.createElement('div');
  cmdLine.className = 'terminal-command-line';
  cmdLine.textContent = `> ${cmd}`;

  const response = document.createElement('div');
  response.className = 'terminal-response';

  if (cmdLower === 'help' || cmdLower === 'ajuda') {
    response.innerHTML = t('terminalHelp');

  } else if (cmdLower === 'contact' || cmdLower === 'contato') {
    response.innerHTML = t('terminalContact');

  } else if (cmdLower === 'skills' || cmdLower === 'habilidades') {
    response.innerHTML = t('terminalSkills');

  } else if (cmdLower === 'projects' || cmdLower === 'projetos') {
    // Navega para a seção de projetos via botão
    document.querySelector('.menu-btn[data-section="projects"]')?.click();
    return;

  } else if (cmdLower === 'clear' || cmdLower === 'limpar') {
    history.innerHTML = '';
    return;

  } else {
    response.textContent = `${t('terminalNotFound')}${cmd}`;
  }

  const entry = document.createElement('div');
  entry.className = 'terminal-history-entry';
  entry.appendChild(cmdLine);
  entry.appendChild(response);
  history.appendChild(entry);

  // Scroll para o final
  window.setTimeout(() => { terminal.scrollTop = terminal.scrollHeight; }, 30);
}

// Busca contagem real de projetos no Firebase
async function fetchProjectCount(container, db) {
  try {
    let count;
    if (itemCache["projects"]) {
      count = itemCache["projects"].length;
    } else {
      const snap = await getDocs(collection(db, "projects"));
      count = snap.size;
    }
    const span = container.querySelector('[data-count-dynamic]');
    if (!span) return;
    let cur = 0;
    const timer = setInterval(() => {
      cur++;
      span.textContent = cur;
      if (cur >= count) clearInterval(timer);
    }, 80);
  } catch (_) {
    // silencioso
  }
}

// ─── HELPERS ─────────────────────────────────────────────────────────────────

function animateCounters(container) {
  container.querySelectorAll('[data-count]').forEach((span) => {
    const target = parseInt(span.dataset.count, 10);
    if (isNaN(target)) return;
    let current = 0;
    const timer = setInterval(() => {
      current = Math.min(current + 1, target);
      span.textContent = current;
      if (current >= target) clearInterval(timer);
    }, 45);
  });
}

function buildAdminActions(typeKey, docId, options) {
  if (!options.getAdminMode?.()) return '';
  return `
    <div class="item-admin-actions">
      <button class="admin-action-btn" data-action="edit" data-type="${typeKey}" data-id="${escapeHtml(docId)}">${t("adminEdit")}</button>
      <button class="admin-action-btn is-delete" data-action="delete" data-type="${typeKey}" data-id="${escapeHtml(docId)}">${t("adminDelete")}</button>
    </div>
  `;
}

function buildAddButton(typeKey, options) {
  if (!options.getAdminMode?.()) return '';
  return `<li class="admin-add-item"><button class="admin-add-btn" data-action="add" data-type="${typeKey}">+</button></li>`;
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;").replace(/'/g, "&#39;");
}

function toDate(value) {
  if (!value) return null;
  if (typeof value.toDate === "function") return value.toDate();
  if (typeof value.seconds === "number") return new Date(value.seconds * 1000);
  const p = new Date(value);
  return Number.isNaN(p.getTime()) ? null : p;
}

function formatDate(value) {
  const date = toDate(value);
  const locale = document.documentElement.lang || "pt-BR";
  return date ? date.toLocaleDateString(locale) : "";
}

function getFirebaseErrorHint(error) {
  if (window.location.protocol === "file:") return t("firebaseHintFileProtocol");
  const code = String(error?.code || "");
  if (code === "permission-denied" || code === "firestore/permission-denied") return t("firebaseHintPermission");
  if (code === "unavailable" || code === "firestore/unavailable") return t("firebaseHintUnavailable");
  return t("firebaseHintGeneric");
}

function renderFirestoreError(baseKey, error) {
  return `<div class="panel-error"><strong>${t(baseKey)}</strong><div>${getFirebaseErrorHint(error)}</div></div>`;
}

// ─── SEÇÕES ──────────────────────────────────────────────────────────────────

function loadContact(panel) {
  const items = [
    {
      label: t('contactLabelLinkedIn'),
      value: 'linkedin.com/in/davi-ponce-manieri',
      href: 'https://www.linkedin.com/in/davi-ponce-manieri/',
    },
    {
      label: t('contactLabelGitHub'),
      value: 'github.com/dvmanieri44',
      href: 'https://github.com/dvmanieri44',
    },
    {
      label: t('contactLabelEmail'),
      value: 'dvponce3@gmail.com',
      copy: true,
    },
    {
      label: t('contactLabelPhone'),
      value: '+55 (16) 997037115',
      copy: true,
    },
  ];

  const html = items.map((item, index) => {
    const valueHtml = item.href
      ? `<a class="contact-value" href="${escapeHtml(item.href)}" target="_blank" rel="noopener" onclick="event.stopPropagation()">${escapeHtml(item.value)}</a>`
      : `<span class="contact-value">${escapeHtml(item.value)}</span>`;

    const action = item.href
      ? `<span class="contact-arrow">↗</span>`
      : `<button class="contact-copy-btn" data-copy="${escapeHtml(item.value)}">${t('contactCopy')}</button>`;

    const cls = item.href ? 'contact-item--link' : 'contact-item--copy';

    return `
      <li class="contact-item ${cls}" style="animation-delay:${index * 75}ms"
          ${item.href ? `role="link" tabindex="0" data-href="${escapeHtml(item.href)}"` : ''}>
        <span class="contact-label">${escapeHtml(item.label)}</span>
        ${valueHtml}
        ${action}
      </li>`;
  }).join('');

  panel.innerHTML = `<ul class="contact-list">${html}</ul>`;

  // Clique no card abre o link
  panel.querySelectorAll('[data-href]').forEach((li) => {
    li.addEventListener('click', () => window.open(li.dataset.href, '_blank', 'noopener'));
    li.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') window.open(li.dataset.href, '_blank', 'noopener');
    });
  });

  // Copiar para área de transferência
  panel.querySelectorAll('.contact-copy-btn').forEach((btn) => {
    btn.addEventListener('click', async (e) => {
      e.stopPropagation();
      try {
        await navigator.clipboard.writeText(btn.dataset.copy);
        btn.textContent = t('contactCopied');
        btn.classList.add('is-copied');
        window.setTimeout(() => {
          btn.textContent = t('contactCopy');
          btn.classList.remove('is-copied');
        }, 2000);
      } catch (_) {}
    });
  });
}

async function loadProjects(panel, db, options) {
  try {
    const snapshot = await getDocs(collection(db, "projects"));
    const items = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    itemCache["projects"] = items;
    items.sort((a, b) => (toDate(a.dataInicio)?.getTime() ?? 0) - (toDate(b.dataInicio)?.getTime() ?? 0));

    if (items.length === 0 && !options.getAdminMode?.()) { panel.innerHTML = t("emptyProjects"); return; }

    const html = items.map((item, index) => {
      const title   = escapeHtml(item.title);
      const desc    = escapeHtml(item.descricao);
      const url     = typeof item.url === "string" ? item.url : "";
      const inicio  = formatDate(item.dataInicio);
      const fim     = formatDate(item.dataFinal);
      const status  = item.finalizado ? t("projectStatusDone") : t("projectStatusOngoing");
      const meta    = [inicio, fim].filter(Boolean).join(" – ");
      const link    = url ? `<a class="project-link" href="${escapeHtml(url)}" target="_blank" rel="noopener">${t("projectLinkOpen")}</a>` : "";
      const ds      = item.finalizado ? "done" : "ongoing";

      return `
        <li class="project-item" data-status="${ds}" style="animation-delay:${index * 60}ms">
          ${buildAdminActions("projects", item.id, options)}
          <div class="project-title">${title || t("menuProjects")}</div>
          ${meta ? `<div class="project-meta">${meta}</div>` : ""}
          ${desc ? `<div class="project-desc">${desc}</div>` : ""}
          <div class="project-meta" style="margin-top:6px">
            <span class="project-status-dot"></span>${status}
          </div>
          ${link}
        </li>`;
    }).join("");

    panel.innerHTML = `<ul class="project-list">${html}${buildAddButton("projects", options)}</ul>`;
  } catch (error) {
    console.error(error);
    panel.innerHTML = renderFirestoreError("errorProjects", error);
  }
}

async function loadExperiences(panel, db, options) {
  try {
    const snapshot = await getDocs(collection(db, "experiences"));
    const items = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    itemCache["experiences"] = items;
    items.sort((a, b) => (toDate(b.dataEntrada)?.getTime() ?? 0) - (toDate(a.dataEntrada)?.getTime() ?? 0));

    if (items.length === 0 && !options.getAdminMode?.()) { panel.innerHTML = t("emptyExperiences"); return; }

    const html = items.map((item, index) => {
      const empresa = escapeHtml(item.empresa);
      const cargo   = escapeHtml(item.cargo);
      const entrada = formatDate(item.dataEntrada);
      const year    = toDate(item.dataEntrada)?.getFullYear() || "";
      const saida   = item.trabalhoAtual ? t("labelCurrent") : formatDate(item.dataSaida);
      const periodo = [entrada, saida].filter(Boolean).join(" – ");
      const cls     = item.trabalhoAtual ? " experience-item--current" : "";

      return `
        <li class="experience-item${cls}" style="animation-delay:${index * 70}ms">
          <span class="experience-dot"></span>
          <div class="experience-card">
            ${buildAdminActions("experiences", item.id, options)}
            <div class="experience-role">${cargo || t("popupLabelRole")}</div>
            <div class="experience-company">${empresa || t("popupLabelCompany")}</div>
            ${periodo || year ? `<div class="experience-meta">${year ? `<span class="exp-year">${year}</span>` : ""}${periodo}</div>` : ""}
          </div>
        </li>`;
    }).join("");

    panel.innerHTML = `<ul class="experience-timeline">${html}${buildAddButton("experiences", options)}</ul>`;
  } catch (error) {
    console.error(error);
    panel.innerHTML = renderFirestoreError("errorExperiences", error);
  }
}

async function loadCertificates(panel, db, options) {
  try {
    const snapshot = await getDocs(collection(db, "certificates"));
    const items = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    itemCache["certificates"] = items;

    const formacaoItems = items
      .filter((i) => i.formacao)
      .sort((a, b) => (toDate(b.dataInicio)?.getTime() ?? 0) - (toDate(a.dataInicio)?.getTime() ?? 0));

    const certItems = items
      .filter((i) => !i.formacao)
      .sort((a, b) => (toDate(b.dataInicio)?.getTime() ?? 0) - (toDate(a.dataInicio)?.getTime() ?? 0));

    if (items.length === 0 && !options.getAdminMode?.()) {
      panel.innerHTML = t("emptyCertificates");
      return;
    }

    let globalIndex = 0;

    const buildCertHtml = (item) => {
      const delay       = globalIndex++ * 55;
      const title       = escapeHtml(item.title);
      const instituicao = escapeHtml(item.instituicao);
      const inicio      = formatDate(item.dataInicio);
      const fim         = item.atual ? t("labelCurrent") : formatDate(item.dataFinal);
      const periodo     = [inicio, fim].filter(Boolean).join(" – ");
      const logoUrl     = typeof item.logoUrl === "string" && item.logoUrl ? item.logoUrl : "";
      const logoHtml    = logoUrl
        ? `<img class="certificate-logo" src="${escapeHtml(logoUrl)}" alt="" loading="lazy">`
        : "";

      // Badge de status
      let badgeClass = "cert-badge--done";
      let badgeText  = "";
      if (item.atual) {
        badgeClass = "cert-badge--active";
        badgeText  = t("certificateStatusCurrent");
      } else if (item.dataFinal) {
        const year = toDate(item.dataFinal)?.getFullYear();
        badgeText  = year ? String(year) : t("certBadgeDone");
      }
      const badgeHtml = badgeText
        ? `<span class="cert-badge ${badgeClass}">${badgeText}</span>`
        : "";

      const cls = item.formacao ? " certificate-item--formacao" : "";

      return `
        <li class="certificate-item${cls}" style="animation-delay:${delay}ms">
          ${buildAdminActions("certificates", item.id, options)}
          ${logoHtml}
          <div class="certificate-title">${title || t("menuCertificates")}</div>
          <div class="certificate-org-row">
            ${instituicao ? `<span class="certificate-org">${instituicao}</span>` : "<span></span>"}
            ${badgeHtml}
          </div>
          ${periodo ? `<div class="certificate-meta">${periodo}</div>` : ""}
        </li>`;
    };

    const formacaoHtml = formacaoItems.length > 0
      ? `<li class="cert-section-label">— ${t("certSectionFormacao")} —</li>` + formacaoItems.map(buildCertHtml).join("")
      : "";

    const certsHtml = certItems.length > 0
      ? `<li class="cert-section-label">— ${t("certSectionCerts")} —</li>` + certItems.map(buildCertHtml).join("")
      : "";

    const totalCerts  = certItems.length;
    const totalForm   = formacaoItems.length;
    const summaryParts = [];
    if (totalCerts > 0) summaryParts.push(`<span data-count="${totalCerts}">0</span> ${t("certSectionCerts").toLowerCase()}`);
    if (totalForm  > 0) summaryParts.push(`<span data-count="${totalForm}">0</span> ${t("certSectionFormacao").toLowerCase()}`);

    panel.innerHTML = `
      <div class="cert-panel">
        <div class="cert-summary">${summaryParts.join("  ·  ")}</div>
        <ul class="certificate-list">
          ${formacaoHtml}${certsHtml}${buildAddButton("certificates", options)}
        </ul>
      </div>`;

    animateCounters(panel);
  } catch (error) {
    console.error(error);
    panel.innerHTML = renderFirestoreError("errorCertificates", error);
  }
}
