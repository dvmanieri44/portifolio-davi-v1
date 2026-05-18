// sections.jsx — All section components for the portfolio.
// Exposes them on window for app.jsx to compose.

const { useState, useEffect, useRef, useCallback, useMemo } = React;

// ─── Hooks ────────────────────────────────────────────────────

function useReveal(threshold = 0.2) {
  const ref = useRef(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSeen(true);
          obs.disconnect();
        }
      },
      { threshold }
    );
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, seen];
}

function useClock(tz = "America/Sao_Paulo") {
  const [t, setT] = useState("");
  useEffect(() => {
    const tick = () => {
      setT(new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit", second: "2-digit", timeZone: tz }));
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [tz]);
  return t;
}

// ─── Custom cursor ────────────────────────────────────────────

function CustomCursor() {
  const ref = useRef(null);
  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    const el = ref.current;
    if (!el) return;

    let x = window.innerWidth / 2, y = window.innerHeight / 2;
    let tx = x, ty = y;

    const move = (e) => { tx = e.clientX; ty = e.clientY; };
    const enter = () => { el.style.opacity = "1"; };
    const leave = () => { el.style.opacity = "0"; };
    document.addEventListener("mousemove", move);
    document.addEventListener("mouseenter", enter);
    document.addEventListener("mouseleave", leave);

    const interactive = 'a, button, input, textarea, select, label, [data-interactive], .terminal, .terminal-input, .project-card, .contact-row, .nav-link, .cert-row';
    const onOver = (e) => {
      if (e.target.closest(interactive)) el.classList.add("is-hover");
    };
    const onOut = (e) => {
      if (e.target.closest(interactive)) el.classList.remove("is-hover");
    };
    document.addEventListener("mouseover", onOver);
    document.addEventListener("mouseout", onOut);

    let raf;
    const tick = () => {
      x += (tx - x) * 0.22;
      y += (ty - y) * 0.22;
      el.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
      raf = requestAnimationFrame(tick);
    };
    tick();

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("mousemove", move);
      document.removeEventListener("mouseenter", enter);
      document.removeEventListener("mouseleave", leave);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseout", onOut);
    };
  }, []);
  return (
    <div ref={ref} className="custom-cursor" style={{ opacity: 0 }}>
      <span className="custom-cursor-dot" />
    </div>
  );
}

// ─── Splash ───────────────────────────────────────────────────

function Splash({ onDone }) {
  const [ready, setReady] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const data = window.PORTFOLIO_DATA;
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;

  useEffect(() => {
    const t1 = setTimeout(() => setReady(true), 150);
    const t2 = setTimeout(() => setLeaving(true), 1900);
    const t3 = setTimeout(() => onDoneRef.current?.(), 2500);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  return (
    <div className={`splash ${ready ? "is-ready" : ""} ${leaving ? "is-leaving" : ""}`}>
      <span className="splash-bar" />
      <div className="splash-title">
        Portfólio de <em>{data.identity.nameDisplay}</em>
      </div>
      <div className="splash-meta">
        <span>v2.0</span>
        <span>· {data.identity.location.split('·')[0].trim()}</span>
        <span>· {new Date().getFullYear()}</span>
      </div>
      <div className="splash-progress">
        <div className="splash-progress-bar" />
      </div>
    </div>
  );
}

// ─── Nav ─────────────────────────────────────────────────────

function Nav({ activeSection, sections, onLang, lang, onTheme, theme }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`nav ${scrolled ? "is-scrolled" : ""}`}>
      <a href="#hero" className="nav-logo">
        <span className="nav-logo-mark">D</span>
        <span className="nav-logo-text">DAVI/M</span>
      </a>

      <nav className="nav-center">
        {sections.map((s) => (
          <a
            key={s.id}
            href={`#${s.id}`}
            className={`nav-link ${activeSection === s.id ? "is-active" : ""}`}
          >
            {s.label}
          </a>
        ))}
      </nav>

      <div className="nav-right">
        <span className="nav-status">
          <span className="nav-status-dot" />
          ONLINE
        </span>
        <select value={lang} onChange={(e) => onLang(e.target.value)} aria-label="Language">
          <option value="pt">PT</option>
          <option value="en">EN</option>
        </select>
      </div>
    </header>
  );
}

