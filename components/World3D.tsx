"use client";
import { useEffect, useRef } from "react";
import * as THREE from "three";

/* ────────────────────────────────────────────────────────────────
   ONE continuous procedural world, driven by scroll.
   Ocean → island rises from the sea → fly up & over mountains →
   pull back over the whole land. Stars + gold embers + drifting fog.
   Epic / historical mood. No asset files — pure GPU.
   ──────────────────────────────────────────────────────────────── */

const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const sstep = (e0: number, e1: number, x: number) => {
  const t = clamp((x - e0) / (e1 - e0), 0, 1);
  return t * t * (3 - 2 * t);
};

/* terrain noise */
function hash(x: number, y: number) { const n = Math.sin(x * 127.1 + y * 311.7) * 43758.5453; return n - Math.floor(n); }
function vnoise(x: number, y: number) {
  const xi = Math.floor(x), yi = Math.floor(y), xf = x - xi, yf = y - yi;
  const u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf);
  return lerp(lerp(hash(xi, yi), hash(xi + 1, yi), u), lerp(hash(xi, yi + 1), hash(xi + 1, yi + 1), u), v);
}
function ridged(x: number, y: number) {
  let amp = 0.5, f = 1, s = 0, n = 0;
  for (let i = 0; i < 5; i++) { const r = 1 - Math.abs(2 * vnoise(x * f, y * f) - 1); s += amp * r * r; n += amp; amp *= 0.5; f *= 2.05; }
  return s / n;
}

/* Camera keyframes across scroll progress 0..1 */
const KEYS = [
  { p: 0.00, pos: [0, 18, 940],   look: [0, 12, 440] },
  { p: 0.16, pos: [0, 36, 640],   look: [0, 34, 180] },
  { p: 0.38, pos: [10, 96, 340],  look: [0, 60, -120] },
  { p: 0.60, pos: [26, 158, 70],  look: [0, 96, -330] },
  { p: 0.82, pos: [-30, 244, -150], look: [0, 120, -520] },
  { p: 1.00, pos: [0, 500, -110], look: [0, 72, -320] },
];
function sample(p: number, key: "pos" | "look"): [number, number, number] {
  let a = KEYS[0], b = KEYS[KEYS.length - 1];
  for (let i = 0; i < KEYS.length - 1; i++) { if (p >= KEYS[i].p && p <= KEYS[i + 1].p) { a = KEYS[i]; b = KEYS[i + 1]; break; } }
  const t = sstep(a.p, b.p, p);
  const va = a[key], vb = b[key];
  return [lerp(va[0], vb[0], t), lerp(va[1], vb[1], t), lerp(va[2], vb[2], t)];
}

/* Mood colour journey (epic/historical): cold navy → steel → warm gold */
const NAVY = new THREE.Color("#05070f");
const STEEL = new THREE.Color("#0a1426");
const WARM = new THREE.Color("#241a10");
function fogColorAt(p: number, out: THREE.Color) {
  if (p < 0.5) out.copy(NAVY).lerp(STEEL, sstep(0.0, 0.5, p));
  else out.copy(STEEL).lerp(WARM, sstep(0.5, 1.0, p));
}

