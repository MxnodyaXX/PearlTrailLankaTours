"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import gsap from "gsap";

const FONT = "var(--font-inter), system-ui, sans-serif";

/* Tunable look + framing of the relic */
const MODEL_TINT = 0xffffff;
const TEX_REPEAT = 2;
const MODEL_ROUGHNESS = 0.92;
const MODEL_SCALE = 2.15;     // size in frame
const CAM_Y = 0.35, CAM_Z = 5.2;
const TARGET_Y = 0.15, BASE_Y = 0.15;
const SPIN_SPEED = 0.1;       // gentle turntable

const goldMetal: React.CSSProperties = {
  backgroundImage: "linear-gradient(180deg,#f9ecbf 0%,#e8c074 40%,#c9a24a 72%,#9c7a2c 100%)",
  WebkitBackgroundClip: "text", backgroundClip: "text",
  color: "transparent", WebkitTextFillColor: "transparent",
  filter: "drop-shadow(0 3px 2px rgba(0,0,0,.6)) drop-shadow(0 1px 0 rgba(255,240,200,.3))",
};
const creamEmboss: React.CSSProperties = {
  color: "#ece0c6",
  textShadow: "0 1px 0 rgba(255,244,214,.16), 0 2px 2px rgba(0,0,0,.55), 0 16px 46px rgba(0,0,0,.6)",
};
const btnGold: React.CSSProperties = {
  color: "#1a1206",
  backgroundImage: "linear-gradient(180deg,#f4dd99,#d9b154 55%,#c9a24a)",
  boxShadow: "inset 0 1px 0 rgba(255,248,220,.65), inset 0 -3px 5px rgba(120,80,20,.4), 0 16px 36px rgba(0,0,0,.55)",
};
const btnOutline: React.CSSProperties = {
  color: "#e8c074",
  border: "1px solid rgba(201,162,74,.5)", background: "rgba(201,162,74,.08)",
  boxShadow: "inset 0 1px 0 rgba(255,240,200,.14), 0 12px 28px rgba(0,0,0,.5)",
};

