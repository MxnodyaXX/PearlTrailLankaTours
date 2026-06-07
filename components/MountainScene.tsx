"use client";
import { useEffect, useRef } from "react";
import * as THREE from "three";

/* ────────────────────────────────────────────────────────────────
   Real-time GPU mountain fly-through.
   - Procedural ridged terrain with a central valley corridor
   - Custom GLSL shader: height gradient (navy → light, gold peaks) + distance fog
   - Camera flies forward & rises ("valley → summit") driven by scroll
   - Only two brand hexes drive the palette: NAVY + GOLD
   Tunable constants live at the top.
   ──────────────────────────────────────────────────────────────── */

const NAVY = new THREE.Color("#020617");
const GOLD = new THREE.Color("#f6b93b");

/* Camera path (tweak to taste) */
const START_Z = 650, END_Z = -260;
const START_Y = 58,  END_Y = 150;
const FOG_NEAR_START = 130, FOG_NEAR_END = 300;
const FOG_FAR = 820;
const PEAK_AMP = 230;           // max mountain height
const FADE_START = 0.82, FADE_END = 1.0; // canvas fade as you leave the 3D zone

/* ── helpers ─────────────────────────────────────────────────── */
const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
const lerp  = (a: number, b: number, t: number) => a + (b - a) * t;
const smoothstep = (e0: number, e1: number, x: number) => {
  const t = clamp((x - e0) / (e1 - e0), 0, 1);
  return t * t * (3 - 2 * t);
};

/* Value-noise fbm for terrain displacement (CPU, baked once) */
function hash(x: number, y: number) {
  const n = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
  return n - Math.floor(n);
}
function vnoise(x: number, y: number) {
  const xi = Math.floor(x), yi = Math.floor(y);
  const xf = x - xi, yf = y - yi;
  const u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf);
  const a = hash(xi, yi),     b = hash(xi + 1, yi);
  const c = hash(xi, yi + 1), d = hash(xi + 1, yi + 1);
  return lerp(lerp(a, b, u), lerp(c, d, u), v);
}
function ridgedFbm(x: number, y: number) {
  let amp = 0.5, freq = 1, sum = 0, norm = 0;
  for (let i = 0; i < 5; i++) {
    const n = vnoise(x * freq, y * freq);
    const ridge = 1 - Math.abs(2 * n - 1);   // sharpen into ridges
    sum += amp * ridge * ridge;
    norm += amp;
    amp *= 0.5; freq *= 2.05;
  }
  return sum / norm;                          // 0..1
}

export default function MountainScene() {
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    /* Respect reduced-motion / no-WebGL → leave the CSS gradient fallback */
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    } catch {
      return; // WebGL unavailable → fallback gradient stays
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    wrap.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(62, window.innerWidth / window.innerHeight, 1, 4000);

    /* ── Terrain geometry ───────────────────────────────────── */
    const W = 760, D = 1700, SX = 170, SZ = 360;
    const geo = new THREE.PlaneGeometry(W, D, SX, SZ);
    geo.rotateX(-Math.PI / 2);
    const pos = geo.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i), z = pos.getZ(i);
      const n = ridgedFbm(x * 0.0042 + 50, z * 0.0042 + 50);
      // carve a low valley corridor down the middle, peaks on the flanks
      const lateral = Math.pow(Math.abs(x) / (W / 2), 1.15);
      const h = n * PEAK_AMP * (0.18 + 0.82 * lateral);
      pos.setY(i, h);
    }
    geo.computeVertexNormals();

    /* ── Custom shader: height gradient + GLSL fog ──────────── */
    const mat = new THREE.ShaderMaterial({
      uniforms: {
        uLow:     { value: NAVY.clone() },
        uHigh:    { value: new THREE.Color("#5b6b86") }, // navy mixed toward white (altitude haze)
        uGold:    { value: GOLD.clone() },
        uFog:     { value: NAVY.clone() },
        uFogNear: { value: FOG_NEAR_START },
        uFogFar:  { value: FOG_FAR },
        uMaxH:    { value: PEAK_AMP },
      },
      vertexShader: /* glsl */ `
        varying float vH;
        varying float vDepth;
        void main() {
          vH = position.y;
          vec4 mv = modelViewMatrix * vec4(position, 1.0);
          vDepth = -mv.z;
          gl_Position = projectionMatrix * mv;
        }
      `,
      fragmentShader: /* glsl */ `
        precision highp float;
        uniform vec3  uLow, uHigh, uGold, uFog;
        uniform float uFogNear, uFogFar, uMaxH;
        varying float vH;
        varying float vDepth;
        void main() {
          float t = clamp(vH / uMaxH, 0.0, 1.0);
          vec3 col = mix(uLow, uHigh, smoothstep(0.12, 0.92, t));
          // warm gold rim catching the highest ridges
          col = mix(col, uGold, smoothstep(0.80, 1.0, t) * 0.30);
          // atmospheric distance fog (the depth between peaks)
          float fog = smoothstep(uFogNear, uFogFar, vDepth);
          col = mix(col, uFog, fog);
          gl_FragColor = vec4(col, 1.0);
        }
      `,
    });

    const terrain = new THREE.Mesh(geo, mat);
    scene.add(terrain);

    /* ── Scroll → progress helpers ──────────────────────────── */
    const endEl = () => document.getElementById("webgl-end");
    const getProgress = () => {
      const end = endEl();
      const denom = end ? end.offsetTop : Math.max(1, document.body.scrollHeight - window.innerHeight);
      return clamp(window.scrollY / denom, 0, 1);
    };

    /* ── Render loop ────────────────────────────────────────── */
    const clock = new THREE.Clock();
    let raf = 0;
    let curr = 0;
    const render = () => {
      raf = requestAnimationFrame(render);
      const target = getProgress();
      curr += (target - curr) * 0.08;               // eased follow
      const time = clock.getElapsedTime();

      const p = curr;
      camera.position.x = Math.sin(time * 0.15) * 8; // gentle sway = "handheld" life
      camera.position.y = lerp(START_Y, END_Y, p) + Math.sin(time * 0.4) * 2.5;
      camera.position.z = lerp(START_Z, END_Z, p);
      camera.lookAt(Math.sin(time * 0.1) * 14, camera.position.y - 26, camera.position.z - 280);

      mat.uniforms.uFogNear.value = lerp(FOG_NEAR_START, FOG_NEAR_END, p);

      renderer.render(scene, camera);

      // fade the canvas out as the page scrolls past the 3D zone
      wrap.style.opacity = String(1 - smoothstep(FADE_START, FADE_END, target));
      if (reduce) cancelAnimationFrame(raf); // single frame if reduced motion
    };
    render();

    /* ── Resize ─────────────────────────────────────────────── */
    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };
    window.addEventListener("resize", onResize);

    /* ── Cleanup ────────────────────────────────────────────── */
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      geo.dispose();
      mat.dispose();
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
        // Fallback gradient (also the sky behind the mountains): navy → gold horizon
        background:
          "linear-gradient(to bottom, #020617 0%, #0a1022 42%, #1c1c24 72%, #3a2f1e 100%)",
      }}
    />
  );
}