// ─── Hero ────────────────────────────────────────────────────

function Hero() {
  const data = window.PORTFOLIO_DATA;
  const clock = useClock();
  const [firstName = "", ...restName] = data.identity.name.split(" ");

  return (
    <section id="hero" className="hero" data-screen-label="01 Hero">
      <div className="hero-left">
        <div className="hero-eyebrow">
          <span className="hero-eyebrow-line" />
          ENG. DE COMPUTAÇÃO · DESDE 2020
        </div>

        <h1 className="hero-title">
          <span className="hero-title-row">
            <span style={{ animationDelay: "0.05s" }}>{firstName}</span>
          </span>
          <span className="hero-title-row">
            <span style={{ animationDelay: "0.18s" }}>
              <em>{restName.join(" ").charAt(0)}</em>{restName.join(" ").slice(1)}
            </span>
          </span>
        </h1>

        <div className="hero-role">
          <span className="hero-role-pulse" />
          ENGENHEIRO DE COMPUTAÇÃO · MOBILE · IA · FULL-STACK
        </div>

        <div className="hero-cta-row">
          <a href="#manifesto" className="btn">
            <span>VER TRABALHO</span>
            <span className="arrow">↓</span>
          </a>
          <a href="#contact" className="btn btn--ghost">
            <span>FALAR COMIGO</span>
            <span className="arrow">↗</span>
          </a>
        </div>
      </div>

      <div className="hero-right">
        <div className="hero-card">
          <div className="hero-card-head">
            <span>// status</span>
            <span>{clock} BRT</span>
          </div>
          <div className="hero-card-body">
            Programador na <span className="kw">{data.identity.company}</span>.<br/>
            Técnico em desenvolvimento de sistemas pelo <span className="kw">SENAI</span>.<br/>
            Estudante de Eng. da Computação pela <span className="kw">UNIVESP</span>.<br/>
            Especialidade <span className="kw">mobile</span>, full-stack por consequência,
            obcecado por <span className="kw">soluções com IA</span>.
          </div>
        </div>

        <div className="hero-stats">
          <div className="hero-stat">
            <span className="hero-stat-num"><em>{data.summary.totalCerts}+</em></span>
            <span className="hero-stat-label">Certificados</span>
          </div>
          <div className="hero-stat">
            <span className="hero-stat-num">{data.projects.length}</span>
            <span className="hero-stat-label">Projetos</span>
          </div>
          <div className="hero-stat">
            <span className="hero-stat-num">{data.summary.yearsCoding}<em>y</em></span>
            <span className="hero-stat-label">Codando</span>
          </div>
        </div>
      </div>

      <div className="hero-scroll">
        <span>SCROLL</span>
        <span className="hero-scroll-line" />
      </div>
    </section>
  );
}

// ─── Manifesto + Terminal ────────────────────────────────────

function Manifesto() {
  const [ref, seen] = useReveal(0.15);
  return (
    <section id="manifesto" className="section" data-screen-label="02 Manifesto">
      <div className="section-head">
        <div>
          <div className="section-label"><span className="accent">▸</span>{"  "}02 / MANIFESTO</div>
        </div>
        <div className="section-meta">{"// quem está aí?"}</div>
      </div>

      <div className="manifesto-wrap" ref={ref}>
        <div>
          <div className={`manifesto-tag reveal ${seen ? "is-in" : ""}`}>Sobre</div>
          <div className={`manifesto reveal reveal-delay-1 ${seen ? "is-in" : ""}`}>
            <p>
              Construo software que <em>funciona em produção</em> — não no slide.
            </p>
            <p>
              Mobile, backend, IA. Aprendi escutando hardware automotivo e quebrando coisas
              até elas <em>quererem</em> obedecer.
            </p>
            <p>
              Hoje meu foco é construir <em>ferramentas que poucos conseguem</em>: integrações
              embarcadas, agentes de IA com objetivo claro e apps que respeitam o usuário.
            </p>
          </div>
        </div>
        <div className={`reveal reveal-delay-2 ${seen ? "is-in" : ""}`}>
          <Terminal />
        </div>
      </div>
    </section>
  );
}

