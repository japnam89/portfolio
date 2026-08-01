import { skills } from "@/data/projects";

// This file lives in `app/about/page.tsx`, so its URL is "/about".
// Next.js turns folders into URL segments automatically.
export default function About() {
  return (
    <section className="mx-auto max-w-3xl px-6 py-20">
      <h1 className="text-4xl font-bold tracking-tight">About me</h1>
      <p className="mt-6 text-lg leading-8 text-zinc-600">
        I&apos;m Japnam Singh, a <strong>Staff Engineer</strong> and{" "}
        <strong>Azure Architect</strong> with over 10 years of software
        engineering experience. I design and lead resilient cloud platforms on
        Azure, set technical direction for platform teams, and stay hands-on with
        code. This portfolio — including its Node.js contact API — is something I
        built myself while exploring modern web tooling.
      </p>

      <h2 className="mt-12 text-2xl font-semibold">What I work with</h2>
      <ul className="mt-4 flex flex-wrap gap-3">
        {skills.map((skill) => (
          <li
            key={skill}
            className="rounded-full bg-zinc-100 px-4 py-2 text-sm font-medium text-zinc-700"
          >
            {skill}
          </li>
        ))}
      </ul>
    </section>
  );
}
