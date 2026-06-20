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

function getSectionNumber(copy, id) {
  const index = (copy.sections || []).findIndex((section) => section.id === id);
  return String(Math.max(0, index) + 1).padStart(2, "0");
}

function getSectionName(copy, id, fallback) {
  return copy.sections?.find((section) => section.id === id)?.label || fallback;
}

function getCertificateOrderValue(item) {
  const rawValue = item?.ordem ?? item?.order;
  if (rawValue === "" || rawValue === null || rawValue === undefined) return null;
  const value = Number(rawValue);
  return Number.isFinite(value) ? value : null;
}

function getCertificateHref(url) {
  const value = String(url || "").trim();
  if (!value) return "";

  const isRelativePath = /^(?:\.{0,2}\/|\/|img\/|assets\/|certificados\/)/i.test(value);
  const withProtocol = isRelativePath || /^https?:\/\//i.test(value) ? value : `https://${value}`;
  try {
    const parsed = new URL(withProtocol, window.location.href);
    return /^https?:$/i.test(parsed.protocol) ? parsed.href : "";
  } catch {
    return "";
  }
}

function getCertificateAccessHref(item) {
  return getCertificateHref(item?.url || item?.fileUrl || item?.imageUrl || item?.logoUrl);
}

function getCertificateMediaType(item) {
  const mimeType = String(item?.mimeType || "").toLowerCase();
  const source = `${item?.fileName || ""} ${getCertificateAccessHref(item)}`.toLowerCase();
  if (mimeType === "application/pdf" || /\.pdf(?:\b|%2f|%3f|\?)/i.test(source)) return "pdf";
  if (mimeType.startsWith("image/") || /\.(?:jpe?g|png|webp)(?:\b|%2f|%3f|\?)/i.test(source) || item?.imageUrl || item?.logoUrl) return "image";
  return "file";
}

