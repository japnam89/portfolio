"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { metaFor } from "@/data/photos";

type Photo = { key: string; src: string };

// Client component: fetches presigned URLs from /api/photos, renders a
// responsive grid with always-visible captions, and a click-to-zoom lightbox
// showing the full metadata. Presigned URLs are short-lived, so it silently
// re-fetches before they expire and on any load error.
export default function PhotoGallery() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [active, setActive] = useState<Photo | null>(null);
  const [failed, setFailed] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/photos", { cache: "no-store" });
      if (!res.ok) throw new Error(`status ${res.status}`);
      const data = (await res.json()) as { photos?: Photo[] };
      setPhotos(data.photos ?? []);
      setError(null);
    } catch {
      setError("Couldn't load photos from storage right now.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, [load]);

  // Keep presigned URLs fresh (re-fetch every 50 min, well under the 1h expiry).
  useEffect(() => {
    const id = setInterval(load, 50 * 60 * 1000);
    return () => clearInterval(id);
  }, [load]);

  // Close the lightbox with Escape.
  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActive(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active]);

  const onImgError = (key: string) => {
    setFailed((prev) => ({ ...prev, [key]: true }));
    load(); // a fresh presigned URL may have expired — refetch the list
  };

  if (loading) return <p className="text-zinc-500">Loading photos…</p>;
  if (error) return <p className="text-red-600">{error}</p>;
  if (photos.length === 0)
    return (
      <p className="rounded-xl border border-dashed border-zinc-300 bg-white/60 px-6 py-12 text-center text-zinc-500 backdrop-blur">
        Photos are being curated — check back soon. 📷
      </p>
    );

  return (
    <>
      <p className="mb-6 text-sm text-zinc-500">
        {photos.length} {photos.length === 1 ? "photo" : "photos"} · click any
        frame to view it full size with details.
      </p>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {photos.map((photo) => {
          const meta = metaFor(photo.key);
          const sub = [meta.location, meta.date].filter(Boolean).join(" · ");
          return (
            <button
              key={photo.key}
              type="button"
              onClick={() => setActive(photo)}
              aria-label={meta.alt}
              className="group flex flex-col overflow-hidden rounded-2xl bg-white text-left shadow-sm ring-1 ring-zinc-200/70 transition hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-zinc-100">
                {failed[photo.key] ? (
                  <div className="flex h-full w-full items-center justify-center p-4 text-center text-xs text-zinc-400">
                    {meta.alt}
                  </div>
                ) : (
                  <Image
                    src={photo.src}
                    alt={meta.alt}
                    fill
                    unoptimized
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    onError={() => onImgError(photo.key)}
                  />
                )}
              </div>

              <div className="flex flex-col gap-0.5 px-4 py-3">
                <p className="text-sm font-semibold leading-tight text-zinc-900">
                  {meta.title ?? meta.alt}
                </p>
                {sub && (
                  <p className="text-xs leading-tight text-zinc-500">{sub}</p>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {active && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={metaFor(active.key).alt}
          onClick={() => setActive(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
        >
          <button
            type="button"
            onClick={() => setActive(null)}
            aria-label="Close"
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-2xl leading-none text-white transition hover:bg-white/20"
          >
            ×
          </button>

          <figure
            className="flex max-h-[92vh] max-w-[92vw] flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={active.src}
              alt={metaFor(active.key).alt}
              className="max-h-[72vh] max-w-[92vw] rounded-lg object-contain"
            />
            <figcaption className="mt-4 w-full max-w-2xl text-center">
              {metaFor(active.key).title && (
                <p className="text-base font-semibold text-white">
                  {metaFor(active.key).title}
                </p>
              )}
              {[metaFor(active.key).location, metaFor(active.key).date]
                .filter(Boolean)
                .join(" · ") && (
                <p className="mt-0.5 text-sm text-zinc-300">
                  {[metaFor(active.key).location, metaFor(active.key).date]
                    .filter(Boolean)
                    .join(" · ")}
                </p>
              )}
              {metaFor(active.key).description && (
                <p className="mx-auto mt-2 max-w-prose text-sm leading-relaxed text-zinc-400">
                  {metaFor(active.key).description}
                </p>
              )}
            </figcaption>
          </figure>
        </div>
      )}
    </>
  );
}
