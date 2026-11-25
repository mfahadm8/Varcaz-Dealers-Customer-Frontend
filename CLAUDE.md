# Varcaz Dealers Customer Frontend

Public listing pages and 360 tours that buyers open from WhatsApp links.

These rules apply to every change in this repo, by people and AI agents alike. Rules marked *(open decision)* wait on an answer from Fahad; record answers in `docs/decisions.md`.

## How we work

1. **Interview before major decisions.** Anything that changes architecture, cost, a vendor, data handling, or what gets deleted is raised with Fahad first, with a recommendation. Small, reversible choices are made and reported.
2. **Plan, then build.** Every feature starts as a short spec in `docs/specs/` (problem, user story, acceptance criteria, out of scope). Code follows the spec.
3. **Start clean, copy in on purpose.** This branch history starts from zero. The old BenefitsOnDemand (BOD) code on `main` is read-only reference. Copy a piece in only when a planned feature needs it, and strip BOD names, IDs, URLs, clients and data on the way in. Log every copy in `docs/reference-from-bod.md`.
4. **MVP scope is frozen** to the design doc: WhatsApp agent, listings, weekly roll-call, matching, public listing and tour pages, small admin panel. New ideas go to `docs/backlog.md`.
5. **Decisions are recorded** in `docs/decisions.md` (one entry per decision: date, choice, why).

## Agents and workflow

- Follow `docs/workflow.md`. Major decisions (Track A) go through independent reviews by `first-principles-thinker`, `lean-council` and the domain reviewers, then an interview with Fahad, then a recorded ADR.
- Every feature (Track B) passes the validation gate before merge: `qa-validator` always, plus the domain reviewers the change needs. No one validates their own work.
- Agent definitions live in `.claude/agents/`. Change an agent only through a PR.

## Credentials and external platforms

- **AWS:** credentials already exist on Fahad's machine under the AWS CLI profile `callsinsight` (account 893685201076, region ap-southeast-2). Use `--profile callsinsight` or `AWS_PROFILE=callsinsight`. Never ask for, copy or store access keys.
- **External platforms** (Meta / WhatsApp, GitHub settings, domain registrars, any service that needs a signup or login): the agent opens the page in the browser and tells Fahad exactly what to do. Fahad signs in and completes logins, verification, payments and approvals himself. The agent never types passwords, codes or card details.
- Any key or token a platform issues goes straight into SSM Parameter Store (via the `callsinsight` profile), never into chat, code or files.

## Git and GitHub

- Repos are private. Trunk branch: `foundation` until it replaces `main`.
- Work on short-lived branches cut from the trunk: `feat/…`, `fix/…`, `chore/…`, `docs/…`. Rebase on the trunk; merge through a PR.
- Conventional commits, e.g. `feat(listings): add roll-call buttons`. One logical change per PR, about 400 changed lines at most.
- Every PR says what, why, how it was tested, and has screenshots for UI.
- Tag releases `vX.Y.Z`; keep `CHANGELOG.md`.
- Never force-push the trunk, rewrite shared history, or delete branches without Fahad's go-ahead.

## Secrets and config

- No secrets, tokens, passwords, phone numbers, tenant IDs or customer data in code or git. Ever.
- Backend secrets live in AWS Secrets Manager or SSM Parameter Store. Frontends get only public config through `VITE_*` variables at build time.
- Every repo ships `.env.example` with every key and no values. `.env*` (except `.env.example`) is git-ignored.
- Secret scanning (gitleaks) runs in CI and as a pre-commit hook.

## Data and privacy

- No BOD data, clients, tenants, logos, IDs or fixtures anywhere.
- Buyer phone numbers and chat text are personal data: stored only in the backend, encrypted at rest, masked in logs (last 4 digits), never sent to a screen that does not need them.
- Imported chats keep raw files in a private bucket with a deletion date. Mined output is stripped of CNIC numbers, names and payment details.
- A dealer (tenant) sees only their own data.

## Quality bar

- Files under 300 lines (hard limit 500). Functions do one thing.
- Tests for every rule that protects money or trust: listing freshness, reply policy, opt-out, tenant isolation.
- Lint, type checks and tests block merges.
- Docs live in the repo: `README.md` (running locally in 5 minutes), `CLAUDE.md` (this file), `docs/architecture.md`, `docs/specs/`, `docs/decisions.md`.

## Rules for AI coding agents

- Read this file, the relevant spec and `docs/decisions.md` before editing.
- Never touch infrastructure, deletes, migrations, secrets or the trunk's history without an explicit go-ahead in the task.
- When a requirement is unclear, ask instead of guessing. List assumptions in the PR.
- Run lint, types and tests locally before opening a PR.
- Never copy code from `main` without logging it in `docs/reference-from-bod.md`.

## Customer frontend rules

The buyers' side: public listing pages, the 360 tour viewer, a dealer's listings page and the WhatsApp button. Buyers arrive from a WhatsApp link on a phone with patchy mobile data.

- **No login, ever,** for buyers. Every page works from a shared link.
- **Fast on a cheap Android over 3G:** under 150 KB of JavaScript before the tour loads, key facts visible in under 2 seconds, panoramas lazy-loaded at multiple resolutions.
- **Client-side rendering only.** A Vite + React single-page app served as static files from S3 and CloudFront. No server-side rendering, no Lambda in the page path. Zero cost when nobody visits.
- **The 360 viewer runs entirely in the browser** (WebGL). Panoramas are static files on CloudFront.
- **Link previews without a server:** WhatsApp and Facebook do not run JavaScript, so when a listing is published the backend writes a tiny static HTML file per listing to S3 (`/l/<code>/index.html`) with its title, description and image tags, which then loads the app. Still static, still free at idle.
- **Mobile first,** designed at 360 px wide. Touch targets at least 44 px.
- **Languages:** English and Roman Urdu at launch, layout ready for Urdu (right to left). All strings in translation files.
- **Tour viewer:** Photo Sphere Viewer with the Map and Virtual Tour plugins, wrapped in one component. Opens on the floor plan or site map. If WebGL fails, the photo gallery and video still work.
- **Every WhatsApp link carries the listing code** so the agent knows the context.
- **Track only what is needed:** page open, tour opened, room viewed, WhatsApp tapped, tagged by listing and link source. No third-party ad trackers at launch.
- **Dealer branding** (logo, name, number) comes from the API, never from a hardcoded tenant list.
- **Freshness is visible:** every price shows its "last confirmed" date. Sold and stale listings say so clearly.
- **Design system is Calls Insight's, copied as is.** Theme, CSS, Tailwind config, typography and shared components come from the Calls Insight frontend (another Varcaz product). Do not invent new UI components or styles: copy the Calls Insight one into `src/components/shared/` unchanged and log it in `docs/reference-from-calls-insights.md`. Follow `docs/design/DESIGN_CONTEXT.md` (card hierarchy, spacing, radius). Never bring over Calls Insight branding, logos, demo data or client names.
- Accessibility: alt text, readable contrast, keyboard-usable viewer controls.
- Hosting: S3 plus CloudFront with origin access control in `ap-southeast-2`, deployed from CI.
