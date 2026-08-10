import type { Metadata } from "next";
import SocialLinks from "@/components/SocialLinks";

export const metadata: Metadata = {
  title: "Social — Japnam Singh",
  description: "Find Japnam Singh on X, GitHub, LinkedIn, and email.",
};

export default function Social() {
  return (
    <section className="mx-auto max-w-3xl px-6 py-20">
      <h1 className="text-4xl font-bold tracking-tight">
        <span className="text-gradient">Social</span>
      </h1>
      <p className="mt-4 text-lg text-zinc-600">
        Connect with me across the web.
      </p>

      <div className="mt-10">
        <SocialLinks variant="cards" />
      </div>

      <p className="mt-10 text-sm text-zinc-400">
        Prefer email?{" "}
        <a
          href="mailto:hello@japnam.tech"
          className="text-zinc-600 underline hover:text-blue-600"
        >
          Get in touch
        </a>
        .
      </p>
    </section>
  );
}
