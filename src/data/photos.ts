// Photography captions. Keyed by the object's FILENAME (the part after
// "photos/"). The actual image URLs are fetched at runtime from /api/photos
// (presigned from your private Hostinger bucket). Edit the captions here.
//
// Any photo in the bucket without an entry here falls back to its filename
// as the alt text, so the gallery still works even if you forget to add one.

export type PhotoMeta = {
  alt: string; // accessible description (required by good practice)
  title?: string; // optional caption shown on hover + lightbox
  location?: string; // optional, e.g. "Reykjavík, Iceland"
};

export const photoMeta: Record<string, PhotoMeta> = {
  "DSC07343.JPG": {
    alt: "A frame from the photography collection",
    title: "DSC07343",
    location: "Add location",
  },
  "DSC07344.JPG": {
    alt: "A frame from the photography collection",
    title: "DSC07344",
    location: "Add location",
  },
  "DSC07659.JPG": {
    alt: "A frame from the photography collection",
    title: "DSC07659",
    location: "Add location",
  },
  "DSC08068.JPG": {
    alt: "A frame from the photography collection",
    title: "DSC08068",
    location: "Add location",
  },
};

// Look up caption metadata for a storage key like "photos/DSC07956.JPG".
export function metaFor(key: string): PhotoMeta {
  const basename = key.split("/").pop() ?? key;
  return photoMeta[basename] ?? { alt: basename };
}
