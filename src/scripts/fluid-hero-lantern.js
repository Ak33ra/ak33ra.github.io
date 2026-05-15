/*
 * fluid-hero-lantern.js
 *
 * "Lantern in the mist" variant. A density field of mist exists everywhere but
 * is invisible by default; the wisp is a moving light source that locally
 * reveals the mist where it has been (or is being) stirred. Moving the wisp
 * parts the mist (radial push + drag along motion direction) and creates
 * swirls (combined with ambient curl-noise velocity).
 *
 * The wisp follows the cursor when it's over the hero, otherwise wanders via
 * two incommensurate sine waves per axis (smooth crossfade between modes).
 *
 * Mist visibility = density × proximity_to_wisp × wisp_speed. The wisp itself
 * always renders as a bright pulsing core regardless of motion.
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
  uniform vec2 u_wisp;
  uniform vec2 u_wisp_prev;
  uniform float u_time;
  uniform float u_dt;

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

    // Ambient swirly velocity field (background drift).
    vec2 vel = curl(uv * 2.5, u_time * 0.15) * 0.05;

    vec2 to_wisp = uv - u_wisp;
    float dist_sq = dot(to_wisp, to_wisp);
    float wisp_falloff = exp(-dist_sq * 60.0);
    vec2 wisp_vel = u_wisp - u_wisp_prev;

    // Drag: pull mist along the wisp's direction of motion → wakes and trails.
    vel += wisp_vel * wisp_falloff * 10.0;

    // Radial push: actively part the mist outward from the wisp.
    float push_strength = length(wisp_vel) * wisp_falloff * 8.0;
    vel += normalize(to_wisp + vec2(1e-5)) * push_strength * 0.04;

    // Advect previous density from upstream of the velocity field.
    vec2 prev_uv = uv - vel * u_dt * 60.0;
    float prev_density = texture2D(u_prev, prev_uv).r;

    // Equilibrium: a slowly-evolving noise pattern. Mist relaxes back toward this
    // after being disturbed — so wakes heal and the field stays full at rest.
    float target = 0.4 + 0.6 * vnoise(uv * 3.5 + u_time * 0.05);
    float density = mix(prev_density, target, 0.03);

    gl_FragColor = vec4(density, 0.0, 0.0, 1.0);
  }
`;

const DISPLAY_SHADER = `
  precision mediump float;

  varying vec2 v_uv;

  uniform sampler2D u_density;
  uniform vec3 u_color_bg;
  uniform vec3 u_color_accent;
  uniform vec3 u_color_fg;
  uniform vec2 u_wisp;
  uniform float u_wisp_speed;   // normalized-per-frame; scales mist reveal
  uniform float u_time;

  void main() {
    float density = texture2D(u_density, v_uv).r;

    vec2 to_wisp = v_uv - u_wisp;
    float dist_sq = dot(to_wisp, to_wisp);

    // Proximity falloff — illumination radius around the wisp (wider than before).
    float proximity = exp(-dist_sq * 8.0);

    // Mist visibility = always-on baseline (so wisp has a visible halo at rest) plus a
    // steeper speed-scaled term so even slow wandering motion meaningfully lifts mist
    // into view.
    float speed_factor = 0.8 + clamp(u_wisp_speed * 200.0, 0.0, 1.7);
    float mist_visible = density * proximity * speed_factor;

    // Wisp light core — always visible at the wisp position. Pulses gently.
    float pulse = 0.92 + 0.08 * sin(u_time * 0.9);
    float core = exp(-dist_sq * 700.0) * 0.85 * pulse;

    vec3 col = u_color_bg;
    col = mix(col, u_color_accent, mist_visible);

    // Core mixes toward fg (high-contrast in both themes) so the light source pops.
    vec3 core_color = mix(u_color_accent, u_color_fg, 0.8);
    col = mix(col, core_color, core);

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
const ACTIVE_LERP = 0.04;

// Wisp-speed envelope (display only): fast attack, brief hold at peak, slow decay.
// Smooths the mist halo's response so brief pauses between motions don't read as
// the light "blinking" on and off. The advection sim still uses raw wisp velocity
// — physics stays crisp; only perceived brightness is buffered.
const SPEED_HOLD_FRAMES = 12;
const SPEED_DECAY_RATE = 0.96;

export function init_fluid_hero_lantern(canvas) {
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

  // Advect-pass uniforms.
  const u_prev = gl.getUniformLocation(advect_program, 'u_prev');
  const u_advect_wisp = gl.getUniformLocation(advect_program, 'u_wisp');
  const u_advect_wisp_prev = gl.getUniformLocation(advect_program, 'u_wisp_prev');
  const u_advect_time = gl.getUniformLocation(advect_program, 'u_time');
  const u_advect_dt = gl.getUniformLocation(advect_program, 'u_dt');

  // Display-pass uniforms.
  const d_density = gl.getUniformLocation(display_program, 'u_density');
  const d_color_bg = gl.getUniformLocation(display_program, 'u_color_bg');
  const d_color_accent = gl.getUniformLocation(display_program, 'u_color_accent');
  const d_color_fg = gl.getUniformLocation(display_program, 'u_color_fg');
  const d_wisp = gl.getUniformLocation(display_program, 'u_wisp');
  const d_wisp_speed = gl.getUniformLocation(display_program, 'u_wisp_speed');
  const d_time = gl.getUniformLocation(display_program, 'u_time');

  let palette = read_palette();
  let target_cursor = [0.5, 0.4];
  let wisp = [0.5, 0.4];
  const wisp_prev = [0.5, 0.4];
  let lerp_factor = LERP_ACTIVE;
  let cursor_active_smooth = 0; // 0 = wisp wandering, 1 = wisp follows cursor
  let real_cursor_in_hero = false;
  let smoothed_speed = 0;
  let decay_frame_count = 0;

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

    // Smooth crossfade between wander mode and follow mode.
    const active_target = real_cursor_in_hero ? 1 : 0;
    cursor_active_smooth += (active_target - cursor_active_smooth) * ACTIVE_LERP;

    // Wandering sine path (always running; only visible when not following cursor).
    const sine_x = 0.5 + 0.30 * Math.sin(t * 0.18) + 0.06 * Math.cos(t * 0.45);
    const sine_y = 0.5 + 0.20 * Math.cos(t * 0.23) + 0.05 * Math.sin(t * 0.57);

    // Wisp target = blend between sine and cursor weighted by crossfade.
    const target_x = sine_x * (1 - cursor_active_smooth) + target_cursor[0] * cursor_active_smooth;
    const target_y = sine_y * (1 - cursor_active_smooth) + target_cursor[1] * cursor_active_smooth;

    // Snapshot previous wisp before smoothing — used for velocity in advect shader.
    wisp_prev[0] = wisp[0];
    wisp_prev[1] = wisp[1];
    wisp[0] += (target_x - wisp[0]) * lerp_factor;
    wisp[1] += (target_y - wisp[1]) * lerp_factor;

    const wisp_speed = Math.hypot(wisp[0] - wisp_prev[0], wisp[1] - wisp_prev[1]);

    // Envelope-follow the speed for display: peak rises instantly; once motion stops,
    // hold at the peak for SPEED_HOLD_FRAMES, then exponential decay toward raw speed.
    if (wisp_speed >= smoothed_speed) {
      smoothed_speed = wisp_speed;
      decay_frame_count = 0;
    } else {
      decay_frame_count++;
      if (decay_frame_count > SPEED_HOLD_FRAMES) {
        smoothed_speed = Math.max(wisp_speed, smoothed_speed * SPEED_DECAY_RATE);
      }
    }

    // --- Advection pass: sim_a → sim_b ---
    gl.useProgram(advect_program);
    bind_position(advect_program);

    gl.bindFramebuffer(gl.FRAMEBUFFER, sim_b.fbo);
    gl.viewport(0, 0, sim_b.width, sim_b.height);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, sim_a.tex);
    gl.uniform1i(u_prev, 0);

    gl.uniform2f(u_advect_wisp, wisp[0], wisp[1]);
    gl.uniform2f(u_advect_wisp_prev, wisp_prev[0], wisp_prev[1]);
    gl.uniform1f(u_advect_time, t);
    gl.uniform1f(u_advect_dt, dt);

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
    gl.uniform3fv(d_color_accent, palette.accent);
    gl.uniform3fv(d_color_fg, palette.fg);
    gl.uniform2f(d_wisp, wisp[0], wisp[1]);
    gl.uniform1f(d_wisp_speed, smoothed_speed);
    gl.uniform1f(d_time, t);

    gl.drawArrays(gl.TRIANGLES, 0, 6);

    raf_id = requestAnimationFrame(frame);
  }
  raf_id = requestAnimationFrame(frame);
}
