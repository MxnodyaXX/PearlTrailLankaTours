import Link from "next/link";

interface Crumb { label: string; href?: string }

interface PageHeroProps {
  kicker:  string;
  title:   string;
  em?:     string;   // italicised part appended after title
  desc:    string;
  img:     string;
  crumbs:  Crumb[];
}

export default function PageHero({ kicker, title, em, desc, img, crumbs }: PageHeroProps) {
  return (
    <section className="relative min-h-[420px] flex items-end pb-16 pt-32 px-5 overflow-hidden">
      {/* Background */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={img}
        alt=""
        className="absolute inset-0 w-full h-full object-cover object-center"
        aria-hidden
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[rgba(2,6,23,.6)] to-[rgba(2,6,23,.85)]" />

      <div className="relative z-10 w-[min(1120px,100%)] mx-auto text-white">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-[11px] font-bold text-white/50 mb-4">
          {crumbs.map((c, i) => (
            <span key={i} className="flex items-center gap-2">
              {i > 0 && <span className="text-white/25">›</span>}
              {c.href ? (
                <Link href={c.href} className="hover:text-gold transition-colors">{c.label}</Link>
              ) : (
                <span className="text-white/70">{c.label}</span>
              )}
            </span>
          ))}
        </nav>

        <p className="text-gold text-[11px] font-black uppercase tracking-[.2em] mb-2">{kicker}</p>
        <h1
          className="font-black leading-[.95] mb-3"
          style={{ fontSize: "clamp(32px,5vw,72px)", letterSpacing: "-0.04em" }}
        >
          {title}{em && <> <em className="text-gold">{em}</em></>}
        </h1>
        <p className="text-[#dbeafe] text-[15px] max-w-xl leading-relaxed">{desc}</p>
      </div>
    </section>
  );
}
