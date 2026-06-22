import { getSettings } from "@/lib/settings-store";
import { saveSettings } from "../actions";
import LogoutButton from "@/components/admin/LogoutButton";
import AdminTabs from "@/components/admin/AdminTabs";

export const dynamic = "force-dynamic";

const field = "w-full bg-white/[.03] border border-white/[.12] rounded-xl px-3.5 py-2.5 text-white text-sm outline-none transition-colors focus:border-gold/70 focus:bg-white/[.05] placeholder:text-white/25";
const labelCls = "block text-white/55 text-[11px] font-bold uppercase tracking-[.12em] mb-1.5";
const card = "rounded-2xl border border-white/[.08] bg-white/[.02] p-5 md:p-6";

export default async function AdminSettings() {
  const s = await getSettings();

  return (
    <main className="min-h-screen px-5 py-8" style={{ background: "#020617" }}>
      <div className="w-[min(820px,100%)] mx-auto">
        <AdminTabs active="/admin/settings" />

        <div className="flex items-center justify-between mb-7">
          <div>
            <h1 className="text-white font-black text-2xl">Contact &amp; Social Links</h1>
            <p className="text-white/45 text-sm">These appear across the whole site — header, footer, contact page and every booking button.</p>
          </div>
          <LogoutButton />
        </div>

        <form action={saveSettings} className="flex flex-col gap-5">
          <section className={card}>
            <h2 className="text-white font-black text-[15px] mb-4">Contact details</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>WhatsApp number <span className="text-white/30 normal-case tracking-normal">· digits only</span></label>
                <input name="whatsapp" defaultValue={s.whatsapp} placeholder="94717179956" className={field} />
              </div>
              <div>
                <label className={labelCls}>Phone (call) <span className="text-white/30 normal-case tracking-normal">· shown + dialled</span></label>
                <input name="phone" defaultValue={s.phone} placeholder="+94 71 717 9956" className={field} />
              </div>
              <div>
                <label className={labelCls}>Telegram <span className="text-white/30 normal-case tracking-normal">· username or phone</span></label>
                <input name="telegram" defaultValue={s.telegram} placeholder="+94717179956" className={field} />
              </div>
              <div>
                <label className={labelCls}>Email</label>
                <input name="email" type="email" defaultValue={s.email} placeholder="hello@example.com" className={field} />
              </div>
              <div className="sm:col-span-2">
                <label className={labelCls}>Address</label>
                <input name="address" defaultValue={s.address} placeholder="Colombo, Sri Lanka" className={field} />
              </div>
            </div>
          </section>

          <section className={card}>
            <h2 className="text-white font-black text-[15px] mb-1">Social links</h2>
            <p className="text-white/40 text-xs mb-4">Full URLs. Leave a field blank to hide that icon everywhere.</p>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Facebook</label>
                <input name="facebook" type="url" defaultValue={s.facebook} placeholder="https://facebook.com/…" className={field} />
              </div>
              <div>
                <label className={labelCls}>Instagram</label>
                <input name="instagram" type="url" defaultValue={s.instagram} placeholder="https://instagram.com/…" className={field} />
              </div>
              <div>
                <label className={labelCls}>TikTok</label>
                <input name="tiktok" type="url" defaultValue={s.tiktok} placeholder="https://tiktok.com/@…" className={field} />
              </div>
              <div>
                <label className={labelCls}>YouTube</label>
                <input name="youtube" type="url" defaultValue={s.youtube} placeholder="https://youtube.com/@…" className={field} />
              </div>
            </div>
          </section>

          <div className="flex gap-3">
            <button type="submit" className="bg-gold hover:bg-gold-deep text-[#0f172a] font-black text-sm px-7 py-3 rounded-full transition-colors">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
