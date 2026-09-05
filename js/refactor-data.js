import { initFirebase } from "./firebase.js";
import {
  collection,
  doc,
  getDoc,
  getDocs,
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

const db = initFirebase();
const base = window.PORTFOLIO_DATA;

function toDate(value) {
  if (!value) return null;
  if (typeof value.toDate === "function") return value.toDate();
  if (typeof value.seconds === "number") return new Date(value.seconds * 1000);
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function yearOf(value) {
  return toDate(value)?.getFullYear()?.toString() || "";
}

function orderValue(item) {
  const rawValue = item?.ordem ?? item?.order;
  if (rawValue === "" || rawValue === null || rawValue === undefined) return null;
  const value = Number(rawValue);
  return Number.isFinite(value) ? value : null;
}

function compareCertificates(a, b) {
  const orderA = orderValue(a);
  const orderB = orderValue(b);

  if (orderA !== null || orderB !== null) {
    if (orderA === null) return 1;
    if (orderB === null) return -1;
    if (orderA !== orderB) return orderA - orderB;
  }

  return (toDate(b.dataInicio)?.getTime() ?? 0) - (toDate(a.dataInicio)?.getTime() ?? 0);
}

function compareByOrder(a, b) {
  const orderA = orderValue(a);
  const orderB = orderValue(b);
  if (orderA === null && orderB === null) return String(a.name || "").localeCompare(String(b.name || ""));
  if (orderA === null) return 1;
  if (orderB === null) return -1;
  return orderA - orderB;
}

function periodLabel(start, end, current = false, currentLabel = "em curso") {
  const startYear = yearOf(start);
  const endYear = current ? currentLabel : yearOf(end);
  return [startYear, endYear].filter(Boolean).join(" — ");
}

function normalizeProject(item, index) {
  return {
    ...item,
    index: String(index + 1).padStart(2, "0"),
    name: item.title || "Projeto",
    tagline: item.title || "Projeto",
    description: item.descricao || "",
    stack: item.stack || [],
    status: item.finalizado ? "done" : "ongoing",
    year: yearOf(item.dataInicio),
    role: item.role || "",
  };
}

function normalizeExperience(item) {
  return {
    ...item,
    role: item.cargo || "Cargo",
    company: item.empresa || "Empresa",
    meta: item.meta || "",
    period: {
      start: yearOf(item.dataEntrada),
      end: item.trabalhoAtual ? null : yearOf(item.dataSaida),
    },
    current: !!item.trabalhoAtual,
    summary: item.summary || "",
  };
}

function normalizeEducation(item) {
  const explicitUrl = typeof item.url === "string" ? item.url : "";
  const fileUrl = typeof item.fileUrl === "string" ? item.fileUrl : "";
  const imageUrl = typeof item.imageUrl === "string" ? item.imageUrl : "";
  const legacyUrl = typeof item.logoUrl === "string" ? item.logoUrl : "";
  return {
    ...item,
    title: item.title || "Formação",
    org: item.instituicao || "",
    url: explicitUrl || fileUrl || imageUrl || legacyUrl,
    period: periodLabel(item.dataInicio, item.dataFinal, item.atual),
    periodEn: periodLabel(item.dataInicio, item.dataFinal, item.atual, "in progress"),
    current: !!item.atual,
    kind: "technical",
  };
}

function normalizeCertificate(item) {
  const explicitUrl = typeof item.url === "string" ? item.url : "";
  const fileUrl = typeof item.fileUrl === "string" ? item.fileUrl : "";
  const imageUrl = typeof item.imageUrl === "string" ? item.imageUrl : "";
  const legacyUrl = typeof item.logoUrl === "string" ? item.logoUrl : "";
  return {
    ...item,
    title: item.title || "Certificado",
    org: item.instituicao || "",
    url: explicitUrl || fileUrl || imageUrl || legacyUrl,
    ordem: orderValue(item),
    year: yearOf(item.dataFinal || item.dataInicio),
    skillId: typeof item.skillId === "string" ? item.skillId : "",
    fileName: typeof item.fileName === "string" ? item.fileName : "",
    mimeType: typeof item.mimeType === "string" ? item.mimeType : "",
  };
}

function normalizeSkill(item) {
  return {
    ...item,
    name: item.name || item.nome || "Skill",
    description: item.description || item.descricao || "",
    ordem: orderValue(item),
  };
}

async function fetchCollection(name) {
  const snapshot = await getDocs(collection(db, name));
  return snapshot.docs.map((entry) => ({ id: entry.id, ...entry.data() }));
}

async function fetchProfileSettings() {
  try {
    const snapshot = await getDoc(doc(db, "settings", "profile"));
    return snapshot.exists() ? snapshot.data() : {};
  } catch (error) {
    console.warn("Falha ao carregar settings/profile.", error);
    return {};
  }
}

function mergeYoutubeSettings(profile) {
  const local = base.identity.youtube || {};
  const remote = profile.youtube || {};
  return {
    ...local,
    ...remote,
    featuredVideo: {
      ...(local.featuredVideo || {}),
      ...(remote.featuredVideo || {}),
    },
  };
}

async function refreshPortfolioData() {
  const [projects, certificates, experiences, profile, skills] = await Promise.all([
    fetchCollection("projects"),
    fetchCollection("certificates"),
    fetchCollection("experiences"),
    fetchProfileSettings(),
    fetchCollection("skills").catch((error) => {
      console.warn("Falha ao carregar skills; usando fallback local.", error);
      return [];
    }),
  ]);

  const orderedProjects = projects
    .sort((a, b) => (toDate(a.dataInicio)?.getTime() ?? 0) - (toDate(b.dataInicio)?.getTime() ?? 0))
    .map(normalizeProject);
  const orderedExperiences = experiences
    .sort((a, b) => (toDate(b.dataEntrada)?.getTime() ?? 0) - (toDate(a.dataEntrada)?.getTime() ?? 0))
    .map(normalizeExperience);
  const education = certificates
    .filter((item) => item.formacao)
    .sort((a, b) => (toDate(b.dataInicio)?.getTime() ?? 0) - (toDate(a.dataInicio)?.getTime() ?? 0))
    .map(normalizeEducation);
  const certs = certificates
    .filter((item) => !item.formacao)
    .sort(compareCertificates)
    .map(normalizeCertificate);
  const orderedSkills = skills.sort(compareByOrder).map(normalizeSkill);

  const publishedProjects = orderedProjects.length ? orderedProjects : base.projects;
  const publishedExperiences = orderedExperiences.length ? orderedExperiences : base.experiences;
  const publishedEducation = education.length ? education : base.education;
  const publishedCertificates = certs.length ? certs : base.certificates;
  const publishedSkills = orderedSkills.length ? orderedSkills : base.skills;

  window.PORTFOLIO_DATA = {
    ...base,
    identity: {
      ...base.identity,
      ...(profile.identity || {}),
      youtube: mergeYoutubeSettings(profile),
    },
    projects: publishedProjects,
    experiences: publishedExperiences,
    education: publishedEducation,
    certificates: publishedCertificates,
    skills: publishedSkills,
    summary: {
      ...base.summary,
      totalProjects: publishedProjects.length,
      totalCerts: publishedCertificates.length,
    },
  };
  window.dispatchEvent(new CustomEvent("portfolio-data-ready"));
}

refreshPortfolioData().catch((error) => {
  console.error("Falha ao carregar dados do Firestore.", error);
  window.dispatchEvent(new CustomEvent("portfolio-data-error", { detail: error }));
});
