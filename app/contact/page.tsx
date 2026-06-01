"use client";
import Navbar        from "@/components/Navbar";
import PageHero      from "@/components/PageHero";
import Footer        from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import { useState }  from "react";

export default function ContactPage() {
  const [status, setStatus] = useState<"idle"|"sending"|"sent">("idle");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    setTimeout(() => setStatus("sent"), 1500);
  };

  return (
    <>
      <Navbar />
      <PageHero
        kicker="Get In Touch"
        title="Contact"
        em="Us"
        desc="Have a question or ready to plan your Sri Lanka adventure? We respond within a few hours."
        img="https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=1920&q=80"
        crumbs={[{ label: "Home", href: "/" }, { label: "Contact" }]}
      />

      <section className="bg-[#020617] py-16 px-5">
        <div className="w-[min(1120px,100%)] mx-auto grid md:grid-cols-[1fr_1.6fr] gap-10 items-start">

          {/* Info */}
          <div data-glow className="bg-[#0f172a] border border-white/[.08] rounded-[28px] p-7 text-white sticky top-24">
            <h3 className="font-black text-2xl mb-1" style={{ letterSpacing: "-0.02em" }}>Let's plan your perfect trip</h3>
            <p className="text-white/50 text-sm mb-7">Reach out — we respond within a few hours and are happy to help with any travel query.</p>

            {[
              { ico:"📞", label:"Phone / Call",    val:"0741 838 376", href:"tel:+94741838376" },
              { ico:"💬", label:"WhatsApp",         val:"0741 838 376", href:"https://wa.me/94741838376" },
              { ico:"📧", label:"Personal Email",   val:"mxnodya.00@gmail.com", href:"mailto:mxnodya.00@gmail.com" },
              { ico:"📨", label:"Company Email",    val:"pearltraillankatours@company.com", href:"mailto:pearltraillankatours@company.com" },
              { ico:"📍", label:"Location",         val:"Colombo, Sri Lanka", href:"#" },
            ].map((c) => (
              <a key={c.label} href={c.href} target={c.href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer"
                className="flex items-start gap-3.5 mb-4 group">
                <div className="w-10 h-10 bg-gold/10 border border-gold/20 rounded-xl flex items-center justify-center text-lg shrink-0 group-hover:bg-gold/20 transition-colors">{c.ico}</div>
                <div>
                  <p className="text-white/35 text-[10px] font-black uppercase tracking-wider">{c.label}</p>
                  <p className="text-white/75 text-sm font-medium break-all group-hover:text-gold transition-colors">{c.val}</p>
                </div>
              </a>
            ))}

            <div className="flex gap-2 mt-6">
              {[["facebook.com/pearltraillankatours","FB"],["instagram.com/pearltraillankatours","IG"],["tiktok.com/@pearltraillankatours","TT"],["youtube.com/@pearltraillankatours","YT"]].map(([href, label]) => (
                <a key={label} href={`https://${href}`} target="_blank" rel="noopener noreferrer"
                  className="w-9 h-9 bg-white/[.05] hover:bg-gold rounded-full flex items-center justify-center text-[10px] font-black text-white hover:text-[#0f172a] transition-all">
                  {label}
                </a>
              ))}
            </div>
          </div>

          {/* Form */}
          <div data-glow className="bg-white/[.04] border border-white/[.08] rounded-[28px] p-7 text-white">
            <h3 className="font-black text-2xl mb-1" style={{ letterSpacing: "-0.02em" }}>Send Us an Inquiry</h3>
            <p className="text-white/50 text-sm mb-7">Fill in the form and we'll get back to you with a personalized travel plan.</p>

            {status === "sent" ? (
              <div className="text-center py-16">
                <div className="text-5xl mb-4">✅</div>
                <h4 className="font-black text-xl mb-2">Inquiry Sent!</h4>
                <p className="text-white/55">We'll be in touch within a few hours. Thank you!</p>
                <button onClick={() => setStatus("idle")} className="mt-6 bg-gold text-[#0f172a] font-black text-sm px-6 py-2.5 rounded-full">Send Another</button>
              </div>
            ) : (
              <form onSubmit={submit} className="flex flex-col gap-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label="Full Name *"><input type="text" required placeholder="Your full name" className="w-full bg-transparent outline-none text-sm font-semibold text-white placeholder:text-white/30" /></Field>
                  <Field label="Email Address *"><input type="email" required placeholder="your@email.com" className="w-full bg-transparent outline-none text-sm font-semibold text-white placeholder:text-white/30" /></Field>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label="Phone / WhatsApp *"><input type="tel" required placeholder="+94 xxx xxx xxx" className="w-full bg-transparent outline-none text-sm font-semibold text-white placeholder:text-white/30" /></Field>
                  <Field label="Country"><input type="text" placeholder="Your country" className="w-full bg-transparent outline-none text-sm font-semibold text-white placeholder:text-white/30" /></Field>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label="Service Type">
                    <select className="w-full bg-transparent outline-none text-sm font-semibold text-white/80 cursor-pointer">
                      <option value="" className="bg-[#0f172a]">Select a service</option>
                      {["Tour Package","Airport Transfer","Rent A Car","Hotel Reservation","Visa Assistance","Custom Trip Planning"].map(s => <option key={s} className="bg-[#0f172a]">{s}</option>)}
                    </select>
                  </Field>
                  <Field label="Destination">
                    <select className="w-full bg-transparent outline-none text-sm font-semibold text-white/80 cursor-pointer">
                      <option value="" className="bg-[#0f172a]">Select destination</option>
                      {["Colombo","Galle","Kandy","Nuwara Eliya","Ella","Jaffna","Mirissa / South Coast","Multiple Destinations","Custom"].map(d => <option key={d} className="bg-[#0f172a]">{d}</option>)}
                    </select>
                  </Field>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label="Travel Date"><input type="date" className="w-full bg-transparent outline-none text-sm font-semibold text-white/80 cursor-pointer" /></Field>
                  <Field label="Number of Travelers">
                    <select className="w-full bg-transparent outline-none text-sm font-semibold text-white/80 cursor-pointer">
                      <option className="bg-[#0f172a]">Select</option>
                      {["1 Person","2 People","3–5 People","6–10 People","11–20 People","20+ People"].map(t => <option key={t} className="bg-[#0f172a]">{t}</option>)}
                    </select>
                  </Field>
                </div>
                <Field label="Message / Special Requirements">
                  <textarea rows={4} placeholder="Tell us about your ideal Sri Lanka experience..." className="w-full bg-transparent outline-none text-sm font-semibold text-white placeholder:text-white/30 resize-none" />
                </Field>
                <button type="submit" disabled={status === "sending"}
                  className="h-14 rounded-2xl bg-gold hover:bg-gold-deep text-[#0f172a] font-black text-sm transition-all disabled:opacity-60">
                  {status === "sending" ? "Sending…" : "Send Inquiry →"}
                </button>
                <p className="text-white/30 text-xs text-center">🔒 Your information is safe and only used for travel planning.</p>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Map */}
      <section className="bg-[#020617] pb-16 px-5">
        <div className="w-[min(1120px,100%)] mx-auto">
          <div className="rounded-[24px] overflow-hidden h-[360px]">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126743.58585413232!2d79.77129!3d6.9218374!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae253d10f7a7003%3A0x320b2e4d32d3838d!2sColombo%2C%20Sri%20Lanka!5e0!3m2!1sen!2slk!4v1700000000000!5m2!1sen!2slk"
              width="100%" height="360" style={{ border: 0 }} allowFullScreen loading="lazy"
              referrerPolicy="no-referrer-when-downgrade" title="PearlTrailLankaTours Location"
            />
          </div>
        </div>
      </section>

      <Footer />
      <WhatsAppFloat />
    </>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="bg-white/[.06] border border-white/[.09] rounded-[14px] px-4 py-3 focus-within:border-gold/50 transition-colors">
      <p className="text-[10px] font-black uppercase tracking-widest text-white/35 mb-1.5">{label}</p>
      {children}
    </div>
  );
}
