// Your ENS (.eth) domain portfolio.
//
// EDIT THIS FILE to manage your domains. Each entry:
//   name        – the full domain, e.g. "japnam.eth"
//   acquiredVia – where you won it: "Metamask", "Namebase", "ETH World", etc.
//   wonDate     – when you acquired it (free text / ISO date)
//   forSale     – true if you're open to offers (shows the "Make an offer" CTA)
//   description – one line about the domain
//
// Visitors submit offers through the form on /domains; offers are stored in the
// SQLite DB and emailed to you (if Resend is configured).

export type Domain = {
  name: string;
  acquiredVia: string;
  wonDate?: string;
  forSale?: boolean;
  description?: string;
};

export const domains: Domain[] = [
  {
    name: "japnam.eth",
    acquiredVia: "Metamask",
    wonDate: "2023",
    forSale: false,
    description: "Primary handle — not for sale.",
  },
  {
    name: "singh.eth",
    acquiredVia: "ETH World",
    wonDate: "2024",
    forSale: true,
    description: "Clean surname domain. Open to serious offers.",
  },
  {
    name: "azure.eth",
    acquiredVia: "Namebase",
    wonDate: "2024",
    forSale: true,
    description: "Premium keyword — great for a cloud/infra brand.",
  },
  {
    name: "cloudnative.eth",
    acquiredVia: "Metamask",
    wonDate: "2025",
    forSale: true,
    description: "Descriptive, brandable for a Kubernetes/cloud project.",
  },
  {
    name: "ivaan.eth",
    acquiredVia: "ETH World",
    wonDate: "2025",
    forSale: false,
    description: "Held — not for sale.",
  },
];
