// This is YOUR content. Edit this array to park diagrams.
// Each diagram is just a plain object (a "data model").
// The page reads from here, so you never touch the page code to add diagrams.
//
// `type` is informational (e.g. "sequence", "flowchart") — it's only used as a
// label. `code` is the raw Mermaid definition (the stuff you'd put in a .mmd file).
// See https://mermaid.js.org for the syntax.
//
// Example sequence diagram:
//   sequenceDiagram
//     participant A as Client
//     participant B as API
//     A->>B: Request
//     B-->>A: Response

export type Diagram = {
  id: string; // unique slug, used as React key + mermaid render id
  title: string;
  description?: string;
  type: string; // label shown on the card, e.g. "Sequence", "Flowchart"
  code: string; // mermaid definition
};

export const diagrams: Diagram[] = [
  {
    id: "oauth-pkce-flow",
    title: "OAuth 2.0 Authorization Code + PKCE",
    description:
      "Standard browser-based auth flow with a public client (no client secret).",
    type: "Sequence",
    code: `sequenceDiagram
    autonumber
    participant U as User
    participant B as Browser (SPA)
    participant A as Auth Server
    participant R as Resource API

    U->>B: Click "Sign in"
    B->>B: Generate PKCE code_verifier + code_challenge
    B->>A: GET /authorize?response_type=code&code_challenge&redirect_uri
    A->>U: Login + consent screen
    U->>A: Credentials / Approve
    A-->>B: Redirect with ?code=auth_code
    B->>A: POST /token (code + code_verifier)
    A-->>B: access_token + refresh_token (JWT)
    B->>R: GET /api/me (Authorization: Bearer access_token)
    R-->>B: 200 OK (user profile)
    B-->>U: Render dashboard`,
  },
  {
    id: "event-driven-pipeline",
    title: "Event-Driven Ingestion Pipeline",
    description:
      "Producer → broker → consumer with retry/DLQ semantics on Azure.",
    type: "Sequence",
    code: `sequenceDiagram
    participant P as Producer
    participant H as Event Hub
    participant C as Consumer (Function)
    participant D as Dead Letter Queue
    participant S as Storage

    P->>H: Publish batch of events
    H-->>P: 200 Accepted (offset committed)
    H->>C: Deliver events (at-least-once)
    C->>S: Write processed record
    alt Write succeeds
        S-->>C: 201 Created
        C-->>H: Checkpoint offset
    else Transient failure (retry exhausted)
        C->>D: Forward event + error context
        D-->>C: ACK
        C-->>H: Checkpoint (skip poison message)
    end`,
  },
  {
    id: "terraform-apply",
    title: "Terraform Plan → Apply Lifecycle",
    description:
      "How a declarative IaC change moves from local to cloud state.",
    type: "Flowchart",
    code: `flowchart TD
    A[Edit *.tf files] --> B[terraform init]
    B --> C[terraform plan]
    C --> D{Changes?}
    D -- No --> Z[No-op: exit]
    D -- Yes --> E[Manual review of plan]
    E --> F[terraform apply]
    F --> G[Provider API calls]
    G --> H[Update remote state]
    H --> I[Resources provisioned]
    I --> J[terraform output]`,
  },
];
