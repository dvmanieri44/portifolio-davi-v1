// terminal.jsx — Working interactive terminal
// Commands: help, about, projetos, skills, contato, exp, certs, clear, social
// Exposes <Terminal /> on window.

const { useState, useEffect, useRef, useCallback } = React;

function TerminalLine({ kind, children }) {
  return <div className={`terminal-line is-${kind}`}>{children}</div>;
}

function PromptLine({ command }) {
  return (
    <div className="terminal-line is-cmd">
      <span className="terminal-prompt">guest@davi</span>
      <span className="dim">:~$ </span>
      {command}
    </div>
  );
}

function Terminal({ lang = "pt" }) {
  const data = window.getPortfolioData?.(lang) || window.PORTFOLIO_DATA;
  const copy = window.getPortfolioCopy?.(lang) || window.PORTFOLIO_COPY.pt;
  const term = copy.terminal;
  const [history, setHistory] = useState([]);   // [{ cmd, output: jsx[] }]
  const [draft, setDraft] = useState("");
  const [bootDone, setBootDone] = useState(false);
  const inputRef = useRef(null);
  const bodyRef = useRef(null);

  // Boot sequence (typed welcome)
  useEffect(() => {
    setHistory([]);
    setBootDone(false);
    const lines = term.boot.map((text, index) => ({
      delay: [200, 550, 900, 1300][index],
      kind: "system",
      text: text.replace("{location}", data.identity.location),
    }));
    const timers = lines.map((l, i) =>
      setTimeout(() => {
        setHistory((h) => [...h, { boot: true, jsx: <TerminalLine kind={l.kind}>{l.text}</TerminalLine> }]);
        if (i === lines.length - 1) setBootDone(true);
      }, l.delay)
    );
    return () => timers.forEach(clearTimeout);
  }, [lang, data.identity.location]);

  // Autoscroll
  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
  }, [history]);

  const focusInput = useCallback(() => {
    if (inputRef.current) inputRef.current.focus();
  }, []);

  const runCommand = useCallback((raw) => {
    const cmd = raw.trim().toLowerCase();
    if (!cmd) return;

    if (cmd === "clear" || cmd === "cls") {
      setHistory([]);
      return;
    }

    let output = null;

    switch (cmd) {
      case "help": case "?": case "ajuda":
        output = (
          <>
            <TerminalLine kind="system">{term.commandsAvailable}</TerminalLine>
            <TerminalLine kind="default">{"  "}<span className="kw">about</span>      {term.help.about}</TerminalLine>
            <TerminalLine kind="default">{"  "}<span className="kw">skills</span>     {term.help.skills}</TerminalLine>
            <TerminalLine kind="default">{"  "}<span className="kw">projects</span>   {term.help.projects}</TerminalLine>
            <TerminalLine kind="default">{"  "}<span className="kw">exp</span>        {term.help.exp}</TerminalLine>
            <TerminalLine kind="default">{"  "}<span className="kw">certs</span>      {term.help.certs}</TerminalLine>
            <TerminalLine kind="default">{"  "}<span className="kw">contact</span>    {term.help.contact}</TerminalLine>
            <TerminalLine kind="default">{"  "}<span className="kw">social</span>     {term.help.social}</TerminalLine>
            <TerminalLine kind="default">{"  "}<span className="kw">whoami</span>     {term.help.whoami}</TerminalLine>
            <TerminalLine kind="default">{"  "}<span className="kw">clear</span>      {term.help.clear}</TerminalLine>
          </>
        );
        break;

      case "about": case "sobre":
        output = (
          <>
            <TerminalLine kind="default">{data.identity.role} · {data.identity.location.split('·').slice(0,2).join('·').trim()}</TerminalLine>
            <TerminalLine kind="default">{" "}</TerminalLine>
            {data.manifesto.map((line, i) => (
              <TerminalLine key={i} kind="default">{line}</TerminalLine>
            ))}
          </>
        );
        break;

      case "skills": case "stack":
        output = (
          <>
            {(data.skills || []).map((skill) => (
              <TerminalLine key={skill.id || skill.name} kind="default">
                <span className="kw" style={{ display: "inline-block", width: 180 }}>{skill.name}</span>
                {skill.description}
                <span className="dim">  · {(data.certificates || []).filter((certificate) => certificate.skillId === skill.id).length} certs</span>
              </TerminalLine>
            ))}
          </>
        );
        break;

      case "projetos": case "projects": case "ls projects":
        output = (
          <>
            <TerminalLine kind="system">
              {term.projectsSummary
                .replace("{total}", data.projects.length)
                .replace("{ongoing}", data.projects.filter(p => p.status === "ongoing").length)}
            </TerminalLine>
            <TerminalLine kind="default">{" "}</TerminalLine>
            {data.projects.map((p) => (
              <TerminalLine key={p.id} kind="default">
                <span className="dim">{p.index}</span>{"  "}
                <span className="kw">{p.name.padEnd(10, " ")}</span>
                <span>{p.tagline}</span>
                <span className="dim">  · {p.year}</span>
              </TerminalLine>
            ))}
          </>
        );
        break;

      case "exp": case "experiencia": case "experiência":
        output = (
          <>
            {data.experiences.map((e, i) => (
              <div key={i} className="terminal-section">
                <TerminalLine kind="default">
                  <span className="kw">{e.role}</span>
                  <span className="dim"> @ </span>
                  {e.company}
                  {e.current ? <span className="kw"> · {term.current}</span> : null}
                </TerminalLine>
                <TerminalLine kind="default" >
                  <span className="dim">{e.period.start} — {e.period.end || term.present} · {e.meta}</span>
                </TerminalLine>
                <TerminalLine kind="default">{e.summary}</TerminalLine>
              </div>
            ))}
          </>
        );
        break;

      case "certs": case "certificados":
        output = (
          <>
            <TerminalLine kind="default">
              <span className="kw">{data.summary.totalCerts}+</span> {term.certsSummary}
            </TerminalLine>
            <TerminalLine kind="default">{" "}</TerminalLine>
            {data.certificates.slice(0, 6).map((c, i) => (
              <TerminalLine key={i} kind="default">
                <span className="dim">·</span>{" "}
                {c.title}
                <span className="dim"> — {c.org} ({c.year})</span>
              </TerminalLine>
            ))}
            <TerminalLine kind="default">
              <span className="dim">  {term.more.replace("{count}", data.certificates.length - 6)}</span>
            </TerminalLine>
          </>
        );
        break;

      case "contato": case "contact":
        output = (
          <>
            <TerminalLine kind="default"><span className="kw">{"email     "}</span>{data.identity.email}</TerminalLine>
            <TerminalLine kind="default"><span className="kw">{"tel       "}</span>{data.identity.phone}</TerminalLine>
            <TerminalLine kind="default"><span className="kw">{"linkedin  "}</span>{data.identity.linkedin}</TerminalLine>
            <TerminalLine kind="default"><span className="kw">{"github    "}</span>{data.identity.github}</TerminalLine>
          </>
        );
        break;

      case "social":
        output = (
          <>
            <TerminalLine kind="default">linkedin <span className="dim">→ </span>{data.identity.linkedin}</TerminalLine>
            <TerminalLine kind="default">github   <span className="dim">→ </span>{data.identity.github}</TerminalLine>
          </>
        );
        break;

      case "whoami":
        output = <TerminalLine kind="default">{data.identity.name} · {data.identity.role.toLowerCase()}</TerminalLine>;
        break;

      case "ls": case "dir":
        output = (
          <TerminalLine kind="default">
            <span className="kw">about</span>  <span className="kw">skills</span>  <span className="kw">projects</span>  <span className="kw">exp</span>  <span className="kw">certs</span>  <span className="kw">contact</span>  <span className="kw">social</span>
          </TerminalLine>
        );
        break;

      case "date":
      case "time":
        output = <TerminalLine kind="default">{new Date().toLocaleString(lang === "en" ? "en-US" : "pt-BR", { timeZone: "America/Sao_Paulo" })} BRT</TerminalLine>;
        break;

      case "sudo hire davi":
      case "sudo hire-me":
      case "hire me":
      case "hire-me":
        output = (
          <>
            <TerminalLine kind="system">{term.hireGranted}</TerminalLine>
            <TerminalLine kind="default">→ <span className="kw">{data.identity.email}</span></TerminalLine>
            <TerminalLine kind="default">→ <span className="kw">{data.identity.linkedin}</span></TerminalLine>
            <TerminalLine kind="system">{term.waitingContact}</TerminalLine>
          </>
        );
        break;

      default:
        output = <TerminalLine kind="error">{term.notFound.replace("{cmd}", cmd)}</TerminalLine>;
    }

    setHistory((h) => [...h, { cmd, jsx: (
      <div className="terminal-section">
        <PromptLine command={cmd} />
        <div style={{ paddingLeft: 14, paddingTop: 4 }}>{output}</div>
      </div>
    ) }]);
  }, [data, lang, term]);

  const onKey = (e) => {
    if (e.key === "Enter") {
      runCommand(draft);
      setDraft("");
    }
  };

  const onHint = (cmd) => {
    runCommand(cmd);
    focusInput();
  };

  return (
    <div className="terminal" onClick={focusInput}>
      <div className="terminal-head">
        <div className="terminal-dots">
          <span className="terminal-dot is-accent" />
          <span className="terminal-dot" />
          <span className="terminal-dot" />
        </div>
        <span className="terminal-head-title">guest@davi:~ — bash</span>
        <span className="terminal-head-right">88×24</span>
      </div>

      <div className="terminal-body" ref={bodyRef}>
        {history.map((h, i) => <React.Fragment key={i}>{h.jsx}</React.Fragment>)}
      </div>

      <div className="terminal-hints">
        {["help", "about", "skills", "projects", "exp", "contact", "hire-me"].map((c) => (
          <button key={c} className="terminal-hint" onClick={() => onHint(c)}>{c}</button>
        ))}
      </div>

      <form
        className="terminal-input-row"
        onSubmit={(e) => { e.preventDefault(); runCommand(draft); setDraft(""); }}
      >
        <span className="terminal-prompt">guest@davi</span>
        <span className="dim">:~$</span>
        <input
          ref={inputRef}
          className="terminal-input"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={onKey}
          spellCheck={false}
          autoComplete="off"
          placeholder={bootDone ? term.placeholder : ""}
          aria-label="Terminal input"
        />
      </form>
    </div>
  );
}

window.Terminal = Terminal;
