import { projects } from "@/data/projects";

// "/projects". Maps over the `projects` array and renders a card per entry.
export default function Projects() {
  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="orb absolute -left-24 -top-24 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl" />
        <div className="orb absolute -right-16 top-10 h-80 w-80 rounded-full bg-fuchsia-500/20 blur-3xl" style={{ animationDelay: "1.5s" }} />
        <div className="absolute inset-0 bg-grid [mask-image:radial-gradient(70%_60%_at_50%_30%,#000,transparent)]" />
      </div>

      <div className="mx-auto max-w-5xl px-6 py-20">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          <span className="text-gradient">Projects</span>
        </h1>
        <p className="mt-4 text-lg text-zinc-600">
          Things I&apos;ve built while learning. Each one taught me something new.
        </p>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <article
              key={project.title}
              className="group flex flex-col rounded-2xl border border-white/60 bg-white/70 p-6 shadow-sm backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl"
            >
              <h2 className="text-xl font-semibold text-zinc-900">{project.title}</h2>
              <p className="mt-2 flex-1 text-sm leading-6 text-zinc-600">
                {project.description}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-md bg-gradient-to-r from-blue-50 to-indigo-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-blue-100"
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
      </div>
    </section>
  );
}
