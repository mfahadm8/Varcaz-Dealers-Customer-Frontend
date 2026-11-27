# Privacy Policy and Terms of Use pages

**Problem.** The Meta app (WhatsApp Cloud API, Tech Provider) needs a public privacy policy URL, terms URL and data deletion instructions before review.

**User story.** A buyer, dealer or Meta reviewer opens `/privacy` or `/terms` on a phone or desktop and reads how RightHand handles data and the rules of use.

**Acceptance criteria**

- `/privacy` and `/terms` render with no login, in the Calls Insight design system, using only copied components.
- The privacy policy covers WhatsApp messages, the AI assistant (Claude on Amazon Bedrock), sharing with Meta and AWS, storage region, retention, opt-out (STOP), and data deletion (`/privacy#data-deletion`).
- Contact email and legal entity come from `VITE_CONTACT_EMAIL` and `VITE_LEGAL_ENTITY`.
- Readable at 360 px wide.

**Out of scope.** Urdu and Roman Urdu versions, cookie banner (no cookies or trackers are used).