function getCertificateFileName(item) {
  if (item?.fileName) return item.fileName;
  const mediaType = getCertificateMediaType(item);
  const extension = mediaType === "pdf" ? ".pdf" : mediaType === "image" ? ".png" : "";
  return `${String(item?.title || "certificate").replace(/[^a-z0-9._-]+/gi, "-")}${extension}`;
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

function getHeroPalette() {
  const styles = getComputedStyle(document.documentElement);
  const accent = styles.getPropertyValue("--accent").trim() || "#d4ff00";
  const text = styles.getPropertyValue("--text-strong").trim() || "#fbf9f4";
  const rawHex = accent.replace("#", "");
  const hex = rawHex.length === 3 ? rawHex.split("").map((char) => char + char).join("") : rawHex;
  const parsed = Number.parseInt(hex, 16);
  return {
    accent,
    text,
    accentRgb: Number.isFinite(parsed)
      ? [(parsed >> 16) & 255, (parsed >> 8) & 255, parsed & 255]
      : [212, 255, 0],
  };
}

function useHeroExperience(fullName) {
  const rootRef = useRef(null);
  const contentRef = useRef(null);
  const bgRef = useRef(null);
  const nameRef = useRef(null);
  const nameWrapRef = useRef(null);
  const stageRef = useRef(null);
  const phoneRef = useRef(null);
  const shadowRef = useRef(null);

  useEffect(() => {
    const root = rootRef.current;
    const content = contentRef.current;
    const bgCanvas = bgRef.current;
    const nameCanvas = nameRef.current;
    const nameWrap = nameWrapRef.current;
    const stage = stageRef.current;
    const phone = phoneRef.current;
    const shadow = shadowRef.current;
    if (!root || !content || !bgCanvas || !nameCanvas || !nameWrap || !stage || !phone) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarse = window.matchMedia("(pointer: coarse)");
    const names = fullName.trim().split(/\s+/);
    const firstName = (names.shift() || "DAVI").toUpperCase();
    const lastName = (names.join(" ") || "MANIERI").toUpperCase();
    const pointer = { x: window.innerWidth / 2, y: window.innerHeight * 0.42, active: false };
    const rotation = { targetX: -16, targetY: -6, x: -16, y: -6 };
    const drag = { active: false, startX: 0, startY: 0, baseX: 0, baseY: 0 };
    let palette = getHeroPalette();
    let raf = 0;
    let running = true;
    let velocity = 0;
    let width = 1;
    let height = 1;
    let dpr = 1;
    let particles = [];
    let connectParticles = false;
    const bgContext = bgCanvas.getContext("2d");

    const sizeBackground = () => {
      if (!bgContext) return;
      const rect = bgCanvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);
      bgCanvas.width = Math.max(1, Math.round(width * dpr));
      bgCanvas.height = Math.max(1, Math.round(height * dpr));
      const compact = coarse.matches || width < 720;
      connectParticles = !compact;
      particles = Array.from({ length: compact ? 32 : 72 }, () => {
        const depth = 0.35 + Math.random() * 0.65;
        return {
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.12 * depth,
          vy: (Math.random() - 0.5) * 0.12 * depth,
          radius: 0.7 + Math.random() * 1.7,
          depth,
          drawX: 0,
          drawY: 0,
        };
      });
    };

    const drawBackground = () => {
      if (!bgContext) return;
      bgContext.setTransform(dpr, 0, 0, dpr, 0, 0);
      bgContext.clearRect(0, 0, width, height);
      const rect = bgCanvas.getBoundingClientRect();
      const px = pointer.x - rect.left;
      const py = pointer.y - rect.top;
      const parallaxX = (px / width - 0.5) * 34;
      const parallaxY = (py / height - 0.5) * 34;

      particles.forEach((particle) => {
        if (!reduced) {
          particle.x += particle.vx;
          particle.y += particle.vy;
          if (particle.x < -20) particle.x = width + 20;
          if (particle.x > width + 20) particle.x = -20;
          if (particle.y < -20) particle.y = height + 20;
          if (particle.y > height + 20) particle.y = -20;
          const dx = particle.x - px;
          const dy = particle.y - py;
          const distance = Math.hypot(dx, dy) || 1;
          if (pointer.active && distance < 160) {
            const force = (1 - distance / 160) * 0.18;
            particle.vx += (dx / distance) * force;
            particle.vy += (dy / distance) * force;
          }
          particle.vx *= 0.97;
          particle.vy *= 0.97;
        }
        particle.drawX = particle.x - parallaxX * particle.depth;
        particle.drawY = particle.y - parallaxY * particle.depth;
      });

      if (connectParticles) {
        for (let i = 0; i < particles.length; i += 1) {
          for (let j = i + 1; j < particles.length; j += 1) {
            const a = particles[i];
            const b = particles[j];
            const distance = Math.hypot(a.drawX - b.drawX, a.drawY - b.drawY);
            if (distance < 118) {
              bgContext.strokeStyle = `rgba(235, 231, 223, ${(1 - distance / 118) * 0.06})`;
              bgContext.beginPath();
              bgContext.moveTo(a.drawX, a.drawY);
              bgContext.lineTo(b.drawX, b.drawY);
              bgContext.stroke();
            }
          }
        }
      }

      particles.forEach((particle) => {
        bgContext.fillStyle = `rgba(235, 231, 223, ${0.14 + particle.depth * 0.34})`;
        bgContext.beginPath();
        bgContext.arc(particle.drawX, particle.drawY, particle.radius * particle.depth, 0, Math.PI * 2);
        bgContext.fill();
      });

      if (pointer.active && !reduced) {
        const [r, g, b] = palette.accentRgb;
        const glow = bgContext.createRadialGradient(px, py, 0, px, py, 230);
        glow.addColorStop(0, `rgba(${r}, ${g}, ${b}, 0.1)`);
        glow.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);
        bgContext.fillStyle = glow;
        bgContext.beginPath();
        bgContext.arc(px, py, 230, 0, Math.PI * 2);
        bgContext.fill();
      }
    };

    let gl = null;
    let nameProgram = null;
    let nameTexture = null;
    let nameBuffer = null;
    let nameUniforms = null;
    let nameReady = false;
    const nameStart = performance.now();

    const paintName = (ctx, cssWidth, cssHeight) => {
      let fontSize = cssHeight * 0.47;
      ctx.font = `${fontSize}px 'Instrument Serif', Georgia, serif`;
      while (ctx.measureText(lastName).width > cssWidth * 0.99 && fontSize > 12) {
        fontSize -= 2;
        ctx.font = `${fontSize}px 'Instrument Serif', Georgia, serif`;
      }
      const lineHeight = fontSize * 0.86;
      const firstBaseline = cssHeight / 2 - lineHeight * 0.16;
      ctx.textBaseline = "alphabetic";
      ctx.fillStyle = palette.text;
      ctx.fillText(firstName, 0, firstBaseline);
      ctx.font = `italic ${fontSize}px 'Instrument Serif', Georgia, serif`;
      ctx.fillStyle = palette.accent;
      ctx.fillText(lastName.charAt(0), 0, firstBaseline + lineHeight);
      const initialWidth = ctx.measureText(lastName.charAt(0)).width;
      ctx.font = `${fontSize}px 'Instrument Serif', Georgia, serif`;
      ctx.fillStyle = palette.text;
      ctx.fillText(lastName.slice(1), initialWidth, firstBaseline + lineHeight);
    };

    const drawNameFallback = () => {
      const ctx = nameCanvas.getContext("2d");
      if (!ctx) return;
      const rect = nameCanvas.getBoundingClientRect();
      const localDpr = Math.min(window.devicePixelRatio || 1, 2);
      nameCanvas.width = Math.max(1, Math.round(rect.width * localDpr));
      nameCanvas.height = Math.max(1, Math.round(rect.height * localDpr));
      ctx.scale(localDpr, localDpr);
      paintName(ctx, rect.width, rect.height);
      nameWrap.classList.add("is-canvas-ready");
    };

    const compileShader = (type, source) => {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const buildNameTexture = () => {
      if (!gl || !nameTexture) return;
      const localDpr = Math.min(window.devicePixelRatio || 1, 2);
      const textureCanvas = document.createElement("canvas");
      textureCanvas.width = nameCanvas.width;
      textureCanvas.height = nameCanvas.height;
      const ctx = textureCanvas.getContext("2d");
      if (!ctx) return;
      ctx.scale(localDpr, localDpr);
      paintName(ctx, textureCanvas.width / localDpr, textureCanvas.height / localDpr);
      gl.bindTexture(gl.TEXTURE_2D, nameTexture);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, textureCanvas);
      nameReady = true;
      nameWrap.classList.add("is-canvas-ready");
    };

    const sizeName = () => {
      const rect = nameCanvas.getBoundingClientRect();
      const localDpr = Math.min(window.devicePixelRatio || 1, 2);
      nameCanvas.width = Math.max(1, Math.round(rect.width * localDpr));
      nameCanvas.height = Math.max(1, Math.round(rect.height * localDpr));
      if (!gl) return drawNameFallback();
      gl.viewport(0, 0, nameCanvas.width, nameCanvas.height);
      buildNameTexture();
    };

    const initName = () => {
      gl = nameCanvas.getContext("webgl", { alpha: true, premultipliedAlpha: false, antialias: true });
      if (!gl) return drawNameFallback();
      const vertexSource = "attribute vec2 p;varying vec2 v;void main(){v=p*.5+.5;gl_Position=vec4(p,0.,1.);}";
      const fragmentSource = `precision highp float;
        uniform sampler2D textureMap;uniform float time;uniform float reveal;
        uniform float velocity;uniform vec2 mouse;varying vec2 v;
        float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
        float noise(vec2 p){vec2 i=floor(p),f=fract(p),u=f*f*(3.-2.*f);
          return mix(mix(hash(i),hash(i+vec2(1.,0.)),u.x),mix(hash(i+vec2(0.,1.)),hash(i+vec2(1.,1.)),u.x),u.y);}
        float fbm(vec2 p){float a=.5,s=0.;for(int i=0;i<4;i++){s+=a*noise(p);p*=2.;a*=.5;}return s;}
        void main(){vec2 uv=v;float ring=smoothstep(.48,0.,distance(uv,mouse));
          float amp=reveal*.15+velocity*.04+ring*velocity*.035+.003;
          vec2 q=vec2(fbm(uv*3.2+time*.22),fbm(uv*3.2-time*.22+4.7));
          vec2 disp=(q-.5)*amp*2.;disp.y+=(hash(floor(uv*vec2(70.,1.)))-.5)*reveal*.28;
          float split=velocity*.5+reveal*.4+ring*.16+.003;
          vec4 cr=texture2D(textureMap,uv+disp+vec2(split*.018,0.));
          vec4 cg=texture2D(textureMap,uv+disp);vec4 cb=texture2D(textureMap,uv+disp-vec2(split*.018,0.));
          gl_FragColor=vec4(cr.r,cg.g,cb.b,max(cg.a,max(cr.a,cb.a))*(1.-reveal*.12));}`;
      const vertex = compileShader(gl.VERTEX_SHADER, vertexSource);
      const fragment = compileShader(gl.FRAGMENT_SHADER, fragmentSource);
      if (!vertex || !fragment) return;
      nameProgram = gl.createProgram();
      gl.attachShader(nameProgram, vertex);
      gl.attachShader(nameProgram, fragment);
      gl.linkProgram(nameProgram);
      gl.deleteShader(vertex);
      gl.deleteShader(fragment);
      if (!gl.getProgramParameter(nameProgram, gl.LINK_STATUS)) return;
      gl.useProgram(nameProgram);
      nameBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, nameBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
      const position = gl.getAttribLocation(nameProgram, "p");
      gl.enableVertexAttribArray(position);
      gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
      nameTexture = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, nameTexture);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
      nameUniforms = {
        texture: gl.getUniformLocation(nameProgram, "textureMap"),
        time: gl.getUniformLocation(nameProgram, "time"),
        reveal: gl.getUniformLocation(nameProgram, "reveal"),
        velocity: gl.getUniformLocation(nameProgram, "velocity"),
        mouse: gl.getUniformLocation(nameProgram, "mouse"),
      };
      sizeName();
    };

    const drawName = (seconds) => {
      if (!gl || !nameProgram || !nameReady) return;
      const progress = Math.max(0, Math.min(1, (performance.now() - nameStart - 260) / 1600));
      const reveal = reduced ? 0 : Math.pow(1 - progress, 3);
      const rect = nameCanvas.getBoundingClientRect();
      const mouseX = Math.max(-0.5, Math.min(1.5, (pointer.x - rect.left) / Math.max(1, rect.width)));
      const mouseY = Math.max(-0.5, Math.min(1.5, 1 - (pointer.y - rect.top) / Math.max(1, rect.height)));
      gl.useProgram(nameProgram);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.bindTexture(gl.TEXTURE_2D, nameTexture);
      gl.uniform1i(nameUniforms.texture, 0);
      gl.uniform1f(nameUniforms.time, seconds);
      gl.uniform1f(nameUniforms.reveal, reveal);
      gl.uniform1f(nameUniforms.velocity, reduced ? 0 : velocity);
      gl.uniform2f(nameUniforms.mouse, mouseX, mouseY);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    };

    const updatePhone = (seconds) => {
      if (!drag.active && !reduced) {
        rotation.targetX = -16 + (pointer.x / window.innerWidth - 0.5) * 28;
        rotation.targetY = -6 - (pointer.y / window.innerHeight - 0.5) * 15;
      }
      rotation.x += (rotation.targetX - rotation.x) * (reduced ? 1 : 0.08);
      rotation.y += (rotation.targetY - rotation.y) * (reduced ? 1 : 0.08);
      const floating = reduced ? 0 : Math.sin(seconds * 0.7) * 5;
      phone.style.transform = `translateY(${floating}px) rotateX(${rotation.y}deg) rotateY(${rotation.x}deg)`;
      if (shadow) {
        const turn = Math.abs(rotation.x) / 44;
        shadow.style.transform = `translateX(-50%) scaleX(${1 - turn * 0.28})`;
        shadow.style.opacity = String(0.85 - turn * 0.35);
      }
    };

    const frame = (time) => {
      if (!running) return;
      velocity *= 0.93;
      drawBackground();
      drawName(time / 1000);
      updatePhone(time / 1000);
      raf = requestAnimationFrame(frame);
    };
    const onPointerMove = (event) => {
      velocity = Math.min(1, velocity + Math.hypot(event.clientX - pointer.x, event.clientY - pointer.y) * 0.012);
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      pointer.active = true;
      if (drag.active && !reduced) {
        rotation.targetX = Math.max(-44, Math.min(44, drag.baseX + (event.clientX - drag.startX) * 0.4));
        rotation.targetY = Math.max(-30, Math.min(26, drag.baseY - (event.clientY - drag.startY) * 0.4));
      }
    };
    const onPointerDown = (event) => {
      if (reduced) return;
      drag.active = true;
      drag.startX = event.clientX;
      drag.startY = event.clientY;
      drag.baseX = rotation.targetX;
      drag.baseY = rotation.targetY;
      stage.classList.add("is-dragging");
    };
    const onPointerUp = () => {
      drag.active = false;
      stage.classList.remove("is-dragging");
    };
    const onScroll = () => {
      if (reduced) return;
      const amount = Math.min(window.scrollY * 0.12, 90);
      content.style.transform = `translateY(${amount}px)`;
      content.style.opacity = String(Math.max(0, 1 - window.scrollY / (window.innerHeight * 0.95)));
    };
    const onResize = () => {
      sizeBackground();
      sizeName();
      if (reduced) {
        drawBackground();
        drawName(performance.now() / 1000);
        updatePhone(0);
      }
    };
    const onPaletteChange = () => {
      palette = getHeroPalette();
      if (gl) buildNameTexture();
      else drawNameFallback();
      if (reduced) drawName(performance.now() / 1000);
    };

    sizeBackground();
    initName();
    document.fonts?.ready.then(() => {
      if (!running) return;
      sizeName();
      if (reduced) drawName(performance.now() / 1000);
    });
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerup", onPointerUp);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    stage.addEventListener("pointerdown", onPointerDown);
    const rootObserver = new MutationObserver(onPaletteChange);
    const bodyObserver = new MutationObserver(onPaletteChange);
    rootObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["style"] });
    bodyObserver.observe(document.body, { attributes: true, attributeFilter: ["data-theme"] });

    if (reduced) {
      drawBackground();
      drawName(performance.now() / 1000);
      updatePhone(0);
    } else {
      raf = requestAnimationFrame(frame);
    }

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      rootObserver.disconnect();
      bodyObserver.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      stage.removeEventListener("pointerdown", onPointerDown);
      if (gl) {
        if (nameTexture) gl.deleteTexture(nameTexture);
        if (nameBuffer) gl.deleteBuffer(nameBuffer);
        if (nameProgram) gl.deleteProgram(nameProgram);
      }
    };
  }, [fullName]);

  return { rootRef, contentRef, bgRef, nameRef, nameWrapRef, stageRef, phoneRef, shadowRef };
}