// ─── Stack marquee ──────────────────────────────────────────

function MarqueeRow({ items, outline = false, dur = 50 }) {
  const content = (
    <>
      {items.map((w, i) => (
        <React.Fragment key={i}>
          <span className={`marquee-word ${outline ? "is-outline" : ""}`} dangerouslySetInnerHTML={{ __html: w }} />
          <span className="marquee-dot">●</span>
        </React.Fragment>
      ))}
    </>
  );
  return (
    <div className="marquee" style={{ "--marquee-dur": `${dur}s` }}>
      <div className="marquee-track">
        {content}
        {content}
      </div>
    </div>
  );
}

function Stack() {
  const data = window.PORTFOLIO_DATA;

  return (
    <section id="stack" className="stack-section section--full" data-screen-label="03 Stack">
      <div className="stack-head">
        <div className="section-head">
          <div>
            <div className="section-label"><span className="accent">▸</span>{"  "}03 / STACK</div>
          </div>
          <div className="section-meta">{"// ferramentas + materiais"}</div>
        </div>
      </div>

      <MarqueeRow
        items={["MOBILE", "<em>BACKEND</em>", "FRONTEND", "DADOS", "<em>IA</em>", "EMBARCADOS"]}
        dur={48}
      />
      <MarqueeRow
        items={["FLUTTER", "PYTHON", "REACT", "<em>LANGCHAIN</em>", "POSTGRES", "DART", "NODE.JS"]}
        outline
        dur={62}
      />

      <div className="stack-grid">
        {data.stack.map((cat) => (
          <div key={cat.label} className="stack-cell">
            <div className="stack-cell-label">{cat.label}</div>
            <div className="stack-cell-name">
              {cat.items[0]}
            </div>
            <div className="stack-cell-items">
              {cat.items.slice(1).map((it, i) => <span key={i}>{it}</span>)}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── Projects ───────────────────────────────────────────────

function ProjectCard({ p, adminMode, onEdit }) {
  const ref = useRef(null);
  const onMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const mx = ((e.clientX - rect.left) / rect.width) * 100;
    const my = ((e.clientY - rect.top) / rect.height) * 100;
    ref.current.style.setProperty("--mx", `${mx}%`);
    ref.current.style.setProperty("--my", `${my}%`);

    // subtle 3D tilt
    const tiltX = (my - 50) / 25;
    const tiltY = (50 - mx) / 25;
    ref.current.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
  };
  const onLeave = () => {
    if (ref.current) ref.current.style.transform = "perspective(1000px) rotateX(0) rotateY(0)";
  };

  // Stylize the name: italicize the first letter
  const first = p.name.charAt(0);
  const rest = p.name.slice(1);

  return (
    <article
      ref={ref}
      className="project-card"
      data-status={p.status}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      <div className="project-card-top">
        <span className="project-card-index">{p.index}</span>
        <span className="project-card-status">
          <span className="project-status-dot" />
          {p.status === "ongoing" ? "EM ANDAMENTO" : "ENTREGUE"} · {p.year}
        </span>
      </div>

      <h3 className="project-card-name">
        <em>{first}</em>{rest}
      </h3>

      <p className="project-card-tagline">{p.description}</p>

      <div className="project-card-foot">
        <div className="project-card-stack">
          {p.stack.map((s) => (
            <span key={s} className="project-stack-tag">{s}</span>
          ))}
        </div>
        <a className="project-card-link" href="#" onClick={(e) => e.preventDefault()}>
          <span>VER CASE</span>
          <span className="arrow">↗</span>
        </a>
      </div>
      {adminMode && (
        <div className="admin-inline-actions">
          <button onClick={() => onEdit({ type: "projects", item: p })}>Editar</button>
          <button onClick={() => window.PORTFOLIO_ADMIN.remove("projects", p.id)}>Excluir</button>
        </div>
      )}
    </article>
  );
}

function Projects({ adminMode, onEdit }) {
  const data = window.PORTFOLIO_DATA;
  const [ref, seen] = useReveal(0.05);

  return (
    <section id="projects" className="section" data-screen-label="04 Projects">
      <div className="section-head">
        <div>
          <div className="section-label"><span className="accent">▸</span>{"  "}04 / PROJETOS</div>
        </div>
        <h2 className="section-title">
          Coisas que <em>existem</em><br/>porque eu fiz.
        </h2>
        <div className="section-meta">
          {data.projects.length} projetos selecionados
        </div>
      </div>

      <div className={`projects-grid reveal ${seen ? "is-in" : ""}`} ref={ref}>
        {data.projects.map((p) => <ProjectCard key={p.id} p={p} adminMode={adminMode} onEdit={onEdit} />)}
      </div>
    </section>
  );
}

// ─── Experience ─────────────────────────────────────────────

function Experience({ adminMode, onEdit }) {
  const data = window.PORTFOLIO_DATA;

  return (
    <section id="experience" className="section" data-screen-label="05 Experience">
      <div className="section-head">
        <div>
          <div className="section-label"><span className="accent">▸</span>{"  "}05 / EXPERIÊNCIA</div>
        </div>
        <h2 className="section-title">Onde já <em>operei</em>.</h2>
        <div className="section-meta">{"// linha do tempo"}</div>
      </div>

      <div className="timeline">
        {data.experiences.map((e, i) => (
          <ExperienceItem key={i} item={e} adminMode={adminMode} onEdit={onEdit} />
        ))}
      </div>
    </section>
  );
}

function ExperienceItem({ item, adminMode, onEdit }) {
  const [ref, seen] = useReveal(0.1);
  return (
    <div ref={ref} className={`timeline-item ${item.current ? "is-current" : ""} reveal ${seen ? "is-in" : ""}`}>
      <span className="timeline-dot" />
      <div className="timeline-period">
        <span>{item.period.start} — {item.period.end || "Presente"}</span>
        {item.current && <span className="current-tag">ATUAL</span>}
      </div>
      <div className="timeline-row">
        <div>
          <h3 className="timeline-role">{item.role}</h3>
          <p className="timeline-summary">{item.summary}</p>
        </div>
        <div className="timeline-company">
          <span className="timeline-company-name">{item.company}</span>
          <span className="timeline-company-meta">{item.meta}</span>
        </div>
      </div>
      {adminMode && (
        <div className="admin-inline-actions">
          <button onClick={() => onEdit({ type: "experiences", item })}>Editar</button>
          <button onClick={() => window.PORTFOLIO_ADMIN.remove("experiences", item.id)}>Excluir</button>
        </div>
      )}
    </div>
  );
}

// ─── Certificates & Education ───────────────────────────────

function Certificates({ adminMode, onEdit }) {
  const data = window.PORTFOLIO_DATA;

  return (
    <section id="education" className="section" data-screen-label="06 Education">
      <div className="section-head">
        <div>
          <div className="section-label"><span className="accent">▸</span>{"  "}06 / FORMAÇÃO + CERTIFICADOS</div>
        </div>
        <h2 className="section-title">Sempre <em>aprendendo</em>.</h2>
        <div className="section-meta">{data.summary.totalCerts}+ certificados</div>
      </div>

      <div className="certs-wrap">
        <div>
          <div className="education">
            {data.education.map((e, i) => (
              <div key={i} className={`edu-card ${e.current ? "is-current" : ""}`}>
                <div className="edu-kind">
                  {e.kind === "graduation" ? "GRADUAÇÃO" : "TÉCNICO"}
                  {e.current ? " · EM CURSO" : ""}
                </div>
                <h3 className="edu-title">{e.title}</h3>
                <div className="edu-org">{e.org}</div>
                <div className="edu-period">{e.period}</div>
                {adminMode && (
                  <div className="admin-inline-actions">
                    <button onClick={() => onEdit({ type: "certificates", item: e })}>Editar</button>
                    <button onClick={() => window.PORTFOLIO_ADMIN.remove("certificates", e.id)}>Excluir</button>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="certs-summary">
            <span className="certs-summary-big">{data.summary.totalCerts}+</span>
            <span>Certificados<br/>em tecnologia</span>
          </div>
        </div>

        <div className="cert-list">
          {data.certificates.map((c, i) => (
            <div key={i} className="cert-row">
              <span className="cert-num">{String(i + 1).padStart(2, "0")}</span>
              <span className="cert-title">{c.title}</span>
              <span className="cert-org">{c.org}</span>
              <span className="cert-year">{c.year}</span>
              {adminMode && (
                <span className="admin-inline-actions">
                  <button onClick={() => onEdit({ type: "certificates", item: c })}>Editar</button>
                  <button onClick={() => window.PORTFOLIO_ADMIN.remove("certificates", c.id)}>Excluir</button>
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Contact ─────────────────────────────────────────────────

function Contact() {
  const data = window.PORTFOLIO_DATA;
  const [copied, setCopied] = useState(null);

  const copy = (val, label) => {
    navigator.clipboard?.writeText(val).then(() => {
      setCopied(label);
      setTimeout(() => setCopied(null), 1400);
    });
  };

  return (
    <section id="contact" className="contact-section" data-screen-label="07 Contact">
      <div className="section-head">
        <div>
          <div className="section-label"><span className="accent">▸</span>{"  "}07 / CONTATO</div>
        </div>
        <div className="section-meta">{"// disponível pra projetos"}</div>
      </div>

      <h2 className="contact-title">
        Bora <em>construir</em><br/>algo<span className="arrow"> ↗</span>
      </h2>

      <div className="contact-grid">
        <p className="contact-lead">
          Estou aberto a <em>oportunidades</em> em mobile, IA aplicada e backend.
          Se você está construindo algo difícil — me chama.
        </p>

        <div className="contact-list">
          <a className="contact-row" href={`mailto:${data.identity.email}`}>
            <span className="contact-row-label">EMAIL</span>
            <span className="contact-row-value">{data.identity.email}<span className="arrow">↗</span></span>
          </a>
          <button className="contact-row" onClick={() => copy(data.identity.phone, "phone")}>
            <span className="contact-row-label">TELEFONE</span>
            <span className="contact-row-value">
              {copied === "phone" ? "COPIADO!" : data.identity.phone}
              <span className="arrow">⎘</span>
            </span>
          </button>
          <a className="contact-row" href={`https://${data.identity.linkedin}`} target="_blank" rel="noopener">
            <span className="contact-row-label">LINKEDIN</span>
            <span className="contact-row-value">{data.identity.linkedin}<span className="arrow">↗</span></span>
          </a>
          <a className="contact-row" href={`https://${data.identity.github}`} target="_blank" rel="noopener">
            <span className="contact-row-label">GITHUB</span>
            <span className="contact-row-value">{data.identity.github}<span className="arrow">↗</span></span>
          </a>
        </div>
      </div>
    </section>
  );
}

// ─── Footer ─────────────────────────────────────────────────

function Footer() {
  const clock = useClock();
  return (
    <footer className="footer">
      <span>DAVI MANIERI © {new Date().getFullYear()}</span>
      <span>São Carlos · SP · BR</span>
      <span>LOCAL TIME · {clock}</span>
    </footer>
  );
}

// ─── Scroll progress + rail ─────────────────────────────────

function ScrollProgress() {
  const [p, setP] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setP(max > 0 ? window.scrollY / max : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <div className="scroll-progress">
      <div className="scroll-progress-bar" style={{ "--p": p }} />
    </div>
  );
}

function SectionRail({ sections, active }) {
  return (
    <div className="section-rail">
      {sections.map((s) => (
        <a
          key={s.id}
          href={`#${s.id}`}
          className={`section-rail-dot ${active === s.id ? "is-active" : ""}`}
          data-label={s.label}
          style={{ pointerEvents: "auto" }}
        />
      ))}
    </div>
  );
}

// ─── Export everything to window ────────────────────────────

Object.assign(window, {
  CustomCursor,
  Splash,
  Nav,
  Hero,
  Manifesto,
  Stack,
  Projects,
  Experience,
  Certificates,
  Contact,
  Footer,
  ScrollProgress,
  SectionRail,
  useReveal,
  useClock,
});
