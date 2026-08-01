import type { Metadata } from "next";
import PhotoGallery from "@/components/PhotoGallery";

export const metadata: Metadata = {
  title: "Photography — Japnam Singh",
  description:
    "A selection of photography by Japnam Singh — frames from travels and everywhere in between.",
};

// "/photography". Photos are fetched at runtime (presigned from your private
// Hostinger bucket) by the PhotoGallery client component.
export default function Photography() {
  return (
    <section className="mx-auto max-w-5xl px-6 py-20">
      <h1 className="text-4xl font-bold tracking-tight">Photography</h1>
      <p className="mt-4 text-lg text-zinc-600">
        A few frames from travels and everywhere in between. Click any photo to
        view it full size.
      </p>

      <div className="mt-10">
        <PhotoGallery />
      </div>
    </section>
  );
}