function AuroraPhone({ stageRef, phoneRef, shadowRef, lang }) {
  const hint = lang === "en" ? "DRAG TO ROTATE" : "ARRASTE PARA GIRAR";
  return (
    <div className="hero-device-wrap">
      <div className="hero-device-stage" ref={stageRef} data-interactive aria-label={hint}>
        <div className="hero-phone-shadow" ref={shadowRef} />
        <div className="hero-phone" ref={phoneRef} aria-hidden="true">
          <div className="hero-phone-back">
            <span className="hero-phone-camera camera-one" />
            <span className="hero-phone-camera camera-two" />
            <span className="hero-phone-camera camera-three" />
            <span className="hero-phone-monogram">D</span>
          </div>
          <div className="hero-phone-rail rail-left"><i /><i /></div>
          <div className="hero-phone-rail rail-right"><i /></div>
          <div className="hero-phone-rail rail-top" />
          <div className="hero-phone-rail rail-bottom" />
          <div className="hero-phone-front">
            <div className="aurora-screen">
              <span className="aurora-glare" />
              <span className="aurora-camera" />
              <div className="aurora-status">
                <span>09:41</span><span className="aurora-signal">|||</span>
                <span className="aurora-battery"><i /></span>
              </div>
              <div className="aurora-head">
                <span className="aurora-brand"><i>a</i>Aurora</span><span className="aurora-bell">◌</span>
              </div>
              <div className="aurora-balance">
                <span className="aurora-kicker">SALDO DISPONIVEL</span>
                <div><strong>R$ 12.480<small>,00</small></strong><em>+2,4%</em></div>
                <svg viewBox="0 0 220 40" preserveAspectRatio="none">
                  <path className="aurora-chart-fill" d="M0 30 L26 26 L52 30 L78 18 L104 23 L130 12 L156 17 L182 7 L220 11 L220 40 L0 40 Z" />
                  <path className="aurora-chart-line" d="M0 30 L26 26 L52 30 L78 18 L104 23 L130 12 L156 17 L182 7 L220 11" />
                </svg>
              </div>
              <div className="aurora-actions">
                <span><i>↑</i>Enviar</span><span><i>↓</i>Receber</span>
                <span><i>≡</i>Pagar</span><span><i>···</i>Mais</span>
              </div>
              <div className="aurora-activity-head"><strong>Atividade</strong><span>ver tudo</span></div>
              <div className="aurora-activity">
                <div><i>⌂</i><span>Aluguel<small>Hoje · 08:12</small></span><b>-R$ 1.850</b></div>
                <div className="is-income"><i>↓</i><span>Salario<small>Ontem · 18:30</small></span><b>+R$ 6.200</b></div>
                <div><i>□</i><span>Mercado<small>Seg · 14:05</small></span><b>-R$ 312</b></div>
              </div>
              <div className="aurora-tabs"><span>⌂</span><span>⌑</span><span>▣</span><span>○</span></div>
            </div>
          </div>
        </div>
      </div>
      <div className="hero-device-hint"><span>↔</span>{hint}</div>
    </div>
  );
}

