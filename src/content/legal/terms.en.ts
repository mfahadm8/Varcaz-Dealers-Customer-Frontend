import type { LegalDocument } from "./types";

export const termsOfUse = (entity: string, email: string): LegalDocument => ({
  eyebrow: "Varcaz Dealers",
  title: "Terms of Use",
  description: "The rules for using Varcaz Dealers, for businesses and for anyone who opens our pages.",
  lastUpdated: "Last updated 27 November 2026",
  sections: [
    {
      id: "agreement",
      title: "About these terms",
      paragraphs: [
        `These terms are an agreement between you and ${entity} ("we", "us") for the use of Varcaz Dealers: the WhatsApp assistant, listing pages, 360 tours and business tools. By using the service you accept these terms and our Privacy Policy.`,
      ],
    },
    {
      id: "the-service",
      title: "What the service does",
      paragraphs: [
        "Varcaz Dealers helps businesses of any type, from wholesalers and e-commerce brands to retailers and property dealers, answer enquiries on WhatsApp, keep their listings up to date and share listing pages and virtual tours with customers.",
        "We are a software provider. We are not an agent, broker or party to any sale. Any sale, order or deal is between the customer and the business (and, where relevant, the owner of the goods or property).",
      ],
    },
    {
      id: "business-accounts",
      title: "Business accounts",
      bullets: [
        "You must be at least 18 and able to act for the business you register.",
        "Keep your login safe. You are responsible for what happens under your account and your WhatsApp Business number.",
        "Give us accurate details and keep them current.",
      ],
    },
    {
      id: "business-responsibilities",
      title: "Business responsibilities",
      bullets: [
        "List only items you are authorised to sell or market, with accurate prices, details, photos and availability.",
        "Confirm or update your listings when asked, and mark sold or withdrawn listings promptly.",
        "Follow WhatsApp's Business and Commerce policies, message only people who contacted you or agreed to hear from you, and respect every request to stop.",
        "Follow the laws that apply to your business and to advertising in Pakistan.",
      ],
    },
    {
      id: "ai-assistant",
      title: "The AI assistant",
      paragraphs: [
        "The assistant answers using the listings and instructions the business provides. It can make mistakes and its replies are not legal, financial or valuation advice.",
        "Prices, availability and terms are binding only when the business confirms them. Businesses can take over any conversation at any time, and customers can ask for a person at any time.",
      ],
    },
    {
      id: "content",
      title: "Your content",
      paragraphs: [
        "Businesses keep ownership of the listings, photos, videos and tours they add. You give us permission to store, process and display that content only to run the service, including on public listing pages and in messages to customers.",
        "Tours and pages we produce for you may be used by you for as long as you use the service.",
      ],
    },
    {
      id: "acceptable-use",
      title: "Acceptable use",
      paragraphs: ["Do not use Varcaz Dealers to:"],
      bullets: [
        "Post false, misleading or fraudulent listings.",
        "Send spam or bulk messages to people who did not ask for them.",
        "Harass anyone, or collect other people's information without permission.",
        "Break, probe or overload our systems, or copy them.",
      ],
    },
    {
      id: "fees",
      title: "Fees",
      paragraphs: [
        "Fees for businesses are set out in the plan or written agreement you accept. WhatsApp charges Meta's message fees on some conversations; where these apply, we tell you before passing them on.",
      ],
    },
    {
      id: "third-parties",
      title: "Third-party services",
      paragraphs: [
        "The service relies on WhatsApp (Meta Platforms) and Amazon Web Services. Their terms also apply to your use of them, and we are not responsible for outages or changes on their side.",
      ],
    },
    {
      id: "suspension",
      title: "Suspension and ending the service",
      paragraphs: [
        "You can stop using the service at any time. We may suspend or end an account that breaks these terms, puts customers at risk or puts our WhatsApp access at risk. When an account ends, we delete its data as described in our Privacy Policy.",
      ],
    },
    {
      id: "disclaimers",
      title: "Disclaimers and liability",
      paragraphs: [
        "The service is provided \"as is\". We do not guarantee that listings are accurate, that the service is always available, or any result from using it.",
        "To the extent the law allows, we are not liable for indirect or consequential losses, or for losses from sales or deals, and our total liability to a business is limited to the fees that business paid us in the three months before the claim.",
        "Businesses agree to cover our losses from claims caused by their listings or their breach of these terms.",
      ],
    },
    {
      id: "law",
      title: "Governing law",
      paragraphs: ["These terms are governed by the laws of Pakistan, and the courts of Pakistan have jurisdiction over any dispute."],
    },
    {
      id: "changes",
      title: "Changes to these terms",
      paragraphs: ["We may update these terms. We will post changes here, update the date at the top and tell businesses before a significant change takes effect."],
    },
    {
      id: "contact",
      title: "Contact",
      paragraphs: [`Questions about these terms: ${email || "contact us through the business you are talking to"}.`],
    },
  ],
});
