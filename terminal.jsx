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

function Terminal() {
  const data = window.PORTFOLIO_DATA;
  const [history, setHistory] = useState([]);   // [{ cmd, output: jsx[] }]
  const [draft, setDraft] = useState("");
  const [bootDone, setBootDone] = useState(false);
  const inputRef = useRef(null);
  const bodyRef = useRef(null);

  // Boot sequence (typed welcome)
  useEffect(() => {
    const lines = [
      { delay: 200,  kind: "system", text: "› inicializando sessão segura..." },
      { delay: 550,  kind: "system", text: "› conectado · " + data.identity.location },
      { delay: 900,  kind: "system", text: "› sessão: guest · perfil: read-only" },
      { delay: 1300, kind: "system", text: "› digite 'help' pra começar." },
    ];
    const timers = lines.map((l, i) =>
      setTimeout(() => {
        setHistory((h) => [...h, { boot: true, jsx: <TerminalLine kind={l.kind}>{l.text}</TerminalLine> }]);
        if (i === lines.length - 1) setBootDone(true);
      }, l.delay)
    );
    return () => timers.forEach(clearTimeout);
  }, []);

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
            <TerminalLine kind="system">comandos disponíveis</TerminalLine>
            <TerminalLine kind="default">{"  "}<span className="kw">about</span>      sobre mim</TerminalLine>
            <TerminalLine kind="default">{"  "}<span className="kw">skills</span>     stack técnica</TerminalLine>
            <TerminalLine kind="default">{"  "}<span className="kw">projetos</span>   últimos projetos</TerminalLine>
            <TerminalLine kind="default">{"  "}<span className="kw">exp</span>        experiência</TerminalLine>
            <TerminalLine kind="default">{"  "}<span className="kw">certs</span>      certificados (resumo)</TerminalLine>
            <TerminalLine kind="default">{"  "}<span className="kw">contato</span>    como me chamar</TerminalLine>
            <TerminalLine kind="default">{"  "}<span className="kw">social</span>     links sociais</TerminalLine>
            <TerminalLine kind="default">{"  "}<span className="kw">whoami</span>     identidade</TerminalLine>
            <TerminalLine kind="default">{"  "}<span className="kw">clear</span>      limpar terminal</TerminalLine>
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
            {data.stack.map((cat) => (
              <TerminalLine key={cat.label} kind="default">
                <span className="kw" style={{ display: "inline-block", width: 100 }}>{cat.label.toLowerCase()}</span>
                {cat.items.join("  ·  ")}
              </TerminalLine>
            ))}
          </>
        );
        break;

      case "projetos": case "projects": case "ls projects":
        output = (
          <>
            <TerminalLine kind="system">{data.projects.length} projetos · {data.projects.filter(p => p.status === 'ongoing').length} em andamento</TerminalLine>
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
                  {e.current ? <span className="kw"> · atual</span> : null}
                </TerminalLine>
                <TerminalLine kind="default" >
                  <span className="dim">{e.period.start} — {e.period.end || "presente"} · {e.meta}</span>
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
              <span className="kw">{data.summary.totalCerts}+</span> certificados em tecnologia
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
              <span className="dim">  ...e mais {data.certificates.length - 6}.</span>
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
            <span className="kw">about</span>  <span className="kw">skills</span>  <span className="kw">projetos</span>  <span className="kw">exp</span>  <span className="kw">certs</span>  <span className="kw">contato</span>  <span className="kw">social</span>
          </TerminalLine>
        );
        break;

      case "date":
      case "time":
        output = <TerminalLine kind="default">{new Date().toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" })} BRT</TerminalLine>;
        break;

      case "sudo hire davi":
      case "sudo hire-me":
      case "hire me":
      case "hire-me":
        output = (
          <>
            <TerminalLine kind="system">[sudo] permissão concedida.</TerminalLine>
            <TerminalLine kind="default">→ <span className="kw">{data.identity.email}</span></TerminalLine>
            <TerminalLine kind="default">→ <span className="kw">{data.identity.linkedin}</span></TerminalLine>
            <TerminalLine kind="system">aguardando contato. :)</TerminalLine>
          </>
        );
        break;

      default:
        output = <TerminalLine kind="error">comando não encontrado: '{cmd}'. tente 'help'.</TerminalLine>;
    }

    setHistory((h) => [...h, { cmd, jsx: (
      <div className="terminal-section">
        <PromptLine command={cmd} />
        <div style={{ paddingLeft: 14, paddingTop: 4 }}>{output}</div>
      </div>
    ) }]);
  }, []);

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
        {["help", "about", "skills", "projetos", "exp", "contato", "hire-me"].map((c) => (
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
          placeholder={bootDone ? "digite um comando..." : ""}
          aria-label="Terminal input"
        />
      </form>
    </div>
  );
}

window.Terminal = Terminal;
