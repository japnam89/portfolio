// Photography captions. Keyed by the object's FILENAME (the part after
// "photos/"). The actual image URLs are fetched at runtime from /api/photos
// (presigned from your private Hostinger bucket). Edit the captions here.
//
// Any photo in the bucket without an entry here falls back to its filename
// as the alt text, so the gallery still works even if you forget to add one.

export type PhotoMeta = {
  alt: string; // accessible description (required by good practice)
  title?: string; // optional caption shown on the card + lightbox
  location?: string; // optional, e.g. "Reykjavík, Iceland"
  date?: string; // optional, e.g. "June 2024" or "2024-06"
  description?: string; // optional longer note shown in the lightbox
};

export const photoMeta: Record<string, PhotoMeta> = {
  "DSC07343.JPG": {
    alt: "Coastal Light — a frame from the photography collection",
    title: "Coastal Light",
    location: "TBD",
    date: "TBD",
    description:
      "Soft light along the coastline at the edge of the day — one of the quieter frames from the collection.",
  },
  "DSC07344.JPG": {
    alt: "City Lines — a frame from the photography collection",
    title: "City Lines",
    location: "TBD",
    date: "TBD",
    description:
      "Leading lines and geometry of the city, captured where architecture meets the sky.",
  },
  "DSC07659.JPG": {
    alt: "Quiet Street — a frame from the photography collection",
    title: "Quiet Street",
    location: "TBD",
    date: "TBD",
    description:
      "An empty street between buildings — the calm before the everyday bustle returns.",
  },
  "DSC08068.JPG": {
    alt: "Evening Calm — a frame from the photography collection",
    title: "Evening Calm",
    location: "TBD",
    date: "TBD",
    description:
      "The day winding down — a still, unhurried moment as the light fades.",
  },
};

// Look up caption metadata for a storage key like "photos/DSC07956.JPG".
export function metaFor(key: string): PhotoMeta {
  const basename = key.split("/").pop() ?? key;
  return photoMeta[basename] ?? { alt: basename };
}
