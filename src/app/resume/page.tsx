"use client";

import { resume } from "@/data/resume";

// "/resume" — printable resume. "Download PDF" calls /api/resume-pdf.
export default function ResumePage() {
  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="orb absolute -right-20 -top-20 h-72 w-72 rounded-full bg-blue-500/15 blur-3xl" />
        <div className="absolute inset-0 bg-grid [mask-image:radial-gradient(70%_60%_at_50%_20%,#000,transparent)]" />
      </div>

      <div className="mx-auto max-w-3xl px-6 py-20">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="flex items-center gap-3 text-4xl font-bold tracking-tight sm:text-5xl">
              <span className="text-3xl">📄</span>
              <span className="text-gradient">{resume.name}</span>
            </h1>
            <p className="mt-1 text-lg text-zinc-600">{resume.title}</p>
          </div>
          <a href="/api/resume-pdf" className="btn-primary">
            Download PDF ↓
          </a>
        </div>

        <div className="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-sm text-zinc-500">
          <span>{resume.contact.email}</span>
          <a href={resume.contact.github} className="hover:text-blue-600" target="_blank" rel="noopener noreferrer">GitHub</a>
          <a href={resume.contact.linkedin} className="hover:text-blue-600" target="_blank" rel="noopener noreferrer">LinkedIn</a>
        </div>

        <p className="mt-8 text-zinc-600">{resume.summary}</p>

        <h2 className="mt-10 text-xl font-semibold text-zinc-900">Experience</h2>
        <div className="mt-4 flex flex-col gap-6">
          {resume.experience.map((job) => (
            <div key={job.role + job.company}>
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="font-semibold text-zinc-900">
                  {job.role} · <span className="text-zinc-500">{job.company}</span>
                </h3>
                <span className="text-sm text-zinc-400">{job.period}</span>
              </div>
              <ul className="mt-2 list-disc pl-5 text-sm text-zinc-600">
                {job.points.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <h2 className="mt-10 text-xl font-semibold text-zinc-900">Education</h2>
        <div className="mt-4 flex flex-col gap-3">
          {resume.education.map((e) => (
            <div key={e.degree}>
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="font-semibold text-zinc-900">{e.degree}</h3>
                <span className="text-sm text-zinc-400">{e.period}</span>
              </div>
              <p className="text-sm text-zinc-500">{e.school}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
