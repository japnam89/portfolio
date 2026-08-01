// Your certifications. Add/remove entries here — the page reads from this list.

export type Certificate = {
  name: string;
  issuer: string;
  year?: string; // e.g. "2023"
  link?: string; // optional URL to verify the credential
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
