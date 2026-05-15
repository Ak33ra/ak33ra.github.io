/*
 * fluid-hero.js
 *
 * A misty/smoky mouse-following visual rendered as a single WebGL fragment shader.
 * Not a true Navier–Stokes solver — that lives elsewhere (see CLAUDE.md / hero principles).
 * Reads palette from CSS custom properties so it follows light/dark theme automatically.
 */

const VERTEX_SHADER = `
  attribute vec2 a_position;
  void main() {
    gl_Position = vec4(a_position, 0.0, 1.0);
  }
`;

const FRAGMENT_SHADER = `
  precision highp float;

  uniform float u_time;
  uniform vec2 u_mouse;        // normalized 0..1 in canvas coords (y up)
  uniform vec2 u_resolution;
  uniform vec3 u_color_bg;
  uniform vec3 u_color_accent;
  uniform vec3 u_color_fg;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }

  float value_noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash(i),                hash(i + vec2(1.0, 0.0)), u.x),
      mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
      u.y
    );
  }

  float fbm(vec2 p) {
    float v = 0.0;
    float amp = 0.5;
    for (int i = 0; i < 5; i++) {
      v += amp * value_noise(p);
      p *= 2.02;
      amp *= 0.5;
    }
    return v;
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    float aspect = u_resolution.x / u_resolution.y;
    vec2 uv_a = vec2(uv.x * aspect, uv.y);
    vec2 mouse_a = vec2(u_mouse.x * aspect, u_mouse.y);

    vec2 to_mouse = uv_a - mouse_a;
    float mouse_dist = length(to_mouse);
    float mouse_influence = exp(-mouse_dist * 1.8);

    // Domain-warp the noise field around the mouse and drift it with time.
    vec2 q = uv_a * 2.0;
    q += vec2(sin(u_time * 0.10), cos(u_time * 0.07)) * 0.4;
    q -= to_mouse * mouse_influence * 3.5;

    float n1 = fbm(q + u_time * 0.04);
    float n2 = fbm(q * 1.6 - u_time * 0.025);

    float smoke = pow(n1 * 0.7 + n2 * 0.3, 1.4);

    // Color blend: bg → accent for smoke. A wider, brighter halo gathers around the cursor.
    vec3 col = u_color_bg;
    col = mix(col, u_color_accent, smoke * 0.55);
    col = mix(col, u_color_accent, pow(mouse_influence, 0.7) * 0.45);

    // Soft vignette so the hero reads as an anchored block, not a full-bleed splash.
    float vignette = 1.0 - smoothstep(0.85, 1.5, length((uv - 0.5) * 2.0));
    col = mix(u_color_bg, col, vignette * 0.95 + 0.05);

    gl_FragColor = vec4(col, 1.0);
  }
`;

function parse_color(s) {
  s = (s || '').trim();
  if (!s) return [0, 0, 0];
  if (s.startsWith('#')) {
    let hex = s.slice(1);
    if (hex.length === 3) hex = hex.split('').map((c) => c + c).join('');
    return [
      parseInt(hex.substr(0, 2), 16) / 255,
      parseInt(hex.substr(2, 2), 16) / 255,
      parseInt(hex.substr(4, 2), 16) / 255,
    ];
  }
  const m = s.match(/[\d.]+/g);
  if (m && m.length >= 3) {
    return [parseFloat(m[0]) / 255, parseFloat(m[1]) / 255, parseFloat(m[2]) / 255];
  }
  return [0, 0, 0];
}

function read_palette() {
  const style = getComputedStyle(document.documentElement);
  return {
    bg: parse_color(style.getPropertyValue('--color-bg')),
    accent: parse_color(style.getPropertyValue('--color-accent')),
    fg: parse_color(style.getPropertyValue('--color-fg')),
  };
}

