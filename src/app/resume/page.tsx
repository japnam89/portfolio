"use client";

import { resume } from "@/data/resume";

// "/resume" — a printable resume page. The "Download PDF" button calls the
// server route /api/resume-pdf which generates the PDF from the same data.
export default function ResumePage() {
  return (
    <section className="mx-auto max-w-3xl px-6 py-20">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">{resume.name}</h1>
          <p className="mt-1 text-lg text-blue-600">{resume.title}</p>
        </div>
        <a
          href="/api/resume-pdf"
          className="rounded-full bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-500"
        >
          Download PDF ↓
        </a>
      </div>

      <div className="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-sm text-zinc-500">
        <span>{resume.contact.email}</span>
        <a href={resume.contact.github} className="hover:text-blue-600" target="_blank" rel="noopener noreferrer">GitHub</a>
        <a href={resume.contact.linkedin} className="hover:text-blue-600" target="_blank" rel="noopener noreferrer">LinkedIn</a>
      </div>

      <p className="mt-8 text-zinc-600">{resume.summary}</p>

      <h2 className="mt-10 text-xl font-semibold">Experience</h2>
      <div className="mt-4 flex flex-col gap-6">
        {resume.experience.map((job) => (
          <div key={job.role + job.company}>
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h3 className="font-semibold">
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

      <h2 className="mt-10 text-xl font-semibold">Education</h2>
      <div className="mt-4 flex flex-col gap-3">
        {resume.education.map((e) => (
          <div key={e.degree}>
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h3 className="font-semibold">{e.degree}</h3>
              <span className="text-sm text-zinc-400">{e.period}</span>
            </div>
            <p className="text-sm text-zinc-500">{e.school}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
