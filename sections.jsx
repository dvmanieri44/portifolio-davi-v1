// sections.jsx — All section components for the portfolio.
// Exposes them on window for app.jsx to compose.

const { useState, useEffect, useRef, useCallback, useMemo } = React;

function getCopy(lang) {
  return window.getPortfolioCopy?.(lang) || window.PORTFOLIO_COPY.pt;
}

function getData(lang) {
  return window.getPortfolioData?.(lang) || window.PORTFOLIO_DATA;
}

function renderParts(parts, keyPrefix = "part") {
  return parts.map((part, index) => {
    const content = part === "company" ? window.PORTFOLIO_DATA.identity.company : part;
    return index % 2 === 1
      ? <em key={`${keyPrefix}-${index}`}>{content}</em>
      : <React.Fragment key={`${keyPrefix}-${index}`}>{content}</React.Fragment>;
  });
}

function getYouTubeEmbedUrl(url) {
  try {
    const parsed = new URL(url);
    let id = "";

    if (parsed.hostname.includes("youtu.be")) {
      id = parsed.pathname.slice(1);
    } else if (parsed.pathname.startsWith("/shorts/")) {
      id = parsed.pathname.split("/")[2];
    } else if (parsed.pathname.startsWith("/embed/")) {
      id = parsed.pathname.split("/")[2];
    } else {
      id = parsed.searchParams.get("v") || "";
    }

    id = id.split(/[?&/]/)[0];
    return id ? `https://www.youtube.com/embed/${id}` : "";
  } catch {
    return "";
  }
}

// ─── Hooks ────────────────────────────────────────────────────

const CERTIFICATES_PER_PAGE = 9;

function getCertificateOrderValue(item) {
  const rawValue = item?.ordem ?? item?.order;
  if (rawValue === "" || rawValue === null || rawValue === undefined) return null;
  const value = Number(rawValue);
  return Number.isFinite(value) ? value : null;
}

function getCertificateHref(url) {
  const value = String(url || "").trim();
  if (!value) return "";

  const withProtocol = /^https?:\/\//i.test(value) ? value : `https://${value}`;
  try {
    const parsed = new URL(withProtocol);
    return /^https?:$/i.test(parsed.protocol) ? parsed.href : "";
  } catch {
    return "";
  }
}

function orderCertificates(items) {
  return items
    .map((item, index) => ({ item, index }))
    .sort((a, b) => {
      const orderA = getCertificateOrderValue(a.item);
      const orderB = getCertificateOrderValue(b.item);

      if (orderA !== null || orderB !== null) {
        if (orderA === null) return 1;
        if (orderB === null) return -1;
        if (orderA !== orderB) return orderA - orderB;
      }

      return a.index - b.index;
    })
    .map(({ item }) => item);
}

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

