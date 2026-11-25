// Your certifications. Add/remove entries here — the page reads from this list.
// LinkedIn has no per-certification public deep link, so each card links to
// your LinkedIn profile's certifications view (or its own verify URL).

import type { TranslationLocale } from "@/lib/content-types";

export const LINKEDIN_URL = "https://www.linkedin.com/in/japnam-singh-160968164/";
// LinkedIn " certifications" overlay deep-link (opens the Licenses & Certifications section).
export const LINKEDIN_CERTS_URL = `${LINKEDIN_URL}overlay/overlay/::experience,licenses`;

export type Certificate = {
  name: string;
  issuer: string;
  year?: string; // e.g. "2023"
  link?: string; // optional explicit verify URL; falls back to LinkedIn certs view
  image?: string; // optional badge image URL (Credly/Microsoft badge art)
  translations?: Partial<Record<TranslationLocale, { name: string }>>;
};

// Certificates are ordered newest year first.
export const certificates: Certificate[] = [
  {
    name: "Agentic AI Business Solutions Architect",
    issuer: "Microsoft",
    year: "2026",
    link: "https://learn.microsoft.com/en-us/users/japnamsingh-7668/credentials/certification/agentic-ai-business-solutions-architect?tab=credentials-tab",
    translations: {
      hi: { name: "एजेंटिक AI बिज़नेस सॉल्यूशंस आर्किटेक्ट" },
      pa: { name: "ਏਜੰਟਿਕ AI ਬਿਜ਼ਨਸ ਸੋਲਿਊਸ਼ਨਜ਼ ਆਰਕੀਟੈਕਟ" },
    },
  },
  {
    name: "Microsoft Certified: Azure AI Engineer Associate",
    issuer: "Microsoft",
    year: "2026",
    link: "https://learn.microsoft.com/en-us/users/JapnamSingh-7668/credentials/51961FDE145F32E7",
    image: "/certs/azure-ai-engineer.svg",
    translations: {
      hi: { name: "Microsoft प्रमाणित: Azure AI इंजीनियर एसोसिएट" },
      pa: { name: "Microsoft ਸਰਟੀਫਾਈਡ: Azure AI ਇੰਜੀਨੀਅਰ ਐਸੋਸੀਏਟ" },
    },
  },
  {
    name: "AI Skills Fest 2026",
    issuer: "Microsoft",
    year: "2026",
    link: "https://www.credly.com/badges/29513636-e72a-4d0c-b5df-8a5c34b1ff55",
    image: "/certs/ai-skills-fest-2026.png",
    translations: {
      hi: { name: "AI स्किल्स फेस्ट 2026" },
      pa: { name: "AI ਸਕਿਲਜ਼ ਫੈਸਟ 2026" },
    },
  },
  {
    name: "Microsoft Certified: Azure AI Fundamentals",
    issuer: "Microsoft",
    year: "2024",
    link: "https://learn.microsoft.com/en-us/users/JapnamSingh-7668/credentials/6D6ECFBC714FC41C",
    image: "/certs/azure-ai-fundamentals.svg",
    translations: {
      hi: { name: "Microsoft प्रमाणित: Azure AI के मूल सिद्धांत" },
      pa: { name: "Microsoft ਸਰਟੀਫਾਈਡ: Azure AI ਦੇ ਬੁਨਿਆਦੀ ਸਿਧਾਂਤ" },
    },
  },
  {
    name: "Microsoft Certified: Azure Solutions Architect Expert",
    issuer: "Microsoft",
    year: "2024",
    link: "https://learn.microsoft.com/en-us/credentials/",
    image: "/certs/azure-solutions-architect.svg",
    translations: {
      hi: { name: "Microsoft प्रमाणित: Azure Solutions Architect Expert" },
      pa: { name: "Microsoft ਸਰਟੀਫਾਈਡ: Azure ਹੱਲ ਆਰਕੀਟੈਕਟ ਮਾਹਰ" },
    },
  },
  {
    name: "Microsoft Certified: Azure Fundamentals",
    issuer: "Microsoft",
    year: "2021",
    link: "https://www.credly.com/badges/8ea1b77a-84ea-4cb0-8235-7cb880305cc6",
    image: "/certs/azure-fundamentals.png",
    translations: {
      hi: { name: "Microsoft प्रमाणित: Azure के मूल सिद्धांत" },
      pa: { name: "Microsoft ਸਰਟੀਫਾਈਡ: Azure ਦੇ ਬੁਨਿਆਦੀ ਸਿਧਾਂਤ" },
    },
  },
  {
    name: "Exam 483: Programming in C#",
    issuer: "Microsoft",
    year: "2021",
    link: "https://www.credly.com/badges/d4095f57-2ea1-48d7-851b-13070c97c1cd",
    image: "/certs/csharp-exam-483.png",
    translations: {
      hi: { name: "परीक्षा 483: C# में प्रोग्रामिंग" },
      pa: { name: "ਪ੍ਰੀਖਿਆ 483: C# ਪ੍ਰੋਗਰਾਮਿੰਗ" },
    },
  },
];
