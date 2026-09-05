// app.jsx — Main app orchestrator + Tweaks integration.

const { useState, useEffect, useRef } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accent": "#d4ff00",
  "palette": ["#0a0907", "#ebe7df", "#d4ff00"],
  "fontMode": "editorial",
  "density": "regular",
  "grainOn": true,
  "scanOn": false,
  "cursorOn": false,
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

const SECTION_IDS = ["hero", "projects", "experience", "manifesto", "education", "contact"];

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
  const t = TWEAK_DEFAULTS;
  const [lang, setLang] = useState(() => {
    const saved = window.localStorage?.getItem("portfolio-lang");
    if (saved === "pt" || saved === "en") return saved;
    return navigator.language?.toLowerCase().startsWith("pt") ? "pt" : "en";
  });
  const [dataVersion, setDataVersion] = useState(0);
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
    if (!window.location.hash) return;
    const id = decodeURIComponent(window.location.hash.slice(1));
    window.requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView());
  }, []);

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

    document.body.style.cursor = "auto";
  }, [t]);

  return (
    <>
      <span className="fx-grain" />

      <div className="app">
        <Nav
          sections={sections}
          activeSection={active}
          lang={lang}
          onLang={setLang}
        />
        <main>
          <Hero lang={lang} />
          <Projects lang={lang} />
          <Experience lang={lang} />
          <Manifesto lang={lang} />
          <Learning lang={lang} />
          <Contact lang={lang} />
        </main>

        <Footer lang={lang} />
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
  { id: "profile", label: "YouTube" },
  { id: "projects", label: "Projetos" },
  { id: "experiences", label: "Experiências" },
  { id: "skills", label: "Skills" },
  { id: "certificates", label: "Certificados" },
  { id: "education", label: "Formação" },
];

function getAdminItems(type, data) {
  if (type === "profile") return [];
  if (type === "projects") return data.projects;
  if (type === "experiences") return data.experiences;
  if (type === "skills") return data.skills || [];
  if (type === "education") return data.education;
  return data.certificates;
}

function getAdminStorageType(type) {
  return type === "education" ? "certificates" : type;
}

function getAdminItemTitle(type, item) {
  if (type === "projects") return item.title || item.name || "Projeto sem título";
  if (type === "experiences") return item.cargo || item.role || "Experiência sem cargo";
  if (type === "skills") return item.name || "Skill sem nome";
  return item.title || "Item sem título";
}

function getAdminItemMeta(type, item) {
  if (type === "projects") return item.year || "";
  if (type === "experiences") return item.empresa || item.company || "";
  if (type === "skills") {
    const order = item.ordem || item.order;
    return [order ? `Ordem ${order}` : "", item.nameEn || ""].filter(Boolean).join(" - ");
  }
  if (type === "certificates") {
    const order = item.ordem || item.order;
    const skill = (window.PORTFOLIO_DATA.skills || []).find((entry) => entry.id === item.skillId);
    return [skill?.name || "Outros", order ? `Ordem ${order}` : "", item.instituicao || item.org || ""].filter(Boolean).join(" - ");
  }
  return item.instituicao || item.org || "";
}

function buildAdminPayload(type, form) {
  if (type === "profile") {
    return {
      youtube: {
        label: String(form.get("youtubeLabel") || ""),
        href: String(form.get("youtubeHref") || ""),
        featuredVideo: {
          title: String(form.get("youtubeVideoTitle") || ""),
          url: String(form.get("youtubeVideoUrl") || ""),
        },
      },
    };
  }

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

  if (type === "skills") {
    const orderRaw = String(form.get("ordem") || "").trim();
    const orderValue = orderRaw ? Number(orderRaw) : null;
    return {
      name: String(form.get("name") || "").trim(),
      nameEn: String(form.get("nameEn") || "").trim(),
      description: String(form.get("description") || "").trim(),
      descriptionEn: String(form.get("descriptionEn") || "").trim(),
      ordem: Number.isFinite(orderValue) ? orderValue : null,
    };
  }

  const current = form.get("atual") === "on";
  const orderRaw = String(form.get("ordem") || "").trim();
  const orderValue = orderRaw ? Number(orderRaw) : null;
  const accessUrl = String(form.get("url") || "").trim();
  return {
    title: String(form.get("title") || ""),
    titleEn: String(form.get("titleEn") || ""),
    description: String(form.get("description") || ""),
    descriptionEn: String(form.get("descriptionEn") || ""),
    instituicao: String(form.get("instituicao") || ""),
    url: accessUrl,
    fileUrl: accessUrl,
    logoUrl: "",
    ...(type === "certificates" ? {
      ordem: Number.isFinite(orderValue) ? orderValue : null,
      skillId: String(form.get("skillId") || ""),
    } : {}),
    dataInicio: form.get("dataInicio") ? new Date(String(form.get("dataInicio"))) : null,
    dataFinal: current || !form.get("dataFinal") ? null : new Date(String(form.get("dataFinal"))),
    atual: current,
    formacao: type === "education",
  };
}

