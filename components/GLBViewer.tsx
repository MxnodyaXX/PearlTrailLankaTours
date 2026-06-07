"use client";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

export default function GLBViewer({ src = "/models/sigiriya.glb" }: { src?: string }) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [autoRotate, setAutoRotate] = useState(true);
  const controlsRef = useRef<OrbitControls | null>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#0a0f1c");

    // PBR environment lighting (no HDRI file needed)
    const pmrem = new THREE.PMREMGenerator(renderer);
    scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;

    const camera = new THREE.PerspectiveCamera(45, mount.clientWidth / mount.clientHeight, 0.1, 100);
    camera.position.set(0, 1, 5);

    // Key + fill lights with a warm gold key to match the brand
    const key = new THREE.DirectionalLight(0xfff0d8, 2.2);
    key.position.set(4, 6, 5);
    scene.add(key);
    const rim = new THREE.DirectionalLight(0xf6b93b, 1.1);
    rim.position.set(-5, 3, -4);
    scene.add(rim);
    scene.add(new THREE.AmbientLight(0xffffff, 0.25));

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.9;
    controls.minDistance = 1.5;
    controls.maxDistance = 14;
    controlsRef.current = controls;

    let model: THREE.Object3D | null = null;
    const loader = new GLTFLoader();
    loader.load(
      src,
      (gltf) => {
        model = gltf.scene;
        // Recenter to origin and normalize scale to a known size
        const box = new THREE.Box3().setFromObject(model);
        const size = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());
        model.position.sub(center);
        const maxDim = Math.max(size.x, size.y, size.z) || 1;
        const scale = 2.6 / maxDim;
        model.scale.setScalar(scale);
        scene.add(model);

        camera.position.set(0, 1.1, 4.6);
        controls.target.set(0, 0, 0);
        controls.update();
        setStatus("ready");
      },
      undefined,
      (err) => { console.error("GLB load error", err); setStatus("error"); }
    );

    let raf = 0;
    const animate = () => {
      raf = requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      if (!mount) return;
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      controls.dispose();
      pmrem.dispose();
      scene.traverse((o) => {
        const m = o as THREE.Mesh;
        if (m.geometry) m.geometry.dispose();
        if (m.material) {
          const mats = Array.isArray(m.material) ? m.material : [m.material];
          mats.forEach((mat) => mat.dispose());
        }
      });
      renderer.dispose();
      if (renderer.domElement.parentNode) renderer.domElement.parentNode.removeChild(renderer.domElement);
    };
  }, [src]);

  const toggleRotate = () => {
    const next = !autoRotate;
    setAutoRotate(next);
    if (controlsRef.current) controlsRef.current.autoRotate = next;
  };

  return (
    <div className="relative w-full h-screen" style={{ background: "#0a0f1c" }}>
      <div ref={mountRef} className="absolute inset-0" />

      {/* Loading / error */}
      {status === "loading" && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <p className="text-white/60 text-sm font-bold tracking-widest uppercase animate-pulse">Loading model…</p>
        </div>
      )}
      {status === "error" && (
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-red-400 text-sm font-bold">Could not load /models/sigiriya.glb</p>
        </div>
      )}

      {/* Instructions */}
      <div className="absolute top-5 left-1/2 -translate-x-1/2 bg-white/[.06] border border-white/[.12] backdrop-blur-xl rounded-full px-5 py-2.5 text-[11px] font-black tracking-widest uppercase text-white/70 pointer-events-none">
        Drag to rotate · Scroll to zoom
      </div>

      {/* Controls */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3">
        <button
          onClick={toggleRotate}
          className="bg-gold hover:bg-gold-deep text-[#0f172a] font-black text-xs px-5 py-2.5 rounded-full transition-all"
        >
          {autoRotate ? "Pause Spin" : "Auto-Spin"}
        </button>
      </div>
    </div>
  );
}
