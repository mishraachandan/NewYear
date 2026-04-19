/**
 * BlackHole.js - Cinematic Interstellar-inspired animated background (v2)
 *
 * Renders a live WebGL black hole scene built to evoke the iconic shot:
 *   - Near-pure black void with faint deep-indigo haze and sparse sharp stars
 *   - A massive, luminous gold/amber accretion disk rotating around the
 *     event horizon with Keplerian differential rotation
 *   - Gravitationally lensed back-of-disk forming a dramatic arc over the
 *     top of the horizon, with a softer reflected arc underneath
 *   - Thin, very bright photon-ring rim and warm outer glow
 *   - Subtle relativistic Doppler brightening on the approaching side
 *   - Gentle camera breathing and nebula drift
 *
 * The shader runs on a full-screen quad via requestAnimationFrame. It pauses
 * when the tab is hidden, handles resize + DPR, and falls back to a styled
 * radial gradient if WebGL is unavailable.
 */

window.BlackHole = function BlackHole() {
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

    const FALLBACK_BG =
        'radial-gradient(ellipse at center, #261400 0%, #10070a 35%, #040208 75%, #000 100%)';

    if (!gl) {
        canvas.style.background = FALLBACK_BG;
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
        '    p *= 2.03;',
        '    a *= 0.5;',
        '  }',
        '  return v;',
        '}',
        '',
        // Sparse, sharp starfield with slow twinkle and a constant deep-space
        // drift so the hero never feels frozen.
        'vec3 starField(vec2 uv) {',
        '  vec3 col = vec3(0.0);',
        '  for (int i = 0; i < 4; i++) {',
        '    float s  = float(i + 1);',
        '    float depth = 0.45 + s * 0.22;',
        '    float driftT = uTime * (0.010 + s * 0.004);',
        '    float ang = driftT * (0.18 + s * 0.05);',
        '    mat2 rot = mat2(cos(ang), -sin(ang), sin(ang), cos(ang));',
        '    vec2 flow = vec2(-driftT * depth, driftT * 0.65 * depth);',
        '    vec2 warped = rot * (uv + flow);',
        '    vec2 p   = warped * (55.0 * s);',
        '    vec2 ip  = floor(p);',
        '    vec2 fp  = fract(p) - 0.5;',
        '    float h  = hash(ip + float(i) * 19.37);',
        '    float threshold = 0.9975 - 0.0018 * s;',
        '    if (h > threshold) {',
        '      float tw = 0.6 + 0.4 * sin(uTime * (0.7 + hash(ip + 3.0) * 2.2) + h * 9.0);',
        '      float m  = exp(-dot(fp, fp) * 110.0) * tw;',
        '      float hue = hash(ip + 41.0);',
        '      vec3 warm = vec3(1.0, 0.93, 0.78);',
        '      vec3 cool = vec3(0.78, 0.86, 1.0);',
        '      vec3 sc   = mix(warm, cool, hue);',
        '      col += sc * m * 1.25;',
        '    }',
        '  }',
        '  return col;',
        '}',
        '',
        // Near-pure black void with the faintest hint of deep indigo haze.
        'vec3 nebula(vec2 uv) {',
        '  float t  = uTime * 0.006;',
        '  float n1 = fbm(uv * 1.2 + vec2(t,  t * 0.6));',
        '  float n2 = fbm(uv * 2.7 + vec2(-t * 0.5, t * 0.3));',
        '  vec3 base   = vec3(0.003, 0.004, 0.010);',
        '  vec3 indigo = vec3(0.020, 0.010, 0.045);',
        '  vec3 ember  = vec3(0.050, 0.018, 0.010);',
        '  vec3 col = mix(base, indigo, smoothstep(0.35, 0.80, n1) * 0.55);',
        '  col = mix(col, ember, smoothstep(0.65, 0.95, n2) * 0.18);',
        '  return col;',
        '}',
        '',
        // Thick accretion disk sample in its own polar frame.
        'vec3 sampleDisk(float r, float theta, float rInner, float rOuter) {',
        '  if (r < rInner || r > rOuter) return vec3(0.0);',
        '  float norm = (r - rInner) / (rOuter - rInner);',
        '',
        '  // Temperature gradient: hot cream inner rim, molten gold mid, ember edge.',
        '  vec3 core  = vec3(2.75, 2.18, 1.34);',
        '  vec3 gold  = vec3(2.10, 1.22, 0.38);',
        '  vec3 amber = vec3(1.18, 0.42, 0.10);',
        '  vec3 edge  = vec3(0.42, 0.14, 0.03);',
        '  vec3 col   = mix(core, gold,  smoothstep(0.0,  0.30, norm));',
        '  col = mix(col, amber, smoothstep(0.30, 0.70, norm));',
        '  col = mix(col, edge,  smoothstep(0.70, 1.00, norm));',
        '',
        '  // Keplerian-ish differential rotation',
        '  float t    = uTime * 0.18;',
        '  float spin = 1.0 / (r * 1.9 + 0.10);',
        '  float ang  = theta + t * spin * 2.05;',
        '',
        '  // Turbulent filaments braided with spiral streaks and dusty lanes.',
        '  float turb   = fbm(vec2(cos(ang) * r * 7.0, sin(ang) * r * 7.0) + t * 1.3);',
        '  float streak = 0.5 + 0.5 * sin(ang * 3.2 - (1.0 / max(r, 0.05)) * 3.0 + t * 1.2);',
        '  float lane   = 0.82 + 0.18 * sin(ang * 10.0 + norm * 17.0 + turb * 2.4);',
        '  float intensity = mix(0.55, 1.45, turb) * mix(0.55, 1.10, streak);',
        '  intensity *= lane;',
        '',
        '  // Relativistic Doppler boost: approaching side brighter, but softer.',
        '  float doppler = 1.0 + cos(theta) * 0.52;',
        '',
        '  // Soft edge fade so disk does not have hard bands',
        '  float edgeFade = smoothstep(rInner, rInner + 0.028, r) *',
        '                   smoothstep(rOuter, rOuter - 0.10, r);',
        '',
        '  return col * intensity * doppler * edgeFade;',
        '}',
        '',
        'void main() {',
        '  vec2 fragCoord = gl_FragCoord.xy;',
        '  vec2 res = uRes;',
        '  vec2 uv  = (fragCoord - 0.5 * res) / res.y;',
        '',
        '  // Very gentle camera drift + slow breathing so the scene feels alive',
        '  uv += vec2(sin(uTime * 0.045) * 0.005, cos(uTime * 0.037) * 0.004);',
        '  float breathe = 1.0 + 0.015 * sin(uTime * 0.25);',
        '  uv *= breathe;',
        '',
        '  // Background (pure void + sparse stars)',
        '  vec3 col = nebula(uv) + starField(uv);',
        '',
        '  float r   = length(uv);',
        '  float phi = atan(uv.y, uv.x);',
        '',
        '  // Black hole scales',
        '  float rHorizon = 0.095;',
        '  float rPhoton  = 0.128;',
        '',
        '  // Inside event horizon: pure darkness',
        '  if (r < rHorizon) {',
        '    gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);',
        '    return;',
        '  }',
        '',
        '  // Gravitational lensing of the background: smear samples radially outward',
        '  float lens  = rHorizon / r;',
        '  float bend  = lens * lens * 2.1;',
        '  vec2 bentUV = uv * (1.0 + bend * 1.7);',
        '  vec3 bgBent = nebula(bentUV) + starField(bentUV) * max(0.0, 1.0 - lens * 2.0);',
        '  col = mix(col, bgBent, smoothstep(0.55, 0.0, r));',
        '',
        '  // Horizon shadow: keep the center black, but feather the outer edge',
        '  // so the silhouette feels more natural and less cut out.',
        '  float shadow = smoothstep(rHorizon * 2.05, rHorizon * 1.01, r);',
        '  col *= 1.0 - shadow * 0.94;',
        '',
        '  // Pseudo-3D horizon shell: a very subtle spherical shading pass',
        '  // that makes the center read as a rounded gravitational form.',
        '  float shellMask = 1.0 - smoothstep(rHorizon * 1.03, rHorizon * 1.82, r);',
        '  vec2 shellUv = uv / (rHorizon * 1.82);',
        '  float shellR = min(length(shellUv), 0.999);',
        '  float shellZ = sqrt(max(0.0, 1.0 - shellR * shellR));',
        '  vec3 shellN = normalize(vec3(shellUv.x * 0.92, shellUv.y * 1.08 - 0.08, shellZ));',
        '  vec3 keyDir  = normalize(vec3(-0.34, 0.30, 0.89));',
        '  vec3 fillDir = normalize(vec3(0.20, -0.82, 0.53));',
        '  float keyLight  = pow(max(dot(shellN, keyDir), 0.0), 3.2);',
        '  float fillLight = pow(max(dot(shellN, fillDir), 0.0), 2.2);',
        '  float contour   = pow(1.0 - max(shellN.z, 0.0), 2.7);',
        '  col += vec3(0.10, 0.07, 0.045) * keyLight * shellMask * 0.55;',
        '  col += vec3(0.025, 0.03, 0.045) * fillLight * shellMask * 0.16;',
        '  col += vec3(0.16, 0.12, 0.08) * contour * shellMask * 0.10;',
        '  col *= 1.0 - shellMask * (0.12 + 0.10 * smoothstep(-0.24, 0.18, uv.y));',
        '',
        '  // Photon ring: thinner and more photographic, with a softer halo.',
        '  float ring = exp(-pow((r - rPhoton) / 0.0075, 2.0));',
        '  float ringHalo = exp(-pow((r - (rPhoton + 0.018)) / 0.040, 2.0));',
        '  col += vec3(1.40, 1.16, 0.82) * ring * 1.45;',
        '  col += vec3(0.68, 0.42, 0.18) * ringHalo * 0.26;',
        '',
        '  // Disk geometry (edge-on with slight tilt)',
        '  float diskInner = 0.165;',
        '  float diskOuter = 0.64;',
        '  float tilt = 0.19;',
        '  float arcLift = 0.060 * exp(-pow(uv.x / 0.34, 2.0));',
        '  float arcSag  = 0.018 * exp(-pow(uv.x / 0.48, 2.0));',
        '  float horizonFeather = smoothstep(rHorizon * 1.01, rHorizon * 1.42, r);',
        '',
        '  // Front half of disk (passes in front of BH, below the horizon line)',
        '  vec2  fuv = vec2(uv.x, (uv.y + arcSag) / tilt);',
        '  float fr  = length(fuv);',
        '  float fa  = atan(fuv.y, fuv.x);',
        '  vec3  front = sampleDisk(fr, fa, diskInner, diskOuter);',
        '  float frontMask = smoothstep(-0.018, 0.020, -(uv.y + arcSag * 0.55));',
        '  frontMask *= horizonFeather;',
        '  col += front * frontMask * 1.08;',
        '',
        '  // Back of disk, gravitationally lensed OVER the top of the BH.',
        '  // This is the signature Interstellar arc — it must read strongly.',
        '  vec2  buv = vec2(uv.x, -(uv.y - arcLift) / tilt);',
        '  float br  = length(buv);',
        '  float ba  = atan(buv.y, buv.x);',
        '  vec3  back = sampleDisk(br, ba, diskInner, diskOuter);',
        '  float backMask = smoothstep(-0.015, 0.018, uv.y - arcLift * 0.58) *',
        '                   smoothstep(rHorizon * 0.98, rHorizon * 1.95, r);',
        '  backMask *= 0.65 + 0.35 * exp(-pow(uv.x / 0.30, 2.0));',
        '  col += back * backMask * 1.68;',
        '',
        '  // Secondary (lower-order) lensed arc under the BH — softer echo',
        '  vec2  b2uv = vec2(uv.x, (uv.y + arcLift * 0.38) / tilt);',
        '  float b2r  = length(b2uv);',
        '  float b2a  = atan(b2uv.y, b2uv.x);',
        '  vec3  back2 = sampleDisk(b2r, b2a, diskInner, diskOuter);',
        '  float back2Mask = smoothstep(-0.012, 0.020, -(uv.y + arcLift * 0.18)) *',
        '                    smoothstep(rHorizon * 1.35, rHorizon * 2.55, r) *',
        '                    0.24;',
        '  col += back2 * back2Mask;',
        '',
        '  // Warm outer glow around the horizon for depth + bloom feel',
        '  float glow = exp(-pow((r - rPhoton) / 0.13, 2.0)) * 0.28;',
        '  float innerRim = exp(-pow((r - rHorizon * 1.03) / 0.022, 2.0));',
        '  col += vec3(0.92, 0.54, 0.24) * glow;',
        '  col += vec3(0.09, 0.07, 0.05) * innerRim;',
        '',
        '  // Vignette for cinematic framing',
        '  float vig = 1.0 - 0.42 * pow(length(uv), 2.0);',
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
        canvas.style.background = FALLBACK_BG;
        return { element: canvas, destroy: function () {} };
    }

    const program = gl.createProgram();
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        // eslint-disable-next-line no-console
        console.error('BlackHole program link error:', gl.getProgramInfoLog(program));
        canvas.style.background = FALLBACK_BG;
        return { element: canvas, destroy: function () {} };
    }

    gl.useProgram(program);

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