function titleFromFileName(fileName) {
  return String(fileName || "Certificado")
    .replace(/\.[^.]+$/, "")
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
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
  const isProfile = type === "profile";
  const youtube = data.identity.youtube || {};
  const featuredVideo = youtube.featuredVideo || {};
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
      const certificateFiles = (type === "certificates" || type === "education")
        ? form.getAll("certificateFile").filter((file) => file && file.size > 0)
        : [];

      if (type === "certificates" && !isEditing && certificateFiles.length > 0) {
        if (!window.PORTFOLIO_ADMIN?.uploadCertificateFile || !window.PORTFOLIO_ADMIN?.createMany) {
          throw new Error("Upload em lote indisponivel.");
        }

        const uploadedPayloads = [];
        const failedFiles = [];
        for (let index = 0; index < certificateFiles.length; index += 1) {
          const file = certificateFiles[index];
          setStatus(`Enviando ${index + 1}/${certificateFiles.length}: ${file.name}`);
          try {
            const url = await window.PORTFOLIO_ADMIN.uploadCertificateFile(file);
            uploadedPayloads.push({
              ...payload,
              title: certificateFiles.length === 1 && payload.title ? payload.title : titleFromFileName(file.name),
              titleEn: certificateFiles.length === 1 ? payload.titleEn : "",
              url,
              fileUrl: url,
              fileName: file.name,
              mimeType: file.type,
            });
          } catch (error) {
            console.error(error);
            failedFiles.push(file.name);
          }
        }

        let createdCount = 0;
        if (uploadedPayloads.length > 0) {
          setStatus("Salvando certificados...");
          const results = await window.PORTFOLIO_ADMIN.createMany("certificates", uploadedPayloads);
          createdCount = results.filter((result) => result.status === "fulfilled").length;
          results.forEach((result, index) => {
            if (result.status === "rejected") failedFiles.push(uploadedPayloads[index].fileName);
          });
        }

        setStatus(`${createdCount}/${certificateFiles.length} certificados criados${failedFiles.length ? `; falharam: ${failedFiles.join(", ")}` : "."}`);
        setSelectedId(null);
        return;
      }

      if (type === "certificates" && !isEditing && !payload.title && !payload.url) {
        throw new Error("Informe um titulo, uma URL ou selecione arquivos.");
      }

      const certificateFile = certificateFiles[0] || null;
      if (certificateFile && certificateFile.size > 0) {
        if (!window.PORTFOLIO_ADMIN?.uploadCertificateFile) {
          throw new Error("Upload de arquivo indisponivel.");
        }
        setStatus("Enviando arquivo...");
        payload.url = await window.PORTFOLIO_ADMIN.uploadCertificateFile(certificateFile, item?.id);
        payload.fileUrl = payload.url;
        payload.fileName = certificateFile.name;
        payload.mimeType = certificateFile.type;
        setStatus("Salvando...");
      }
      if (isProfile) {
        await window.PORTFOLIO_ADMIN.saveProfile(payload);
      } else {
        const storageType = getAdminStorageType(type);
        if (isEditing) await window.PORTFOLIO_ADMIN.update(storageType, item.id, payload);
        else await window.PORTFOLIO_ADMIN.create(storageType, payload);
      }
      setStatus(isProfile || isEditing ? "Atualizado." : "Criado.");
      setSelectedId(null);
    } catch (error) {
      console.error(error);
      setStatus(error?.message || "Erro ao salvar.");
    } finally {
      setBusy(false);
    }
  };

  const remove = async (entry) => {
    const warning = type === "skills"
      ? `Excluir "${getAdminItemTitle(type, entry)}"? Os certificados vinculados serao preservados em Outros.`
      : `Excluir "${getAdminItemTitle(type, entry)}"?`;
    if (!window.confirm(warning)) return;
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
              {!isProfile && <button type="button" onClick={() => setSelectedId(null)}>+ novo</button>}
            </div>
            <div className="admin-list-items">
              {isProfile && <p>Configuracao unica do canal e do video em destaque.</p>}
              {!isProfile && items.length === 0 && <p>Nenhum item cadastrado.</p>}
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
              <strong>{isProfile ? "Canal e video" : isEditing ? "Editar" : "Novo"}</strong>
              {status && <small>{status}</small>}
            </div>

            {isProfile && (
              <>
                <input name="youtubeLabel" placeholder="Label do canal" defaultValue={youtube.label || ""} required />
                <input name="youtubeHref" placeholder="URL do canal" defaultValue={youtube.href || ""} required />
                <input name="youtubeVideoTitle" placeholder="Titulo do video" defaultValue={featuredVideo.title || ""} required />
                <input name="youtubeVideoUrl" placeholder="URL do video do YouTube" defaultValue={featuredVideo.url || ""} required />
              </>
            )}

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

            {type === "skills" && (
              <>
                <div className="admin-form-row">
                  <input name="name" placeholder="Nome da skill (PT)" defaultValue={item?.name || ""} required />
                  <input name="nameEn" placeholder="Skill name (EN)" defaultValue={item?.nameEn || ""} required />
                </div>
                <textarea name="description" placeholder="Descricao da skill (PT)" defaultValue={item?.description || ""} />
                <textarea name="descriptionEn" placeholder="Skill description (EN)" defaultValue={item?.descriptionEn || ""} />
                <input
                  name="ordem"
                  type="number"
                  min="1"
                  step="1"
                  placeholder="Ordem de exibicao"
                  defaultValue={item?.ordem || item?.order || ""}
                />
              </>
            )}

            {(type === "certificates" || type === "education") && (
              <>
                <div className="admin-form-row">
                  <input
                    name="title"
                    placeholder="Titulo (PT)"
                    defaultValue={item?.title || ""}
                    required={type === "education" || isEditing}
                  />
                  <input name="titleEn" placeholder="Title (EN)" defaultValue={item?.titleEn || ""} />
                </div>
                {type === "certificates" && (
                  <>
                    <div className="admin-form-row">
                      <select name="skillId" defaultValue={item?.skillId || ""}>
                        <option value="">Outros / Other</option>
                        {(data.skills || []).map((skill) => (
                          <option key={skill.id} value={skill.id}>{skill.name}</option>
                        ))}
                      </select>
                      <input name="instituicao" placeholder="Instituicao" defaultValue={item?.instituicao || ""} />
                    </div>
                    <textarea name="description" placeholder="Descricao do certificado (PT)" defaultValue={item?.description || ""} />
                    <textarea name="descriptionEn" placeholder="Certificate description (EN)" defaultValue={item?.descriptionEn || ""} />
                  </>
                )}
                {type === "education" && (
                  <input name="instituicao" placeholder="Instituicao" defaultValue={item?.instituicao || ""} required />
                )}
                {type === "certificates" ? (
                  <div className="admin-form-row">
                    <input
                      name="url"
                      placeholder="URL do certificado (PDF, imagem ou link)"
                      defaultValue={item?.url || item?.fileUrl || item?.imageUrl || item?.logoUrl || ""}
                    />
                    <input
                      name="ordem"
                      type="number"
                      min="1"
                      step="1"
                      placeholder="Ordem"
                      defaultValue={item?.ordem || item?.order || ""}
                    />
                  </div>
                ) : (
                  <input
                    name="url"
                    placeholder="URL do PDF da formacao"
                    defaultValue={item?.url || item?.fileUrl || item?.imageUrl || item?.logoUrl || ""}
                  />
                )}
                <label className="admin-file-field">
                  <span>
                    {type === "certificates" && !isEditing
                      ? "Arquivos dos certificados (selecao multipla)"
                      : type === "certificates" ? "Arquivo do certificado" : "PDF da formacao"}
                  </span>
                  <input
                    name="certificateFile"
                    type="file"
                    accept={type === "certificates" ? "application/pdf,image/jpeg,image/png,image/webp" : "application/pdf"}
                    multiple={type === "certificates" && !isEditing}
                  />
                </label>
                <div className="admin-form-row">
                  <input name="dataInicio" type="date" defaultValue={toInputDate(item?.dataInicio)} required={type === "education"} />
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
              {isEditing && !isProfile && (
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
