// Your certifications. Add/remove entries here — the page reads from this list.
// LinkedIn has no per-certification public deep link, so each card links to
// your LinkedIn profile's certifications view (or its own verify URL).

export const LINKEDIN_URL = "https://www.linkedin.com/in/japnam-singh-160968164/";
// LinkedIn " certifications" overlay deep-link (opens the Licenses & Certifications section).
export const LINKEDIN_CERTS_URL = `${LINKEDIN_URL}overlay/overlay/::experience,licenses`;

export type Certificate = {
  name: string;
  issuer: string;
  year?: string; // e.g. "2023"
  link?: string; // optional explicit verify URL; falls back to LinkedIn certs view
  image?: string; // optional badge image URL (Credly/Microsoft badge art)
};

// Confirmed from Microsoft Learn / Credly share links, ordered ascending by year:
//   8ea1b77a-...      — Azure Fundamentals (2021-07-07, Credly)
//   d4095f57-...      — Exam 483: Programming in C# (2021-01-18, Credly)
//   6D6ECFBC714FC41C — Azure AI Fundamentals (2024-06-23)
//   51961FDE145F32E7 — Azure AI Engineer Associate (2026-06-27)
//   29513636-...      — AI Skills Fest 2026 (2026-06-19, Credly)
export const certificates: Certificate[] = [
  {
    name: "Microsoft Certified: Azure Fundamentals",
    issuer: "Microsoft",
    year: "2021",
    link: "https://www.credly.com/badges/8ea1b77a-84ea-4cb0-8235-7cb880305cc6",
    image: "/certs/azure-fundamentals.png",
  },
  {
    name: "Exam 483: Programming in C#",
    issuer: "Microsoft",
    year: "2021",
    link: "https://www.credly.com/badges/d4095f57-2ea1-48d7-851b-13070c97c1cd",
    image: "/certs/csharp-exam-483.png",
  },
  {
    name: "Microsoft Certified: Azure AI Fundamentals",
    issuer: "Microsoft",
    year: "2024",
    link: "https://learn.microsoft.com/en-us/users/JapnamSingh-7668/credentials/6D6ECFBC714FC41C",
  },
  {
    name: "Microsoft Certified: Azure Solutions Architect Expert",
    issuer: "Microsoft",
    year: "2024",
    link: "https://learn.microsoft.com/en-us/credentials/",
  },
  {
    name: "AI Skills Fest 2026",
    issuer: "Microsoft",
    year: "2026",
    link: "https://www.credly.com/badges/29513636-e72a-4d0c-b5df-8a5c34b1ff55",
    image: "/certs/ai-skills-fest-2026.png",
  },
  {
    name: "Microsoft Certified: Azure AI Engineer Associate",
    issuer: "Microsoft",
    year: "2026",
    link: "https://learn.microsoft.com/en-us/users/JapnamSingh-7668/credentials/51961FDE145F32E7",
  },
];
