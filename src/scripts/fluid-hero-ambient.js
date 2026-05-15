/*
 * fluid-hero-ambient.js
 *
 * "Always-alive" variant of the liquid hero. A small wisp wanders the hero via
 * incommensurate sine waves and deposits a faint accent splash at its current
 * position regardless of cursor state, so the hero is never entirely blank.
 * When the real cursor enters, a smoothed crossfade dials the wisp's contribution
 * down and the cursor's velocity-driven painting up.
 *
 * Underlying sim is the same as fluid-hero-liquid.js (advection through curl-noise
 * velocity field via ping-pong framebuffers) — only the source terms differ.
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
  uniform vec2 u_cursor;
  uniform vec2 u_cursor_prev;
  uniform float u_cursor_active;   // smoothed 0..1; 1 when real cursor over hero
  uniform vec2 u_wisp;             // ambient source position (wanders)
  uniform float u_time;
  uniform float u_dt;
  uniform vec3 u_color_accent;
  uniform vec3 u_color_fg;

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

    // Cursor halo — gated by u_cursor_active so it fades in/out cleanly.
    vec2 to_cursor = uv - u_cursor;
    float cursor_falloff = exp(-dot(to_cursor, to_cursor) * 80.0);
    vec2 cursor_vel = u_cursor - u_cursor_prev;
    vel += cursor_vel * cursor_falloff * 8.0 * u_cursor_active;

    // Advect: sample previous frame from upstream of the velocity field.
    vec2 prev_uv = uv - vel * u_dt * 60.0;
    vec4 prev_color = texture2D(u_prev, prev_uv);

    // Slight fade so old trails decay.
    vec4 result = prev_color * 0.994;

    // Cursor splash — velocity-driven, only active when cursor is over hero.
    float cursor_splash = cursor_falloff * min(length(cursor_vel) * 25.0, 1.0) * u_cursor_active;
    result.rgb = mix(result.rgb, u_color_accent, cursor_splash);
    result.a = max(result.a, cursor_splash);

    // Wisp ambient source — will-o-wisp aesthetic: a tight bright core surrounded by
    // a softer accent-colored halo. The core mixes toward u_color_fg, which is the
    // high-contrast token in both themes (near-white in dark mode, near-black in light
    // mode), so it reads as glowing/saturated regardless of theme. Subtle pulse adds life.
    vec2 to_wisp = uv - u_wisp;
    float wisp_dist_sq = dot(to_wisp, to_wisp);
    float wisp_gate = 1.0 - u_cursor_active;
    float wisp_pulse = 0.92 + 0.08 * sin(u_time * 0.9);

    float wisp_halo = exp(-wisp_dist_sq * 50.0) * 0.10 * wisp_gate;
    result.rgb = mix(result.rgb, u_color_accent, wisp_halo);
    result.a = max(result.a, wisp_halo);

    float wisp_core = exp(-wisp_dist_sq * 600.0) * 0.55 * wisp_pulse * wisp_gate;
    vec3 wisp_core_color = mix(u_color_accent, u_color_fg, 0.75);
    result.rgb = mix(result.rgb, wisp_core_color, wisp_core);
    result.a = max(result.a, wisp_core);

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

const LERP_ACTIVE = 0.18;
const LERP_IDLE = 0.09;

// How quickly u_cursor_active lerps toward its target (1 if cursor in hero, 0 otherwise).
// Slower than the cursor-position lerp so the crossfade between wisp and cursor reads as a
// genuine fade rather than a flip.
const ACTIVE_LERP = 0.04;

export function init_fluid_hero_ambient(canvas) {
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

  const u_prev = gl.getUniformLocation(advect_program, 'u_prev');
  const u_cursor = gl.getUniformLocation(advect_program, 'u_cursor');
  const u_cursor_prev = gl.getUniformLocation(advect_program, 'u_cursor_prev');
  const u_cursor_active = gl.getUniformLocation(advect_program, 'u_cursor_active');
  const u_wisp = gl.getUniformLocation(advect_program, 'u_wisp');
  const u_time = gl.getUniformLocation(advect_program, 'u_time');
  const u_dt = gl.getUniformLocation(advect_program, 'u_dt');
  const u_color_accent = gl.getUniformLocation(advect_program, 'u_color_accent');
  const u_color_fg = gl.getUniformLocation(advect_program, 'u_color_fg');

  const d_density = gl.getUniformLocation(display_program, 'u_density');
  const d_color_bg = gl.getUniformLocation(display_program, 'u_color_bg');

  let palette = read_palette();
  let cursor = [0.5, 0.4];
  let target_cursor = [0.5, 0.4];
  const cursor_prev = [0.5, 0.4];
  let lerp_factor = LERP_ACTIVE;
  let cursor_active_smooth = 0; // 0 = wisp dominant, 1 = real cursor dominant
  let real_cursor_in_hero = false;

  const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
  const SIM_SCALE = 0.5;

  let sim_a = null;
  let sim_b = null;

  function resize() {
    const rect = canvas.getBoundingClientRect();
    canvas.width = Math.max(1, Math.floor(rect.width * dpr));
    canvas.height = Math.max(1, Math.floor(rect.height * dpr));
    const sim_w = Math.max(2, Math.floor(canvas.width * SIM_SCALE));
    const sim_h = Math.max(2, Math.floor(canvas.height * SIM_SCALE));
    if (sim_a) { gl.deleteFramebuffer(sim_a.fbo); gl.deleteTexture(sim_a.tex); }
    if (sim_b) { gl.deleteFramebuffer(sim_b.fbo); gl.deleteTexture(sim_b.tex); }
    sim_a = make_target(gl, sim_w, sim_h);
    sim_b = make_target(gl, sim_w, sim_h);
  }
  resize();

  const hero = canvas.closest('.fluid-hero') ?? canvas.parentElement;

  function on_pointer(e) {
    const rect = canvas.getBoundingClientRect();
    target_cursor = [
      (e.clientX - rect.left) / rect.width,
      1.0 - (e.clientY - rect.top) / rect.height,
    ];
    lerp_factor = LERP_ACTIVE;
    real_cursor_in_hero = true;
  }
  function on_pointer_leave() {
    target_cursor = [0.5, 0.4];
    lerp_factor = LERP_IDLE;
    real_cursor_in_hero = false;
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
    const t = (now - start) / 1000;

    // Smooth cursor follow.
    cursor_prev[0] = cursor[0];
    cursor_prev[1] = cursor[1];
    cursor[0] += (target_cursor[0] - cursor[0]) * lerp_factor;
    cursor[1] += (target_cursor[1] - cursor[1]) * lerp_factor;

    // Crossfade between wisp and cursor sources.
    const active_target = real_cursor_in_hero ? 1 : 0;
    cursor_active_smooth += (active_target - cursor_active_smooth) * ACTIVE_LERP;

    // Wisp position: two incommensurate sines per axis → non-repeating wander.
    // Stays in roughly the middle 2/3 of the hero so trails don't pile up at edges.
    const wisp_x = 0.5 + 0.30 * Math.sin(t * 0.18) + 0.06 * Math.cos(t * 0.45);
    const wisp_y = 0.5 + 0.20 * Math.cos(t * 0.23) + 0.05 * Math.sin(t * 0.57);

    // --- Advection pass: sim_a → sim_b ---
    gl.useProgram(advect_program);
    bind_position(advect_program);

    gl.bindFramebuffer(gl.FRAMEBUFFER, sim_b.fbo);
    gl.viewport(0, 0, sim_b.width, sim_b.height);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, sim_a.tex);
    gl.uniform1i(u_prev, 0);

    gl.uniform2f(u_cursor, cursor[0], cursor[1]);
    gl.uniform2f(u_cursor_prev, cursor_prev[0], cursor_prev[1]);
    gl.uniform1f(u_cursor_active, cursor_active_smooth);
    gl.uniform2f(u_wisp, wisp_x, wisp_y);
    gl.uniform1f(u_time, t);
    gl.uniform1f(u_dt, dt);
    gl.uniform3fv(u_color_accent, palette.accent);
    gl.uniform3fv(u_color_fg, palette.fg);

    gl.drawArrays(gl.TRIANGLES, 0, 6);

    const tmp = sim_a; sim_a = sim_b; sim_b = tmp;

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
