// Portfolio fallback data. Everything here is real, public and safe to render
// when Firebase is unavailable or has no published records.

window.PORTFOLIO_DATA = {
  identity: {
    name: "DAVI MANIERI",
    nameDisplay: "Davi Manieri",
    role: "Desenvolvedor Android",
    roleEn: "Android Software Engineer",
    location: "São Carlos · São Paulo · Brasil",
    timezone: "America/Sao_Paulo",
    status: "Aberto a oportunidades remotas e internacionais",
    company: "Tecnomotor Eletrônica",
    email: "dvponce3@gmail.com",
    phone: "+55 (16) 99703-7115",
    linkedin: "linkedin.com/in/davi-ponce-manieri",
    github: "github.com/dvmanieri44",
    resume: "img/curriculum.pdf",
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
    "Desenvolvedor Android na Tecnomotor Eletrônica e estudante de Engenharia da Computação pela UNIVESP.",
    "Construo produtos mobile com Kotlin, Jetpack Compose e integrações com hardware.",
    "Também atuo em backend e arquitetura quando o produto exige uma solução de ponta a ponta.",
  ],

  stack: [
    { label: "Container", items: ["Docker"] },
    { label: "Mobile", items: ["Kotlin"] },
    { label: "UI Android", items: ["Jetpack Compose"] },
    { label: "Plataforma", items: ["Android"] },
    { label: "Padrao", items: ["MVI"] },
    { label: "Arquitetura", items: ["Clean Architecture"] },
    { label: "Versionamento", items: ["Git"] },
    { label: "DevOps", items: ["CI/CD"] },
    { label: "Sistemas", items: ["Embarcados"] },
  ],

  skills: [],

  projects: [
    {
      id: "lectio-divina",
      index: "01",
      name: "Lectio Divina",
      nameEn: "Lectio Divina",
      tagline: "Aplicativo Android de liturgia diária e reflexão guiada",
      taglineEn: "Android app for daily liturgy and guided reflection",
      description:
        "Produto completo com consumo de API, persistência local, histórico, notificações configuráveis e compartilhamento nativo.",
      descriptionEn:
        "A complete Android product with API integration, local persistence, history, configurable notifications, and native sharing.",
      stack: ["Kotlin", "Jetpack Compose", "MVVM", "Room", "Retrofit"],
      status: "ongoing",
      year: "2026",
      role: "Solo developer",
      url: "https://github.com/dvmanieri44/lectio-divina",
    },
    {
      id: "premierpet-erp",
      index: "02",
      name: "PremieRpet ERP",
      nameEn: "PremieRpet ERP",
      tagline: "ERP full-stack para operações e rastreabilidade de estoque",
      taglineEn: "Full-stack ERP for inventory operations and traceability",
      description:
        "Aplicação em Next.js com controle de acesso, auditoria, versionamento, resolução de conflitos e testes dos fluxos críticos do backend.",
      descriptionEn:
        "A Next.js application with access control, auditing, versioning, conflict handling, and tests for critical backend flows.",
      stack: ["Next.js", "TypeScript", "Firebase Admin", "Node.js", "Tests"],
      status: "ongoing",
      year: "2026",
      role: "Full-stack · team project",
      url: "https://github.com/dvmanieri44/erp-de-controle-de-estoque",
    },
    {
      id: "dopamine-free-launcher",
      index: "03",
      name: "Dopamine Free Launcher",
      nameEn: "Dopamine Free Launcher",
      tagline: "Launcher Android minimalista para reduzir distrações",
      taglineEn: "Minimal Android launcher designed to reduce distractions",
      description:
        "Exploração de uma experiência mobile intencional, com interface limpa e foco em produtividade usando UI declarativa.",
      descriptionEn:
        "An exploration of intentional mobile UX with a clean, productivity-focused interface built with declarative UI.",
      stack: ["Kotlin", "Jetpack Compose", "Android"],
      status: "ongoing",
      year: "2026",
      role: "Solo developer",
      url: "https://github.com/dvmanieri44/DopamineFreeLauncher",
    },
  ],

  experiences: [
    {
      role: "Desenvolvedor Android",
      roleEn: "Android Software Developer",
      company: "Tecnomotor Eletrônica",
      meta: "São Carlos, SP",
      period: { start: "2024", end: null },
      current: true,
      summary:
        "Desenvolvimento de soluções mobile e ferramentas internas integradas a hardware automotivo, atuando também em arquitetura e backend quando necessário.",
      summaryEn:
        "Building mobile solutions and internal tools integrated with automotive hardware, contributing to architecture and backend work when needed.",
    },
    {
      role: "Desenvolvedor Freelance",
      company: "Projetos próprios e clientes",
      meta: "Remoto",
      period: { start: "2022", end: "2024" },
      current: false,
      summary:
        "Apps mobile em Flutter, automações com IA, dashboards e MVPs para clientes em diferentes nichos.",
      summaryEn:
        "Delivered mobile apps, AI automations, dashboards, and MVPs for clients across different industries.",
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
  totalCerts: window.PORTFOLIO_DATA.certificates.length,
  totalProjects: window.PORTFOLIO_DATA.projects.length,
  yearsProfessional: 2,
};

window.PORTFOLIO_COPY = {
  pt: {
    documentTitle: "Davi Manieri - Portfolio",
    sections: [
      { id: "hero", label: "INICIO" },
      { id: "projects", label: "PROJETOS" },
      { id: "experience", label: "EXPERIENCIA" },
      { id: "manifesto", label: "SOBRE" },
      { id: "education", label: "FORMACAO" },
      { id: "contact", label: "CONTATO" },
    ],
    adminPromptPassword: "Digite a senha",
    adminWrongPassword: "Senha incorreta.",
    splashPrefix: "Portfolio de",
    splashLocation: "Brasil",
    navStatus: "ABERTO A OPORTUNIDADES",
    heroEyebrow: "ANDROID SOFTWARE ENGINEER",
    heroRole: "KOTLIN · JETPACK COMPOSE · CLEAN ARCHITECTURE",
    heroIntro: "Construo aplicativos Android confiaveis, interfaces claras e integracoes entre software e hardware.",
    heroLocation: "Brasil · UTC-3 · remoto internacional",
    heroPrimaryCta: "VER PROJETOS",
    heroSecondaryCta: "BAIXAR CURRICULO",
    heroContactCta: "ENTRAR EM CONTATO",
    heroStatusLabel: "// status",
    heroCardLines: [
      ["Programador na ", "company", "."],
      ["Tecnico em desenvolvimento de sistemas pelo ", "SENAI", "."],
      ["Estudante de Eng. da Computacao pela ", "UNIVESP", "."],
      ["Especialidade ", "mobile", ", full-stack por consequencia, obcecado por ", "solucoes com IA", "."],
    ],
    heroStats: {
      projects: "Projetos selecionados",
      experience: "Experiencia profissional",
      focus: "Foco principal",
      yearSuffix: "+ anos",
    },
    heroProofLabel: "ATUACAO ATUAL",
    heroProofTitle: "Android na Tecnomotor",
    heroProofBody: "Produtos mobile e ferramentas conectadas ao ecossistema automotivo, com participacao em arquitetura, backend e integracao com hardware.",
    heroProofEducation: "Engenharia da Computacao · UNIVESP",
    manifestoMeta: "// engenharia com proposito",
    manifestoTag: "Sobre",
    manifestoBody: [
      ["Atuo com ", "Android", ", arquitetura limpa e integracoes embarcadas para transformar problemas reais em produtos confiaveis."],
      ["Tenho formacao tecnica em Desenvolvimento de Sistemas pelo ", "SENAI", " e estudo Engenharia da Computacao na UNIVESP."],
      ["Valorizo software ", "simples de usar, facil de manter e honesto sobre o que entrega", "."],
    ],
    aboutFacts: ["ANDROID FIRST", "PRODUTO DE PONTA A PONTA", "APRENDIZADO CONTINUO"],
    stackMeta: "// competencias comprovadas",
    skillsTitle: ["Base tecnica ", "aplicada", "."],
    skillsCertificateSingular: "certificado",
    skillsCertificatePlural: "certificados",
    skillsOtherName: "Outros",
    skillsOtherDescription: "Certificados aguardando classificacao por skill.",
    certificatePreview: "VISUALIZAR",
    certificateDownload: "BAIXAR",
    certificateClose: "FECHAR",
    certificateNoPreview: "A visualizacao deste arquivo nao esta disponivel no navegador.",
    stackRows: [
      ["DOCKER", "<em>KOTLIN</em>", "JETPACK COMPOSE", "ANDROID", "<em>MVI</em>", "CLEAN ARCHITECTURE"],
      ["GIT", "<em>CI/CD</em>", "EMBARCADOS", "DOCKER", "KOTLIN", "<em>ANDROID</em>"],
    ],
    projectsTitle: ["Trabalho ", "selecionado", "."],
    projectsMetaSuffix: "projetos selecionados",
    projectStatusOngoing: "EM ANDAMENTO",
    projectStatusDone: "ENTREGUE",
    projectLink: "VER REPOSITORIO",
    youtubeTitle: ["Tambem ensino ", "tecnologia", " no YouTube."],
    youtubeMeta: "// canal + video em destaque",
    youtubeLead: ["No canal eu compartilho conteudo sobre ", "programacao, IA e projetos reais", " com uma pegada pratica."],
    youtubeVideoFallback: "Video indisponivel. Use o link do canal para assistir no YouTube.",
    youtubeChannelCta: "ABRIR CANAL",
    youtubeVideoCta: "VER NO YOUTUBE",
    experienceTitle: ["Experiencia que ", "vira produto", "."],
    experienceMeta: "// linha do tempo",
    current: "ATUAL",
    present: "Presente",
    educationLabel: "FORMACAO",
    educationTitle: ["Formacao e ", "base tecnica", "."],
    educationMetaSuffix: " formacoes",
    graduation: "GRADUACAO",
    technical: "TECNICO",
    inProgress: "EM CURSO",
    certificatesSummary: ["Certificados", "em tecnologia"],
    certificateLink: "ACESSAR",
    contactMeta: "// aberto a oportunidades internacionais",
    contactTitle: ["Vamos ", "construir", "algo util"],
    contactLead: ["Estou aberto a ", "vagas remotas internacionais", " em Android e engenharia de software. Vamos conversar sobre o seu produto."],
    resumeLabel: "CURRICULO",
    copied: "COPIADO!",
    phoneLabel: "TELEFONE",
    footerLocation: "Sao Carlos - SP - BR",
    footerTime: "LOCAL TIME",
    identityLocation: "Sao Carlos - Sao Paulo - Brasil",
    manifestoData: [
      "Programador na Tecnomotor Eletronica, tecnico em Desenvolvimento de Sistemas pelo SENAI",
      "e estudante de Engenharia da Computacao pela UNIVESP.",
      "Premiado como melhor aluno no curso tecnico em Desenvolvimento de Sistemas.",
      "Foco em Android, arquitetura limpa, integracoes embarcadas e produtos bem construidos.",
    ],
    stackData: [
      { label: "Container", items: ["Docker"] },
      { label: "Mobile", items: ["Kotlin"] },
      { label: "UI Android", items: ["Jetpack Compose"] },
      { label: "Plataforma", items: ["Android"] },
      { label: "Padrao", items: ["MVI"] },
      { label: "Arquitetura", items: ["Clean Architecture"] },
      { label: "Versionamento", items: ["Git"] },
      { label: "DevOps", items: ["CI/CD"] },
      { label: "Sistemas", items: ["Embarcados"] },
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
      { id: "projects", label: "PROJECTS" },
      { id: "experience", label: "EXPERIENCE" },
      { id: "manifesto", label: "ABOUT" },
      { id: "education", label: "EDUCATION" },
      { id: "contact", label: "CONTACT" },
    ],
    adminPromptPassword: "Enter the password",
    adminWrongPassword: "Wrong password.",
    splashPrefix: "Portfolio of",
    splashLocation: "Brazil",
    navStatus: "OPEN TO OPPORTUNITIES",
    heroEyebrow: "ANDROID SOFTWARE ENGINEER",
    heroRole: "KOTLIN · JETPACK COMPOSE · CLEAN ARCHITECTURE",
    heroIntro: "I build reliable Android applications, clear interfaces, and integrations between software and hardware.",
    heroLocation: "Brazil · UTC-3 · international remote",
    heroPrimaryCta: "VIEW PROJECTS",
    heroSecondaryCta: "DOWNLOAD RESUME",
    heroContactCta: "GET IN TOUCH",
    heroStatusLabel: "// status",
    heroCardLines: [
      ["Software developer at ", "company", "."],
      ["Systems Development Technician from ", "SENAI", "."],
      ["Computer Engineering student at ", "UNIVESP", "."],
      ["Mobile specialist, full-stack by consequence, focused on ", "AI solutions", "."],
    ],
    heroStats: {
      projects: "Selected projects",
      experience: "Professional experience",
      focus: "Primary focus",
      yearSuffix: "+ years",
    },
    heroProofLabel: "CURRENT ROLE",
    heroProofTitle: "Android at Tecnomotor",
    heroProofBody: "Mobile products and tools connected to the automotive ecosystem, with contributions across architecture, backend, and hardware integration.",
    heroProofEducation: "Computer Engineering · UNIVESP",
    manifestoMeta: "// engineering with purpose",
    manifestoTag: "About",
    manifestoBody: [
      ["I work with ", "Android", ", clean architecture, and embedded integrations to turn real problems into reliable products."],
      ["I hold a technical degree in Systems Development from ", "SENAI", " and study Computer Engineering at UNIVESP."],
      ["I value software that is ", "simple to use, easy to maintain, and honest about what it delivers", "."],
    ],
    aboutFacts: ["ANDROID FIRST", "END-TO-END PRODUCT", "CONTINUOUS LEARNING"],
    stackMeta: "// verified capabilities",
    skillsTitle: ["Applied technical ", "foundation", "."],
    skillsCertificateSingular: "certificate",
    skillsCertificatePlural: "certificates",
    skillsOtherName: "Other",
    skillsOtherDescription: "Certificates waiting to be assigned to a skill.",
    certificatePreview: "PREVIEW",
    certificateDownload: "DOWNLOAD",
    certificateClose: "CLOSE",
    certificateNoPreview: "This file cannot be previewed in the browser.",
    stackRows: [
      ["DOCKER", "<em>KOTLIN</em>", "JETPACK COMPOSE", "ANDROID", "<em>MVI</em>", "CLEAN ARCHITECTURE"],
      ["GIT", "<em>CI/CD</em>", "EMBEDDED", "DOCKER", "KOTLIN", "<em>ANDROID</em>"],
    ],
    projectsTitle: ["Selected ", "work", "."],
    projectsMetaSuffix: "selected projects",
    projectStatusOngoing: "IN PROGRESS",
    projectStatusDone: "SHIPPED",
    projectLink: "VIEW REPOSITORY",
    youtubeTitle: ["I also teach ", "technology", " on YouTube."],
    youtubeMeta: "// channel + featured video",
    youtubeLead: ["On the channel I share practical content about ", "programming, AI, and real projects", "."],
    youtubeVideoFallback: "Video unavailable. Use the channel link to watch on YouTube.",
    youtubeChannelCta: "OPEN CHANNEL",
    youtubeVideoCta: "WATCH ON YOUTUBE",
    experienceTitle: ["Experience that ", "ships", "."],
    experienceMeta: "// timeline",
    current: "CURRENT",
    present: "Present",
    educationLabel: "EDUCATION",
    educationTitle: ["Education and technical ", "foundation", "."],
    educationMetaSuffix: " programs",
    graduation: "DEGREE",
    technical: "TECHNICAL",
    inProgress: "IN PROGRESS",
    certificatesSummary: ["Certificates", "in technology"],
    certificateLink: "OPEN",
    contactMeta: "// open to international opportunities",
    contactTitle: ["Let's ", "build", "something useful"],
    contactLead: ["I am open to ", "international remote roles", " in Android and software engineering. Let's talk about your product."],
    resumeLabel: "RESUME",
    copied: "COPIED!",
    phoneLabel: "PHONE",
    footerLocation: "Sao Carlos - SP - BR",
    footerTime: "LOCAL TIME",
    identityLocation: "Sao Carlos - Sao Paulo - Brazil",
    manifestoData: [
      "Software developer at Tecnomotor Eletronica and Systems Development Technician from SENAI.",
      "Computer Engineering student at UNIVESP.",
      "Received the best student award in the Systems Development technical program.",
      "Focused on Android, clean architecture, embedded integrations, and well-built products.",
    ],
    stackData: [
      { label: "Container", items: ["Docker"] },
      { label: "Mobile", items: ["Kotlin"] },
      { label: "Android UI", items: ["Jetpack Compose"] },
      { label: "Platform", items: ["Android"] },
      { label: "Pattern", items: ["MVI"] },
      { label: "Architecture", items: ["Clean Architecture"] },
      { label: "Version Control", items: ["Git"] },
      { label: "DevOps", items: ["CI/CD"] },
      { label: "Systems", items: ["Embedded"] },
    ],
    projectData: {},
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

  const skills = base.skills?.length
    ? base.skills.map((item) => translateByKey(item, {}, ["name"], {
        name: ["nameEn"],
        description: ["descriptionEn"],
      }))
    : (copy.stackData || base.stack).map((category, index) => ({
        id: `fallback-skill-${index + 1}`,
        name: category.items?.[0] || category.label,
        description: category.label || "",
        ordem: index + 1,
        isFallback: true,
      }));

  return {
    ...base,
    identity: {
      ...base.identity,
      role: isEnglish ? (base.identity.roleEn || "Computer Engineer") : base.identity.role,
      location: copy.identityLocation || base.identity.location,
      status: isEnglish ? "Open to remote and international roles" : base.identity.status,
    },
    manifesto: copy.manifestoData || base.manifesto,
    stack: copy.stackData || base.stack,
    skills,
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
      description: ["descriptionEn"],
    })),
  };
};
