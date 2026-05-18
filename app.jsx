// app.jsx — Main app orchestrator + Tweaks integration.

const { useState, useEffect, useRef } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accent": "#d4ff00",
  "palette": ["#0a0907", "#ebe7df", "#d4ff00"],
  "fontMode": "editorial",
  "density": "regular",
  "grainOn": true,
  "scanOn": true,
  "cursorOn": true,
  "dark": true
}/*EDITMODE-END*/;

const FONT_PRESETS = {
  editorial: {
    label: "Editorial",
    display: '"Instrument Serif", Georgia, serif',
    mono: '"JetBrains Mono", ui-monospace, monospace',
    sans: '"Space Grotesk", system-ui, sans-serif',
  },
  mono: {
    label: "Mono only",
    display: '"JetBrains Mono", ui-monospace, monospace',
    mono: '"JetBrains Mono", ui-monospace, monospace',
    sans: '"JetBrains Mono", ui-monospace, monospace',
  },
  display: {
    label: "Display heavy",
    display: '"Space Grotesk", system-ui, sans-serif',
    mono: '"JetBrains Mono", ui-monospace, monospace',
    sans: '"Space Grotesk", system-ui, sans-serif',
  },
};

const ACCENT_OPTIONS = [
  "#d4ff00", // lime electric
  "#67e8f9", // original cyan
  "#ff5a36", // hot coral
  "#a78bfa", // soft purple
  "#fbbf24", // amber
];

const SECTIONS = [
  { id: "hero",       label: "INÍCIO" },
  { id: "manifesto",  label: "MANIFESTO" },
  { id: "stack",      label: "STACK" },
  { id: "projects",   label: "PROJETOS" },
  { id: "experience", label: "EXP" },
  { id: "education",  label: "EDUCAÇÃO" },
  { id: "contact",    label: "CONTATO" },
];

