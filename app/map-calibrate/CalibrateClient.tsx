"use client";

import { useRef, useState } from "react";

interface Pt { id: number; x: number | null; y: number | null; name: string }

let UID = 1;
const mk = (x: number | null = null, y: number | null = null, name = ""): Pt => ({ id: UID++, x, y, name });

const SEED: { x: number; y: number; name: string }[] = [
  { x: 124, y: 700, name: "Colombo" },
  { x: 127, y: 631, name: "Negombo" },
  { x: 263, y: 386, name: "Anuradhapura" },
  { x: 420, y: 304, name: "Trincomalee" },
  { x: 333, y: 604, name: "Kandy" },
  { x: 390, y: 683, name: "Nuwara Eliya" },
  { x: 518, y: 819, name: "Kataragama" },
  { x: 279, y: 924, name: "Galle" },
];

// Parse a pasted ROUTE / CITIES / DEST array into ordered points.
// Reads every { x: .., y: .. } and a label from `label: "..."` or a trailing `// name`.
function parsePoints(text: string): { x: number; y: number; name: string }[] {
  const out: { x: number; y: number; name: string }[] = [];
  const re = /\{\s*x:\s*(-?\d+(?:\.\d+)?)\s*,\s*y:\s*(-?\d+(?:\.\d+)?)([^}]*)\}/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text))) {
    const x = Math.round(parseFloat(m[1]));
    const y = Math.round(parseFloat(m[2]));
    let name = "";
    const lab = m[3].match(/label:\s*["']([^"']*)["']/);
    if (lab) name = lab[1];
    else {
      const nl = text.indexOf("\n", re.lastIndex);
      const after = text.slice(re.lastIndex, nl === -1 ? undefined : nl);
      const cm = after.match(/\/\/\s*(.+)/);
      if (cm) name = cm[1].replace(/^\d+\s*/, "").replace(/\s*\([^)]*\)\s*$/, "").trim();
    }
    out.push({ x, y, name });
  }
  return out;
}

// Catmull-Rom → bézier for the live preview
function smoothPath(pts: { x: number; y: number }[]): string {
  if (pts.length < 2) return pts.length ? `M ${pts[0].x},${pts[0].y}` : "";
  let d = `M ${pts[0].x},${pts[0].y}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] ?? p2;
    const c1x = p1.x + (p2.x - p0.x) / 6, c1y = p1.y + (p2.y - p0.y) / 6;
    const c2x = p2.x - (p3.x - p1.x) / 6, c2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C ${c1x.toFixed(1)},${c1y.toFixed(1)} ${c2x.toFixed(1)},${c2y.toFixed(1)} ${p2.x},${p2.y}`;
  }
  return d;
}

