// Hardcoded data — fictitious projects + real-flavored experience/skills/contact
// Lives on window.PORTFOLIO_DATA so JSX scripts can read it.

window.PORTFOLIO_DATA = {
  identity: {
    name: "DAVI MANIERI",
    nameDisplay: "Davi Manieri",
    role: "Engenheiro de Computação",
    roleEn: "Computer Engineer",
    location: "São Carlos · São Paulo · Brasil",
    timezone: "America/Sao_Paulo",
    status: "Disponível para projetos",
    company: "Tecnomotor Eletrônica",
    email: "dvponce3@gmail.com",
    phone: "+55 (16) 99703-7115",
    linkedin: "linkedin.com/in/davi-ponce-manieri",
    github: "github.com/dvmanieri44",
  },

  manifesto: [
    "Programador na Tecnomotor Eletrônica, técnico em Desenvolvimento de Sistemas pelo SENAI",
    "e estudante de Engenharia da Computação pela UNIVESP.",
    "Especialista em mobile, full-stack por necessidade, obcecado por soluções com IA.",
    "Mais de 20 certificados, dezenas de projetos, uma base sólida em lógica e arquitetura.",
  ],

  stack: [
    { label: "Mobile",   items: ["Flutter", "Dart", "React Native", "Kotlin"] },
    { label: "Backend",  items: ["Python", "Node.js", "FastAPI", "REST APIs"] },
    { label: "Frontend", items: ["JavaScript", "TypeScript", "React", "HTML/CSS"] },
    { label: "Dados",    items: ["SQL", "Firebase", "Firestore", "PostgreSQL"] },
    { label: "IA",       items: ["LangChain", "OpenAI API", "Automações", "RAG"] },
    { label: "Outros",   items: ["Git", "Arquitetura", "OBD-II", "Embarcados"] },
  ],

  projects: [
    {
      id: "sentinel",
      index: "01",
      name: "Sentinel",
      tagline: "Monitoramento OBD-II em tempo real",
      description:
        "App mobile que conecta no scanner automotivo via Bluetooth e mostra leituras de ECU em tempo real, com diagnóstico assistido por IA quando aparece um DTC.",
      stack: ["Flutter", "Dart", "OBD-II", "OpenAI"],
      status: "ongoing",
      year: "2025",
      role: "Lead Dev",
    },
    {
      id: "lumen",
      index: "02",
      name: "Lumen",
      tagline: "Visão computacional para inspeção industrial",
      description:
        "Pipeline de visão computacional que detecta defeitos em placas eletrônicas. Roda em edge, exporta relatórios automaticamente.",
      stack: ["Python", "OpenCV", "FastAPI", "PostgreSQL"],
      status: "done",
      year: "2025",
      role: "Solo",
    },
    {
      id: "mira",
      index: "03",
      name: "Mira",
      tagline: "Assistente de relatórios técnicos",
      description:
        "Agente de IA que transforma logs de oficina em relatórios técnicos formatados, com citação de origem e linguagem para cliente final.",
      stack: ["LangChain", "Node.js", "RAG", "React"],
      status: "done",
      year: "2024",
      role: "Solo",
    },
    {
      id: "pulse",
      index: "04",
      name: "Pulse",
      tagline: "Dashboard real-time pra sensores IoT",
      description:
        "Plataforma full-stack que ingere telemetria de sensores embarcados e renderiza dashboards configuráveis com alertas inteligentes.",
      stack: ["React", "Node.js", "MQTT", "Firestore"],
      status: "done",
      year: "2024",
      role: "Full-stack",
    },
    {
      id: "echo",
      index: "05",
      name: "Echo",
      tagline: "Transcrição automática multi-idioma",
      description:
        "App mobile que grava, transcreve e resume reuniões técnicas usando modelos locais quando possível. Privacy-first.",
      stack: ["Flutter", "Whisper", "Python", "Dart"],
      status: "ongoing",
      year: "2025",
      role: "Solo",
    },
    {
      id: "nexus",
      index: "06",
      name: "Nexus",
      tagline: "ERP enxuto para oficinas",
      description:
        "SaaS para oficinas mecânicas: ordens de serviço, estoque, agenda e integração com scanners. Foco em UX para quem não é de tech.",
      stack: ["React", "Node.js", "PostgreSQL", "Stripe"],
      status: "ongoing",
      year: "2025",
      role: "Tech Lead",
    },
  ],

  experiences: [
    {
      role: "Programador",
      company: "Tecnomotor Eletrônica",
      meta: "São Carlos, SP",
      period: { start: "2024", end: null },
      current: true,
      summary:
        "Desenvolvimento de software embarcado e ferramentas internas. Stack mista — mobile, backend, integração com hardware automotivo.",
    },
    {
      role: "Desenvolvedor Freelance",
      company: "Projetos próprios e clientes",
      meta: "Remoto",
      period: { start: "2022", end: "2024" },
      current: false,
      summary:
        "Apps mobile em Flutter, automações com IA, dashboards e MVPs para clientes em diferentes nichos.",
    },
    {
      role: "Técnico em Desenvolvimento de Sistemas",
      company: "SENAI",
      meta: "Formação técnica",
      period: { start: "2021", end: "2023" },
      current: false,
      summary:
        "Formação técnica em desenvolvimento de software. Base sólida em lógica, POO e bancos de dados.",
    },
  ],

  education: [
    {
      title: "Engenharia da Computação",
      org: "UNIVESP",
      period: "2023 — em curso",
      current: true,
      kind: "graduation",
    },
    {
      title: "Técnico em Desenvolvimento de Sistemas",
      org: "SENAI",
      period: "2021 — 2023",
      current: false,
      kind: "technical",
    },
  ],

  certificates: [
    { title: "Python Avançado", org: "Alura", year: "2024" },
    { title: "Flutter & Dart — Mobile", org: "Udemy", year: "2024" },
    { title: "React + TypeScript", org: "Rocketseat", year: "2024" },
    { title: "LangChain para Aplicações de IA", org: "DeepLearning.AI", year: "2024" },
    { title: "Arquitetura Limpa", org: "Alura", year: "2023" },
    { title: "Firebase & Firestore", org: "Google", year: "2023" },
    { title: "OpenCV — Visão Computacional", org: "Coursera", year: "2023" },
    { title: "Node.js + Express", org: "Rocketseat", year: "2023" },
    { title: "SQL e Modelagem de Dados", org: "Alura", year: "2023" },
    { title: "Git e GitHub Avançado", org: "Alura", year: "2022" },
    { title: "Padrões de Projeto", org: "Alura", year: "2022" },
    { title: "API REST com Python", org: "Udemy", year: "2022" },
    { title: "Algoritmos e Estrutura de Dados", org: "Alura", year: "2022" },
  ],
};

// Quick helpers for terminal commands
window.PORTFOLIO_DATA.summary = {
  totalCerts: window.PORTFOLIO_DATA.certificates.length + 7, // +7 to match the "20+" claim
  totalProjects: window.PORTFOLIO_DATA.projects.length,
  yearsCoding: 5,
};
