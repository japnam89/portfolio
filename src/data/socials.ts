// Single source of truth for social profiles.
// `icon` maps to an inline SVG in SocialLinks.tsx.
export type Social = {
  name: string;
  handle: string;
  href: string;
  desc: string;
  icon: "x" | "github" | "linkedin" | "email";
};

export const socials: Social[] = [
  {
    name: "X (Twitter)",
    handle: "@japnamfx",
    href: "https://x.com/japnamfx",
    desc: "Thoughts on cloud, code, and career.",
    icon: "x",
  },
  {
    name: "GitHub",
    handle: "japnam89",
    href: "https://github.com/japnam89",
    desc: "Open-source and project repositories.",
    icon: "github",
  },
  {
    name: "LinkedIn",
    handle: "japnam-singh",
    href: "https://www.linkedin.com/in/japnam-singh-160968164/",
    desc: "Professional profile and certifications.",
    icon: "linkedin",
  },
  {
    name: "Email",
    handle: "Get in touch",
    href: "mailto:info@japnam.com",
    desc: "Prefer email? Send a note.",
    icon: "email",
  },
];