function Hero({ lang = "pt" }) {
  const data = getData(lang);
  const copy = getCopy(lang);
  const refs = useHeroExperience(data.identity.name);
  const [firstName = "", ...restNameParts] = data.identity.name.split(" ");
  const lastName = restNameParts.join(" ");

  return (
    <section id="hero" className="hero" data-screen-label="01 Hero" ref={refs.rootRef}>
      <canvas className="hero-particles" ref={refs.bgRef} aria-hidden="true" />
      <div className="hero-vignette" aria-hidden="true" />
      <div className="hero-content" ref={refs.contentRef}>
        <div className="hero-left">
          <div className="hero-eyebrow">
            <span className="hero-eyebrow-line" />
            {copy.heroEyebrow}
          </div>

          <div className="hero-name" ref={refs.nameWrapRef}>
            <h1 className="hero-name-fallback">
              <span>{firstName}</span>
              <span><em>{lastName.charAt(0)}</em>{lastName.slice(1)}</span>
            </h1>
            <canvas className="hero-name-canvas" ref={refs.nameRef} aria-hidden="true" />
          </div>

          <div className="hero-role">
            <span className="hero-role-pulse" />
            {copy.heroRole}
          </div>

          <div className="hero-cta-row">
            <a href="#projects" className="btn">
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
          <AuroraPhone
            lang={lang}
            stageRef={refs.stageRef}
            phoneRef={refs.phoneRef}
            shadowRef={refs.shadowRef}
          />
          <div className="hero-stats">
            <div className="hero-stat">
              <span className="hero-stat-num">{data.summary.totalCerts}<em>+</em></span>
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
  const sectionNumber = getSectionNumber(copy, "manifesto");
  return (
    <section id="manifesto" className="section" data-screen-label={`${sectionNumber} Manifesto`}>
      <div className="section-head">
        <div>
          <div className="section-label"><span className="accent">▸</span>{"  "}{sectionNumber} / {getSectionName(copy, "manifesto", "MANIFESTO")}</div>
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

function CertificateModal({ certificate, copy, onClose }) {
  const closeRef = useRef(null);
  const [downloading, setDownloading] = useState(false);
  const href = getCertificateAccessHref(certificate);
  const mediaType = getCertificateMediaType(certificate);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    const previousFocus = document.activeElement;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
      previousFocus?.focus?.();
    };
  }, [onClose]);

  const download = async () => {
    if (!href || downloading) return;
    setDownloading(true);
    try {
      const response = await fetch(href);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const blobUrl = URL.createObjectURL(await response.blob());
      const anchor = document.createElement("a");
      anchor.href = blobUrl;
      anchor.download = getCertificateFileName(certificate);
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      window.setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
    } catch (error) {
      console.warn("Download direto indisponivel; abrindo arquivo.", error);
      window.open(href, "_blank", "noopener,noreferrer");
    } finally {
      setDownloading(false);
    }
  };

  return ReactDOM.createPortal(
    <div className="certificate-modal" role="dialog" aria-modal="true" aria-labelledby="certificate-modal-title" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <div className="certificate-modal-card">
        <header className="certificate-modal-head">
          <div>
            <span>{certificate.org}</span>
            <h3 id="certificate-modal-title">{certificate.title}</h3>
          </div>
          <button ref={closeRef} type="button" onClick={onClose} aria-label={copy.certificateClose}>×</button>
        </header>
        <div className="certificate-modal-preview">
          {mediaType === "image" && <img src={href} alt={certificate.title} />}
          {mediaType === "pdf" && <iframe src={href} title={certificate.title} />}
          {mediaType === "file" && <p>{copy.certificateNoPreview}</p>}
        </div>
        {certificate.description && <p className="certificate-modal-description">{certificate.description}</p>}
        <footer className="certificate-modal-actions">
          <a className="btn btn--ghost" href={href} target="_blank" rel="noopener">{copy.certificatePreview}</a>
          <button className="btn" type="button" onClick={download} disabled={downloading}>
            {downloading ? "..." : copy.certificateDownload}
          </button>
        </footer>
      </div>
    </div>,
    document.body,
  );
}