export default function CalibrateClient() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [pts, setPts] = useState<Pt[]>([]);
  const [selected, setSelected] = useState<number | null>(null); // id awaiting placement/move
  const [cursor, setCursor] = useState<{ x: number; y: number } | null>(null);
  const [loop, setLoop] = useState(true);
  const [copied, setCopied] = useState("");
  const [importText, setImportText] = useState("");

  const loadPoints = (replace: boolean) => {
    const parsed = parsePoints(importText);
    if (!parsed.length) return;
    const fresh = parsed.map((p) => mk(p.x, p.y, p.name));
    setPts((prev) => (replace ? fresh : [...prev, ...fresh]));
    setSelected(null);
  };

  const toView = (clientX: number, clientY: number) => {
    const svg = svgRef.current; if (!svg) return null;
    const ctm = svg.getScreenCTM(); if (!ctm) return null;
    const p = svg.createSVGPoint(); p.x = clientX; p.y = clientY;
    const l = p.matrixTransform(ctm.inverse());
    return { x: Math.round(l.x), y: Math.round(l.y) };
  };

  const onClick = (e: React.MouseEvent) => {
    const loc = toView(e.clientX, e.clientY); if (!loc) return;
    if (selected != null) {
      setPts((p) => p.map((q) => (q.id === selected ? { ...q, x: loc.x, y: loc.y } : q)));
      setSelected(null);
    } else {
      setPts((p) => [...p, mk(loc.x, loc.y)]);
    }
  };
  const onMove = (e: React.MouseEvent) => { const l = toView(e.clientX, e.clientY); if (l) setCursor(l); };

  const placed = pts
    .filter((p) => p.x != null && p.y != null)
    .map((p) => ({ id: p.id, x: p.x as number, y: p.y as number, name: p.name }));
  const pathPts = loop && placed.length > 1 ? [...placed, placed[0]] : placed;
  const previewPath = smoothPath(pathPts);

  // editing helpers
  const rename = (id: number, name: string) => setPts((p) => p.map((q) => (q.id === id ? { ...q, name } : q)));
  const del = (id: number) => setPts((p) => p.filter((q) => q.id !== id));
  const move = (id: number, dir: -1 | 1) => setPts((p) => {
    const i = p.findIndex((q) => q.id === id); const j = i + dir;
    if (i < 0 || j < 0 || j >= p.length) return p;
    const n = [...p]; [n[i], n[j]] = [n[j], n[i]]; return n;
  });
  const insertAfter = (id: number) => setPts((p) => {
    const i = p.findIndex((q) => q.id === id); const np = mk(null, null);
    const n = [...p]; n.splice(i + 1, 0, np); setSelected(np.id); return n;
  });

  const routeOut = "const ROUTE = [\n" + placed.map((p) => `  { x: ${p.x}, y: ${p.y} },${p.name ? ` // ${p.name}` : ""}`).join("\n") + "\n];";
  const cityOut = "const CITIES = [\n" + placed.filter((p) => p.name.trim()).map((p) => `  { x: ${p.x}, y: ${p.y}, label: "${p.name}" },`).join("\n") + "\n];";

  const copy = async (text: string, which: string) => {
    try { await navigator.clipboard.writeText(text); setCopied(which); setTimeout(() => setCopied(""), 1400); } catch {}
  };

  return (
    <div className="min-h-screen text-white px-5 py-8" style={{ background: "#0b1220" }}>
      <div className="w-[min(1240px,100%)] mx-auto">
        <h1 className="text-2xl font-black mb-1">Route Builder</h1>
        <p className="text-white/50 text-sm mb-5 max-w-3xl">
          Click the map to drop waypoints <b>in travel order</b>. Add un-named bend points between cities to keep the line on land/coast.
          Name a point to make it a city marker. Selected a row? Your next click <b>moves</b> that point. Coordinates are in the 664×936 map space.
        </p>

        <div className="flex flex-wrap gap-2 mb-5">
          <button onClick={() => { setPts(SEED.map((s) => mk(s.x, s.y, s.name))); setSelected(null); }} className="bg-white/10 hover:bg-white/20 font-black text-xs px-4 py-2 rounded-md">Seed 8 cities</button>
          <button onClick={() => setPts((p) => p.slice(0, -1))} className="bg-white/10 hover:bg-white/20 font-black text-xs px-4 py-2 rounded-md">Undo last</button>
          <button onClick={() => { setPts([]); setSelected(null); }} className="bg-white/10 hover:bg-white/20 font-black text-xs px-4 py-2 rounded-md">Clear all</button>
          <label className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-md text-xs font-bold">
            <input type="checkbox" checked={loop} onChange={(e) => setLoop(e.target.checked)} /> Close loop (return to start)
          </label>
          {selected != null && <span className="px-4 py-2 rounded-md text-xs font-black" style={{ background: "rgba(246,185,59,.16)", color: "#f6b93b" }}>Click the map to place / move the selected point</span>}
        </div>

        {/* Paste existing points to edit */}
        <details className="mb-6 rounded-lg border border-white/10 bg-white/[.03]">
          <summary className="cursor-pointer select-none px-4 py-2.5 text-sm font-bold text-white/70">Paste existing points to edit ▾</summary>
          <div className="px-4 pb-4">
            <textarea
              value={importText}
              onChange={(e) => setImportText(e.target.value)}
              placeholder={`Paste a ROUTE / CITIES / DEST array, e.g.\n[\n  { x: 124, y: 700 }, // Colombo\n  { x: 125, y: 611, label: "Negombo" },\n]`}
              className="w-full h-36 bg-black/40 border border-white/10 rounded-lg p-3 text-xs font-mono outline-none focus:border-white/25"
            />
            <div className="flex flex-wrap gap-2 mt-2">
              <button onClick={() => loadPoints(true)} className="bg-gold text-[#0b1220] font-black text-xs px-4 py-2 rounded-md">Load (replace)</button>
              <button onClick={() => loadPoints(false)} className="bg-white/10 hover:bg-white/20 font-black text-xs px-4 py-2 rounded-md">Append</button>
              <span className="text-white/35 text-[11px] self-center">Reads x/y and names from <code>label:</code> or <code>// comments</code> · keeps order.</span>
            </div>
          </div>
        </details>

        <div className="grid lg:grid-cols-[minmax(0,540px)_1fr] gap-8 items-start">
          {/* Map */}
          <div className="rounded-xl overflow-hidden border border-white/10" style={{ position: "sticky", top: 16, background: "radial-gradient(ellipse 70% 60% at 50% 46%, rgba(34,64,104,.3), transparent 70%)" }}>
            <svg ref={svgRef} viewBox="0 0 664 936" preserveAspectRatio="xMidYMid meet"
              style={{ display: "block", width: "100%", height: "auto", cursor: "crosshair", touchAction: "none" }}
              onClick={onClick} onMouseMove={onMove} onMouseLeave={() => setCursor(null)}>
              <defs>
                <filter id="cb-bg" colorInterpolationFilters="sRGB"><feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  1 1 1 0 0" /></filter>
              </defs>
              <image href="/MapSriLanka.png" x={0} y={0} width={664} height={936} filter="url(#cb-bg)" />

              {/* route preview */}
              {previewPath && <path d={previewPath} fill="none" stroke="#f6b93b" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" opacity="0.9" />}

              {/* waypoints */}
              {placed.map((p, idx) => {
                const isCity = !!p.name.trim();
                const isSel = p.id === selected;
                return (
                  <g key={p.id}>
                    <circle cx={p.x} cy={p.y} r={isCity ? 8 : 5}
                      fill={isSel ? "#fff" : isCity ? "#f6b93b" : "rgba(246,185,59,0.55)"} stroke="#0b1220" strokeWidth="2" />
                    <text x={p.x} y={p.y - 11} fontSize="12" fontWeight="800" textAnchor="middle"
                      fill={isSel ? "#fff" : "rgba(255,255,255,0.55)"} style={{ paintOrder: "stroke", stroke: "#0b1220", strokeWidth: 4 }}>{idx + 1}</text>
                    {isCity && <text x={p.x + 11} y={p.y + 5} fontSize="14" fontWeight="700" fill="#f6b93b" style={{ paintOrder: "stroke", stroke: "#0b1220", strokeWidth: 4 }}>{p.name}</text>}
                  </g>
                );
              })}

              {cursor && (
                <g pointerEvents="none">
                  <line x1={cursor.x} y1={0} x2={cursor.x} y2={936} stroke="rgba(246,185,59,0.3)" strokeWidth="1" />
                  <line x1={0} y1={cursor.y} x2={664} y2={cursor.y} stroke="rgba(246,185,59,0.3)" strokeWidth="1" />
                </g>
              )}
            </svg>
            <div className="px-3 py-2 text-[11px] font-mono text-white/45 border-t border-white/10">
              cursor: {cursor ? `${cursor.x}, ${cursor.y}` : "—"} · {placed.length} points
            </div>
          </div>

          {/* Editor + output */}
          <div>
            <div className="flex flex-col gap-1.5 mb-6 max-h-[420px] overflow-auto pr-1">
              {pts.length === 0 && <p className="text-white/35 text-sm py-6 text-center">Click the map to start, or “Seed 8 cities”.</p>}
              {pts.map((p, idx) => {
                const isSel = p.id === selected;
                return (
                  <div key={p.id} className="flex items-center gap-2 rounded-lg px-2.5 py-2"
                    style={{ background: isSel ? "rgba(246,185,59,.14)" : "rgba(255,255,255,0.04)", border: `1px solid ${isSel ? "rgba(246,185,59,.4)" : "rgba(255,255,255,0.08)"}` }}>
                    <span className="w-6 h-6 rounded-full grid place-items-center text-[11px] font-black shrink-0" style={{ background: p.name.trim() ? "#f6b93b" : "rgba(255,255,255,0.12)", color: p.name.trim() ? "#0b1220" : "#fff" }}>{idx + 1}</span>
                    <input value={p.name} onChange={(e) => rename(p.id, e.target.value)} placeholder="(bend point — name to make a city)"
                      className="flex-1 bg-transparent border-b border-white/10 focus:border-white/30 outline-none text-sm py-1" />
                    <span className="font-mono text-[11px] text-white/40 w-20 text-right">{p.x != null ? `${p.x},${p.y}` : "place →"}</span>
                    <button title="Move (re-place)" onClick={() => setSelected(isSel ? null : p.id)} className="text-white/40 hover:text-gold text-xs px-1">✎</button>
                    <button title="Insert after" onClick={() => insertAfter(p.id)} className="text-white/40 hover:text-gold text-xs px-1">＋</button>
                    <button title="Up" onClick={() => move(p.id, -1)} className="text-white/40 hover:text-white text-xs px-1">▲</button>
                    <button title="Down" onClick={() => move(p.id, 1)} className="text-white/40 hover:text-white text-xs px-1">▼</button>
                    <button title="Delete" onClick={() => del(p.id)} className="text-white/30 hover:text-red-400 text-xs px-1">✕</button>
                  </div>
                );
              })}
            </div>

            {/* outputs */}
            <div className="flex items-center justify-between mb-2">
              <p className="text-white/50 text-xs font-bold uppercase tracking-wider">Route — send this to me</p>
              <button onClick={() => copy(routeOut, "route")} className="bg-white/10 hover:bg-white/20 font-black text-xs px-3 py-1.5 rounded-md">{copied === "route" ? "Copied ✓" : "Copy"}</button>
            </div>
            <pre className="bg-black/40 border border-white/10 rounded-lg p-4 text-[12px] font-mono text-emerald-300 overflow-auto whitespace-pre mb-5">{routeOut}</pre>

            <div className="flex items-center justify-between mb-2">
              <p className="text-white/50 text-xs font-bold uppercase tracking-wider">Named cities</p>
              <button onClick={() => copy(cityOut, "city")} className="bg-white/10 hover:bg-white/20 font-black text-xs px-3 py-1.5 rounded-md">{copied === "city" ? "Copied ✓" : "Copy"}</button>
            </div>
            <pre className="bg-black/40 border border-white/10 rounded-lg p-4 text-[12px] font-mono text-amber-200 overflow-auto whitespace-pre">{cityOut}</pre>
          </div>
        </div>
      </div>
    </div>
  );
}
