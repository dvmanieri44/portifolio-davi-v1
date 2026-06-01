import { initFirebase } from "./firebase.js";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
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

function periodLabel(start, end, current = false) {
  const startYear = yearOf(start);
  const endYear = current ? "em curso" : yearOf(end);
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
  return {
    ...item,
    title: item.title || "Formação",
    org: item.instituicao || "",
    period: periodLabel(item.dataInicio, item.dataFinal, item.atual),
    current: !!item.atual,
    kind: "technical",
  };
}

function normalizeCertificate(item) {
  return {
    ...item,
    title: item.title || "Certificado",
    org: item.instituicao || "",
    year: yearOf(item.dataFinal || item.dataInicio),
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
  const [projects, certificates, experiences, profile] = await Promise.all([
    fetchCollection("projects"),
    fetchCollection("certificates"),
    fetchCollection("experiences"),
    fetchProfileSettings(),
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
    .sort((a, b) => (toDate(b.dataInicio)?.getTime() ?? 0) - (toDate(a.dataInicio)?.getTime() ?? 0))
    .map(normalizeCertificate);

  window.PORTFOLIO_DATA = {
    ...base,
    identity: {
      ...base.identity,
      ...(profile.identity || {}),
      youtube: mergeYoutubeSettings(profile),
    },
    projects: orderedProjects,
    experiences: orderedExperiences,
    education,
    certificates: certs,
    summary: {
      ...base.summary,
      totalProjects: orderedProjects.length,
      totalCerts: certs.length + education.length,
    },
  };
  window.dispatchEvent(new CustomEvent("portfolio-data-ready"));
}

window.PORTFOLIO_ADMIN = {
  refresh: refreshPortfolioData,
  async create(type, payload) {
    await addDoc(collection(db, type), payload);
    await refreshPortfolioData();
  },
  async update(type, id, payload) {
    await updateDoc(doc(db, type, id), payload);
    await refreshPortfolioData();
  },
  async remove(type, id) {
    await deleteDoc(doc(db, type, id));
    await refreshPortfolioData();
  },
  async saveProfile(payload) {
    await setDoc(doc(db, "settings", "profile"), payload, { merge: true });
    await refreshPortfolioData();
  },
};

refreshPortfolioData().catch((error) => {
  console.error("Falha ao carregar dados do Firestore.", error);
  window.dispatchEvent(new CustomEvent("portfolio-data-error", { detail: error }));
});