export default function World3D() {
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = wrapRef.current;
    if (!mount) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    } catch { return; }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.12;
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 6000);

    const fogCol = new THREE.Color();
    fogColorAt(0, fogCol);

    /* ── Ocean ─────────────────────────────────────────────────── */
    const oceanGeo = new THREE.PlaneGeometry(6000, 6000, 200, 200);
    oceanGeo.rotateX(-Math.PI / 2);
    const oceanMat = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uDeep: { value: new THREE.Color("#02060f") },
        uCrest: { value: new THREE.Color("#0c1d35") },
        uGlint: { value: new THREE.Color("#f6b93b") },
        uFog: { value: fogCol.clone() },
        uFogNear: { value: 300 },
        uFogFar: { value: 2600 },
      },
      vertexShader: /* glsl */`
        uniform float uTime;
        varying float vH; varying float vDepth;
        float wv(vec2 p){
          return sin(p.x*0.012+uTime*0.7)*2.2
               + sin(p.y*0.017+uTime*0.9)*2.6
               + sin((p.x+p.y)*0.0075+uTime*0.5)*3.4;
        }
        void main(){
          vec3 pos = position;
          float h = wv(position.xz);
          pos.y += h; vH = h;
          vec4 mv = modelViewMatrix * vec4(pos,1.0);
          vDepth = -mv.z;
          gl_Position = projectionMatrix * mv;
        }`,
      fragmentShader: /* glsl */`
        precision highp float;
        uniform vec3 uDeep,uCrest,uGlint,uFog; uniform float uFogNear,uFogFar;
        varying float vH; varying float vDepth;
        void main(){
          float t = clamp(vH*0.12+0.5,0.0,1.0);
          vec3 col = mix(uDeep,uCrest,t);
          col += uGlint * pow(t,3.0) * 0.12;
          float fog = smoothstep(uFogNear,uFogFar,vDepth);
          col = mix(col,uFog,fog);
          gl_FragColor = vec4(col,1.0);
        }`,
    });
    const ocean = new THREE.Mesh(oceanGeo, oceanMat);
    ocean.position.y = 0;
    scene.add(ocean);

    /* ── Island terrain (rises from the sea) ───────────────────── */
    const W = 1500, D = 1900, AMP = 270;
    const tGeo = new THREE.PlaneGeometry(W, D, 150, 200);
    tGeo.rotateX(-Math.PI / 2);
    const tp = tGeo.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < tp.count; i++) {
      const x = tp.getX(i), z = tp.getZ(i);
      const rn = Math.max(Math.abs(x) / (W / 2), Math.abs(z) / (D / 2));   // elliptical island
      const fall = sstep(1.0, 0.42, rn);                                    // 1 centre → 0 shore
      const n = ridged(x * 0.0045 + 40, z * 0.0045 + 40);
      tp.setY(i, n * AMP * fall);
    }
    tGeo.computeVertexNormals();
    const tMat = new THREE.ShaderMaterial({
      uniforms: {
        uLow: { value: new THREE.Color("#070d1c") },
        uHigh: { value: new THREE.Color("#5d6b86") },
        uGold: { value: new THREE.Color("#f6b93b") },
        uFog: { value: fogCol.clone() },
        uFogNear: { value: 220 },
        uFogFar: { value: 1700 },
        uMaxH: { value: AMP },
      },
      vertexShader: /* glsl */`
        varying float vH; varying float vDepth;
        void main(){
          vH = position.y;
          vec4 mv = modelViewMatrix * vec4(position,1.0);
          vDepth = -mv.z;
          gl_Position = projectionMatrix * mv;
        }`,
      fragmentShader: /* glsl */`
        precision highp float;
        uniform vec3 uLow,uHigh,uGold,uFog; uniform float uFogNear,uFogFar,uMaxH;
        varying float vH; varying float vDepth;
        void main(){
          float t = clamp(vH/uMaxH,0.0,1.0);
          vec3 col = mix(uLow,uHigh, smoothstep(0.10,0.92,t));
          col = mix(col,uGold, smoothstep(0.80,1.0,t)*0.28);
          float fog = smoothstep(uFogNear,uFogFar,vDepth);
          col = mix(col,uFog,fog);
          gl_FragColor = vec4(col,1.0);
        }`,
    });
    const terrain = new THREE.Mesh(tGeo, tMat);
    terrain.position.y = -AMP;            // start submerged
    scene.add(terrain);

    /* ── Stars ─────────────────────────────────────────────────── */
    const starN = 1400;
    const starPos = new Float32Array(starN * 3);
    for (let i = 0; i < starN; i++) {
      const r = 2600 + Math.random() * 800;
      const th = Math.random() * Math.PI * 2;
      const ph = Math.random() * Math.PI * 0.5;              // upper hemisphere
      starPos[i * 3] = Math.cos(th) * Math.sin(ph) * r;
      starPos[i * 3 + 1] = Math.cos(ph) * r * 0.8 + 200;
      starPos[i * 3 + 2] = Math.sin(th) * Math.sin(ph) * r - 400;
    }
    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute("position", new THREE.BufferAttribute(starPos, 3));
    const starMat = new THREE.PointsMaterial({ color: 0xffffff, size: 3, sizeAttenuation: false, transparent: true, opacity: 0.9, depthWrite: false });
    const stars = new THREE.Points(starGeo, starMat);
    scene.add(stars);

    /* ── Gold embers / dust ────────────────────────────────────── */
    const emN = 700;
    const emPos = new Float32Array(emN * 3);
    for (let i = 0; i < emN; i++) {
      emPos[i * 3] = (Math.random() - 0.5) * 1400;
      emPos[i * 3 + 1] = Math.random() * 360;
      emPos[i * 3 + 2] = (Math.random() - 0.5) * 1400 - 100;
    }
    const emGeo = new THREE.BufferGeometry();
    emGeo.setAttribute("position", new THREE.BufferAttribute(emPos, 3));
    const emMat = new THREE.PointsMaterial({ color: 0xf6b93b, size: 2.6, sizeAttenuation: true, transparent: true, opacity: 0.5, depthWrite: false, blending: THREE.AdditiveBlending });
    const embers = new THREE.Points(emGeo, emMat);
    scene.add(embers);

    /* ── Scroll → progress ─────────────────────────────────────── */
    const getP = () => {
      const el = document.getElementById("story3d");
      if (!el) return 0;
      const total = el.offsetHeight - window.innerHeight;
      return clamp(total > 0 ? (window.scrollY - el.offsetTop) / total : 0, 0, 1);
    };

    /* ── Loop ──────────────────────────────────────────────────── */
    const clock = new THREE.Clock();
    let raf = 0, cur = 0;
    const tmpFog = new THREE.Color();
    const loop = () => {
      raf = requestAnimationFrame(loop);
      const tgt = getP();
      cur += (tgt - cur) * 0.07;
      const p = cur;
      const time = clock.getElapsedTime();

      oceanMat.uniforms.uTime.value = time;

      // island rises from the sea
      terrain.position.y = lerp(-AMP, 0, sstep(0.08, 0.34, p));

      // camera flight
      const cp = sample(p, "pos"), cl = sample(p, "look");
      camera.position.set(cp[0] + Math.sin(time * 0.13) * 6, cp[1], cp[2]);
      camera.lookAt(cl[0] + Math.sin(time * 0.1) * 10, cl[1], cl[2]);

      // mood fog
      fogColorAt(p, tmpFog);
      (oceanMat.uniforms.uFog.value as THREE.Color).copy(tmpFog);
      (tMat.uniforms.uFog.value as THREE.Color).copy(tmpFog);

      // stars fade as we climb into day-ish altitude
      starMat.opacity = 0.9 * (1 - sstep(0.16, 0.4, p));

      // embers drift upward, wrap
      const ep = emGeo.attributes.position as THREE.BufferAttribute;
      for (let i = 0; i < emN; i++) {
        let y = ep.getY(i) + 0.18 + Math.sin(time + i) * 0.02;
        if (y > 380) y = 0;
        ep.setY(i, y);
      }
      ep.needsUpdate = true;
      embers.position.z = camera.position.z - 200;

      renderer.render(scene, camera);
    };
    loop();

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      oceanGeo.dispose(); oceanMat.dispose();
      tGeo.dispose(); tMat.dispose();
      starGeo.dispose(); starMat.dispose();
      emGeo.dispose(); emMat.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode) renderer.domElement.parentNode.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div
      ref={wrapRef}
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none"
      style={{
        zIndex: 0,
        background: "linear-gradient(to bottom, #05070f 0%, #070b18 45%, #0d1322 70%, #241a10 100%)",
      }}
    />
  );
}
