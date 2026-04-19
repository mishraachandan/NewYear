/**
 * BlackHole.js - Cinematic Interstellar-inspired animated background
 *
 * Renders a live WebGL black hole scene:
 *   - Deep navy / violet cosmic nebula
 *   - Sharp, twinkling starfield
 *   - Central event horizon (pure black disk)
 *   - Photon ring (thin bright halo)
 *   - Swirling accretion disk in gold / amber / burnt orange
 *   - Top "lensed arc" from the back of the disk bent over the black hole
 *   - Gentle Doppler brightening and subtle camera breathing
 *
 * The shader is rendered into a full-hero <canvas> and animates via
 * requestAnimationFrame. It automatically falls back to a static styled
 * gradient if WebGL is unavailable.
 */

window.BlackHole = function BlackHole(options) {
    const opts = options || {};

    const canvas = document.createElement('canvas');
    canvas.className = 'blackhole-canvas';
    Object.assign(canvas.style, {
        position: 'absolute',
        inset: '0',
        width: '100%',
        height: '100%',
        display: 'block',
        zIndex: '0',
        pointerEvents: 'none'
    });

    const gl =
        canvas.getContext('webgl', { antialias: true, alpha: false, premultipliedAlpha: false }) ||
        canvas.getContext('experimental-webgl', { antialias: true, alpha: false });

    // Graceful fallback: if WebGL is unavailable, paint a rich CSS gradient.
    if (!gl) {
        Object.assign(canvas.style, {
            background:
                'radial-gradient(ellipse at center, #1a0f00 0%, #0a0614 35%, #05030b 70%, #000 100%)'
        });
        return { element: canvas, destroy: function () {} };
    }

    const VERT_SRC = [
        'attribute vec2 aPos;',
        'void main() {',
        '  gl_Position = vec4(aPos, 0.0, 1.0);',
        '}'
    ].join('\n');

    const FRAG_SRC = [
        'precision highp float;',
        '',
        'uniform vec2  uRes;',
        'uniform float uTime;',
        '',
        'float hash(vec2 p) {',
        '  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);',
        '}',
        '',
        'float vnoise(vec2 p) {',
        '  vec2 i = floor(p);',
        '  vec2 f = fract(p);',
        '  f = f * f * (3.0 - 2.0 * f);',
        '  float a = hash(i);',
        '  float b = hash(i + vec2(1.0, 0.0));',
        '  float c = hash(i + vec2(0.0, 1.0));',
        '  float d = hash(i + vec2(1.0, 1.0));',
        '  return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);',
        '}',
        '',
        'float fbm(vec2 p) {',
        '  float v = 0.0;',
        '  float a = 0.5;',
        '  for (int i = 0; i < 5; i++) {',
        '    v += a * vnoise(p);',
        '    p *= 2.02;',
        '    a *= 0.5;',
        '  }',
        '  return v;',
        '}',
        '',
        // Three-layer starfield with twinkle and warm/cool hues
        'vec3 starField(vec2 uv) {',
        '  vec3 col = vec3(0.0);',
        '  for (int i = 0; i < 3; i++) {',
        '    float s = float(i + 1);',
        '    vec2 p  = uv * (70.0 * s);',
        '    vec2 ip = floor(p);',
        '    vec2 fp = fract(p) - 0.5;',
        '    float h = hash(ip + float(i) * 17.3);',
        '    float threshold = 0.996 - 0.0025 * s;',
        '    if (h > threshold) {',
        '      float tw = 0.55 + 0.45 * sin(uTime * (0.8 + hash(ip + 7.0) * 2.5) + h * 12.0);',
        '      float m  = exp(-dot(fp, fp) * 75.0) * tw;',
        '      float hue = hash(ip + 53.0);',
        '      vec3 warm = vec3(1.0, 0.92, 0.72);',
        '      vec3 cool = vec3(0.72, 0.82, 1.0);',
        '      vec3 sc = mix(warm, cool, hue);',
        '      col += sc * m * 1.1;',
        '    }',
        '  }',
        '  return col;',
        '}',
        '',
        // Deep nebula: navy base with wispy violet / amber highlights
        'vec3 nebula(vec2 uv) {',
        '  float t  = uTime * 0.008;',
        '  float n1 = fbm(uv * 1.4 + vec2(t,  t * 0.7));',
        '  float n2 = fbm(uv * 3.1 + vec2(-t * 0.8, t * 0.4));',
        '  vec3 navy   = vec3(0.008, 0.012, 0.035);',
        '  vec3 violet = vec3(0.065, 0.028, 0.13);',
        '  vec3 ember  = vec3(0.14,  0.06,  0.04);',
        '  vec3 col = mix(navy, violet, smoothstep(0.28, 0.78, n1));',
        '  col = mix(col, ember, smoothstep(0.55, 0.95, n2) * 0.35);',
        '  // Subtle far-field darkening toward corners',
        '  col *= 0.85 + 0.15 * (1.0 - smoothstep(0.0, 1.2, length(uv)));',
        '  return col;',
        '}',
        '',
        // Accretion disk sample in its own polar frame.
        'vec3 sampleDisk(float r, float theta, float rInner, float rOuter) {',
        '  if (r < rInner || r > rOuter) return vec3(0.0);',
        '  float norm = (r - rInner) / (rOuter - rInner);',
        '',
        '  // Temperature gradient: hot (white-amber) near ISCO, cooler amber outside',
        '  vec3 core = vec3(2.8, 2.1, 1.25);',
        '  vec3 mid  = vec3(2.2, 1.15, 0.35);',
        '  vec3 edge = vec3(1.1, 0.38, 0.06);',
        '  vec3 col  = mix(core, mid, smoothstep(0.0, 0.35, norm));',
        '  col = mix(col, edge, smoothstep(0.35, 1.0, norm));',
        '',
        '  // Differential rotation: inner rotates much faster (Keplerian-ish)',
        '  float t     = uTime * 0.28;',
        '  float spin  = 1.0 / (r * 2.2 + 0.12);',
        '  float ang   = theta + t * spin * 2.2;',
        '',
        '  // Turbulent filaments + banded streaks',
        '  float turb   = fbm(vec2(cos(ang) * r * 6.5, sin(ang) * r * 6.5) + t * 1.4);',
        '  float streak = 0.5 + 0.5 * sin(ang * 2.0 - (1.0 / max(r, 0.05)) * 2.7 + t * 1.1);',
        '  float intensity = mix(0.45, 1.25, turb) * mix(0.55, 1.05, streak);',
        '',
        '  // Relativistic Doppler boost: one side of disk brighter',
        '  float doppler = 1.0 + cos(theta) * 0.55;',
        '',
        '  // Soft edge fade so disk does not have hard rings',
        '  float edgeFade = smoothstep(rInner, rInner + 0.035, r) *',
        '                   smoothstep(rOuter, rOuter - 0.08, r);',
        '',
        '  return col * intensity * doppler * edgeFade;',
        '}',
        '',
        'void main() {',
        '  vec2 fragCoord = gl_FragCoord.xy;',
        '  vec2 res = uRes;',
        '  vec2 uv  = (fragCoord - 0.5 * res) / res.y;',
        '',
        '  // Very gentle camera drift so the scene feels alive',
        '  uv += vec2(sin(uTime * 0.05) * 0.004, cos(uTime * 0.04) * 0.003);',
        '',
        '  vec3 col = nebula(uv) + starField(uv);',
        '',
        '  float r   = length(uv);',
        '  float phi = atan(uv.y, uv.x);',
        '',
        '  // Black hole scales',
        '  float rHorizon = 0.085;',
        '  float rPhoton  = 0.115;',
        '',
        '  // Inside event horizon: pure darkness',
        '  if (r < rHorizon) {',
        '    gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);',
        '    return;',
        '  }',
        '',
        '  // Gravitational lensing: smear background samples radially outward',
        '  float lens  = rHorizon / r;',
        '  float bend  = lens * lens * 1.8;',
        '  vec2 bentUV = uv * (1.0 + bend * 1.6);',
        '  vec3 bgBent = nebula(bentUV) + starField(bentUV) * max(0.0, 1.0 - lens * 1.8);',
        '  col = mix(col, bgBent, smoothstep(0.45, 0.0, r));',
        '',
        '  // Shadow: darken close to the horizon',
        '  float shadow = smoothstep(rHorizon * 2.4, rHorizon, r);',
        '  col *= mix(1.0, 0.0, shadow);',
        '',
        '  // Photon ring: thin, very bright rim',
        '  float ring = exp(-pow((r - rPhoton) / 0.0055, 2.0));',
        '  col += vec3(1.65, 1.25, 0.75) * ring * 2.2;',
        '',
        '  // Disk geometry (edge-on with slight tilt)',
        '  float diskInner = 0.145;',
        '  float diskOuter = 0.56;',
        '  float tilt = 0.20;',
        '',
        '  // Front half of disk (passes in front of BH, below screen center line)',
        '  vec2  fuv = vec2(uv.x, uv.y / tilt);',
        '  float fr  = length(fuv);',
        '  float fa  = atan(fuv.y, fuv.x);',
        '  vec3  front = sampleDisk(fr, fa, diskInner, diskOuter);',
        '  float frontMask = smoothstep(-0.015, 0.02, -uv.y);',
        '  col += front * frontMask * 1.15;',
        '',
        '  // Back of disk, gravitationally lensed OVER the top of the BH',
        '  vec2  buv = vec2(uv.x, -uv.y / tilt);',
        '  float br  = length(buv);',
        '  float ba  = atan(buv.y, buv.x);',
        '  vec3  back = sampleDisk(br, ba, diskInner, diskOuter);',
        '  float backMask = smoothstep(-0.01, 0.02, uv.y) *',
        '                   smoothstep(rHorizon * 1.15, rHorizon * 1.55, r);',
        '  col += back * backMask * 1.55;',
        '',
        '  // Bottom-lensed arc (symmetric to the top arc; tames hard seam under BH)',
        '  vec2  b2uv = vec2(uv.x, uv.y / tilt);',
        '  float b2r  = length(b2uv);',
        '  float b2a  = atan(b2uv.y, b2uv.x);',
        '  vec3  back2 = sampleDisk(b2r, b2a, diskInner, diskOuter);',
        '  float back2Mask = smoothstep(-0.01, 0.02, -uv.y) *',
        '                    smoothstep(rHorizon * 1.4, rHorizon * 2.2, r) *',
        '                    0.35;',
        '  col += back2 * back2Mask;',
        '',
        '  // Warm outer glow around the horizon for depth',
        '  float glow = exp(-pow((r - rPhoton) / 0.09, 2.0)) * 0.32;',
        '  col += vec3(1.0, 0.55, 0.2) * glow;',
        '',
        '  // Vignette for cinematic feel',
        '  float vig = 1.0 - 0.35 * pow(length(uv), 2.0);',
        '  col *= vig;',
        '',
        '  // Filmic-ish tonemap + gamma',
        '  col = col / (1.0 + col);',
        '  col = pow(col, vec3(1.0 / 2.2));',
        '',
        '  gl_FragColor = vec4(col, 1.0);',
        '}'
    ].join('\n');

    function compile(type, src) {
        const sh = gl.createShader(type);
        gl.shaderSource(sh, src);
        gl.compileShader(sh);
        if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
            // eslint-disable-next-line no-console
            console.error('BlackHole shader compile error:', gl.getShaderInfoLog(sh));
            gl.deleteShader(sh);
            return null;
        }
        return sh;
    }

    const vs = compile(gl.VERTEX_SHADER, VERT_SRC);
    const fs = compile(gl.FRAGMENT_SHADER, FRAG_SRC);

    if (!vs || !fs) {
        Object.assign(canvas.style, {
            background:
                'radial-gradient(ellipse at center, #1a0f00 0%, #0a0614 35%, #05030b 70%, #000 100%)'
        });
        return { element: canvas, destroy: function () {} };
    }

    const program = gl.createProgram();
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        // eslint-disable-next-line no-console
        console.error('BlackHole program link error:', gl.getProgramInfoLog(program));
        Object.assign(canvas.style, {
            background:
                'radial-gradient(ellipse at center, #1a0f00 0%, #0a0614 35%, #05030b 70%, #000 100%)'
        });
        return { element: canvas, destroy: function () {} };
    }

    gl.useProgram(program);

    // Full-screen quad
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
        gl.STATIC_DRAW
    );
    const aPos = gl.getAttribLocation(program, 'aPos');
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const uRes  = gl.getUniformLocation(program, 'uRes');
    const uTime = gl.getUniformLocation(program, 'uTime');

    // Cap DPR so mobile GPUs don't melt — full pixel ratio looks great on desktop.
    function pixelRatio() {
        return Math.min(window.devicePixelRatio || 1, 2);
    }

    function resize() {
        const dpr = pixelRatio();
        const rect = canvas.getBoundingClientRect();
        const w = Math.max(1, Math.floor(rect.width  * dpr));
        const h = Math.max(1, Math.floor(rect.height * dpr));
        if (canvas.width !== w || canvas.height !== h) {
            canvas.width = w;
            canvas.height = h;
        }
        gl.viewport(0, 0, canvas.width, canvas.height);
    }

    let rafId = 0;
    let running = true;
    const start = performance.now();

    function frame() {
        if (!running) return;
        resize();
        const t = (performance.now() - start) * 0.001;
        gl.uniform2f(uRes, canvas.width, canvas.height);
        gl.uniform1f(uTime, t);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
        rafId = requestAnimationFrame(frame);
    }

    // Pause when tab is hidden to save battery
    function onVisibility() {
        if (document.hidden) {
            running = false;
            cancelAnimationFrame(rafId);
        } else if (!running) {
            running = true;
            rafId = requestAnimationFrame(frame);
        }
    }

    window.addEventListener('resize', resize);
    document.addEventListener('visibilitychange', onVisibility);

    // Kick off
    resize();
    rafId = requestAnimationFrame(frame);

    function destroy() {
        running = false;
        cancelAnimationFrame(rafId);
        window.removeEventListener('resize', resize);
        document.removeEventListener('visibilitychange', onVisibility);
        try {
            gl.deleteBuffer(buffer);
            gl.deleteProgram(program);
            gl.deleteShader(vs);
            gl.deleteShader(fs);
        } catch (e) {
            // ignore
        }
    }

    return { element: canvas, destroy: destroy };
};
