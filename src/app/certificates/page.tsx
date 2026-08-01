import { certificates } from "@/data/certificates";

// "/certificates". Reads the certificate list from src/data/certificates.ts.
export default function Certificates() {
  return (
    <section className="mx-auto max-w-3xl px-6 py-20">
      <h1 className="text-4xl font-bold tracking-tight">Certifications</h1>
      <p className="mt-4 text-lg text-zinc-600">
        Professional certifications I&apos;ve earned along the way.
      </p>

      <ul className="mt-10 flex flex-col gap-4">
        {certificates.map((cert) => (
          <li
            key={cert.name}
            className="flex flex-col gap-1 rounded-2xl border border-zinc-200 p-6 transition-shadow hover:shadow-lg sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <h2 className="text-lg font-semibold">{cert.name}</h2>
              <p className="text-sm text-zinc-500">
                {cert.issuer}
                {cert.year ? ` · ${cert.year}` : ""}
              </p>
            </div>
            {cert.link && (
              <a
                href={cert.link}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 shrink-0 text-sm font-medium text-blue-600 hover:underline sm:mt-0"
              >
                Verify ↗
              </a>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
