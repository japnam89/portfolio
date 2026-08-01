// Your resume content. Edit this file to update the resume page + PDF.
// Keep it plain text — the PDF generator renders from here.

export const resume = {
  name: "Japnam Singh",
  title: "Staff Engineer & Azure Architect",
  summary:
    "Staff Engineer and Azure Architect with 10+ years of software engineering experience. I design resilient cloud platforms on Azure, set technical direction for platform teams, and stay hands-on with code.",
  contact: {
    email: "your.email@example.com",
    github: "https://github.com/japnam89",
    linkedin: "https://www.linkedin.com/in/japnam-singh-160968164/",
  },
  experience: [
    {
      role: "Staff Engineer / Azure Architect",
      company: "Current Company",
      period: "2021 — Present",
      points: [
        "Architected multi-subscription Azure landing zones with Terraform and Azure Policy.",
        "Led a platform team building event-driven microservices on AKS.",
        "Drove CI/CD and observability improvements across 20+ services.",
      ],
    },
    {
      role: "Senior Software Engineer",
      company: "Previous Company",
      period: "2016 — 2021",
      points: [
        "Built and shipped full-stack features in Node.js and React.",
        "Migrated monolith to microservices, cutting deploy times significantly.",
      ],
    },
  ],
  education: [
    {
      degree: "B.S. in Computer Science",
      school: "Your University",
      period: "2008 — 2012",
    },
  ],
  // Reuses the skills list you already maintain in projects.ts
};

export type Resume = typeof resume;
