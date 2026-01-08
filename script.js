// SPLASH TIMELINE
const splashTimeline = anime.timeline({
  easing: 'easeInOutSine'
});

splashTimeline
  .add({
    targets: '.splash-content',
    opacity: [0, 1],
    duration: 1200
  })
  .add({
    targets: '.splash-line',
    height: '120px',
    duration: 1000
  })
  .add({
    targets: '.splash',
    opacity: [1, 0],
    delay: 200,
    duration: 1000,
    complete: () => {
      document.querySelector('.splash').style.display = 'none';
      document.querySelector('.app').classList.remove('hidden');
      startHomeAnimations();
      initMenuPanel();
    }
  });

// HOME ANIMATIONS
function startHomeAnimations() {
  anime({
    targets: '.vertical-line',
    height: '180px',
    duration: 2000,
    easing: 'easeInOutSine'
  });

  anime({
    targets: '.content',
    opacity: [0, 1],
    translateY: [20, 0],
    delay: 100,
    duration: 1800,
    easing: 'easeOutExpo'
  });

  anime({
    targets: '.nav, .footer',
    opacity: [0, 1],
    delay: 1200,
    duration: 1500,
    easing: 'linear'
  });
  initHeroDots();
}

function initHeroDots() {
  const canvas = document.querySelector('.hero-canvas');
  if (!canvas) return;

  const gl = canvas.getContext('webgl', { alpha: true, antialias: true });
  if (!gl) return;

  const vertexSource = `
    attribute vec2 a_pos;
    varying vec2 v_uv;
    void main() {
      v_uv = a_pos * 0.5 + 0.5;
      gl_Position = vec4(a_pos, 0.0, 1.0);
    }
  `;

  const fragmentSource = `
    precision mediump float;
    uniform vec2 u_res;
    uniform float u_time;
    varying vec2 v_uv;

    float hash(vec2 p) {
      return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
    }

    float noise(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      vec2 u = f * f * (3.0 - 2.0 * f);
      float a = hash(i);
      float b = hash(i + vec2(1.0, 0.0));
      float c = hash(i + vec2(0.0, 1.0));
      float d = hash(i + vec2(1.0, 1.0));
      return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
    }

    float dotField(vec2 p, float scale, float jitter, float softness) {
      vec2 gp = p * scale;
      vec2 id = floor(gp);
      vec2 f = fract(gp) - 0.5;
      vec2 j = vec2(hash(id + 1.3), hash(id + 2.1)) - 0.5;
      f -= j * jitter;
      float d = length(f);
      float r = 0.035 + 0.02 * hash(id + 4.7);
      return smoothstep(r, r - softness, d);
    }

    void main() {
      vec2 p = v_uv - 0.5;
      p.x *= u_res.x / u_res.y;

      vec2 flow = vec2(
        sin(p.y * 1.6 + u_time * 0.08),
        cos(p.x * 1.2 + u_time * 0.06)
      );
      p += 0.03 * flow;

      float d1 = dotField(p + u_time * 0.006, 22.0, 0.22, 0.03);
      float d2 = dotField(p * 1.1 - u_time * 0.005, 36.0, 0.18, 0.025);
      float d3 = dotField(p * 0.9 + u_time * 0.004, 16.0, 0.24, 0.035);

      float dots = clamp(d1 * 0.55 + d2 * 0.5 + d3 * 0.35, 0.0, 1.0);
      float fog = smoothstep(0.25, 1.0, noise(p * 2.6 + u_time * 0.03)) * 0.04;

      float alpha = clamp(dots * 0.45 + fog, 0.0, 0.5);
      vec3 color = vec3(1.0) * (0.55 + 0.25 * dots);

      gl_FragColor = vec4(color, alpha);
    }
  `;

  function compile(type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    return shader;
  }

  const vertex = compile(gl.VERTEX_SHADER, vertexSource);
  const fragment = compile(gl.FRAGMENT_SHADER, fragmentSource);
  const program = gl.createProgram();
  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);
  gl.linkProgram(program);

  const posLoc = gl.getAttribLocation(program, 'a_pos');
  const resLoc = gl.getUniformLocation(program, 'u_res');
  const timeLoc = gl.getUniformLocation(program, 'u_time');

  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
    -1, -1,
     1, -1,
    -1,  1,
     1,  1
  ]), gl.STATIC_DRAW);

  gl.clearColor(0, 0, 0, 0);
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

  function resize() {
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.max(1, Math.floor(rect.width * dpr));
    canvas.height = Math.max(1, Math.floor(rect.height * dpr));
    gl.viewport(0, 0, canvas.width, canvas.height);
  }

  resize();
  if (window.ResizeObserver) {
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
  } else {
    window.addEventListener('resize', resize);
  }

  const start = performance.now();
  function render() {
    const t = (performance.now() - start) / 1000;
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.useProgram(program);

    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    gl.uniform2f(resLoc, canvas.width, canvas.height);
    gl.uniform1f(timeLoc, t);

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    requestAnimationFrame(render);
  }

  render();
}
const translations = {
  pt: {
    splash: "PortfÃ³lio de<br><strong>Davi Manieri</strong>",
    name: "DAVI MANIERI",
    role: "ENGENHEIRO DE COMPUTAÃ‡ÃƒO",
    subtitle: "Interfaces silenciosas.<br>CÃ³digo com propÃ³sito.",
    enter: "Entrar",
    copyright: "Â© 2026",
    location: "Brasil"
  },
  en: {
    splash: "Portfolio of<br><strong>Davi Manieri</strong>",
    name: "DAVI MANIERI",
    role: "COMPUTER ENGINEER",
    subtitle: "Silent interfaces.<br>Purpose-driven code.",
    enter: "Enter",
    copyright: "Â© 2026",
    location: "Brazil"
  }
};

const switcher = document.getElementById("language-switcher");

switcher.addEventListener("change", (e) => {
  setLanguage(e.target.value);
});

function setLanguage(lang) {
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    el.innerHTML = translations[lang][key];
  });
}

function initMenuPanel() {
  const contentMap = {
    'Home': $homeText,
    'Fale comigo': $contact
  };
  const panel = document.querySelector('[data-panel]');
  const buttons = document.querySelectorAll('.menu-btn');
  if (!panel || buttons.length === 0) return;

  function setPanel(label) {
    panel.classList.add('is-animating');
    window.setTimeout(() => {
      panel.textContent = contentMap[label] || label;
      panel.classList.remove('is-animating');
    }, 180);
  }

  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      setPanel(btn.textContent.trim());
    });
  });
}