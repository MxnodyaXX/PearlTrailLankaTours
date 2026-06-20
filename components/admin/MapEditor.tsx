"use client";

import { useRef, useState } from "react";
import type { PackageMap } from "@/lib/packages-data";
import { smoothPath } from "@/lib/route-path";

interface Pt { x: number; y: number; label: string; days: string; anchor: "start" | "end" }

function fromMap(map?: PackageMap): Pt[] {
  if (!map || !Array.isArray(map.route)) return [];
  return map.route.map((r) => {
    const stop = map.stops?.find((s) => s.x === r.x && s.y === r.y);
    return {
      x: r.x, y: r.y,
      label: stop?.label ?? "",
      days: stop ? stop.days.join(",") : "",
      anchor: stop?.anchor ?? "start",
    };
  });
}

function toMap(pts: Pt[]): PackageMap {
  return {
    route: pts.map((p) => ({ x: p.x, y: p.y })),
    stops: pts
      .filter((p) => p.label.trim())
      .map((p) => ({
        x: p.x, y: p.y, label: p.label.trim(), anchor: p.anchor,
        days: p.days.split(",").map((d) => parseInt(d.trim(), 10)).filter((d) => !isNaN(d)),
      })),
  };
}

export default function MapEditor({
  value, onChange, dayCount,
}: { value?: PackageMap; onChange: (m: PackageMap) => void; dayCount: number }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [pts, setPts] = useState<Pt[]>(() => fromMap(value));
  const [selected, setSelected] = useState<number | null>(null);
  const [cursor, setCursor] = useState<{ x: number; y: number } | null>(null);

  const commit = (next: Pt[]) => { setPts(next); onChange(toMap(next)); };

  const toView = (clientX: number, clientY: number) => {
    const svg = svgRef.current; if (!svg) return null;
    const ctm = svg.getScreenCTM(); if (!ctm) return null;
    const p = svg.createSVGPoint(); p.x = clientX; p.y = clientY;
    const l = p.matrixTransform(ctm.inverse());
    return { x: Math.round(l.x), y: Math.round(l.y) };
  };

  const onMapClick = (e: React.MouseEvent) => {
    const loc = toView(e.clientX, e.clientY); if (!loc) return;
    if (selected != null) {
      commit(pts.map((p, i) => (i === selected ? { ...p, x: loc.x, y: loc.y } : p)));
      setSelected(null);
    } else {
      commit([...pts, { x: loc.x, y: loc.y, label: "", days: "", anchor: "start" }]);
    }
  };

  const update = (i: number, patch: Partial<Pt>) => commit(pts.map((p, idx) => (idx === i ? { ...p, ...patch } : p)));
  const del = (i: number) => { commit(pts.filter((_, idx) => idx !== i)); setSelected(null); };
  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir; if (j < 0 || j >= pts.length) return;
    const n = [...pts]; [n[i], n[j]] = [n[j], n[i]]; commit(n);
  };

  const placed = pts;
  const previewPath = smoothPath(placed.map((p) => ({ x: p.x, y: p.y })));

  return (
    <div className="grid md:grid-cols-[minmax(0,340px)_1fr] gap-5 items-start">
      {/* ── Map (left, mirrors the detail-page placement) ──────────── */}
      <div className="rounded-xl overflow-hidden border border-white/10"
        style={{ background: "radial-gradient(ellipse 72% 58% at 50% 46%, rgba(34,64,104,0.28) 0%, transparent 70%)" }}>
        <svg ref={svgRef} viewBox="0 0 664 936" preserveAspectRatio="xMidYMid meet"
          style={{ display: "block", width: "100%", height: "auto", cursor: "crosshair", touchAction: "none" }}
          onClick={onMapClick}
          onMouseMove={(e) => { const l = toView(e.clientX, e.clientY); if (l) setCursor(l); }}
          onMouseLeave={() => setCursor(null)}>
          <defs>
            <filter id="me-bg" colorInterpolationFilters="sRGB"><feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  1 1 1 0 0" /></filter>
          </defs>
          <image href="/MapSriLanka.png" x={0} y={0} width={664} height={936} filter="url(#me-bg)" />

          {previewPath && <path d={previewPath} fill="none" stroke="#f6b93b" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" opacity="0.9" />}

          {placed.map((p, i) => {
            const isCity = !!p.label.trim();
            const isSel = i === selected;
            return (
              <g key={i}>
                <circle cx={p.x} cy={p.y} r={isCity ? 8 : 5}
                  fill={isSel ? "#fff" : isCity ? "#f6b93b" : "rgba(246,185,59,0.55)"} stroke="#0b1220" strokeWidth="2" />
                <text x={p.x} y={p.y - 11} fontSize="12" fontWeight="800" textAnchor="middle"
                  fill={isSel ? "#fff" : "rgba(255,255,255,0.55)"} style={{ paintOrder: "stroke", stroke: "#0b1220", strokeWidth: 4 }}>{i + 1}</text>
                {isCity && (
                  <text x={p.anchor === "start" ? p.x + 11 : p.x - 11} y={p.y + 5} fontSize="13" fontWeight="700"
                    textAnchor={p.anchor} fill="#f6b93b" style={{ paintOrder: "stroke", stroke: "#0b1220", strokeWidth: 4 }}>{p.label}</text>
                )}
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
          {cursor ? `${cursor.x}, ${cursor.y}` : "—"} · {placed.length} points
        </div>
      </div>

      {/* ── Points (right) ─────────────────────────────────────────── */}
      <div>
        <p className="text-white/50 text-xs mb-3">
          Click the map to drop points <b>in travel order</b> (add bends to keep the line on land).
          Give a point a <b>name</b> + <b>day(s)</b> to make it a stop. Selected a row? Your next click <b>moves</b> it.
          {dayCount > 0 && <> This tour has <b>{dayCount} day{dayCount === 1 ? "" : "s"}</b>.</>}
        </p>

        {selected != null && (
          <p className="mb-3 text-xs font-black px-3 py-1.5 rounded inline-block" style={{ background: "rgba(246,185,59,.16)", color: "#f6b93b" }}>
            Click the map to move point {selected + 1}
          </p>
        )}

        <div className="flex flex-col gap-1.5 max-h-[460px] overflow-auto pr-1">
          {placed.length === 0 && <p className="text-white/35 text-sm py-6 text-center border border-white/10 rounded-lg">Click the map to start the route.</p>}
          {placed.map((p, i) => {
            const isSel = i === selected;
            return (
              <div key={i} className="rounded-lg px-2.5 py-2"
                style={{ background: isSel ? "rgba(246,185,59,.14)" : "rgba(255,255,255,0.04)", border: `1px solid ${isSel ? "rgba(246,185,59,.4)" : "rgba(255,255,255,0.08)"}` }}>
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full grid place-items-center text-[11px] font-black shrink-0"
                    style={{ background: p.label.trim() ? "#f6b93b" : "rgba(255,255,255,0.12)", color: p.label.trim() ? "#0b1220" : "#fff" }}>{i + 1}</span>
                  <input value={p.label} onChange={(e) => update(i, { label: e.target.value })} placeholder="(bend — name to make a stop)"
                    className="flex-1 bg-transparent border-b border-white/10 focus:border-white/30 outline-none text-sm py-1 text-white" />
                  <span className="font-mono text-[11px] text-white/40 w-16 text-right">{p.x},{p.y}</span>
                  <button type="button" onClick={() => setSelected(isSel ? null : i)} title="Move" className="text-white/40 hover:text-gold text-xs px-1">✎</button>
                  <button type="button" onClick={() => move(i, -1)} className="text-white/40 hover:text-white text-xs px-1">▲</button>
                  <button type="button" onClick={() => move(i, 1)} className="text-white/40 hover:text-white text-xs px-1">▼</button>
                  <button type="button" onClick={() => del(i)} className="text-red-300/70 hover:text-red-300 text-xs px-1">✕</button>
                </div>
                {p.label.trim() && (
                  <div className="flex items-center gap-2 mt-2 pl-8">
                    <input value={p.days} onChange={(e) => update(i, { days: e.target.value })} placeholder="day(s) e.g. 2,3"
                      className="w-28 bg-white/5 border border-white/10 rounded px-2 py-1 text-white text-[11px] outline-none" />
                    <select value={p.anchor} onChange={(e) => update(i, { anchor: e.target.value as "start" | "end" })}
                      className="bg-white/5 border border-white/10 rounded px-2 py-1 text-white text-[11px] outline-none">
                      <option value="start">label right</option>
                      <option value="end">label left</option>
                    </select>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
