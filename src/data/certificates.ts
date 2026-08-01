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
};

// Confirmed from Microsoft Learn / Credly share links:
//   51961FDE145F32E7 — Azure AI Engineer Associate (2026-06-27)
//   6D6ECFBC714FC41C — Azure AI Fundamentals (2024-06-23)
//   8ea1b77a-...      — Azure Fundamentals (2021-07-07, Credly)
export const certificates: Certificate[] = [
  {
    name: "Microsoft Certified: Azure AI Engineer Associate",
    issuer: "Microsoft",
    year: "2026",
    link: "https://learn.microsoft.com/en-us/users/JapnamSingh-7668/credentials/51961FDE145F32E7",
  },
  {
    name: "Microsoft Certified: Azure AI Fundamentals",
    issuer: "Microsoft",
    year: "2024",
    link: "https://learn.microsoft.com/en-us/users/JapnamSingh-7668/credentials/6D6ECFBC714FC41C",
  },
  {
    name: "Microsoft Certified: Azure Fundamentals",
    issuer: "Microsoft",
    year: "2021",
    link: "https://www.credly.com/badges/8ea1b77a-84ea-4cb0-8235-7cb880305cc6",
  },
  {
    name: "Microsoft Certified: Azure Solutions Architect Expert",
    issuer: "Microsoft",
    year: "2024",
    link: "https://learn.microsoft.com/en-us/credentials/",
  },
  {
    name: "Microsoft Certified: DevOps Engineer Expert",
    issuer: "Microsoft",
    year: "2023",
  },
];
