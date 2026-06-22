// Editable site-wide contact + social settings. Defaults below are the current
// live values; the admin can override any of them (stored in the `settings`
// table). Components read them via getSettings() (server) or useSettings()
// (client) so changing a number/email/link updates the whole site.

export interface SiteSettings {
  whatsapp: string;  // digits only, used for wa.me links — e.g. "94717179956"
  phone: string;     // display + tel: link — e.g. "+94 71 717 9956"
  telegram: string;  // username or phone for t.me — e.g. "+94717179956"
  email: string;
  address: string;
  facebook: string;  // full URL (blank = hidden)
  instagram: string;
  tiktok: string;
  youtube: string;
}

export const DEFAULT_SETTINGS: SiteSettings = {
  whatsapp: "94717179956",
  phone: "+94 71 717 9956",
  telegram: "+94717179956",
  email: "pearltraillankatours@gmail.com",
  address: "Colombo, Sri Lanka",
  facebook: "https://facebook.com/pearltraillankatours",
  instagram: "https://instagram.com/pearltraillankatours",
  tiktok: "https://tiktok.com/@pearltraillankatours",
  youtube: "https://youtube.com/@pearltraillankatours",
};

// Essentials fall back to the default when left blank (so links never break).
// Socials/telegram are used literally — blank means "hide this link".
const FALLBACK_KEYS: (keyof SiteSettings)[] = ["whatsapp", "phone", "email", "address"];

type SettingsRow = Partial<Record<keyof SiteSettings, string | null>> | null | undefined;

/** Merge a DB row over the defaults. No row → defaults. */
export function mergeSettings(row: SettingsRow): SiteSettings {
  if (!row) return { ...DEFAULT_SETTINGS };
  const out = {} as SiteSettings;
  (Object.keys(DEFAULT_SETTINGS) as (keyof SiteSettings)[]).forEach((k) => {
    const v = typeof row[k] === "string" ? (row[k] as string).trim() : "";
    out[k] = v || (FALLBACK_KEYS.includes(k) ? DEFAULT_SETTINGS[k] : "");
  });
  return out;
}

// ── Link helpers ───────────────────────────────────────────────────
const digits = (v: string) => v.replace(/\D/g, "");

export const waHref = (s: SiteSettings, text?: string) =>
  `https://wa.me/${digits(s.whatsapp)}${text ? `?text=${encodeURIComponent(text)}` : ""}`;

export const telHref = (s: SiteSettings) => `tel:${s.phone.replace(/[^\d+]/g, "")}`;

export const tgHref = (s: SiteSettings) => {
  const h = s.telegram.trim();
  if (!h) return "";
  return h.startsWith("http") ? h : `https://t.me/${h.replace(/^@/, "")}`;
};

export const mailHref = (s: SiteSettings) => `mailto:${s.email}`;

/** Social links as an ordered, blank-filtered list. */
export const socialLinks = (s: SiteSettings) =>
  ([
    { key: "facebook", label: "Facebook", short: "FB", href: s.facebook },
    { key: "instagram", label: "Instagram", short: "IG", href: s.instagram },
    { key: "tiktok", label: "TikTok", short: "TT", href: s.tiktok },
    { key: "youtube", label: "YouTube", short: "YT", href: s.youtube },
  ] as const).filter((x) => x.href && x.href.trim() !== "");
