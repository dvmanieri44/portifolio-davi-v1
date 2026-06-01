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
    youtube: {
      label: "www.youtube.com/@Code-Club-y8t",
      href: "https://www.youtube.com/@Code-Club-y8t",
      featuredVideo: {
        url: "",
        title: "Video em destaque do canal",
      },
    },
  },

  manifesto: [
    "Programador na Tecnomotor Eletrônica, técnico em Desenvolvimento de Sistemas pelo SENAI",
    "e estudante de Engenharia da Computação pela UNIVESP.",
    "Especialista em mobile, full-stack por necessidade, obcecado por soluções com IA.",
    "Criador do Canal Davi Ponce, voltado para tecnologia e IA.",
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

window.PORTFOLIO_COPY = {
  pt: {
    documentTitle: "Davi Manieri - Portfolio",
    sections: [
      { id: "hero", label: "INICIO" },
      { id: "manifesto", label: "MANIFESTO" },
      { id: "stack", label: "STACK" },
      { id: "projects", label: "PROJETOS" },
      { id: "youtube", label: "YOUTUBE" },
      { id: "experience", label: "EXP" },
      { id: "education", label: "EDUCACAO" },
      { id: "contact", label: "CONTATO" },
    ],
    adminPromptPassword: "Digite a senha",
    adminWrongPassword: "Senha incorreta.",
    splashPrefix: "Portfolio de",
    splashLocation: "Brasil",
    navStatus: "ONLINE",
    heroEyebrow: "ENG. DE COMPUTACAO - DESDE 2020",
    heroRole: "ENGENHEIRO DE COMPUTACAO - MOBILE - IA - FULL-STACK",
    heroPrimaryCta: "VER TRABALHO",
    heroSecondaryCta: "FALAR COMIGO",
    heroStatusLabel: "// status",
    heroCardLines: [
      ["Programador na ", "company", "."],
      ["Tecnico em desenvolvimento de sistemas pelo ", "SENAI", "."],
      ["Estudante de Eng. da Computacao pela ", "UNIVESP", "."],
      ["Especialidade ", "mobile", ", full-stack por consequencia, obcecado por ", "solucoes com IA", "."],
    ],
    heroStats: {
      certificates: "Certificados",
      projects: "Projetos",
      coding: "Codando",
      yearSuffix: "a",
    },
    manifestoMeta: "// quem esta ai?",
    manifestoTag: "Sobre",
    manifestoBody: [
      ["Construo software que ", "funciona em producao", " - nao no slide."],
      ["Mobile, backend, IA. Aprendi escutando hardware automotivo e quebrando coisas ate elas ", "quererem", " obedecer."],
      ["Hoje meu foco e construir ", "ferramentas que poucos conseguem", ": integracoes embarcadas, agentes de IA com objetivo claro e apps que respeitam o usuario."],
      ["Criador do ", "Canal Davi Ponce", ", voltado para tecnologia e IA."],
    ],
    stackMeta: "// ferramentas + materiais",
    stackRows: [
      ["MOBILE", "<em>BACKEND</em>", "FRONTEND", "DADOS", "<em>IA</em>", "EMBARCADOS"],
      ["FLUTTER", "PYTHON", "REACT", "<em>LANGCHAIN</em>", "POSTGRES", "DART", "NODE.JS"],
    ],
    projectsTitle: ["Coisas que ", "existem", "porque eu fiz."],
    projectsMetaSuffix: "projetos selecionados",
    projectStatusOngoing: "EM ANDAMENTO",
    projectStatusDone: "ENTREGUE",
    projectLink: "VER CASE",
    youtubeTitle: ["Tambem ensino ", "tecnologia", " no YouTube."],
    youtubeMeta: "// canal + video em destaque",
    youtubeLead: ["No canal eu compartilho conteudo sobre ", "programacao, IA e projetos reais", " com uma pegada pratica."],
    youtubeVideoFallback: "Video indisponivel. Use o link do canal para assistir no YouTube.",
    youtubeChannelCta: "ABRIR CANAL",
    youtubeVideoCta: "VER NO YOUTUBE",
    experienceTitle: ["Onde ja ", "operei", "."],
    experienceMeta: "// linha do tempo",
    current: "ATUAL",
    present: "Presente",
    educationLabel: "07 / FORMACAO + CERTIFICADOS",
    educationTitle: ["Sempre ", "aprendendo", "."],
    educationMetaSuffix: "+ certificados",
    graduation: "GRADUACAO",
    technical: "TECNICO",
    inProgress: "EM CURSO",
    certificatesSummary: ["Certificados", "em tecnologia"],
    contactMeta: "// disponivel pra projetos",
    contactTitle: ["Bora ", "construir", "algo"],
    contactLead: ["Estou aberto a ", "oportunidades", " em mobile, IA aplicada e backend. Se voce esta construindo algo dificil - me chama."],
    copied: "COPIADO!",
    phoneLabel: "TELEFONE",
    footerLocation: "Sao Carlos - SP - BR",
    footerTime: "LOCAL TIME",
    identityLocation: "Sao Carlos - Sao Paulo - Brasil",
    manifestoData: [
      "Programador na Tecnomotor Eletronica, tecnico em Desenvolvimento de Sistemas pelo SENAI",
      "e estudante de Engenharia da Computacao pela UNIVESP.",
      "Especialista em mobile, full-stack por necessidade, obcecado por solucoes com IA.",
      "Criador do Canal Davi Ponce, voltado para tecnologia e IA.",
      "Mais de 20 certificados, dezenas de projetos, uma base solida em logica e arquitetura.",
    ],
    stackData: [
      { label: "Mobile", items: ["Flutter", "Dart", "React Native", "Kotlin"] },
      { label: "Backend", items: ["Python", "Node.js", "FastAPI", "REST APIs"] },
      { label: "Frontend", items: ["JavaScript", "TypeScript", "React", "HTML/CSS"] },
      { label: "Dados", items: ["SQL", "Firebase", "Firestore", "PostgreSQL"] },
      { label: "IA", items: ["LangChain", "OpenAI API", "Automacoes", "RAG"] },
      { label: "Outros", items: ["Git", "Arquitetura", "OBD-II", "Embarcados"] },
    ],
    projectData: {},
    experienceData: {},
    educationData: {},
    certificateData: {},
    terminal: {
      boot: [
        "› inicializando sessao segura...",
        "› conectado - {location}",
        "› sessao: guest - perfil: read-only",
        "› digite 'help' pra comecar.",
      ],
      commandsAvailable: "comandos disponiveis",
      help: {
        about: "sobre mim",
        skills: "stack tecnica",
        projects: "ultimos projetos",
        exp: "experiencia",
        certs: "certificados (resumo)",
        contact: "como me chamar",
        social: "links sociais",
        whoami: "identidade",
        clear: "limpar terminal",
      },
      projectsSummary: "{total} projetos - {ongoing} em andamento",
      current: "atual",
      present: "presente",
      certsSummary: "certificados em tecnologia",
      more: "...e mais {count}.",
      hireGranted: "[sudo] permissao concedida.",
      waitingContact: "aguardando contato. :)",
      notFound: "comando nao encontrado: '{cmd}'. tente 'help'.",
      placeholder: "digite um comando...",
    },
  },
  en: {
    documentTitle: "Davi Manieri - Portfolio",
    sections: [
      { id: "hero", label: "HOME" },
      { id: "manifesto", label: "MANIFESTO" },
      { id: "stack", label: "STACK" },
      { id: "projects", label: "PROJECTS" },
      { id: "youtube", label: "YOUTUBE" },
      { id: "experience", label: "EXP" },
      { id: "education", label: "EDUCATION" },
      { id: "contact", label: "CONTACT" },
    ],
    adminPromptPassword: "Enter the password",
    adminWrongPassword: "Wrong password.",
    splashPrefix: "Portfolio of",
    splashLocation: "Brazil",
    navStatus: "ONLINE",
    heroEyebrow: "COMPUTER ENGINEERING - SINCE 2020",
    heroRole: "COMPUTER ENGINEER - MOBILE - AI - FULL-STACK",
    heroPrimaryCta: "VIEW WORK",
    heroSecondaryCta: "CONTACT ME",
    heroStatusLabel: "// status",
    heroCardLines: [
      ["Software developer at ", "company", "."],
      ["Systems Development Technician from ", "SENAI", "."],
      ["Computer Engineering student at ", "UNIVESP", "."],
      ["Mobile specialist, full-stack by consequence, focused on ", "AI solutions", "."],
    ],
    heroStats: {
      certificates: "Certificates",
      projects: "Projects",
      coding: "Coding",
      yearSuffix: "y",
    },
    manifestoMeta: "// who is there?",
    manifestoTag: "About",
    manifestoBody: [
      ["I build software that ", "works in production", " - not just on slides."],
      ["Mobile, backend, AI. I learned by listening to automotive hardware and breaking things until they ", "wanted", " to obey."],
      ["Today my focus is building ", "tools few people can build", ": embedded integrations, goal-driven AI agents, and apps that respect the user."],
      ["Creator of ", "Canal Davi Ponce", ", focused on technology and AI."],
    ],
    stackMeta: "// tools + materials",
    stackRows: [
      ["MOBILE", "<em>BACKEND</em>", "FRONTEND", "DATA", "<em>AI</em>", "EMBEDDED"],
      ["FLUTTER", "PYTHON", "REACT", "<em>LANGCHAIN</em>", "POSTGRES", "DART", "NODE.JS"],
    ],
    projectsTitle: ["Things that ", "exist", "because I built them."],
    projectsMetaSuffix: "selected projects",
    projectStatusOngoing: "IN PROGRESS",
    projectStatusDone: "SHIPPED",
    projectLink: "VIEW CASE",
    youtubeTitle: ["I also teach ", "technology", " on YouTube."],
    youtubeMeta: "// channel + featured video",
    youtubeLead: ["On the channel I share practical content about ", "programming, AI, and real projects", "."],
    youtubeVideoFallback: "Video unavailable. Use the channel link to watch on YouTube.",
    youtubeChannelCta: "OPEN CHANNEL",
    youtubeVideoCta: "WATCH ON YOUTUBE",
    experienceTitle: ["Where I have ", "operated", "."],
    experienceMeta: "// timeline",
    current: "CURRENT",
    present: "Present",
    educationLabel: "07 / EDUCATION + CERTIFICATES",
    educationTitle: ["Always ", "learning", "."],
    educationMetaSuffix: "+ certificates",
    graduation: "DEGREE",
    technical: "TECHNICAL",
    inProgress: "IN PROGRESS",
    certificatesSummary: ["Certificates", "in technology"],
    contactMeta: "// available for projects",
    contactTitle: ["Let's ", "build", "something"],
    contactLead: ["I am open to ", "opportunities", " in mobile, applied AI, and backend. If you are building something hard, reach out."],
    copied: "COPIED!",
    phoneLabel: "PHONE",
    footerLocation: "Sao Carlos - SP - BR",
    footerTime: "LOCAL TIME",
    identityLocation: "Sao Carlos - Sao Paulo - Brazil",
    manifestoData: [
      "Software developer at Tecnomotor Eletronica and Systems Development Technician from SENAI.",
      "Computer Engineering student at UNIVESP.",
      "Mobile specialist, full-stack by necessity, focused on AI solutions.",
      "Creator of Canal Davi Ponce, focused on technology and AI.",
      "20+ certificates, several projects, and a solid foundation in logic and architecture.",
    ],
    stackData: [
      { label: "Mobile", items: ["Flutter", "Dart", "React Native", "Kotlin"] },
      { label: "Backend", items: ["Python", "Node.js", "FastAPI", "REST APIs"] },
      { label: "Frontend", items: ["JavaScript", "TypeScript", "React", "HTML/CSS"] },
      { label: "Data", items: ["SQL", "Firebase", "Firestore", "PostgreSQL"] },
      { label: "AI", items: ["LangChain", "OpenAI API", "Automation", "RAG"] },
      { label: "Other", items: ["Git", "Architecture", "OBD-II", "Embedded"] },
    ],
    projectData: {
      sentinel: {
        tagline: "Real-time OBD-II monitoring",
        description: "Mobile app that connects to an automotive scanner over Bluetooth and displays live ECU readings, with AI-assisted diagnostics when a DTC appears.",
      },
      lumen: {
        tagline: "Computer vision for industrial inspection",
        description: "Computer vision pipeline that detects defects in electronic boards. Runs on edge devices and exports reports automatically.",
      },
      mira: {
        tagline: "Technical report assistant",
        description: "AI agent that turns workshop logs into formatted technical reports, with source citations and customer-facing language.",
      },
      pulse: {
        tagline: "Real-time dashboard for IoT sensors",
        description: "Full-stack platform that ingests embedded sensor telemetry and renders configurable dashboards with intelligent alerts.",
      },
      echo: {
        tagline: "Multilingual automatic transcription",
        description: "Mobile app that records, transcribes, and summarizes technical meetings using local models whenever possible. Privacy-first.",
      },
      nexus: {
        tagline: "Lean ERP for workshops",
        description: "SaaS for auto repair shops: service orders, inventory, scheduling, and scanner integration. UX focused on non-technical users.",
      },
    },
    experienceData: {
      "Programador|Tecnomotor Eletronica": {
        role: "Software Developer",
        meta: "Sao Carlos, SP",
        summary: "Development of embedded software and internal tools. Mixed stack: mobile, backend, and automotive hardware integration.",
      },
      "Desenvolvedor Freelance|Projetos proprios e clientes": {
        role: "Freelance Developer",
        company: "Personal projects and clients",
        meta: "Remote",
        summary: "Mobile apps in Flutter, AI automations, dashboards, and MVPs for clients in different niches.",
      },
      "Tecnico em Desenvolvimento de Sistemas|SENAI": {
        role: "Systems Development Technician",
        meta: "Technical education",
        summary: "Technical training in software development. Strong foundation in logic, OOP, and databases.",
      },
    },
    educationData: {
      "Engenharia da Computacao|UNIVESP": {
        title: "Computer Engineering",
        period: "2023 - in progress",
      },
      "Tecnico em Desenvolvimento de Sistemas|SENAI": {
        title: "Systems Development Technician",
        period: "2021 - 2023",
      },
    },
    certificateData: {
      "Python Avancado|Alura": { title: "Advanced Python" },
      "Flutter & Dart - Mobile|Udemy": { title: "Flutter & Dart - Mobile" },
      "LangChain para Aplicacoes de IA|DeepLearning.AI": { title: "LangChain for AI Applications" },
      "Arquitetura Limpa|Alura": { title: "Clean Architecture" },
      "OpenCV - Visao Computacional|Coursera": { title: "OpenCV - Computer Vision" },
      "SQL e Modelagem de Dados|Alura": { title: "SQL and Data Modeling" },
      "Git e GitHub Avancado|Alura": { title: "Advanced Git and GitHub" },
      "Padroes de Projeto|Alura": { title: "Design Patterns" },
      "API REST com Python|Udemy": { title: "REST API with Python" },
      "Algoritmos e Estrutura de Dados|Alura": { title: "Algorithms and Data Structures" },
    },
    terminal: {
      boot: [
        "› starting secure session...",
        "› connected - {location}",
        "› session: guest - profile: read-only",
        "› type 'help' to begin.",
      ],
      commandsAvailable: "available commands",
      help: {
        about: "about me",
        skills: "technical stack",
        projects: "latest projects",
        exp: "experience",
        certs: "certificates (summary)",
        contact: "how to reach me",
        social: "social links",
        whoami: "identity",
        clear: "clear terminal",
      },
      projectsSummary: "{total} projects - {ongoing} in progress",
      current: "current",
      present: "present",
      certsSummary: "certificates in technology",
      more: "...and {count} more.",
      hireGranted: "[sudo] permission granted.",
      waitingContact: "waiting for contact. :)",
      notFound: "command not found: '{cmd}'. try 'help'.",
      placeholder: "type a command...",
    },
  },
};

function portfolioNormalizeKey(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[—–]/g, "-")
    .replace(/\s+/g, " ")
    .trim();
}

