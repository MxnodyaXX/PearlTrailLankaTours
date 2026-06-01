"use client";
import { useEffect, useRef } from "react";

interface Spark {
  x: number; y: number;
  vx: number; vy: number;
  life: number; total: number;
  radius: number;
  bright: boolean; // white flash vs gold
}

export default function CursorGlow() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const spotRef   = useRef<HTMLDivElement>(null);
  const sparks    = useRef<Spark[]>([]);
  const raf       = useRef(0);
  const lastSpawn = useRef(0);

  useEffect(() => {
    // Skip on touch-only devices (no cursor)
    if (window.matchMedia("(hover: none)").matches) return;

    const canvas = canvasRef.current!;
    const spot   = spotRef.current!;
    const ctx    = canvas.getContext("2d")!;

    /* ── Resize ─────────────────────────────── */
    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize, { passive: true });

    /* ── Mouse move ─────────────────────────── */
    const onMove = (e: MouseEvent) => {
      const x = e.clientX;
      const y = e.clientY;

      /* 1 · Soft spotlight -------------------- */
      spot.style.setProperty("--mx", `${x}px`);
      spot.style.setProperty("--my", `${y}px`);

      /* 2 · Card inner-glow update ------------ */
      document.querySelectorAll<HTMLElement>("[data-glow]").forEach(el => {
        const r = el.getBoundingClientRect();
        el.style.setProperty("--gx", `${x - r.left}px`);
        el.style.setProperty("--gy", `${y - r.top}px`);
      });

      /* 3 · Spawn sparks (≤30 fps) ------------ */
      const now = Date.now();
      if (now - lastSpawn.current < 33) return;
      lastSpawn.current = now;

      const burst = Math.floor(Math.random() * 3) + 2; // 2-4 sparks
      for (let i = 0; i < burst; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 0.6 + Math.random() * 2.8;
        sparks.current.push({
          x, y,
          vx:     Math.cos(angle) * speed,
          vy:     Math.sin(angle) * speed - 1.4,
          life:   0,
          total:  22 + Math.random() * 28,
          radius: 0.7 + Math.random() * 1.8,
          bright: Math.random() < 0.28,
        });
      }
      // Hard cap
      if (sparks.current.length > 260) {
        sparks.current.splice(0, sparks.current.length - 260);
      }
    };
    window.addEventListener("mousemove", onMove, { passive: true });

    /* ── Render loop ────────────────────────── */
    const tick = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      sparks.current = sparks.current.filter(s => s.life < s.total);

      for (const s of sparks.current) {
        // Physics
        s.x  += s.vx;
        s.y  += s.vy;
        s.vy += 0.09;   // gravity
        s.vx *= 0.965;  // air resistance
        s.life++;

        const t     = s.life / s.total;       // 0 → 1
        const alpha = (1 - t) * (s.bright ? 0.92 : 0.70);
        const r     = s.radius * (1 - t * 0.45);

        if (s.bright) {
          // White-hot flash
          ctx.shadowColor = "rgba(255,240,180,0.9)";
          ctx.shadowBlur  = 10;
          ctx.fillStyle   = `rgba(255,250,220,${alpha})`;
        } else {
          // Gold spark
          ctx.shadowColor = "rgba(246,185,59,0.65)";
          ctx.shadowBlur  = 6;
          ctx.fillStyle   = `rgba(246,185,59,${alpha})`;
        }

        ctx.beginPath();
        ctx.arc(s.x, s.y, Math.max(r, 0.3), 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.shadowBlur = 0; // reset for next frame
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf.current);
    };
  }, []);

  return (
    <>
      {/* ── Soft cursor spotlight ───────────────────────────────── */}
      <div
        ref={spotRef}
        className="pointer-events-none fixed inset-0 z-[9990]"
        style={{
          background:
            "radial-gradient(680px circle at var(--mx,-9999px) var(--my,-9999px), rgba(246,185,59,.07), transparent 68%)",
        }}
      />

      {/* ── Spark canvas ────────────────────────────────────────── */}
      <canvas
        ref={canvasRef}
        className="pointer-events-none fixed inset-0 z-[9991]"
        aria-hidden="true"
      />
    </>
  );
}