function useActiveSection(ids) {
  const [active, setActive] = useState(ids[0]);
  useEffect(() => {
    const opts = { root: null, rootMargin: "-40% 0px -55% 0px", threshold: 0 };
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) setActive(e.target.id);
      });
    }, opts);
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, [ids.join("|")]);
  return active;
}

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [splashGone, setSplashGone] = useState(false);
  const [lang, setLang] = useState("pt");
  const [dataVersion, setDataVersion] = useState(0);
  const [adminMode, setAdminMode] = useState(false);
  const [editor, setEditor] = useState(null);
  const active = useActiveSection(SECTIONS.map((s) => s.id));

  useEffect(() => {
    const rerender = () => setDataVersion((value) => value + 1);
    window.addEventListener("portfolio-data-ready", rerender);
    return () => window.removeEventListener("portfolio-data-ready", rerender);
  }, []);

  useEffect(() => {
    let clicks = 0;
    const footer = document.querySelector(".footer");
    if (!footer) return;
    const onClick = () => {
      clicks += 1;
      if (clicks < 5) return;
      clicks = 0;
      const answer = window.prompt("Digite a senha");
      if (answer === "2040") setAdminMode(true);
      else if (answer !== null) window.alert("Senha incorreta.");
    };
    footer.addEventListener("click", onClick);
    return () => footer.removeEventListener("click", onClick);
  }, [dataVersion]);

  // Apply token CSS vars from tweaks
  useEffect(() => {
    const r = document.documentElement;
    r.style.setProperty("--accent", t.accent);
    // derived softs
    const hexToRgba = (hex, alpha) => {
      const h = hex.replace("#", "");
      const r_ = parseInt(h.substring(0, 2), 16);
      const g_ = parseInt(h.substring(2, 4), 16);
      const b_ = parseInt(h.substring(4, 6), 16);
      return `rgba(${r_}, ${g_}, ${b_}, ${alpha})`;
    };
    r.style.setProperty("--accent-soft", hexToRgba(t.accent, 0.12));
    r.style.setProperty("--accent-line", hexToRgba(t.accent, 0.35));

    const fp = FONT_PRESETS[t.fontMode] || FONT_PRESETS.editorial;
    r.style.setProperty("--font-display", fp.display);
    r.style.setProperty("--font-mono", fp.mono);
    r.style.setProperty("--font-sans", fp.sans);

    // density
    if (t.density === "compact") {
      r.style.setProperty("--pad-section", "clamp(56px, 8vw, 100px)");
      r.style.setProperty("--pad-page", "clamp(16px, 4vw, 56px)");
    } else if (t.density === "comfy") {
      r.style.setProperty("--pad-section", "clamp(110px, 16vw, 200px)");
      r.style.setProperty("--pad-page", "clamp(28px, 6vw, 120px)");
    } else {
      r.style.setProperty("--pad-section", "clamp(80px, 12vw, 160px)");
      r.style.setProperty("--pad-page", "clamp(20px, 5vw, 80px)");
    }

    r.style.setProperty("--grain-opacity", t.grainOn ? "0.04" : "0");
    r.style.setProperty("--scan-opacity", t.scanOn ? "0.025" : "0");

    document.body.dataset.theme = t.dark ? "dark" : "light";
    if (t.dark) document.body.removeAttribute("data-theme");

    document.body.style.cursor = t.cursorOn ? "none" : "auto";
  }, [t]);

  return (
    <>
      {!splashGone && <Splash onDone={() => setSplashGone(true)} />}
      <span className="fx-grain" />
      <span className="fx-scan" />
      {t.cursorOn && <CustomCursor />}
      <ScrollProgress />

      <div className="app">
        <Nav
          sections={SECTIONS}
          activeSection={active}
          lang={lang}
          onLang={setLang}
        />
        <SectionRail sections={SECTIONS} active={active} />

        <main>
          <Hero />
          <Manifesto />
          <Stack />
          <Projects adminMode={adminMode} onEdit={setEditor} />
          <Experience adminMode={adminMode} onEdit={setEditor} />
          <Certificates adminMode={adminMode} onEdit={setEditor} />
          <Contact />
        </main>

        <Footer />
        {adminMode && <AdminDock onCreate={setEditor} />}
        {editor && <AdminEditor editor={editor} onClose={() => setEditor(null)} />}

        <TweaksPanel title="Tweaks">
          <TweakSection label="Identidade" />
          <TweakColor
            label="Accent"
            value={t.accent}
            options={ACCENT_OPTIONS}
            onChange={(v) => setTweak("accent", v)}
          />
          <TweakRadio
            label="Tipografia"
            value={t.fontMode}
            options={Object.keys(FONT_PRESETS)}
            onChange={(v) => setTweak("fontMode", v)}
          />

          <TweakSection label="Layout" />
          <TweakRadio
            label="Densidade"
            value={t.density}
            options={["compact", "regular", "comfy"]}
            onChange={(v) => setTweak("density", v)}
          />
          <TweakToggle
            label="Dark mode"
            value={t.dark}
            onChange={(v) => setTweak("dark", v)}
          />

          <TweakSection label="Efeitos" />
          <TweakToggle
            label="Grain"
            value={t.grainOn}
            onChange={(v) => setTweak("grainOn", v)}
          />
          <TweakToggle
            label="Scanlines"
            value={t.scanOn}
            onChange={(v) => setTweak("scanOn", v)}
          />
          <TweakToggle
            label="Cursor custom"
            value={t.cursorOn}
            onChange={(v) => setTweak("cursorOn", v)}
          />
        </TweaksPanel>
      </div>
    </>
  );
}

function AdminDock({ onCreate }) {
  return (
    <div className="admin-dock">
      <span>ADMIN</span>
      <button onClick={() => onCreate({ type: "projects" })}>+ projeto</button>
      <button onClick={() => onCreate({ type: "experiences" })}>+ experiência</button>
      <button onClick={() => onCreate({ type: "certificates" })}>+ certificado</button>
    </div>
  );
}

function toInputDate(value) {
  if (!value) return "";
  const date = typeof value.toDate === "function" ? value.toDate() : new Date(value);
  return Number.isNaN(date.getTime()) ? "" : date.toISOString().slice(0, 10);
}