window.getPortfolioCopy = function getPortfolioCopy(lang) {
  return window.PORTFOLIO_COPY[lang] || window.PORTFOLIO_COPY.pt;
};

window.getPortfolioData = function getPortfolioData(lang) {
  const base = window.PORTFOLIO_DATA;
  const copy = window.getPortfolioCopy(lang);
  const isEnglish = lang === "en";

  const translateByKey = (item, map, keyParts, englishFields = {}) => {
    const key = keyParts.map((part) => portfolioNormalizeKey(item[part])).join("|");
    const explicit = isEnglish
      ? Object.entries(englishFields).reduce((acc, [target, sources]) => {
          const value = sources.map((source) => item[source]).find(Boolean);
          return value ? { ...acc, [target]: value } : acc;
        }, {})
      : {};
    return { ...item, ...(map[key] || {}), ...explicit };
  };

  return {
    ...base,
    identity: {
      ...base.identity,
      role: isEnglish ? (base.identity.roleEn || "Computer Engineer") : base.identity.role,
      location: copy.identityLocation || base.identity.location,
      status: isEnglish ? "Available for projects" : base.identity.status,
    },
    manifesto: copy.manifestoData || base.manifesto,
    stack: copy.stackData || base.stack,
    projects: base.projects.map((project) => {
      const fallback = copy.projectData?.[project.id] || {};
      return translateByKey(
        { ...project, ...fallback },
        {},
        ["name"],
        {
          name: ["nameEn", "titleEn"],
          tagline: ["taglineEn", "titleEn"],
          description: ["descriptionEn", "descricaoEn"],
        },
      );
    }),
    experiences: base.experiences.map((item) => translateByKey(item, copy.experienceData || {}, ["role", "company"], {
      role: ["roleEn", "cargoEn"],
      company: ["companyEn", "empresaEn"],
      meta: ["metaEn"],
      summary: ["summaryEn"],
    })),
    education: base.education.map((item) => translateByKey(item, copy.educationData || {}, ["title", "org"], {
      title: ["titleEn"],
      org: ["orgEn", "instituicaoEn"],
      period: ["periodEn"],
    })),
    certificates: base.certificates.map((item) => translateByKey(item, copy.certificateData || {}, ["title", "org"], {
      title: ["titleEn"],
      org: ["orgEn", "instituicaoEn"],
    })),
  };
};