function compile_shader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error('shader compile error', gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

export function init_fluid_hero(canvas) {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
    canvas.style.display = 'none';
    return;
  }

  const gl = canvas.getContext('webgl', { antialias: false, premultipliedAlpha: false });
  if (!gl) {
    canvas.style.display = 'none';
    return;
  }

  const vs = compile_shader(gl, gl.VERTEX_SHADER, VERTEX_SHADER);
  const fs = compile_shader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
  if (!vs || !fs) {
    canvas.style.display = 'none';
    return;
  }

  const program = gl.createProgram();
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error('program link error', gl.getProgramInfoLog(program));
    canvas.style.display = 'none';
    return;
  }
  gl.useProgram(program);

  // Full-screen quad as two triangles.
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
    gl.STATIC_DRAW
  );
  const a_position = gl.getAttribLocation(program, 'a_position');
  gl.enableVertexAttribArray(a_position);
  gl.vertexAttribPointer(a_position, 2, gl.FLOAT, false, 0, 0);

  const u_time = gl.getUniformLocation(program, 'u_time');
  const u_mouse = gl.getUniformLocation(program, 'u_mouse');
  const u_resolution = gl.getUniformLocation(program, 'u_resolution');
  const u_color_bg = gl.getUniformLocation(program, 'u_color_bg');
  const u_color_accent = gl.getUniformLocation(program, 'u_color_accent');
  const u_color_fg = gl.getUniformLocation(program, 'u_color_fg');

  let palette = read_palette();
  let mouse = [0.5, 0.4];
  let target_mouse = [0.5, 0.4];
  let dpr = Math.min(window.devicePixelRatio || 1, 1.5); // cap DPR for perf

  function resize() {
    const rect = canvas.getBoundingClientRect();
    canvas.width = Math.max(1, Math.floor(rect.width * dpr));
    canvas.height = Math.max(1, Math.floor(rect.height * dpr));
    gl.viewport(0, 0, canvas.width, canvas.height);
  }
  resize();

  function on_pointer(e) {
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = 1.0 - (e.clientY - rect.top) / rect.height;
    target_mouse = [x, y];
  }

  function on_pointer_leave() {
    // Drift back toward center when the cursor leaves.
    target_mouse = [0.5, 0.4];
  }

  // Listen on the hero <section>, not the canvas: the text-overlay div sits on top of the canvas
  // and would otherwise intercept every pointer event before it reaches a canvas-bound listener.
  // Coordinates are still computed against the canvas's bounding rect (they coincide).
  const hero = canvas.closest('.fluid-hero') ?? canvas.parentElement;
  hero.addEventListener('pointermove', on_pointer);
  hero.addEventListener('pointerleave', on_pointer_leave);
  window.addEventListener('resize', resize);

  // Update palette when theme changes (explicit toggle or system preference).
  const theme_observer = new MutationObserver(() => { palette = read_palette(); });
  theme_observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme'],
  });
  const media = matchMedia('(prefers-color-scheme: dark)');
  media.addEventListener('change', () => { palette = read_palette(); });

  const start = performance.now();
  let raf_id = 0;
  let visible = true;

  // Pause the loop when the hero scrolls fully out of view.
  const io = new IntersectionObserver((entries) => {
    visible = entries[0].isIntersecting;
    if (visible && !raf_id) raf_id = requestAnimationFrame(frame);
  }, { threshold: 0 });
  io.observe(canvas);

  function frame(now) {
    raf_id = 0;
    if (!visible) return;

    // Smooth mouse follow.
    mouse[0] += (target_mouse[0] - mouse[0]) * 0.12;
    mouse[1] += (target_mouse[1] - mouse[1]) * 0.12;

    const t = (now - start) / 1000;
    gl.uniform1f(u_time, t);
    gl.uniform2f(u_mouse, mouse[0], mouse[1]);
    gl.uniform2f(u_resolution, canvas.width, canvas.height);
    gl.uniform3fv(u_color_bg, palette.bg);
    gl.uniform3fv(u_color_accent, palette.accent);
    gl.uniform3fv(u_color_fg, palette.fg);

    gl.drawArrays(gl.TRIANGLES, 0, 6);
    raf_id = requestAnimationFrame(frame);
  }
  raf_id = requestAnimationFrame(frame);
}
