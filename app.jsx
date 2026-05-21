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

const SECTION_IDS = ["hero", "manifesto", "stack", "projects", "experience", "education", "contact"];

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
  const [lang, setLang] = useState(() => {
    const saved = window.localStorage?.getItem("portfolio-lang");
    return saved === "en" ? "en" : "pt";
  });
  const [dataVersion, setDataVersion] = useState(0);
  const [adminOpen, setAdminOpen] = useState(false);
  const active = useActiveSection(SECTION_IDS);
  const copy = window.getPortfolioCopy?.(lang) || window.PORTFOLIO_COPY.pt;
  const sections = copy.sections || SECTION_IDS.map((id) => ({ id, label: id.toUpperCase() }));

  useEffect(() => {
    document.documentElement.lang = lang === "en" ? "en" : "pt-BR";
    document.title = copy.documentTitle || document.title;
    window.localStorage?.setItem("portfolio-lang", lang);
  }, [lang, copy.documentTitle]);

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
      const answer = window.prompt(copy.adminPromptPassword);
      if (answer === "2040") setAdminOpen(true);
      else if (answer !== null) window.alert(copy.adminWrongPassword);
    };
    footer.addEventListener("click", onClick);
    return () => footer.removeEventListener("click", onClick);
  }, [dataVersion, copy.adminPromptPassword, copy.adminWrongPassword]);

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
      {!splashGone && <Splash lang={lang} onDone={() => setSplashGone(true)} />}
      <span className="fx-grain" />
      <span className="fx-scan" />
      {t.cursorOn && <CustomCursor />}
      <ScrollProgress />

      <div className="app">
        <Nav
          sections={sections}
          activeSection={active}
          lang={lang}
          onLang={setLang}
        />
        <SectionRail sections={sections} active={active} />

        <main>
          <Hero lang={lang} />
          <Manifesto lang={lang} />
          <Stack lang={lang} />
          <Projects lang={lang} />
          <Experience lang={lang} />
          <Certificates lang={lang} />
          <Contact lang={lang} />
        </main>

        <Footer lang={lang} />
        {adminOpen && <AdminPanel onClose={() => setAdminOpen(false)} />}

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

function toInputDate(value) {
  if (!value) return "";
  const date = typeof value.toDate === "function" ? value.toDate() : new Date(value);
  return Number.isNaN(date.getTime()) ? "" : date.toISOString().slice(0, 10);
}

const ADMIN_TABS = [
  { id: "projects", label: "Projetos" },
  { id: "experiences", label: "Experiências" },
  { id: "certificates", label: "Certificados" },
  { id: "education", label: "Formação" },
];

function getAdminItems(type, data) {
  if (type === "projects") return data.projects;
  if (type === "experiences") return data.experiences;
  if (type === "education") return data.education;
  return data.certificates;
}

function getAdminStorageType(type) {
  return type === "education" ? "certificates" : type;
}

function getAdminItemTitle(type, item) {
  if (type === "projects") return item.title || item.name || "Projeto sem título";
  if (type === "experiences") return item.cargo || item.role || "Experiência sem cargo";
  return item.title || "Item sem título";
}

function getAdminItemMeta(type, item) {
  if (type === "projects") return item.year || "";
  if (type === "experiences") return item.empresa || item.company || "";
  return item.instituicao || item.org || "";
}

function buildAdminPayload(type, form) {
  if (type === "projects") {
    return {
      title: String(form.get("title") || ""),
      descricao: String(form.get("descricao") || ""),
      url: String(form.get("url") || ""),
      stack: String(form.get("stack") || "")
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
      dataInicio: form.get("dataInicio") ? new Date(String(form.get("dataInicio"))) : null,
      dataFinal: form.get("dataFinal") ? new Date(String(form.get("dataFinal"))) : null,
      finalizado: form.get("finalizado") === "on",
    };
  }

  if (type === "experiences") {
    const current = form.get("trabalhoAtual") === "on";
    return {
      empresa: String(form.get("empresa") || ""),
      cargo: String(form.get("cargo") || ""),
      meta: String(form.get("meta") || ""),
      summary: String(form.get("summary") || ""),
      dataEntrada: form.get("dataEntrada") ? new Date(String(form.get("dataEntrada"))) : null,
      dataSaida: current || !form.get("dataSaida") ? null : new Date(String(form.get("dataSaida"))),
      trabalhoAtual: current,
    };
  }

  const current = form.get("atual") === "on";
  return {
    title: String(form.get("title") || ""),
    instituicao: String(form.get("instituicao") || ""),
    logoUrl: String(form.get("logoUrl") || ""),
    dataInicio: form.get("dataInicio") ? new Date(String(form.get("dataInicio"))) : null,
    dataFinal: current || !form.get("dataFinal") ? null : new Date(String(form.get("dataFinal"))),
    atual: current,
    formacao: type === "education",
  };
}

