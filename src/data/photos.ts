// Photography captions. Keyed by the object's FILENAME (the part after
// "photos/"). The actual image URLs are fetched at runtime from /api/photos
// (presigned from your private object-storage bucket). Edit the captions here.
//
// Any photo in the bucket without an entry here falls back to its filename
// as the alt text, so the gallery still works even if you forget to add one.

import type { PhotoCaptionTranslations } from "@/lib/content-types";

export type PhotoMeta = {
  alt: string; // accessible description (required by good practice)
  title?: string; // optional caption shown on the card + lightbox
  location?: string; // optional, e.g. "Reykjavík, Iceland"
  date?: string; // optional, e.g. "June 2024" or "2024-06"
  description?: string; // optional longer note shown in the lightbox
  translations?: PhotoCaptionTranslations;
};

export const photoMeta: Record<string, PhotoMeta> = {
  "DSC07343.JPG": {
    alt: "Coastal Light — a frame from the photography collection",
    title: "Coastal Light",
    location: "TBD",
    date: "TBD",
    description:
      "Soft light along the coastline at the edge of the day — one of the quieter frames from the collection.",
    translations: {
      hi: {
        alt: "समुद्रतट की रोशनी — फ़ोटो संग्रह का एक दृश्य",
        title: "तटीय रोशनी",
        location: "निर्धारित होना बाकी",
        date: "निर्धारित होना बाकी",
        description:
          "दिन ढलने के समय समुद्रतट पर पड़ती नरम रोशनी — संग्रह के शांत दृश्यों में से एक।",
      },
      pa: {
        alt: "ਸਮੁੰਦਰੀ ਰੌਸ਼ਨੀ — ਫੋਟੋਗ੍ਰਾਫੀ ਸੰਗ੍ਰਹਿ ਦਾ ਇੱਕ ਦ੍ਰਿਸ਼",
        title: "ਤੱਟੀ ਰੌਸ਼ਨੀ",
        location: "ਹਾਲੇ ਤੈਅ ਨਹੀਂ",
        date: "ਹਾਲੇ ਤੈਅ ਨਹੀਂ",
        description:
          "ਦਿਨ ਦੇ ਅੰਤ ਵੇਲੇ ਸਮੁੰਦਰੀ ਕੰਢੇ ਉੱਤੇ ਪੈਂਦੀ ਨਰਮ ਰੌਸ਼ਨੀ — ਸੰਗ੍ਰਹਿ ਦੇ ਸ਼ਾਂਤ ਦ੍ਰਿਸ਼ਾਂ ਵਿੱਚੋਂ ਇੱਕ।",
      },
    },
  },
  "DSC07344.JPG": {
    alt: "City Lines — a frame from the photography collection",
    title: "City Lines",
    location: "TBD",
    date: "TBD",
    description:
      "Leading lines and geometry of the city, captured where architecture meets the sky.",
    translations: {
      hi: {
        alt: "शहर की रेखाएँ — फ़ोटो संग्रह का एक दृश्य",
        title: "शहर की रेखाएँ",
        location: "निर्धारित होना बाकी",
        date: "निर्धारित होना बाकी",
        description:
          "जहाँ वास्तुकला आसमान से मिलती है, वहाँ शहर की रेखाओं और ज्यामिति को कैमरे में कैद किया गया।",
      },
      pa: {
        alt: "ਸ਼ਹਿਰ ਦੀਆਂ ਰੇਖਾਵਾਂ — ਫੋਟੋਗ੍ਰਾਫੀ ਸੰਗ੍ਰਹਿ ਦਾ ਇੱਕ ਦ੍ਰਿਸ਼",
        title: "ਸ਼ਹਿਰ ਦੀਆਂ ਰੇਖਾਵਾਂ",
        location: "ਹਾਲੇ ਤੈਅ ਨਹੀਂ",
        date: "ਹਾਲੇ ਤੈਅ ਨਹੀਂ",
        description:
          "ਜਿੱਥੇ ਇਮਾਰਤਾਂ ਅਸਮਾਨ ਨਾਲ ਮਿਲਦੀਆਂ ਹਨ, ਉੱਥੇ ਸ਼ਹਿਰ ਦੀਆਂ ਰੇਖਾਵਾਂ ਅਤੇ ਜਿਓਮੈਟਰੀ ਕੈਮਰੇ ਵਿੱਚ ਕੈਦ ਕੀਤੀ।",
      },
    },
  },
  "DSC07659.JPG": {
    alt: "Quiet Street — a frame from the photography collection",
    title: "Quiet Street",
    location: "TBD",
    date: "TBD",
    description:
      "An empty street between buildings — the calm before the everyday bustle returns.",
    translations: {
      hi: {
        alt: "शांत सड़क — फ़ोटो संग्रह का एक दृश्य",
        title: "शांत सड़क",
        location: "निर्धारित होना बाकी",
        date: "निर्धारित होना बाकी",
        description:
          "इमारतों के बीच एक खाली सड़क — रोज़मर्रा की हलचल लौटने से पहले का सुकून।",
      },
      pa: {
        alt: "ਸ਼ਾਂਤ ਗਲੀ — ਫੋਟੋਗ੍ਰਾਫੀ ਸੰਗ੍ਰਹਿ ਦਾ ਇੱਕ ਦ੍ਰਿਸ਼",
        title: "ਸ਼ਾਂਤ ਗਲੀ",
        location: "ਹਾਲੇ ਤੈਅ ਨਹੀਂ",
        date: "ਹਾਲੇ ਤੈਅ ਨਹੀਂ",
        description:
          "ਇਮਾਰਤਾਂ ਵਿਚਕਾਰ ਇੱਕ ਖਾਲੀ ਗਲੀ — ਰੋਜ਼ਾਨਾ ਦੀ ਰੌਣਕ ਮੁੜ ਆਉਣ ਤੋਂ ਪਹਿਲਾਂ ਦੀ ਸ਼ਾਂਤੀ।",
      },
    },
  },
  "DSC08068.JPG": {
    alt: "Evening Calm — a frame from the photography collection",
    title: "Evening Calm",
    location: "TBD",
    date: "TBD",
    description:
      "The day winding down — a still, unhurried moment as the light fades.",
    translations: {
      hi: {
        alt: "शाम का सुकून — फ़ोटो संग्रह का एक दृश्य",
        title: "शाम का सुकून",
        location: "निर्धारित होना बाकी",
        date: "निर्धारित होना बाकी",
        description:
          "दिन के ढलने के साथ रोशनी कम होती है — एक शांत और बेफ़िक्र पल।",
      },
      pa: {
        alt: "ਸ਼ਾਮ ਦੀ ਸ਼ਾਂਤੀ — ਫੋਟੋਗ੍ਰਾਫੀ ਸੰਗ੍ਰਹਿ ਦਾ ਇੱਕ ਦ੍ਰਿਸ਼",
        title: "ਸ਼ਾਮ ਦੀ ਸ਼ਾਂਤੀ",
        location: "ਹਾਲੇ ਤੈਅ ਨਹੀਂ",
        date: "ਹਾਲੇ ਤੈਅ ਨਹੀਂ",
        description:
          "ਦਿਨ ਢਲਦਾ ਹੈ ਅਤੇ ਰੌਸ਼ਨੀ ਘੱਟਦੀ ਜਾਂਦੀ ਹੈ — ਇੱਕ ਸ਼ਾਂਤ ਤੇ ਬੇਫ਼ਿਕਰ ਪਲ।",
      },
    },
  },
  "Amazing Owl at Grouse mountain": {
    alt: "Amazing Owl at Grouse mountain",
    translations: {
      hi: { alt: "ग्राउज़ माउंटेन पर शानदार उल्लू" },
      pa: { alt: "ਗਰਾਊਸ ਮਾਊਂਟੇਨ ਉੱਤੇ ਸ਼ਾਨਦਾਰ ਉੱਲੂ" },
    },
  },
  "DSC07466.JPG": {
    alt: "DSC07466.JPG",
    translations: {
      hi: { alt: "तस्वीर DSC07466.JPG" },
      pa: { alt: "ਫੋਟੋ DSC07466.JPG" },
    },
  },
  "DSC07660.JPG": {
    alt: "DSC07660.JPG",
    translations: {
      hi: { alt: "तस्वीर DSC07660.JPG" },
      pa: { alt: "ਫੋਟੋ DSC07660.JPG" },
    },
  },
  "DSC09559.JPG": {
    alt: "DSC09559.JPG",
    translations: {
      hi: { alt: "तस्वीर DSC09559.JPG" },
      pa: { alt: "ਫੋਟੋ DSC09559.JPG" },
    },
  },
  "Vancouver Harbour Air": {
    alt: "Vancouver Harbour Air",
    translations: {
      hi: { alt: "वैंकूवर हार्बर एयर" },
      pa: { alt: "ਵੈਨਕੂਵਰ ਹਾਰਬਰ ਏਅਰ" },
    },
  },
  "peacock somewhere in vancouver": {
    alt: "peacock somewhere in vancouver",
    translations: {
      hi: { alt: "वैंकूवर में कहीं एक मोर" },
      pa: { alt: "ਵੈਨਕੂਵਰ ਵਿੱਚ ਕਿਤੇ ਇੱਕ ਮੋਰ" },
    },
  },
  "peak chairlift": {
    alt: "peak chairlift",
    translations: {
      hi: { alt: "पीक चेयरलिफ्ट" },
      pa: { alt: "ਪੀਕ ਚੇਅਰਲਿਫਟ" },
    },
  },
};

// Look up caption metadata for a storage key like "photos/DSC07956.JPG".
export function metaFor(key: string): PhotoMeta {
  const basename = key.split("/").pop() ?? key;
  return photoMeta[basename] ?? { alt: basename };
}
