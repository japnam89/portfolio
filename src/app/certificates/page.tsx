import Image from "next/image";
import { certificates, LINKEDIN_CERTS_URL } from "@/data/certificates";

// "/certificates". Renders a responsive grid of picture tiles, ordered
// ascending by year (data is already sorted). Each tile shows the badge art
// (when available), name, issuer, year, and a verify link.
export default function Certificates() {
  return (
    <section className="mx-auto max-w-5xl px-6 py-20">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Certifications
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-zinc-600">
          Professional certifications and credentials I&apos;ve earned along the
          way — from foundational Azure to AI Engineering.
        </p>
      </div>

      <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {certificates.map((cert) => (
          <article
            key={cert.name}
            className="group flex flex-col overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl"
          >
            <div className="flex items-center justify-center bg-gradient-to-br from-sky-50 via-indigo-50 to-slate-100 p-8">
              {cert.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={cert.image}
                  alt={`${cert.name} badge`}
                  className="h-32 w-32 object-contain drop-shadow-md transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />
              ) : (
                <div className="flex h-32 w-32 items-center justify-center rounded-2xl bg-white/70 text-3xl font-black text-indigo-500 shadow-inner">
                  {cert.issuer.slice(0, 1)}
                </div>
              )}
            </div>

            <div className="flex flex-1 flex-col gap-3 p-6">
              <div>
                <h2 className="text-lg font-semibold leading-snug text-zinc-900">
                  {cert.name}
                </h2>
                <p className="mt-1 text-sm text-zinc-500">
                  {cert.issuer}
                  {cert.year ? ` · ${cert.year}` : ""}
                </p>
              </div>

              <div className="mt-auto flex items-center gap-4 pt-2">
                {cert.link ? (
                  <a
                    href={cert.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium text-blue-600 hover:underline"
                  >
                    Verify ↗
                  </a>
                ) : (
                  <a
                    href={LINKEDIN_CERTS_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium text-blue-600 hover:underline"
                  >
                    LinkedIn ↗
                  </a>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