function makeVintageTexture(): THREE.CanvasTexture {
  const s = 512;
  const c = document.createElement("canvas");
  c.width = c.height = s;
  const ctx = c.getContext("2d")!;
  ctx.fillStyle = "#6e5234";
  ctx.fillRect(0, 0, s, s);
  for (let i = 0; i < 260; i++) {
    const x = Math.random() * s, y = Math.random() * s, r = 8 + Math.random() * 64;
    const dark = Math.random() > 0.5;
    ctx.fillStyle = dark ? `rgba(38,24,10,${0.04 + Math.random() * 0.09})` : `rgba(156,124,82,${0.03 + Math.random() * 0.08})`;
    ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
  }
  const img = ctx.getImageData(0, 0, s, s);
  const d = img.data;
  for (let i = 0; i < d.length; i += 4) { const n = (Math.random() - 0.5) * 24; d[i] += n; d[i + 1] += n; d[i + 2] += n; }
  ctx.putImageData(img, 0, 0);
  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(TEX_REPEAT, TEX_REPEAT);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

export default function StoryModel() {
  const canvasWrap = useRef<HTMLDivElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    const mount = canvasWrap.current;
    if (!mount) return;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.06;
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#120b04");

    const pmrem = new THREE.PMREMGenerator(renderer);
    scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;

    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, CAM_Y, CAM_Z);

    const key = new THREE.DirectionalLight(0xffe7bf, 2.6);
    key.position.set(4, 6, 5); scene.add(key);
    const rim = new THREE.DirectionalLight(0xf6b93b, 1.3);
    rim.position.set(-5, 2.5, -4); scene.add(rim);
    scene.add(new THREE.AmbientLight(0xffe9c4, 0.22));

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.enableZoom = false;
    controls.enablePan = false;
    controls.target.set(0, TARGET_Y, 0);
    controls.update();

    // Responsive framing — refit & re-centre the relic for portrait phones
    let baseY = BASE_Y;
    const frame = () => {
      const portrait = window.innerWidth < 768;
      baseY = portrait ? 0.15 : BASE_Y;
      camera.position.set(0, portrait ? 0.3 : CAM_Y, portrait ? 5.7 : CAM_Z);
      controls.target.set(0, baseY, 0);
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      controls.update();
    };
    frame();

    const emN = 480;
    const emPos = new Float32Array(emN * 3);
    for (let i = 0; i < emN; i++) { emPos[i * 3] = (Math.random() - 0.5) * 9; emPos[i * 3 + 1] = Math.random() * 6 - 1; emPos[i * 3 + 2] = (Math.random() - 0.5) * 9; }
    const emGeo = new THREE.BufferGeometry();
    emGeo.setAttribute("position", new THREE.BufferAttribute(emPos, 3));
    const emMat = new THREE.PointsMaterial({ color: 0xe8c074, size: 0.022, transparent: true, opacity: 0.5, depthWrite: false, blending: THREE.AdditiveBlending });
    const embers = new THREE.Points(emGeo, emMat);
    scene.add(embers);

    let spinner: THREE.Object3D | null = null;
    const loader = new GLTFLoader();
    loader.load("/models/sigiriya.glb", (gltf) => {
      const m = gltf.scene;
      const vintageTex = makeVintageTexture();
      m.traverse((o) => {
        if ((o as THREE.Mesh).isMesh) {
          const mesh = o as THREE.Mesh;
          const old = mesh.material;
          mesh.material = new THREE.MeshStandardMaterial({ map: vintageTex, color: MODEL_TINT, roughness: MODEL_ROUGHNESS, metalness: 0, envMapIntensity: 0.5 });
          if (old) (Array.isArray(old) ? old : [old]).forEach((x) => x.dispose());
        }
      });
      const box = new THREE.Box3().setFromObject(m);
      const size = box.getSize(new THREE.Vector3());
      const center = box.getCenter(new THREE.Vector3());
      m.position.sub(center);
      const maxDim = Math.max(size.x, size.y, size.z) || 1;
      m.scale.setScalar(MODEL_SCALE / maxDim);

      // spinner turns around the centred model; holder sets the resting height
      const sp = new THREE.Group(); sp.add(m);
      const holder = new THREE.Group(); holder.add(sp);
      holder.position.y = baseY;
      scene.add(holder);
      spinner = sp;
      (spinner.userData as { holder: THREE.Group }).holder = holder;
      setStatus("ready");
    }, undefined, (e) => { console.error(e); setStatus("error"); });

    const clock = new THREE.Clock();
    let raf = 0;
    const animate = () => {
      raf = requestAnimationFrame(animate);
      const dt = clock.getDelta();
      const t = clock.getElapsedTime();
      controls.update();
      if (spinner) {
        spinner.rotation.y += dt * SPIN_SPEED;
        const holder = (spinner.userData as { holder?: THREE.Group }).holder;
        if (holder) holder.position.y = baseY + Math.sin(t * 0.8) * 0.04;
      }
      embers.rotation.y += dt * 0.02;
      renderer.render(scene, camera);
    };
    animate();

    window.addEventListener("resize", frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", frame);
      controls.dispose(); pmrem.dispose(); emGeo.dispose(); emMat.dispose();
      scene.traverse((o) => {
        const mm = o as THREE.Mesh;
        if (mm.geometry) mm.geometry.dispose();
        if (mm.material) (Array.isArray(mm.material) ? mm.material : [mm.material]).forEach((x) => x.dispose());
      });
      renderer.dispose();
      if (renderer.domElement.parentNode) renderer.domElement.parentNode.removeChild(renderer.domElement);
    };
  }, []);

  /* entrance reveal */
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(".hero-line", { yPercent: 120 });
      gsap.set([".hero-kicker", ".hero-sub", ".hero-cta"], { opacity: 0, y: 22 });
      const tl = gsap.timeline({ delay: 0.35 });
      tl.to(".hero-kicker", { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" })
        .to(".hero-line", { yPercent: 0, stagger: 0.12, duration: 1.05, ease: "power3.out" }, 0.15)
        .to(".hero-sub", { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }, 0.85)
        .to(".hero-cta", { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" }, 1.05);
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={rootRef} className="relative h-screen overflow-hidden" style={{ fontFamily: FONT, background: "#120b04" }}>
      {/* 3D stage */}
      <div ref={canvasWrap} className="absolute inset-0" style={{ zIndex: 0 }} />

      {/* contact shadow */}
      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 5, background: "radial-gradient(ellipse 42% 8% at 50% 82%, rgba(0,0,0,.6) 0%, transparent 72%)" }} />

      {/* vintage atmosphere */}
      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 30, background:
        "radial-gradient(ellipse 70% 60% at 50% 48%, rgba(232,192,116,.10) 0%, transparent 55%), radial-gradient(ellipse 120% 100% at 50% 50%, transparent 40%, rgba(8,5,2,.9) 100%)" }} />
      <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 31, opacity: 0.16, mixBlendMode: "overlay" }} aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
        <filter id="hero-grain"><feTurbulence type="fractalNoise" baseFrequency="0.78" numOctaves="4" stitchTiles="stitch" /></filter>
        <rect width="100%" height="100%" filter="url(#hero-grain)" />
      </svg>

      {/* vertical scrim — darkens top & bottom, keeps the book clear */}
      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 8, background:
        "linear-gradient(to bottom, rgba(8,5,2,.78) 0%, transparent 26%, transparent 66%, rgba(8,5,2,.85) 100%)" }} />

      {status === "loading" && (
        <div className="absolute inset-0 z-[40] flex items-center justify-center pointer-events-none">
          <p style={{ color: "#b6a684", letterSpacing: ".3em" }} className="text-sm uppercase animate-pulse">Unsealing the relic…</p>
        </div>
      )}

      {/* top bar */}
      <header className="absolute top-0 left-0 right-0 z-[55] flex items-center justify-between px-6 md:px-10 py-5">
        <Link href="/" className="leading-none text-left" style={{ color: "#e8c074" }}>
          <span className="block font-black tracking-[.2em] text-sm md:text-lg uppercase" style={creamEmboss}>PearlTrail</span>
          <span className="block text-[9px] md:text-[10px] tracking-[.3em] uppercase mt-0.5" style={{ color: "#9c8048" }}>Codex of Ceylon</span>
        </Link>
        <Link href="/" className="text-[10px] md:text-[11px] tracking-[.25em] uppercase hover:text-[#e8c074] transition-colors" style={{ color: "#c9a24a" }}>← Return</Link>
      </header>

      {/* ── Centred hero: title top · book middle · CTA bottom ─────── */}
      <div className="absolute inset-0 z-[20] flex flex-col items-center justify-between text-center px-6 pt-[12vh] md:pt-28 pb-[7vh] md:pb-14" style={{ pointerEvents: "none" }}>
        {/* top block */}
        <div className="w-full max-w-[1000px]">
          <div className="hero-kicker inline-flex items-center gap-3 mb-5" style={{ color: "#c9a24a" }}>
            <span style={{ width: 34, height: 1, background: "linear-gradient(to right, transparent, #c9a24a)" }} />
            <span className="text-[11px] md:text-[13px] tracking-[.34em] uppercase">3,500 Years · One Island</span>
            <span style={{ width: 34, height: 1, background: "linear-gradient(to left, transparent, #c9a24a)" }} />
          </div>

          <h1 style={{ fontSize: "clamp(40px,7.6vw,110px)", lineHeight: 0.95, letterSpacing: "-0.04em", fontWeight: 900 }}>
            <span className="block overflow-hidden" style={{ paddingBottom: "0.06em" }}>
              <span className="hero-line block" style={creamEmboss}>The Story of</span>
            </span>
            <span className="block overflow-hidden" style={{ paddingBottom: "0.08em" }}>
              <span className="hero-line block" style={goldMetal}>Ceylon.</span>
            </span>
          </h1>
          <div className="overflow-hidden mt-2">
            <p className="hero-line text-[12px] md:text-[15px] font-bold tracking-[.26em] uppercase" style={{ color: "#b6a684" }}>
              An Illuminated Chronicle of Sri Lanka
            </p>
          </div>
        </div>

        {/* bottom block */}
        <div className="w-full max-w-xl">
          <p className="hero-sub mx-auto max-w-lg text-[15px] md:text-[18px]" style={{ color: "#c7baa0", lineHeight: 1.55 }}>
            From the first kingdoms of the dry plains to the island of today —
            open the codex and journey through three and a half thousand years of Sri Lanka.
          </p>
          <div className="hero-cta mt-7 flex flex-wrap gap-4 justify-center" style={{ pointerEvents: "auto" }}>
            <Link href="/discover" className="font-black tracking-[.2em] uppercase text-xs px-8 py-4 rounded-sm transition-all hover:-translate-y-0.5" style={btnGold}>
              Begin the Story →
            </Link>
            <Link href="/packages" className="font-black tracking-[.2em] uppercase text-xs px-8 py-4 rounded-sm transition-all hover:-translate-y-0.5" style={btnOutline}>
              View Journeys
            </Link>
          </div>
          <p className="mt-6 text-[10px] tracking-[.35em] uppercase" style={{ color: "#9c8048" }}>— drag to inspect the relic —</p>
        </div>
      </div>
    </div>
  );
}
