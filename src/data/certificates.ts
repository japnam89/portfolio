// Your certifications. Add/remove entries here — the page reads from this list.
// LinkedIn has no per-certification public deep link, so each card links to
// your LinkedIn profile's certifications view.

export const LINKEDIN_URL = "https://www.linkedin.com/in/japnam-singh-160968164/";
// LinkedIn " certifications" overlay deep-link (opens the Licenses & Certifications section).
export const LINKEDIN_CERTS_URL = `${LINKEDIN_URL}overlay/overlay/::experience,licenses`;

export type Certificate = {
  name: string;
  issuer: string;
  year?: string; // e.g. "2023"
  link?: string; // optional explicit verify URL; falls back to LinkedIn certs view
};

export const certificates: Certificate[] = [
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
  {
    name: "CKA: Certified Kubernetes Administrator",
    issuer: "The Linux Foundation",
    year: "2023",
  },
];
