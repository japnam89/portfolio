import Database from "better-sqlite3";
import path from "node:path";
import fs from "node:fs";

const dataDir = path.join(process.cwd(), "data");
fs.mkdirSync(dataDir, { recursive: true });
const db = new Database(path.join(dataDir, "blog.db"));
db.pragma("journal_mode = WAL");

const slugify = (title) => {
  let base = title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80);
  return base || "post";
};

const insertPost = (title, content) => {
  // Idempotent: if a post with this exact title already exists, skip it.
  const existing = db
    .prepare("SELECT id, slug FROM posts WHERE title = ?")
    .get(title);
  if (existing) {
    console.log("✓ already exists:", existing.slug, "|", title.slice(0, 50));
    return existing;
  }

  let slug = slugify(title);
  let n = 1;
  let check = db
    .prepare("SELECT id FROM posts WHERE slug = ?")
    .get(slug);
  while (check) {
    slug = slugify(title) + "-" + n++;
    check = db
      .prepare("SELECT id FROM posts WHERE slug = ?")
      .get(slug);
  }
  const excerpt = content
    .replace(/[#>*_`\\\-]/g, " ")
    .replace(/\n/g, " ")
    .trim()
    .slice(0, 160);
  db
    .prepare(`INSERT INTO posts (slug, title, excerpt, content, cover) VALUES (?, ?, ?, ?, ?)`)
    .run(slug, title, excerpt, content, null);
  const row = db
    .prepare(
      "SELECT id, slug, title, excerpt, cover, created_at FROM posts WHERE slug = ?",
    )
    .get(slug);
  console.log("✓ created:", row.slug, "|", row.title);
  return row;
};

// Post 1: AI-103 — Azure AI Apps and Agents Developer
insertPost(
  "AI-103: Azure AI Apps and Agents Developer — What Changed from AI-102",
  `## What Changed — In One Sentence

AI-102 was about building AI solutions on Azure: pick a model, deploy it, call it, monitor it. AI-103 is about building **applications and agents** that use AI, with a much heavier emphasis on agent frameworks, tool-calling, evaluation, and the operational reality of shipping something that does not hallucinate in front of a customer.

The migration guide from Microsoft puts it this way: AI-103 measures whether you can *"design, build, evaluate, and deploy AI applications and agents that are grounded, performant, and safe."* That sentence is doing a lot of work. Let me unpack it.

## The Five Places AI-103 Is Not AI-102

### 1. Agents Are Now Core, Not a Module

On AI-102, "agent" was a chapter. On AI-103, it is the spine. You are expected to understand:

- **Agent architecture**: the loop of plan → call tool → observe → respond, and where each step lives.
- **Tool definitions**: how you describe a tool to a model, what makes a tool description unambiguous enough that the model actually calls the right one.
- **Orchestration patterns**: single-agent vs. multi-agent, when to reach for each, and what you pay for each in latency and cost.
- **Grounding**: Retrieval-Augmented Generation (RAG), citations, and the difference between a model that *looks* confident and one that is *tethered* to source material.

If you worked with Azure AI Studio's agent capabilities or the newer agent SDK surfaces, this is familiar territory. If your AI-102 knowledge stopped at "deploy a model to an endpoint and call it with REST," this is the biggest gap.

### 2. Evaluation Is Explicitly on the Exam

AI-102 touched evaluation lightly — mostly "did you set up monitoring?" AI-103 expects you to know how to **measure** whether an AI application is any good:

- **RA GSL (generative AI evaluation)** metrics: groundedness, relevance, coherence, fluency, similarity, and when each matters.
- **Adversarial and safety evaluation**: what you test for when the cost of a bad answer is embarrassment vs. when the cost is a compliance incident.
- **Programmatic evaluation vs. human evaluation**: when to automate and when a human in the loop is the only acceptable answer.

This is the part of the exam where people who only know how to call an endpoint tend to fail. You need to know how to tell whether your thing works, not just how to build it.

### 3. Safety and Responsible AI Moved From "Nice to Have" to "Examinable"

AI-102 mentioned content filtering. AI-103 goes further:

- **Prompt injection and jailbreak patterns**: what they look like, categories of injection, and the mitigations that actually reduce risk (not just the ones that look good in a demo).
- **Content safety filters**: how they are configured, what they catch, and the tradeoff between over-filtering (a helpful answer blocked) and under-filtering (a dangerous one through).
- **Responsible AI principles in practice**: fairness, reliability, privacy, inclusiveness, transparency, and accountability — not as abstract values but as decisions you make when you pick a model, a grounding strategy, and an evaluation plan.

### 4. The Azure Services Have Been Renamed and Re-shuffled

Several services and SDK surfaces changed names or rolled into new ones. The exam expects you to know the **current names and when to use which**:

| Old / colloquial name | What the exam expects you to know |
| --- | --- |
| Azure OpenAI Service (model deployment) | Azure AI Foundry / model deployment surfaces — the current vocabulary |
| Cognitive Services (legacy) | Consolidated into Azure AI services; know what moved where |
| Azure AI Studio (agent workflows) | Agent building, evaluation, and monitoring surfaces |

You do not need to memorize every service name change. You do need to know enough to read a scenario and pick the right current service without hesitating.

### 5. Deployment and Operations Got More Real

AI-103 is less about "deploy a model" and more about "ship and run an AI application":

- **Latency and cost tradeoffs**: smaller models for cheaper/faster paths, larger models for quality, when to cache, when to stream.
- **Monitoring an AI workload**: what you monitor (token usage, latency, error rates, evaluation drift) and how that differs from monitoring a REST API.
- **Grounding and retrieval in production**: chunking strategies, index refresh, and the failure modes that show up only after real users start asking real questions.

## What Did Not Change

Not everything moved. The durable parts of AI engineering on Azure are still on the exam:

- **Selecting the right model for the job**: knowing when a small model with grounding beats a large model without it.
- **Fine-tuning vs. prompt engineering vs. RAG**: the decision space is unchanged even if the exam vocabulary around it got sharper.
- **Integration patterns**: calling models from code, handling responses, retry and error handling, batching where it makes sense.
- **Basic Azure plumbing**: resource groups, authentication, networking considerations for AI services, keys vs. managed identity.

If AI-102 gave you a foundation, AI-103 builds on it. It does not throw it away.

## How to Study for AI-103 Now

1. **Start with the official learning path for AI-103**, not the AI-102 one. The module list will reflect the agent-and-evaluation emphasis.
2. **Build one agent end to end.** Something small: a tool-calling agent that queries a dataset or API and answers from it. The act of wiring tools, handling the loop, and evaluating the output teaches more than any number of video hours.
3. **Run an evaluation.** Use Azure AI Studio evaluation or a local harness to measure your agent on groundedness and relevance. The exam will ask you to reason about evaluation results.
4. **Read the responsible AI and safety documentation for the current services**, not the 2024 versions. The content safety surfaces changed.
5. **Practice with recent practice questions.** The question style around agents, grounding, and evaluation is new enough that older question banks will mislead you.

## The Mindset Shift

The cleanest way to think about AI-103 is this: AI-102 tested whether you could **build an AI solution on Azure**. AI-103 tests whether you can **ship and operate an AI application that a real user can trust**.

That shift — from "can you wire it up" to "can you ship something safe and useful" — is the through-line of the whole 2026/2027 certification reset. It shows up in AI-103, in AI-901, and in the new agent track. Once you see it, the exam stops feeling like a collection of facts and starts feeling like a coherent bet about where the job went.

And that bet is: the career is no longer in deploying models. It is in building applications and agents on top of them that do not embarrass you in production.`,
);

// Post 2: AI-901 — Azure AI Fundamentals
insertPost(
  "AI-901: Azure AI Fundamentals — The New AI-900 for 2027",
  `## Who AI-901 Is For

AI-901 is for someone who wants to:

- Speak the language of AI on Azure in a meeting without pretending.
- Understand what Azure AI Foundry, Azure OpenAI, and the Azure AI services actually do — at a level deep enough to ask good questions.
- Decide whether to go deeper (AI-103, AZ-104, a specialty) or stop here.
- Get an early credential on a resume fresh to the cloud space, as a signal that you have oriented yourself.

It is **not** a technical deep dive. You will not write code on this exam. You will not deploy a model. You will not configure a content safety filter. You will, however, be expected to know what those things *are*, when you would use them, and what tradeoffs they involve.

## What AI-900 Covered (For Context)

AI-900 was built around:

- AI workloads and considerations (the "what is AI even for" questions).
- The basics of machine learning on Azure.
- Azure AI services as a category: vision, language, speech, decision.
- Azure OpenAI Service as it existed at the time.
- Responsible AI principles.

That was a good fundamentals exam for its time. It is just that "its time" treated AI on Azure as something you consumed through a handful of named services. The 2027 version has to account for agents, generative AI evaluation, and the fact that a lot of what used to be "build a custom ML model" is now "prompt a foundation model and ground it."

## What AI-901 Adds

The new fundamentals exam folds in the things that became unavoidable in the last two years:

### Generative AI Is Now Core, Not a Sidebar

You will be expected to understand:

- **Large language models (LLMs)** at a conceptual level: what they are, how they generate text, what "tokens" means in practice, and why "the model predicted the next token" is not the same as "the model knows the answer."
- **Generative AI workloads**: summarization, translation, code generation, chat, and the realistic limits of each.
- **Prompt engineering** as a fundamentals topic: what a prompt is, why clarity and context matter, and the difference between a good prompt and a bad one at a level you can explain to someone else.

On AI-900, generative AI was one section. On AI-901, it is a pillar.

### Agents and AI Applications Enter the Fundamentals Conversation

This is the biggest shift. AI-901 now expects you to know, at a high level:

- What an **AI agent** is (a system that can take actions, call tools, and loop — not just answer a question).
- What **grounding** is and why an ungrounded model is a risk in many real applications.
- The basic idea of **Retrieval-Augmented Generation (RAG)** without needing to build one.

You are not expected to build an agent on AI-901. You are expected to know what one is, when you would reach for one, and what "it hallucinated" actually means in a grounded vs. ungrounded context.

### Responsible AI Is Broader and More Specific

AI-900 covered the principles. AI-901 expects you to connect them to concrete situations:

- **Fairness and bias**: what bias in a model output looks like, why it happens, and the kinds of mitigations that exist at the fundamentals level.
- **Privacy and security**: what data goes into a model, what comes out, and the risk surface that creates.
- **Transparency and accountability**: why an AI system's decisions need to be understandable and who is responsible when they go wrong.

The principles themselves did not change. What changed is that the exam now assumes AI is more embedded in real products, so the consequences of ignoring the principles are more concrete.

### Azure AI Services Vocabulary Is Current

AI-901 expects you to recognize the current Azure AI landscape:

- **Azure AI Foundry** as the umbrella for building, evaluating, and deploying AI applications and agents.
- **Azure OpenAI Service** and what it provides (access to foundation models, the playground, deployments).
- **Azure AI services** (the pre-built vision, language, speech, etc. capabilities) and when you use a pre-built service vs. a foundation model vs. a custom solution.

If you studied AI-900 materials, a lot of this will feel familiar. The rename is not just cosmetic — the content around Azure AI Foundry and generative AI is meaningfully newer.

## AI-900 vs. AI-901 — At a Glance

| | AI-900 (retired for new candidates) | AI-901 (current) |
| --- | --- | --- |
| Generative AI | One section | Core pillar |
| Agents / AI applications | Not covered | High-level coverage |
| Grounding / RAG | Not covered | Conceptual level |
| Azure AI vocabulary | Pre-2026 service names | Current Azure AI Foundry-era names |
| Responsible AI | Principles | Principles + concrete situations |
| Technical depth | Very light | Very light (but wider) |

The exam is still a fundamentals exam. It is still accessible to someone brand new to Azure. It is just that "brand new to Azure" in 2027 now includes "brand new to generative AI and agents," so the fundamentals have to cover those too.

## How to Prepare for AI-901

1. **Use the official AI-901 learning path**, not AI-900 materials that have not been updated. The module structure will reflect the generative AI and agent coverage.
2. **Do not skip the generative AI modules.** They are now central, not supplementary. If a study plan treats them as optional, it is built for the old exam.
3. **Learn the vocabulary.** AI-901 is partly a vocabulary exam: LLM, token, grounding, RAG, agent, prompt, Azure AI Foundry, content safety — know what each means in plain language.
4. **Get hands-on in the Azure AI Foundry playground / studio**, even if only for an hour. Seeing a model respond in a chat interface and then seeing what happens when you give it bad context makes the responsible AI and grounding concepts real.
5. **Practice with current practice questions.** Older AI-900 question banks will include content that no longer maps to the exam.

## The Credential in Context

AI-901 is a fundamentals credential. It will not by itself get you a job. It is, however, a reasonable first checkpoint if you are building toward AI-103 or AZ-305, or if you simply want to be the person in the room who understands what the AI team is talking about.

The right way to think about it: AI-901 is the map, not the destination. It orients you. What you do after — build an agent, take AZ-305 and learn infrastructure, go deeper into security — is the part that actually moves your career.

That is the same framing Microsoft used for AI-900, and it is still the right framing for AI-901. The map got bigger. The advice did not change.`,
);

// Post 3: AZ-305 — Designing Microsoft Azure Infrastructure Solutions
insertPost(
  "AZ-305: Designing Microsoft Azure Infrastructure Solutions — Still the Core in 2027",
  `## Why AZ-305 Survived the Reset Untouched

The 2026 shakeup retired AZ-204 and AZ-500, renamed the AI track, and invented a new agent builder lane. Infrastructure design — the work of taking requirements like "we need a highly available web app with a SQL backend, governed by policy, costing under a budget, secure enough for a regulated workload" — did not go anywhere. Nobody's prompt can design a secure, cost-aware, compliant architecture end to end and own the consequences of it. That job still goes to a person.

AZ-305 is the certification that says you can do that job at the design level.

## What AZ-305 Actually Tests

AZ-305 is a design exam. You are given a business or technical requirement and asked to pick the right Azure services, architecture pattern, and governance approach. The exam covers:

### Compute Design

- When to use Virtual Machines, App Service, Azure Kubernetes Service, Azure Functions, Container Apps, and Azure Spring Apps — not just what each is, but which fits a given workload, scale pattern, and operational model.
- Migration considerations: lift-and-shift vs. refactor vs. replatform, and the tradeoffs among them.
- Scaling: autoscale, scale sets, and the design decisions that make scaling actually work rather than just exist.

### Storage Design

- Blob storage tiers and lifecycle management for real data access patterns.
- Managed Disks, Files, and Disk Storage in the right context.
- Data redundancy options (LRS, ZRS, GRS, RA-GRS) and what each means for availability, cost, and recovery objectives.
- Storage security: shared access signatures, private endpoints, and encryption-at-rest considerations.

### Networking Design

- Virtual Networks, subnets, and network segmentation as an architectural decision, not a checkbox.
- Load balancing: Azure Load Balancer vs. Application Gateway vs. Front Door vs. Traffic Manager — and when each is the right answer.
- Private endpoints, service endpoints, DNS, and the connectivity patterns that keep traffic off the public internet where it should be.
- Hybrid connectivity: ExpressRoute, VPN Gateway, and the scenarios that drive one vs. the other.

### Identity and Security Design

- Microsoft Entra ID (formerly Azure AD) integration: hybrid identity, B2B, B2C, and the scenarios each serves.
- Managed identities vs. service principals vs. keys — and why managed identity is usually the answer.
- Role-Based Access Control design: least privilege, scope, and the way permissions compound across a subscription.
- Azure Policy, Blueprints (where they still apply), and the governance tooling that keeps a design from drifting.

### Business Continuity and Disaster Recovery

- Backup and restore: what to back up, how often, and the RPO/RTO implications of your choices.
- Site Recovery and geo-redundancy for the workloads that need them.
- The difference between high availability and disaster recovery, and why designing for one is not the same as designing for the other.

### Cost and Monitoring Design

- Cost estimation and optimization: reserved instances, savings plans, right-sizing, and the design-time decisions that dominate a workload's bill.
- Monitoring and alerting design: what to monitor, how to structure alerts, and the operational visibility a design needs to survive contact with real users.

## Why AZ-305 Is Still the Anchor

If you look at the 2027 certification map, AZ-305 sits at the center of the infrastructure track the way it always did:

- **AZ-900** gives you the vocabulary.
- **AZ-104** gives you the administration muscle (and is still the natural next step after fundamentals).
- **AZ-305** gives you the design layer on top of that muscle.

The AI certifications now run on top of infrastructure someone has to design, secure, and cost-control. The agent builders Microsoft is pushing still need networks, identities, and governance. The platform engineering lane that pays the money still runs on the skills AZ-305 tests.

None of that changed because AI got reorganized.

## What Has Been True Since Before 2026

The durable truths of AZ-305 did not move:

- **Design is a decision discipline**, not a memorization exercise. The exam rewards people who can take a scenario, weigh options, and justify a choice — not people who have memorized one canonical architecture.
- **Tradeoffs are the point.** The right answer to "design a storage solution" is almost never "the one with the most features." It is the one that fits the access pattern, the budget, the compliance requirements, and the team's ability to operate it.
- **Security and cost are design concerns, not afterthoughts.** A design that ignores either one is a design that fails in production, and the exam tests for that in a way that a checklist cannot capture.

If you are studying for AZ-305 now, these truths are still true. The material is still current. The exam is still worth taking.

## How to Study for AZ-305 in 2027

1. **Know the core services cold, in context.** Not "what is App Service" but "given this workload, why App Service and not Kubernetes, and what would change my mind."
2. **Practice scenario questions.** AZ-305 is a scenario exam. Practice questions that force you to choose between two plausible designs are more valuable than any number of definition-recall questions.
3. **Learn the governance tooling well enough to apply it.** Azure Policy, RBAC, managed identity — these are not side topics. They are design concerns and the exam treats them that way.
4. **Do not skip the cost and monitoring design sections.** They are easy to under-prepare for and expensive to fail on, because they are easy to dismiss as "soft" until you are staring at a question that turns on them.
5. **Use AZ-104 as a foundation if you have not taken it.** AZ-305 assumes you understand the services at an operational level. If you only know them conceptually, the design questions will feel harder than they are.

## The 2027 Certification Map in One Picture

If you are building a cloud career in 2027 and wondering where AZ-305 fits, here is the simplest honest picture:

- **Fundamentals**: AZ-900 / AI-901 — orient yourself.
- **Infrastructure core**: AZ-104 (admin) → AZ-305 (design). This is the track that did not move.
- **AI track**: AI-901 (fundamentals) → AI-103 (apps and agents developer). This is the track that got rewritten.
- **Security**: SC-500 replaced AZ-500 for the cloud and AI security engineer lane.
- **New agent track**: AB-620 and related, for the least-crowded specialty.

AZ-305 is the middle of the infrastructure core. If your goal is to be the person who can design Azure solutions that actually work — secure, available, cost-aware, governable — AZ-305 is still the exam that certifies that.

The world changed around it. It did not need to change itself.`,
);

console.log("\nDone. Total posts now:", db.prepare("SELECT COUNT(*) as c FROM posts").get().c);
