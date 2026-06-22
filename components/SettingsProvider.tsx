"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { DEFAULT_SETTINGS, mergeSettings, type SiteSettings } from "@/lib/site-config";
import { supabase } from "@/lib/supabase";

const Ctx = createContext<SiteSettings>(DEFAULT_SETTINGS);

/** Read the current contact/social settings anywhere in a client component. */
export const useSettings = () => useContext(Ctx);

export default function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);

  useEffect(() => {
    if (!supabase) return;
    let cancelled = false;
    supabase
      .from("settings")
      .select("*")
      .eq("id", "main")
      .maybeSingle()
      .then(({ data }) => {
        if (!cancelled && data) setSettings(mergeSettings(data));
      });
    return () => { cancelled = true; };
  }, []);

  return <Ctx.Provider value={settings}>{children}</Ctx.Provider>;
}
