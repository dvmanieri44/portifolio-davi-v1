import { collection, getDocs } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

export function initMenuPanel(db) {
  const contentMap = {
    "Home": "Ol ! Meu nome ‚ Davi Manieri, sou T‚cnico de Desenvolvimento de Sistemas e tenho forma‡Æo conclu¡da em Python, al‚m de habilidades com outras linguagens de programa‡Æo, l¢gica e exatas, juntamente com a dedica‡Æo e o empenho em cada atividade que me ‚ requisitada!\nEstou … disposi‡Æo para realizar trabalhos que estejam inseridos dentro do meu contexto de forma‡Æo acadˆmica!",
    "Projetos": "Carregando projetos...",
    "Experiencia": "Carregando experiencia...",
    "Certificados": "Carregando certificados...",
    "Fale comigo": "- LinkedIn: <a href=\"https://www.linkedin.com/in/davi-ponce-manieri/\" target=\"_blank\" rel=\"noopener\">linkedin.com/in/davi-ponce-manieri</a>\n- GitHub: <a href=\"https://github.com/dvmanieri44\" target=\"_blank\" rel=\"noopener\">github.com/dvmanieri44</a>\n- Telefone: +55 (16) 997037115\n- Email: dvponce3@gmail.com"
  };
  const panel = document.querySelector('[data-panel]');
  const buttons = document.querySelectorAll('.menu-btn');
  if (!panel || buttons.length === 0) return;

  function setPanel(label) {
    panel.classList.add('is-animating');
    window.setTimeout(() => {
      if (label === "Projetos") {
        panel.innerHTML = contentMap[label];
        panel.classList.remove('is-animating');
        loadProjects(panel, db);
        return;
      }
      if (label === "Experiencia") {
        panel.innerHTML = contentMap[label];
        panel.classList.remove('is-animating');
        loadExperiences(panel, db);
        return;
      }
      if (label === "Certificados") {
        panel.innerHTML = contentMap[label];
        panel.classList.remove('is-animating');
        loadCertificates(panel, db);
        return;
      }
      panel.innerHTML = contentMap[label] || label;
      panel.classList.remove('is-animating');
    }, 180);
  }

  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      if (btn.tagName === 'A' && btn.hasAttribute('download')) {
        return;
      }
      setPanel(btn.textContent.trim());
    });
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
  return date ? date.toLocaleDateString("pt-BR") : "";
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
      panel.innerHTML = "Nenhum projeto cadastrado.";
      return;
    }

    const html = items.map((item) => {
      const title = escapeHtml(item.title);
      const desc = escapeHtml(item.descricao);
      const url = typeof item.url === "string" ? item.url : "";
      const inicio = formatDate(item.dataInicio);
      const fim = formatDate(item.dataFinal);
      const status = item.finalizado ? "Finalizado" : "Em andamento";
      const dateText = [inicio, fim].filter(Boolean).join(" - ");
      const meta = [dateText, status].filter(Boolean).join("   ");
      const link = url
        ? `<a class="project-link" href="${escapeHtml(url)}" target="_blank" rel="noopener">Abrir projeto</a>`
        : "";

      return `
        <li class="project-item">
          <div class="project-title">${title || "Projeto"}</div>
          ${meta ? `<div class="project-meta">${meta}</div>` : ""}
          ${desc ? `<div class="project-desc">${desc}</div>` : ""}
          ${link}
        </li>
      `;
    }).join("");

    panel.innerHTML = `<ul class="project-list">${html}</ul>`;
  } catch (error) {
    panel.innerHTML = "NÆo foi poss¡vel carregar os projetos.";
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
      panel.innerHTML = "Nenhuma experiencia cadastrada.";
      return;
    }

    const html = items.map((item) => {
      const empresa = escapeHtml(item.empresa);
      const cargo = escapeHtml(item.cargo);
      const entrada = formatDate(item.dataEntrada);
      const saida = item.trabalhoAtual ? "Atual" : formatDate(item.dataSaida);
      const periodo = [entrada, saida].filter(Boolean).join(" - ");
      const status = item.trabalhoAtual ? "Trabalho atual" : "";
      const meta = [periodo, status].filter(Boolean).join("  ·  ");

      return `
        <li class="experience-item">
          <span class="experience-dot"></span>
          <div class="experience-card">
            <div class="experience-role">${cargo || "Cargo"}</div>
            <div class="experience-company">${empresa || "Empresa"}</div>
            ${meta ? `<div class="experience-meta">${meta}</div>` : ""}
          </div>
        </li>
      `;
    }).join("");

    panel.innerHTML = `<ul class="experience-timeline">${html}</ul>`;
  } catch (error) {
    panel.innerHTML = "N’o foi poss­vel carregar as experiencias.";
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
      panel.innerHTML = "Nenhum certificado cadastrado.";
      return;
    }

    const html = items.map((item) => {
      const title = escapeHtml(item.title);
      const instituicao = escapeHtml(item.instituicao);
      const inicio = formatDate(item.dataInicio);
      const fim = item.atual ? "Atual" : formatDate(item.dataFinal);
      const periodo = [inicio, fim].filter(Boolean).join(" - ");
      const status = item.atual ? "Em andamento" : "";
      const formacao = item.formacao ? "Formacao" : "";
      const meta = [periodo, status, formacao].filter(Boolean).join("  ·  ");

      return `
        <li class="certificate-item">
          <div class="certificate-title">${title || "Certificado"}</div>
          ${instituicao ? `<div class="certificate-org">${instituicao}</div>` : ""}
          ${meta ? `<div class="certificate-meta">${meta}</div>` : ""}
        </li>
      `;
    }).join("");

    panel.innerHTML = `<ul class="certificate-list">${html}</ul>`;
  } catch (error) {
    panel.innerHTML = "Nao foi possivel carregar os certificados.";
  }
}
