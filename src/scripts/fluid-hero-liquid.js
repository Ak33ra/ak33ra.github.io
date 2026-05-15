/*
 * fluid-hero-liquid.js
 *
 * Stateful advection-based "liquid" hero visual. Each frame samples the previous
 * frame's density at a position upstream in a curl-noise velocity field, fades
 * slightly, and deposits accent color where the cursor is moving — producing
 * liquid-feeling trails that flow, evolve, and decay.
 *
 * Not a full Navier–Stokes solver (no pressure projection / incompressibility
 * enforcement). For that, a separate variant would live in its own file.
 *
 * Reads palette from CSS custom properties so it follows light/dark theme automatically.
 */

const VERTEX_SHADER = `
  attribute vec2 a_position;
  varying vec2 v_uv;
  void main() {
    v_uv = a_position * 0.5 + 0.5;
    gl_Position = vec4(a_position, 0.0, 1.0);
  }
`;

const ADVECT_SHADER = `
  precision highp float;

  varying vec2 v_uv;

  uniform sampler2D u_prev;
  uniform vec2 u_mouse;
  uniform vec2 u_mouse_prev;
  uniform float u_time;
  uniform float u_dt;
  uniform vec3 u_color_accent;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }

  float vnoise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash(i),                  hash(i + vec2(1.0, 0.0)), u.x),
      mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
      u.y
    );
  }

  // Curl of a scalar noise field → divergence-free 2D velocity (no compression).
  vec2 curl(vec2 p, float t) {
    float eps = 0.05;
    vec2 dx = vec2(eps, 0.0);
    vec2 dy = vec2(0.0, eps);
    float n_xp = vnoise(p + dx + t);
    float n_xm = vnoise(p - dx + t);
    float n_yp = vnoise(p + dy + t);
    float n_ym = vnoise(p - dy + t);
    return vec2(n_yp - n_ym, -(n_xp - n_xm)) / (2.0 * eps);
  }

  void main() {
    vec2 uv = v_uv;

    // Ambient swirly velocity (always-on drift).
    vec2 vel = curl(uv * 2.5, u_time * 0.15) * 0.05;

    // Mouse-induced velocity: cursor velocity falls off radially.
    vec2 to_mouse = uv - u_mouse;
    float mouse_dist_sq = dot(to_mouse, to_mouse);
    float mouse_falloff = exp(-mouse_dist_sq * 80.0);
    vec2 mouse_vel = u_mouse - u_mouse_prev;
    vel += mouse_vel * mouse_falloff * 8.0;

    // Advect: sample previous frame from upstream of the velocity field.
    vec2 prev_uv = uv - vel * u_dt * 60.0;
    vec4 prev_color = texture2D(u_prev, prev_uv);

    // Slight fade so old trails decay.
    vec4 result = prev_color * 0.994;

    // Deposit color where the cursor is, proportional to cursor speed.
    // (No movement → no paint; the user "paints" by moving.)
    float splash = mouse_falloff * min(length(mouse_vel) * 25.0, 1.0);
    result.rgb = mix(result.rgb, u_color_accent, splash);
    result.a = max(result.a, splash);

    gl_FragColor = result;
  }
`;

