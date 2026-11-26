# Copied from Calls Insight

The design system is copied from the Calls Insight frontend (`calls-insights`, a Varcaz product) unchanged, so both products share one look. Log every copy here.

## 2026-11-26, design system (branch `feat/legal-pages`)

Copied byte for byte:

- `tailwind.config.js`, `postcss.config.js`, `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json`, `eslint.config.js`
- `src/index.css`, `src/App.css`
- `src/components/shared/`: every component that does not depend on Calls Insight app code (AnimatedAdvisorOrb, AudioPlayer, Badge, BottomSlider, Button, Checkbox, ConfirmModal, DatePicker, DateRangePicker, Divider, DraftNavigationBlocker, Dropdown, EmptyState, ErrorBoundary, FileUpload, file-upload, Funnel, Hero, Input, InsightVisual, MetricCard, Modal, MultiSelect, OnboardingStepper, PageHero, PageWorkEnvelope, PriorityStar, ProgressSteps, QueueStatusMark, RadarChart, RadioButton, ScoreGauge, ScrollToTop, SecureInput, SideSlider, SpeedoMeter, StatusChip, Table, TablePagination, TextArea, VideoEmbed, WorkspaceTabs, charts/, shared.scss and their helper files)
- `src/contexts/PageChromeContext.tsx`, `src/contexts/page-chrome/` (needed by Hero and PageHero)
- `src/utils/cn.ts`, `src/utils/videoHelpers.ts`, `src/types/insightVisual.ts`
- `src/assets/bg.png`, `src/assets/AI advisor.svg`
- `DESIGN_CONTEXT.md` as `docs/design/DESIGN_CONTEXT.md`

Changed on the way in:

- `src/contexts/index.ts`: keeps only the page chrome exports. The rest pulls in Calls Insight's global app state and demo data.
- `src/components/shared/Footer.tsx`: links point to `/terms`, `/privacy` and the contact email; the line reads "Powered by Varcaz Dealers by Varcaz".

Not copied:

- `NavBar` and `navbar/`, `GlobalSearch`, `SourceLinkedEpisodes`, `EntityLinks`, `StickyFilterShell`, `AccountabilitySlider`, `CaseInvestigation`, `call-upload`: they depend on Calls Insight's auth, API services or demo data.
- The Calls Insight logos and favicon: they carry the Calls Insight name. A Varcaz Dealers logo is still needed.
