// This is YOUR content. Edit this array to add/remove projects.
// Each project is just a plain object (a "data model").
// The pages read from here, so you never touch the page code to update content.

export type Project = {
  title: string;
  description: string;
  tags: string[];
  link?: string; // optional URL to the live project or repo
};

export const projects: Project[] = [
  {
    title: "Personal Portfolio",
    description:
      "The website you are looking at right now, built with Next.js, React, and Tailwind CSS. Includes a Node.js API route for the contact form and sends email via Resend.",
    tags: ["Next.js", "React", "TypeScript", "Node.js"],
    link: "https://github.com/japnam89",
  },
  {
    title: "Azure Landing Zone",
    description:
      "Designed and deployed a secure, multi-subscription Azure landing zone using Terraform and Azure Policy — baseline networking, identity, and guardrails for the whole org.",
    tags: ["Azure", "Terraform", "Azure Policy", "IaC"],
    link: "https://github.com/japnam89",
  },
  {
    title: "Event-Driven Microservices",
    description:
      "Led a platform team building event-driven microservices on Azure Kubernetes Service with Service Bus and API Management, cutting deploy times and improving reliability.",
    tags: ["AKS", "Kubernetes", "Node.js", "Service Bus"],
  },
];

export const skills = [
  "Azure Architecture",
  "Cloud & Infrastructure (IaC)",
  "Node.js / TypeScript",
  "React / Next.js",
  "Kubernetes (AKS)",
  "DevOps & CI/CD",
  "Solution Design",
  "10+ Years Software Engineering",
];