function CertificateCard({ certificate, copy, onOpen }) {
  const href = getCertificateAccessHref(certificate);
  const mediaType = getCertificateMediaType(certificate);
  const content = (
    <>
      <div className={`skill-certificate-preview is-${mediaType}`}>
        {mediaType === "image" && href ? <img src={href} alt="" loading="lazy" /> : <span>{mediaType === "pdf" ? "PDF" : "FILE"}</span>}
      </div>
      <div className="skill-certificate-copy">
        <strong>{certificate.title}</strong>
        <span>{[certificate.org, certificate.year].filter(Boolean).join(" · ")}</span>
        {certificate.description && <p>{certificate.description}</p>}
      </div>
      {href && <span className="skill-certificate-action">{copy.certificatePreview} ↗</span>}
    </>
  );

  return href ? (
    <button className="skill-certificate-card" type="button" onClick={() => onOpen(certificate)}>{content}</button>
  ) : (
    <article className="skill-certificate-card is-disabled">{content}</article>
  );
}

function Skills({ lang = "pt" }) {
  const data = getData(lang);
  const copy = getCopy(lang);
  const skills = data.skills || [];
  const certificates = useMemo(() => orderCertificates(data.certificates || []), [data.certificates]);
  const groups = useMemo(() => {
    const knownIds = new Set(skills.map((skill) => skill.id));
    const result = skills.map((skill) => ({
      ...skill,
      certificates: certificates.filter((certificate) => certificate.skillId === skill.id),
    }));
    const unassigned = certificates.filter((certificate) => !certificate.skillId || !knownIds.has(certificate.skillId));
    if (unassigned.length) {
      result.push({
        id: "other-certificates",
        name: copy.skillsOtherName,
        description: copy.skillsOtherDescription,
        certificates: unassigned,
        isOther: true,
      });
    }
    return result;
  }, [skills, certificates, copy.skillsOtherName, copy.skillsOtherDescription]);
  const firstOpenId = groups.find((group) => group.certificates.length)?.id || groups[0]?.id || null;
  const [openId, setOpenId] = useState(firstOpenId);
  const [selectedCertificate, setSelectedCertificate] = useState(null);
  const sectionNumber = getSectionNumber(copy, "skills");

  useEffect(() => {
    if (!groups.some((group) => group.id === openId)) setOpenId(firstOpenId);
  }, [groups, openId, firstOpenId]);

  return (
    <section id="skills" className="skills-section section--full" data-screen-label={`${sectionNumber} Skills`}>
      <div className="skills-head">
        <div className="section-head">
          <div>
            <div className="section-label"><span className="accent">▸</span>{"  "}{sectionNumber} / {getSectionName(copy, "skills", "SKILLS")}</div>
          </div>
          <h2 className="section-title">{copy.skillsTitle[0]}<em>{copy.skillsTitle[1]}</em>{copy.skillsTitle[2]}</h2>
          <div className="section-meta">{copy.stackMeta}</div>
        </div>
      </div>

      <MarqueeRow items={copy.stackRows[0]} dur={48} />
      <MarqueeRow items={copy.stackRows[1]} outline dur={62} />

      <div className="skills-accordion">
        {groups.map((group, index) => {
          const isOpen = openId === group.id;
          const countLabel = group.certificates.length === 1 ? copy.skillsCertificateSingular : copy.skillsCertificatePlural;
          return (
            <article key={group.id} className={`skill-group ${isOpen ? "is-open" : ""}`}>
              <button
                type="button"
                className="skill-group-trigger"
                onClick={() => setOpenId(isOpen ? null : group.id)}
                aria-expanded={isOpen}
                aria-controls={`skill-panel-${index}`}
              >
                <span className="skill-group-index">{String(index + 1).padStart(2, "0")}</span>
                <span className="skill-group-main">
                  <strong>{group.name}</strong>
                  {group.description && <span>{group.description}</span>}
                </span>
                <span className="skill-group-count">{group.certificates.length} {countLabel}</span>
                <span className="skill-group-icon" aria-hidden="true">+</span>
              </button>
              {isOpen && (
                <div id={`skill-panel-${index}`} className="skill-group-panel">
                  {group.certificates.length ? (
                    <div className="skill-certificates-grid">
                      {group.certificates.map((certificate) => (
                        <CertificateCard key={certificate.id || certificate.title} certificate={certificate} copy={copy} onOpen={setSelectedCertificate} />
                      ))}
                    </div>
                  ) : (
                    <p className="skill-group-empty">0 {copy.skillsCertificatePlural}</p>
                  )}
                </div>
              )}
            </article>
          );
        })}
      </div>

      {selectedCertificate && <CertificateModal certificate={selectedCertificate} copy={copy} onClose={() => setSelectedCertificate(null)} />}
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
  const sectionNumber = getSectionNumber(copy, "projects");

  return (
    <section id="projects" className="section" data-screen-label={`${sectionNumber} Projects`}>
      <div className="section-head">
        <div>
          <div className="section-label"><span className="accent">▸</span>{"  "}{sectionNumber} / {getSectionName(copy, "projects", "PROJECTS")}</div>
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
  const sectionNumber = getSectionNumber(copy, "youtube");

  return (
    <section id="youtube" className="section youtube-section" data-screen-label={`${sectionNumber} YouTube`}>
      <div className="section-head">
        <div>
          <div className="section-label"><span className="accent">{"\u25b8"}</span>{"  "}{sectionNumber} / {getSectionName(copy, "youtube", "YOUTUBE")}</div>
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
  const sectionNumber = getSectionNumber(copy, "experience");

  return (
    <section id="experience" className="section" data-screen-label={`${sectionNumber} Experience`}>
      <div className="section-head">
        <div>
          <div className="section-label"><span className="accent">▸</span>{"  "}{sectionNumber} / {getSectionName(copy, "experience", "EXP")}</div>
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

// ─── Education ──────────────────────────────────────────────

function Education({ lang = "pt" }) {
  const data = getData(lang);
  const copy = getCopy(lang);
  const sectionNumber = getSectionNumber(copy, "education");

  return (
    <section id="education" className="section" data-screen-label={`${sectionNumber} Education`}>
      <div className="section-head">
        <div>
          <div className="section-label"><span className="accent">▸</span>{"  "}{sectionNumber} / {copy.educationLabel}</div>
        </div>
        <h2 className="section-title">{copy.educationTitle[0]}<em>{copy.educationTitle[1]}</em>{copy.educationTitle[2]}</h2>
        <div className="section-meta">{data.education.length}{copy.educationMetaSuffix}</div>
      </div>

      <div className="education education-grid">
        {data.education.map((education, index) => {
          const href = getCertificateAccessHref(education);
          return (
            <article key={education.id || index} className={`edu-card ${education.current ? "is-current" : ""}`}>
              <div className="edu-kind">
                {education.kind === "graduation" ? copy.graduation : copy.technical}
                {education.current ? ` · ${copy.inProgress}` : ""}
              </div>
              <h3 className="edu-title">{education.title}</h3>
              <div className="edu-org">{education.org}</div>
              <div className="edu-period">{education.period}</div>
              {href && (
                <a className="cert-link edu-link" href={href} target="_blank" rel="noopener">
                  {copy.certificateLink || "OPEN"}
                </a>
              )}
            </article>
          );
        })}
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
  const sectionNumber = getSectionNumber(copy, "contact");

  const copyToClipboard = (val, label) => {
    navigator.clipboard?.writeText(val).then(() => {
      setCopied(label);
      setTimeout(() => setCopied(null), 1400);
    });
  };

  return (
    <section id="contact" className="contact-section" data-screen-label={`${sectionNumber} Contact`}>
      <div className="section-head">
        <div>
          <div className="section-label"><span className="accent">▸</span>{"  "}{sectionNumber} / {getSectionName(copy, "contact", "CONTACT")}</div>
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
  Skills,
  Projects,
  YouTubeSection,
  Experience,
  Education,
  Contact,
  Footer,
  ScrollProgress,
  SectionRail,
  useReveal,
  useClock,
});
