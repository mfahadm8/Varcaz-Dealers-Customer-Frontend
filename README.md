# RightHand Customer Frontend

Status: foundation. Pages so far: `/privacy` and `/terms`.

## Run locally

```bash
cp .env.example .env.local   # set VITE_CONTACT_EMAIL
npm install
npm run dev                  # http://localhost:5173/privacy
npm run build                # type check + production build in dist/
```

- Rules: [CLAUDE.md](CLAUDE.md)
- Workflow and review agents: [docs/workflow.md](docs/workflow.md), [.claude/agents/](.claude/agents/)
- Decisions: [docs/decisions.md](docs/decisions.md)
- Specs: [docs/specs/](docs/specs/)
- Code copied from the old BOD reference on `main`: [docs/reference-from-bod.md](docs/reference-from-bod.md)
- Design system copied from Calls Insight: [docs/reference-from-calls-insights.md](docs/reference-from-calls-insights.md), [docs/design/DESIGN_CONTEXT.md](docs/design/DESIGN_CONTEXT.md)