function Splash({ onDone, lang = "pt" }) {
  const [ready, setReady] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const data = getData(lang);
  const copy = getCopy(lang);
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
        {copy.splashPrefix} <em>{data.identity.nameDisplay}</em>
      </div>
      <div className="splash-meta">
        <span>v2.0</span>
        <span>· {copy.splashLocation}</span>
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
  const copy = getCopy(lang);

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
          {copy.navStatus}
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

function Hero({ lang = "pt" }) {
  const data = getData(lang);
  const copy = getCopy(lang);
  const clock = useClock();
  const [firstName = "", ...restName] = data.identity.name.split(" ");

  return (
    <section id="hero" className="hero" data-screen-label="01 Hero">
      <div className="hero-left">
        <div className="hero-eyebrow">
          <span className="hero-eyebrow-line" />
          {copy.heroEyebrow}
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
          {copy.heroRole}
        </div>

        <div className="hero-cta-row">
          <a href="#manifesto" className="btn">
            <span>{copy.heroPrimaryCta}</span>
            <span className="arrow">↓</span>
          </a>
          <a href="#contact" className="btn btn--ghost">
            <span>{copy.heroSecondaryCta}</span>
            <span className="arrow">↗</span>
          </a>
        </div>
      </div>

      <div className="hero-right">
        <div className="hero-card">
          <div className="hero-card-head">
            <span>{copy.heroStatusLabel}</span>
            <span>{clock} BRT</span>
          </div>
          <div className="hero-card-body">
            {copy.heroCardLines.map((line, index) => (
              <React.Fragment key={index}>
                {line.map((part, partIndex) => {
                  const content = part === "company" ? data.identity.company : part;
                  return partIndex % 2 === 1
                    ? <span key={partIndex} className="kw">{content}</span>
                    : <React.Fragment key={partIndex}>{content}</React.Fragment>;
                })}
                {index < copy.heroCardLines.length - 1 && <br />}
              </React.Fragment>
            ))}
          </div>
        </div>

        <div className="hero-stats">
          <div className="hero-stat">
            <span className="hero-stat-num"><em>{data.summary.totalCerts}+</em></span>
            <span className="hero-stat-label">{copy.heroStats.certificates}</span>
          </div>
          <div className="hero-stat">
            <span className="hero-stat-num">{data.projects.length}</span>
            <span className="hero-stat-label">{copy.heroStats.projects}</span>
          </div>
          <div className="hero-stat">
            <span className="hero-stat-num">{data.summary.yearsCoding}<em>{copy.heroStats.yearSuffix}</em></span>
            <span className="hero-stat-label">{copy.heroStats.coding}</span>
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

function Manifesto({ lang = "pt" }) {
  const copy = getCopy(lang);
  const [ref, seen] = useReveal(0.15);
  return (
    <section id="manifesto" className="section" data-screen-label="02 Manifesto">
      <div className="section-head">
        <div>
          <div className="section-label"><span className="accent">▸</span>{"  "}02 / MANIFESTO</div>
        </div>
        <div className="section-meta">{copy.manifestoMeta}</div>
      </div>

      <div className="manifesto-wrap" ref={ref}>
        <div>
          <div className={`manifesto-tag reveal ${seen ? "is-in" : ""}`}>{copy.manifestoTag}</div>
          <div className={`manifesto reveal reveal-delay-1 ${seen ? "is-in" : ""}`}>
            {copy.manifestoBody.map((line, index) => (
              <p key={index}>{renderParts(line, `manifesto-${index}`)}</p>
            ))}
          </div>
        </div>
        <div className={`reveal reveal-delay-2 ${seen ? "is-in" : ""}`}>
          <Terminal lang={lang} />
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

function Stack({ lang = "pt" }) {
  const data = getData(lang);
  const copy = getCopy(lang);

  return (
    <section id="stack" className="stack-section section--full" data-screen-label="03 Stack">
      <div className="stack-head">
        <div className="section-head">
          <div>
            <div className="section-label"><span className="accent">▸</span>{"  "}03 / STACK</div>
          </div>
          <div className="section-meta">{copy.stackMeta}</div>
        </div>
      </div>

      <MarqueeRow
        items={copy.stackRows[0]}
        dur={48}
      />
      <MarqueeRow
        items={copy.stackRows[1]}
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

function ProjectCard({ p, copy }) {
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
          {p.status === "ongoing" ? copy.projectStatusOngoing : copy.projectStatusDone} · {p.year}
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
          <span>{copy.projectLink}</span>
          <span className="arrow">↗</span>
        </a>
      </div>
    </article>
  );
}

function Projects({ lang = "pt" }) {
  const data = getData(lang);
  const copy = getCopy(lang);
  const [ref, seen] = useReveal(0.05);

  return (
    <section id="projects" className="section" data-screen-label="04 Projects">
      <div className="section-head">
        <div>
          <div className="section-label"><span className="accent">▸</span>{"  "}04 / {copy.sections.find((section) => section.id === "projects")?.label || "PROJECTS"}</div>
        </div>
        <h2 className="section-title">
          {copy.projectsTitle[0]}<em>{copy.projectsTitle[1]}</em><br/>{copy.projectsTitle[2]}
        </h2>
        <div className="section-meta">
          {data.projects.length} {copy.projectsMetaSuffix}
        </div>
      </div>

      <div className={`projects-grid reveal ${seen ? "is-in" : ""}`} ref={ref}>
        {data.projects.map((p) => <ProjectCard key={p.id} p={p} copy={copy} />)}
      </div>
    </section>
  );
}

// ─── Experience ─────────────────────────────────────────────

function YouTubeSection({ lang = "pt" }) {
  const data = getData(lang);
  const copy = getCopy(lang);
  const [ref, seen] = useReveal(0.08);
  const youtube = data.identity.youtube || {};
  const featuredVideo = youtube.featuredVideo || {};
  const embedUrl = getYouTubeEmbedUrl(featuredVideo.url);
  const videoTitle = featuredVideo.title || "Video em destaque";

  return (
    <section id="youtube" className="section youtube-section" data-screen-label="05 YouTube">
      <div className="section-head">
        <div>
          <div className="section-label"><span className="accent">{"\u25b8"}</span>{"  "}05 / {copy.sections.find((section) => section.id === "youtube")?.label || "YOUTUBE"}</div>
        </div>
        <h2 className="section-title">
          {copy.youtubeTitle[0]}<em>{copy.youtubeTitle[1]}</em><br/>{copy.youtubeTitle[2]}
        </h2>
        <div className="section-meta">{copy.youtubeMeta}</div>
      </div>

      <div ref={ref} className={`youtube-grid reveal ${seen ? "is-in" : ""}`}>
        <div className="youtube-copy">
          <p className="youtube-lead">
            {copy.youtubeLead[0]}<em>{copy.youtubeLead[1]}</em>{copy.youtubeLead[2]}
          </p>
          <div className="youtube-actions">
            <a className="btn" href={youtube.href} target="_blank" rel="noopener">
              <span>{copy.youtubeChannelCta}</span>
              <span className="arrow">{"\u2197"}</span>
            </a>
            {featuredVideo.url && (
              <a className="btn btn--ghost" href={featuredVideo.url} target="_blank" rel="noopener">
                <span>{copy.youtubeVideoCta}</span>
                <span className="arrow">{"\u2197"}</span>
              </a>
            )}
          </div>
        </div>

        <div className="youtube-player" data-interactive>
          {embedUrl ? (
            <iframe
              src={embedUrl}
              title={videoTitle}
              loading="lazy"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          ) : (
            <div className="youtube-fallback">
              <strong>{videoTitle}</strong>
              <span>{copy.youtubeVideoFallback}</span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function Experience({ lang = "pt" }) {
  const data = getData(lang);
  const copy = getCopy(lang);

  return (
    <section id="experience" className="section" data-screen-label="06 Experience">
      <div className="section-head">
        <div>
          <div className="section-label"><span className="accent">▸</span>{"  "}06 / {copy.sections.find((section) => section.id === "experience")?.label || "EXP"}</div>
        </div>
        <h2 className="section-title">{copy.experienceTitle[0]}<em>{copy.experienceTitle[1]}</em>{copy.experienceTitle[2]}</h2>
        <div className="section-meta">{copy.experienceMeta}</div>
      </div>

      <div className="timeline">
        {data.experiences.map((e, i) => (
          <ExperienceItem key={i} item={e} copy={copy} />
        ))}
      </div>
    </section>
  );
}

function ExperienceItem({ item, copy }) {
  const [ref, seen] = useReveal(0.1);
  return (
    <div ref={ref} className={`timeline-item ${item.current ? "is-current" : ""} reveal ${seen ? "is-in" : ""}`}>
      <span className="timeline-dot" />
      <div className="timeline-period">
        <span>{item.period.start} — {item.period.end || copy.present}</span>
        {item.current && <span className="current-tag">{copy.current}</span>}
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
    </div>
  );
}

// ─── Certificates & Education ───────────────────────────────

function Certificates({ lang = "pt" }) {
  const data = getData(lang);
  const copy = getCopy(lang);
  const [page, setPage] = useState(1);
  const certificates = useMemo(() => orderCertificates(data.certificates || []), [data.certificates]);
  const pageCount = Math.max(1, Math.ceil(certificates.length / CERTIFICATES_PER_PAGE));
  const currentPage = Math.min(page, pageCount);
  const pageStart = (currentPage - 1) * CERTIFICATES_PER_PAGE;
  const visibleCertificates = certificates.slice(pageStart, pageStart + CERTIFICATES_PER_PAGE);

  useEffect(() => {
    setPage(1);
  }, [lang, certificates.length]);

  useEffect(() => {
    if (page > pageCount) setPage(pageCount);
  }, [page, pageCount]);

  return (
    <section id="education" className="section" data-screen-label="07 Education">
      <div className="section-head">
        <div>
          <div className="section-label"><span className="accent">▸</span>{"  "}{copy.educationLabel}</div>
        </div>
        <h2 className="section-title">{copy.educationTitle[0]}<em>{copy.educationTitle[1]}</em>{copy.educationTitle[2]}</h2>
        <div className="section-meta">{data.summary.totalCerts}{copy.educationMetaSuffix}</div>
      </div>

      <div className="certs-wrap">
        <div>
          <div className="education">
            {data.education.map((e, i) => (
              <div key={i} className={`edu-card ${e.current ? "is-current" : ""}`}>
                <div className="edu-kind">
                  {e.kind === "graduation" ? copy.graduation : copy.technical}
                  {e.current ? ` · ${copy.inProgress}` : ""}
                </div>
                <h3 className="edu-title">{e.title}</h3>
                <div className="edu-org">{e.org}</div>
                <div className="edu-period">{e.period}</div>
              </div>
            ))}
          </div>

          <div className="certs-summary">
            <span className="certs-summary-big">{data.summary.totalCerts}+</span>
            <span>{copy.certificatesSummary[0]}<br/>{copy.certificatesSummary[1]}</span>
          </div>
        </div>

        <div className="cert-list">
          {visibleCertificates.map((c, i) => {
            const href = getCertificateHref(c.url || c.logoUrl);
            const number = pageStart + i + 1;
            return (
              <div key={c.id || `${c.title}-${number}`} className={`cert-row ${href ? "has-link" : ""}`}>
                <span className="cert-num">{String(number).padStart(2, "0")}</span>
                <span className="cert-title">{c.title}</span>
                <span className="cert-org">{c.org}</span>
                <span className="cert-year">{c.year}</span>
                {href && (
                  <a className="cert-link" href={href} target="_blank" rel="noopener">
                    {copy.certificateLink || "ACESSAR"}
                  </a>
                )}
              </div>
            );
          })}
          {pageCount > 1 && (
            <div className="cert-pagination" aria-label="Paginacao de certificados">
              {Array.from({ length: pageCount }, (_, index) => index + 1).map((pageNumber) => (
                <button
                  key={pageNumber}
                  type="button"
                  className={pageNumber === currentPage ? "is-active" : ""}
                  onClick={() => setPage(pageNumber)}
                  aria-current={pageNumber === currentPage ? "page" : undefined}
                >
                  {pageNumber}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

// ─── Contact ─────────────────────────────────────────────────

function Contact({ lang = "pt" }) {
  const data = getData(lang);
  const copy = getCopy(lang);
  const youtube = data.identity.youtube ?? {
    label: "www.youtube.com/@Code-Club-y8t",
    href: "https://www.youtube.com/@Code-Club-y8t",
  };
  const [copied, setCopied] = useState(null);

  const copyToClipboard = (val, label) => {
    navigator.clipboard?.writeText(val).then(() => {
      setCopied(label);
      setTimeout(() => setCopied(null), 1400);
    });
  };

  return (
    <section id="contact" className="contact-section" data-screen-label="08 Contact">
      <div className="section-head">
        <div>
          <div className="section-label"><span className="accent">▸</span>{"  "}08 / {copy.sections.find((section) => section.id === "contact")?.label || "CONTACT"}</div>
        </div>
        <div className="section-meta">{copy.contactMeta}</div>
      </div>

      <h2 className="contact-title">
        {copy.contactTitle[0]}<em>{copy.contactTitle[1]}</em><br/>{copy.contactTitle[2]}<span className="arrow"> ↗</span>
      </h2>

      <div className="contact-grid">
        <p className="contact-lead">
          {copy.contactLead[0]}<em>{copy.contactLead[1]}</em>{copy.contactLead[2]}
        </p>

        <div className="contact-list">
          <a className="contact-row" href={`mailto:${data.identity.email}`}>
            <span className="contact-row-label">EMAIL</span>
            <span className="contact-row-value">{data.identity.email}<span className="arrow">↗</span></span>
          </a>
          <button className="contact-row" onClick={() => copyToClipboard(data.identity.phone, "phone")}>
            <span className="contact-row-label">{copy.phoneLabel}</span>
            <span className="contact-row-value">
              {copied === "phone" ? copy.copied : data.identity.phone}
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
          <a className="contact-row" href={youtube.href} target="_blank" rel="noopener">
            <span className="contact-row-label">YOUTUBE</span>
            <span className="contact-row-value">{youtube.label}<span className="arrow">↗</span></span>
          </a>
        </div>
      </div>
    </section>
  );
}

// ─── Footer ─────────────────────────────────────────────────

function Footer({ lang = "pt" }) {
  const copy = getCopy(lang);
  const clock = useClock();
  return (
    <footer className="footer">
      <span>DAVI MANIERI © {new Date().getFullYear()}</span>
      <span>{copy.footerLocation}</span>
      <span>{copy.footerTime} · {clock}</span>
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
  YouTubeSection,
  Experience,
  Certificates,
  Contact,
  Footer,
  ScrollProgress,
  SectionRail,
  useReveal,
  useClock,
});
