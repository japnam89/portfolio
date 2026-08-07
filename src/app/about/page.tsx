import Image from "next/image";
import { skills } from "@/data/projects";

// "/about". Shows the AI-generated Azure Architect portrait + bio + skills.
export default function About() {
  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="orb absolute -left-24 -top-24 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl" />
        <div className="orb absolute -right-16 top-10 h-80 w-80 rounded-full bg-fuchsia-500/20 blur-3xl" style={{ animationDelay: "1.5s" }} />
        <div className="absolute inset-0 bg-grid [mask-image:radial-gradient(70%_60%_at_50%_30%,#000,transparent)]" />
      </div>

      <div className="mx-auto grid max-w-5xl items-start gap-10 px-6 py-20 lg:grid-cols-[320px_1fr]">
        {/* Portrait — single AI-generated Azure Architect photo */}
        <div className="stagger">
          <div className="relative aspect-[4/5] overflow-hidden rounded-3xl border border-white/60 shadow-2xl">
            <Image
              src="/azure-architect-1.jpg"
              alt="Japnam Singh as a Certified Azure Architect"
              fill
              priority
              sizes="(max-width: 1024px) 90vw, 320px"
              className="object-cover"
            />
          </div>
        </div>

        {/* Bio */}
        <div className="stagger">
          <p className="text-sm font-semibold uppercase tracking-widest text-blue-500">
            About me
          </p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
            <span className="text-gradient">Japnam Singh</span>
          </h1>
          <p className="mt-6 text-lg leading-8 text-zinc-600">
            I&apos;m a <strong className="text-zinc-900">Staff Engineer</strong>{" "}
            and <strong className="text-zinc-900">Azure Architect</strong> with
            over 10 years of software engineering experience. I design and lead
            resilient cloud platforms on Azure, set technical direction for
            platform teams, and stay hands-on with code. This portfolio —
            including its Node.js contact API — is something I built myself while
            exploring modern web tooling.
          </p>

          <h2 className="mt-12 text-2xl font-semibold">What I work with</h2>
          <ul className="mt-4 flex flex-wrap gap-3">
            {skills.map((skill) => (
              <li
                key={skill}
                className="rounded-full border border-zinc-200 bg-white/60 px-4 py-2 text-sm font-medium text-zinc-700 backdrop-blur"
              >
                {skill}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