function AdminPanel({ onClose }) {
  const data = window.PORTFOLIO_DATA;
  const [type, setType] = useState("projects");
  const [selectedId, setSelectedId] = useState(null);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState("");
  const items = getAdminItems(type, data).filter((entry) => entry.id);
  const item = items.find((entry) => entry.id === selectedId) || null;
  const isEditing = !!item;
  const [currentFlag, setCurrentFlag] = useState(false);

  useEffect(() => {
    setSelectedId(null);
    setStatus("");
  }, [type]);

  useEffect(() => {
    if (type === "experiences") setCurrentFlag(!!item?.trabalhoAtual);
    else if (type === "certificates" || type === "education") setCurrentFlag(!!item?.atual);
    else setCurrentFlag(false);
  }, [type, item?.id]);

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  const submit = async (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setBusy(true);
    setStatus("Salvando...");
    try {
      const payload = buildAdminPayload(type, form);
      const storageType = getAdminStorageType(type);
      if (isEditing) await window.PORTFOLIO_ADMIN.update(storageType, item.id, payload);
      else await window.PORTFOLIO_ADMIN.create(storageType, payload);
      setStatus(isEditing ? "Atualizado." : "Criado.");
      setSelectedId(null);
    } catch (error) {
      console.error(error);
      setStatus("Erro ao salvar.");
    } finally {
      setBusy(false);
    }
  };

  const remove = async (entry) => {
    if (!window.confirm(`Excluir "${getAdminItemTitle(type, entry)}"?`)) return;
    setBusy(true);
    setStatus("Excluindo...");
    try {
      await window.PORTFOLIO_ADMIN.remove(getAdminStorageType(type), entry.id);
      if (selectedId === entry.id) setSelectedId(null);
      setStatus("Excluído.");
    } catch (error) {
      console.error(error);
      setStatus("Erro ao excluir.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="admin-modal admin-panel-overlay" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <section className="admin-card admin-panel">
        <header className="admin-panel-head">
          <div>
            <strong>Configurar portfólio</strong>
            <span>Gerencie o conteúdo que aparece no site.</span>
          </div>
          <button type="button" onClick={onClose}>Fechar</button>
        </header>

        <nav className="admin-tabs" aria-label="Seções do painel">
          {ADMIN_TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={type === tab.id ? "is-active" : ""}
              onClick={() => setType(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        <div className="admin-panel-body">
          <aside className="admin-list">
            <div className="admin-list-head">
              <strong>{ADMIN_TABS.find((tab) => tab.id === type)?.label}</strong>
              <button type="button" onClick={() => setSelectedId(null)}>+ novo</button>
            </div>
            <div className="admin-list-items">
              {items.length === 0 && <p>Nenhum item cadastrado.</p>}
              {items.map((entry) => (
                <div key={entry.id} className={`admin-list-item ${selectedId === entry.id ? "is-active" : ""}`}>
                  <button type="button" onClick={() => setSelectedId(entry.id)}>
                    <strong>{getAdminItemTitle(type, entry)}</strong>
                    <span>{getAdminItemMeta(type, entry)}</span>
                  </button>
                  <button type="button" onClick={() => remove(entry)} disabled={busy}>Excluir</button>
                </div>
              ))}
            </div>
          </aside>

          <form
            key={`${type}:${item?.id || "new"}`}
            className="admin-form"
            onSubmit={submit}
          >
            <div className="admin-form-head">
              <strong>{isEditing ? "Editar" : "Novo"}</strong>
              {status && <small>{status}</small>}
            </div>

            {type === "projects" && (
              <>
                <input name="title" placeholder="Título" defaultValue={item?.title || ""} required />
                <textarea name="descricao" placeholder="Descrição" defaultValue={item?.descricao || ""} />
                <input name="url" placeholder="URL do projeto" defaultValue={item?.url || ""} />
                <input
                  name="stack"
                  placeholder="Stack separada por vírgulas"
                  defaultValue={(item?.stack || []).join(", ")}
                />
                <div className="admin-form-row">
                  <input name="dataInicio" type="date" defaultValue={toInputDate(item?.dataInicio)} />
                  <input name="dataFinal" type="date" defaultValue={toInputDate(item?.dataFinal)} />
                </div>
                <label><input name="finalizado" type="checkbox" defaultChecked={!!item?.finalizado} /> Finalizado</label>
              </>
            )}

            {type === "experiences" && (
              <>
                <input name="empresa" placeholder="Empresa" defaultValue={item?.empresa || ""} required />
                <input name="cargo" placeholder="Cargo" defaultValue={item?.cargo || ""} required />
                <input name="meta" placeholder="Meta / local / tipo" defaultValue={item?.meta || ""} />
                <textarea name="summary" placeholder="Resumo" defaultValue={item?.summary || ""} />
                <div className="admin-form-row">
                  <input name="dataEntrada" type="date" defaultValue={toInputDate(item?.dataEntrada)} required />
                  <input
                    name="dataSaida"
                    type="date"
                    defaultValue={toInputDate(item?.dataSaida)}
                    disabled={currentFlag}
                  />
                </div>
                <label>
                  <input
                    name="trabalhoAtual"
                    type="checkbox"
                    checked={currentFlag}
                    onChange={(e) => setCurrentFlag(e.target.checked)}
                  />{" "}
                  Trabalho atual
                </label>
              </>
            )}

            {(type === "certificates" || type === "education") && (
              <>
                <input name="title" placeholder="Título" defaultValue={item?.title || ""} required />
                <input name="instituicao" placeholder="Instituição" defaultValue={item?.instituicao || ""} required />
                <input name="logoUrl" placeholder="URL do logo" defaultValue={item?.logoUrl || ""} />
                <div className="admin-form-row">
                  <input name="dataInicio" type="date" defaultValue={toInputDate(item?.dataInicio)} required />
                  <input
                    name="dataFinal"
                    type="date"
                    defaultValue={toInputDate(item?.dataFinal)}
                    disabled={currentFlag}
                  />
                </div>
                <label>
                  <input
                    name="atual"
                    type="checkbox"
                    checked={currentFlag}
                    onChange={(e) => setCurrentFlag(e.target.checked)}
                  />{" "}
                  Em andamento
                </label>
              </>
            )}

            <div className="admin-form-actions">
              {isEditing && (
                <button type="button" onClick={() => setSelectedId(null)}>Novo item</button>
              )}
              <button disabled={busy} type="submit">{busy ? "Salvando..." : "Salvar"}</button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