function AdminEditor({ editor, onClose }) {
  const item = editor.item || {};
  const [type, setType] = useState(editor.type);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState("");
  const isEditing = !!item.id;

  const submit = async (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setBusy(true);
    setStatus("Salvando...");
    try {
      let payload;
      if (type === "projects") {
        payload = {
          title: String(form.get("title") || ""),
          descricao: String(form.get("descricao") || ""),
          url: String(form.get("url") || ""),
          dataInicio: form.get("dataInicio") ? new Date(String(form.get("dataInicio"))) : null,
          dataFinal: form.get("dataFinal") ? new Date(String(form.get("dataFinal"))) : null,
          finalizado: form.get("finalizado") === "on",
        };
      } else if (type === "experiences") {
        const current = form.get("trabalhoAtual") === "on";
        payload = {
          empresa: String(form.get("empresa") || ""),
          cargo: String(form.get("cargo") || ""),
          dataEntrada: form.get("dataEntrada") ? new Date(String(form.get("dataEntrada"))) : null,
          dataSaida: current || !form.get("dataSaida") ? null : new Date(String(form.get("dataSaida"))),
          trabalhoAtual: current,
        };
      } else {
        const current = form.get("atual") === "on";
        payload = {
          title: String(form.get("certTitle") || ""),
          instituicao: String(form.get("instituicao") || ""),
          logoUrl: String(form.get("logoUrl") || ""),
          dataInicio: form.get("certInicio") ? new Date(String(form.get("certInicio"))) : null,
          dataFinal: current || !form.get("certFim") ? null : new Date(String(form.get("certFim"))),
          atual: current,
          formacao: form.get("formacao") === "on",
        };
      }
      if (isEditing) await window.PORTFOLIO_ADMIN.update(type, item.id, payload);
      else await window.PORTFOLIO_ADMIN.create(type, payload);
      onClose();
    } catch (error) {
      console.error(error);
      setStatus("Erro ao salvar.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="admin-modal" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <form className="admin-card" onSubmit={submit}>
        <div className="admin-card-head">
          <strong>{isEditing ? "Editar" : "Novo"}</strong>
          {!isEditing && (
            <select value={type} onChange={(e) => setType(e.target.value)}>
              <option value="projects">Projeto</option>
              <option value="experiences">Experiência</option>
              <option value="certificates">Certificado</option>
            </select>
          )}
        </div>

        {type === "projects" && (
          <>
            <input name="title" placeholder="Título" defaultValue={item.title || ""} required />
            <textarea name="descricao" placeholder="Descrição" defaultValue={item.descricao || ""} />
            <input name="url" placeholder="URL" defaultValue={item.url || ""} />
            <div className="admin-row">
              <input name="dataInicio" type="date" defaultValue={toInputDate(item.dataInicio)} />
              <input name="dataFinal" type="date" defaultValue={toInputDate(item.dataFinal)} />
            </div>
            <label><input name="finalizado" type="checkbox" defaultChecked={!!item.finalizado} /> Finalizado</label>
          </>
        )}

        {type === "experiences" && (
          <>
            <input name="empresa" placeholder="Empresa" defaultValue={item.empresa || ""} required />
            <input name="cargo" placeholder="Cargo" defaultValue={item.cargo || ""} required />
            <div className="admin-row">
              <input name="dataEntrada" type="date" defaultValue={toInputDate(item.dataEntrada)} required />
              <input name="dataSaida" type="date" defaultValue={toInputDate(item.dataSaida)} />
            </div>
            <label><input name="trabalhoAtual" type="checkbox" defaultChecked={!!item.trabalhoAtual} /> Trabalho atual</label>
          </>
        )}

        {type === "certificates" && (
          <>
            <input name="certTitle" placeholder="Título" defaultValue={item.title || ""} required />
            <input name="instituicao" placeholder="Instituição" defaultValue={item.instituicao || ""} required />
            <input name="logoUrl" placeholder="URL do logo" defaultValue={item.logoUrl || ""} />
            <div className="admin-row">
              <input name="certInicio" type="date" defaultValue={toInputDate(item.dataInicio)} required />
              <input name="certFim" type="date" defaultValue={toInputDate(item.dataFinal)} />
            </div>
            <label><input name="atual" type="checkbox" defaultChecked={!!item.atual} /> Em andamento</label>
            <label><input name="formacao" type="checkbox" defaultChecked={!!item.formacao} /> Formação</label>
          </>
        )}

        <div className="admin-actions">
          <button type="button" onClick={onClose}>Cancelar</button>
          <button disabled={busy} type="submit">{busy ? "Salvando..." : "Salvar"}</button>
        </div>
        {status && <small>{status}</small>}
      </form>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
