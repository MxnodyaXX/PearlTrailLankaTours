"use client";

import { useRouter } from "next/navigation";
import { createSupabaseBrowser } from "@/lib/supabase/browser";

export default function LogoutButton() {
  const router = useRouter();
  async function logout() {
    const supabase = createSupabaseBrowser();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }
  return (
    <button
      onClick={logout}
      className="bg-white/[.06] hover:bg-white/[.12] border border-white/10 text-white/80 font-bold text-xs px-4 py-2 rounded-full transition-colors"
    >
      Log out
    </button>
  );
}
