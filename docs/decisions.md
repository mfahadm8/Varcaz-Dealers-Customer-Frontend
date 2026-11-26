# Decisions

Newest first. Open questions live in the planning doc's Interview section until answered.

| Date | Decision | Why |
| --- | --- | --- |
| 2026-11-26 | UI design system: copied verbatim from Calls Insight (Varcaz product); no new components | Fahad's instruction; one Varcaz look |
| 2026-11-26 | AWS access through the local CLI profile `callsinsight`; external signups done by Fahad in the browser, guided by the agent | Credentials stay with Fahad |
| 2026-11-26 | Admin app state: TanStack Query for server data, Zustand for UI state, no Redux | Less code; caching built in |
| 2026-11-26 | Bot persona: the dealer's assistant, admits it is automated when asked | Honest and in the dealer's voice |
| 2026-11-26 | Customer frontend: client-side rendered SPA on S3 + CloudFront; link previews from static per-listing HTML files written at publish time | Zero cost at zero usage; 360 viewer is browser-only |
| 2026-11-26 | LLM: Amazon Bedrock with Claude only | Pay per token, stays in the AWS account |
| 2026-11-26 | WhatsApp: direct Meta Cloud API as a Tech Provider, Embedded Signup with coexistence; no paid provider | No platform fee; cost grows only with messages |
| 2026-11-26 | Auth: Cognito for the admin app; no buyer login | Buyers come from shared links |
| 2026-11-26 | We own the BOD code and may reuse it | Fahad confirmed |
| 2026-11-26 | Serverless only, scale to zero: FastAPI on Lambda via an adapter behind API Gateway; no ECS | Zero cost when idle |
| 2026-11-26 | DynamoDB on-demand is the source of truth; every item type designed by `dynamodb-modeler` | Serverless and pay-per-use |
| 2026-11-26 | No response streaming; the bot shows WhatsApp's typing indicator while it works | Fahad's choice; WhatsApp sends whole messages anyway |
| 2026-11-26 | Independent validation agents and a two-track workflow (decisions, features) | Make sure everything works as expected |
| 2026-11-26 | Start from scratch on a clean `foundation` branch; copy from the old BOD code on `main` only what a planned feature needs | Avoids carrying unused BOD modules and data |
| 2026-11-26 | Fresh git history: Varcaz history starts with no BOD commits | Old history holds BOD clients, account IDs and PRs |
| 2026-11-26 | AWS: one account `893685201076` for dev and prod, region `ap-southeast-2` | Fahad's choice |
