import { projects } from "@/data/projects";

// "/projects". This page maps over the `projects` array from our data file
// and renders a card for each one. Add a project in projects.ts and it shows
// up here automatically — that's the "data-driven" idea.
export default function Projects() {
  return (
    <section className="mx-auto max-w-5xl px-6 py-20">
      <h1 className="text-4xl font-bold tracking-tight">Projects</h1>
      <p className="mt-4 text-lg text-zinc-600">
        Things I&apos;ve built while learning. Each one taught me something new.
      </p>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <article
            key={project.title}
            className="group flex flex-col rounded-2xl border border-zinc-200 p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
          >
            <h2 className="text-xl font-semibold">{project.title}</h2>
            <p className="mt-2 flex-1 text-sm leading-6 text-zinc-600">
              {project.description}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700"
                >
                  {tag}
                </span>
              ))}
            </div>
            {project.link && (
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 text-sm font-medium text-blue-600 hover:underline"
              >
                View →
              </a>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}
