import type { Metadata } from "next";
import SocialLinks from "@/components/SocialLinks";
import LocalizedText from "@/components/LocalizedText";

export const metadata: Metadata = {
  title: "Social — Japnam Singh",
  description: "Find Japnam Singh on X, GitHub, LinkedIn, and email.",
};

export default function Social() {
  return (
    <section className="mx-auto max-w-3xl px-6 py-20">
      <h1 className="flex items-center gap-3 text-4xl font-bold tracking-tight">
        <span className="text-3xl">🔗</span>
        <span className="text-gradient">
          <LocalizedText text="Social" />
        </span>
      </h1>
      <p className="mt-4 text-lg text-zinc-600">
        <LocalizedText text="Connect with me across the web." />
      </p>

      <div className="mt-10">
        <SocialLinks variant="cards" />
      </div>

      <p className="mt-10 text-sm text-zinc-400">
        <LocalizedText text="Prefer email?" />{" "}
        <a
          href="mailto:info@japnam.com"
          className="text-zinc-600 underline hover:text-blue-600"
        >
          <LocalizedText text="Get in touch" />
        </a>
        .
      </p>
    </section>
  );
}
