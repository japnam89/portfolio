// This is YOUR content. Edit this array to add/remove n8n workflow templates.
// Each template is just a plain object (a "data model").
// The page reads from here, so you never touch the page code to update content.
//
// Fields:
//   id          unique slug (used as key)
//   title       display name
//   description what the workflow does
//   category    grouping label shown on the card (e.g. "Automation", "AI")
//   tags        small chips shown under the description
//   download    OPTIONAL URL to a .json export of the workflow (n8n "Download")
//   link        OPTIONAL URL to a blog post / docs / live demo
//
// To actually offer downloads, drop the exported .json files into
// /public/workflows/ and set `download: "/workflows/my-flow.json"`.

export type Workflow = {
  id: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  download?: string;
  link?: string;
};

export const workflows: Workflow[] = [
  {
    id: "rss-to-slack",
    title: "RSS → Slack Digest",
    description:
      "Polls a list of RSS/Atom feeds on a schedule and posts a tidy digest of new items to a Slack channel. De-duplicates by GUID so you never see the same post twice.",
    category: "Automation",
    tags: ["RSS", "Slack", "Schedule", "No-code"],
    download: "/workflows/rss-to-slack.json",
    link: "https://n8n.io/workflows",
  },
  {
    id: "webhook-to-sheets",
    title: "Webhook → Google Sheets Logger",
    description:
      "Catches an inbound webhook, maps the payload, and appends a row to a Google Sheet. Great as a zero-cost event log for forms, contact requests, or IoT devices.",
    category: "Data",
    tags: ["Webhook", "Google Sheets", "Logging"],
    download: "/workflows/webhook-to-sheets.json",
  },
  {
    id: "ai-support-triage",
    title: "AI Support Ticket Triage",
    description:
      "Takes an inbound support message, classifies intent + sentiment with an LLM, labels/assigns it, and drafts a first-response reply. Routes urgent items to a human queue.",
    category: "AI",
    tags: ["AI", "LLM", "Support", "Routing"],
    download: "/workflows/ai-support-triage.json",
  },
  {
    id: "github-issue-to-task",
    title: "GitHub Issue → Project Board",
    description:
      "Watches new GitHub issues and auto-creates a linked card on a project board, applying labels based on the issue's title/body keywords.",
    category: "DevOps",
    tags: ["GitHub", "Automation", "Project Mgmt"],
    download: "/workflows/github-issue-to-task.json",
  },
  {
    id: "daily-standup-summary",
    title: "Daily Standup Summary",
    description:
      "Aggregates yesterday's merged PRs, new issues, and calendar events, then posts a markdown standup summary to Slack/email each morning.",
    category: "Automation",
    tags: ["Slack", "GitHub", "Schedule", "Summary"],
    download: "/workflows/daily-standup-summary.json",
  },
  {
    id: "lead-enrichment",
    title: "Lead Enrichment Pipeline",
    description:
      "On a new signup webhook, enriches the contact with company data, scores the lead, and writes it to your CRM — skipping low-quality entries automatically.",
    category: "AI",
    tags: ["Webhook", "CRM", "Enrichment"],
    download: "/workflows/lead-enrichment.json",
  },
];