const DISPLAY_SHADER = `
  precision mediump float;
  varying vec2 v_uv;
  uniform sampler2D u_density;
  uniform vec3 u_color_bg;

  void main() {
    vec4 d = texture2D(u_density, v_uv);
    gl_FragColor = vec4(mix(u_color_bg, d.rgb, d.a), 1.0);
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

function make_program(gl, vs_src, fs_src) {
  const vs = compile_shader(gl, gl.VERTEX_SHADER, vs_src);
  const fs = compile_shader(gl, gl.FRAGMENT_SHADER, fs_src);
  if (!vs || !fs) return null;
  const program = gl.createProgram();
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error('program link error', gl.getProgramInfoLog(program));
    return null;
  }
  return program;
}

function make_target(gl, width, height) {
  const tex = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

  const fbo = gl.createFramebuffer();
  gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);

  return { tex, fbo, width, height };
}

// Lerp rates for the smoothed cursor follow. Active = cursor inside the hero (snappy).
// Idle = cursor has left and target is the default center (drifts back at half speed).
const LERP_ACTIVE = 0.18;
const LERP_IDLE = 0.09;

export function init_fluid_hero_liquid(canvas) {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
    canvas.style.display = 'none';
    return;
  }

  const gl = canvas.getContext('webgl', { antialias: false, premultipliedAlpha: false });
  if (!gl) {
    canvas.style.display = 'none';
    return;
  }

  const advect_program = make_program(gl, VERTEX_SHADER, ADVECT_SHADER);
  const display_program = make_program(gl, VERTEX_SHADER, DISPLAY_SHADER);
  if (!advect_program || !display_program) {
    canvas.style.display = 'none';
    return;
  }

  // Shared full-screen quad.
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
    gl.STATIC_DRAW
  );

  function bind_position(program) {
    const a_position = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(a_position);
    gl.vertexAttribPointer(a_position, 2, gl.FLOAT, false, 0, 0);
  }

  // Advect-pass uniforms.
  const u_prev = gl.getUniformLocation(advect_program, 'u_prev');
  const u_mouse = gl.getUniformLocation(advect_program, 'u_mouse');
  const u_mouse_prev = gl.getUniformLocation(advect_program, 'u_mouse_prev');
  const u_time = gl.getUniformLocation(advect_program, 'u_time');
  const u_dt = gl.getUniformLocation(advect_program, 'u_dt');
  const u_color_accent = gl.getUniformLocation(advect_program, 'u_color_accent');

  // Display-pass uniforms.
  const d_density = gl.getUniformLocation(display_program, 'u_density');
  const d_color_bg = gl.getUniformLocation(display_program, 'u_color_bg');

  let palette = read_palette();
  let mouse = [0.5, 0.4];
  let target_mouse = [0.5, 0.4];
  const mouse_prev = [0.5, 0.4];
  let lerp_factor = LERP_ACTIVE;

  const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
  const SIM_SCALE = 0.5; // half-res simulation; GPU upscales on display

  let sim_a = null;
  let sim_b = null;

  function resize() {
    const rect = canvas.getBoundingClientRect();
    canvas.width = Math.max(1, Math.floor(rect.width * dpr));
    canvas.height = Math.max(1, Math.floor(rect.height * dpr));

    const sim_w = Math.max(2, Math.floor(canvas.width * SIM_SCALE));
    const sim_h = Math.max(2, Math.floor(canvas.height * SIM_SCALE));

    if (sim_a) {
      gl.deleteFramebuffer(sim_a.fbo);
      gl.deleteTexture(sim_a.tex);
    }
    if (sim_b) {
      gl.deleteFramebuffer(sim_b.fbo);
      gl.deleteTexture(sim_b.tex);
    }
    sim_a = make_target(gl, sim_w, sim_h);
    sim_b = make_target(gl, sim_w, sim_h);
  }
  resize();

  // Listen on the parent <section> — the text-overlay covers the canvas.
  const hero = canvas.closest('.fluid-hero') ?? canvas.parentElement;

  function on_pointer(e) {
    const rect = canvas.getBoundingClientRect();
    target_mouse = [
      (e.clientX - rect.left) / rect.width,
      1.0 - (e.clientY - rect.top) / rect.height,
    ];
    lerp_factor = LERP_ACTIVE;
  }
  function on_pointer_leave() {
    target_mouse = [0.5, 0.4];
    lerp_factor = LERP_IDLE;
  }
  hero.addEventListener('pointermove', on_pointer);
  hero.addEventListener('pointerleave', on_pointer_leave);
  window.addEventListener('resize', resize);

  const theme_observer = new MutationObserver(() => { palette = read_palette(); });
  theme_observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme'],
  });
  matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    palette = read_palette();
  });

  let visible = true;
  let raf_id = 0;
  const io = new IntersectionObserver((entries) => {
    visible = entries[0].isIntersecting;
    if (visible && !raf_id) raf_id = requestAnimationFrame(frame);
  }, { threshold: 0 });
  io.observe(canvas);

  const start = performance.now();
  let last_time = start;

  function frame(now) {
    raf_id = 0;
    if (!visible) return;

    const dt = Math.min((now - last_time) / 1000, 0.05);
    last_time = now;

    // Snapshot previous mouse before smoothing — needed for splash velocity.
    mouse_prev[0] = mouse[0];
    mouse_prev[1] = mouse[1];
    mouse[0] += (target_mouse[0] - mouse[0]) * lerp_factor;
    mouse[1] += (target_mouse[1] - mouse[1]) * lerp_factor;

    // --- Advection pass: sim_a → sim_b ---
    gl.useProgram(advect_program);
    bind_position(advect_program);

    gl.bindFramebuffer(gl.FRAMEBUFFER, sim_b.fbo);
    gl.viewport(0, 0, sim_b.width, sim_b.height);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, sim_a.tex);
    gl.uniform1i(u_prev, 0);

    gl.uniform2f(u_mouse, mouse[0], mouse[1]);
    gl.uniform2f(u_mouse_prev, mouse_prev[0], mouse_prev[1]);
    gl.uniform1f(u_time, (now - start) / 1000);
    gl.uniform1f(u_dt, dt);
    gl.uniform3fv(u_color_accent, palette.accent);

    gl.drawArrays(gl.TRIANGLES, 0, 6);

    // Swap so the just-written target becomes the "current" density.
    const tmp = sim_a;
    sim_a = sim_b;
    sim_b = tmp;

    // --- Display pass: sim_a → screen ---
    gl.useProgram(display_program);
    bind_position(display_program);

    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(0, 0, canvas.width, canvas.height);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, sim_a.tex);
    gl.uniform1i(d_density, 0);
    gl.uniform3fv(d_color_bg, palette.bg);

    gl.drawArrays(gl.TRIANGLES, 0, 6);

    raf_id = requestAnimationFrame(frame);
  }
  raf_id = requestAnimationFrame(frame);
}
