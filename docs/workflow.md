# Workflow

Two tracks. Validators are independent: they get the spec, the brief or the diff, never the author's conclusion. No one validates their own work. Agents live in `.claude/agents/`.

## Track A: major decisions

For strategy, architecture, vendors, cost, data models (any DynamoDB table, item type, key or GSI), security model, or deleting anything.

1. **Brief.** Write `docs/adr/NNNN-short-title.md`: context, goal, constraints, options (at least two), open questions. Status: proposed.
2. **Independent reviews, in parallel:**
   - `first-principles-thinker`: what must be true, assumptions to kill, design from zero.
   - `lean-council`: cost at idle, simplicity, time to market, founder time; cut list.
   - Domain reviewer(s): `serverless-architect` (AWS), `dynamodb-modeler` (data), `whatsapp-agent-reviewer` (messaging and AI), `security-reviewer` (auth, data, IAM).
3. **Synthesis.** Add a "Reviews" section to the ADR: where reviewers agree, where they conflict, and a single recommendation.
4. **Interview Fahad.** Present the recommendation and the main alternative. Fahad decides.
5. **Record.** ADR status set to accepted or rejected; one row added to `docs/decisions.md`. Rules in `CLAUDE.md` updated if the decision changes one.

Nothing in Track B may depend on a Track A decision that is still proposed.

## Track B: features and fixes

1. **Spec.** `docs/specs/NNNN-feature.md`: problem, user story, acceptance criteria written as checks that can pass or fail, out of scope, data access patterns if any.
2. **Scope check.** `lean-council` on the spec. Apply its cuts or note why not.
3. **Data check.** If the spec touches DynamoDB, `dynamodb-modeler` updates `docs/data-model/` first.
4. **Build.** `backend-developer` or `frontend-developer` on a `feat/…` branch, tests first, with a summary of commands run and criteria mapped to tests.
5. **Validation gate, in parallel:**
   - always `qa-validator`;
   - `security-reviewer` for auth, webhooks, data access, IAM, uploads, personal data;
   - `dynamodb-modeler` for any data access change;
   - `serverless-architect` for any `infra/` change;
   - `whatsapp-agent-reviewer` for agent, prompts, policy, outreach or WhatsApp code;
   - `ux-mobile-reviewer` for any UI change.
6. **Fix and re-validate.** Fix every blocker; re-run only the failing checks.
7. **PR.** Description includes the spec link and each validator's verdict. Merge only when every required validator says pass and CI is green.

## Definition of done

- Every acceptance criterion has a test that passes in CI.
- Validators required by step 5 have passed.
- Docs updated: spec status, `docs/data-model/` if data changed, `docs/reference-from-bod.md` if old code was copied, `CHANGELOG.md`.
- Deployed to dev and smoke-tested (for WhatsApp changes: one real message round trip on the dev number, typing indicator seen).
