import type { Metadata } from "next";
import StoryModel from "@/components/StoryModel";

export const metadata: Metadata = {
  title: "The Story of Ceylon — 3,500 Years of Sri Lanka | PearlTrailLankaTours",
  description:
    "An illuminated chronicle of Sri Lanka — open the codex and journey through three and a half thousand years of history, from the first kingdoms to the island of today.",
};

export default function ModelPage() {
  return <StoryModel />;
}
