import type { LegalDocument } from "./types";

export const privacyPolicy = (entity: string, email: string): LegalDocument => ({
  eyebrow: "Varcaz Dealers",
  title: "Privacy Policy",
  description: "How we collect, use and protect information on WhatsApp and on our listing pages.",
  lastUpdated: "Last updated 27 November 2026",
  sections: [
    {
      id: "who-we-are",
      title: "Who we are",
      paragraphs: [
        `Varcaz Dealers is a service run by ${entity} ("we", "us"). It gives businesses in Pakistan, such as property dealers, wholesalers and online brands, an AI assistant on their WhatsApp Business number, public listing pages and 360 virtual tours.`,
        "When you message a business that uses Varcaz Dealers, the business decides why your information is used, and we process it for them to run the service. For business accounts and our own website, we decide how information is used.",
      ],
    },
    {
      id: "information-we-collect",
      title: "Information we collect",
      paragraphs: ["From customers and other people who message a business:"],
      bullets: [
        "Your WhatsApp phone number and profile name.",
        "The messages, voice notes and media you send to the business, and the replies sent to you.",
        "What you are looking for, such as the product, property or service, budget, location and timing, as you tell us in the chat.",
        "Which listings and tours you open from links the business sends you.",
      ],
      after: [
        "From businesses: your name, business name, phone number and email, the listings, photos, videos and tours you add, and, only if you choose to connect it, up to six months of past WhatsApp chats from your business number.",
        "From visitors to our pages: page opens, tours opened, rooms viewed and taps on the WhatsApp button, with basic device and browser details. Our pages need no login and we use no advertising trackers.",
      ],
    },
    {
      id: "how-we-use",
      title: "How we use information",
      bullets: [
        "To answer your questions about the business's listings on its behalf and send you matching listings you asked for.",
        "To hand the conversation to the business or its staff whenever a person should take over.",
        "To keep listings accurate, for example by asking businesses to confirm prices and availability each week.",
        "To keep the service secure, prevent abuse and fix problems.",
        "To improve the service using aggregated statistics that do not identify you.",
      ],
      after: ["We do not sell personal information and we do not use it for advertising."],
    },
    {
      id: "ai-assistant",
      title: "The AI assistant",
      paragraphs: [
        "Replies may be written by an AI model (Anthropic Claude, run on Amazon Bedrock in our AWS account). Your messages are sent to the model only to write a reply or to understand what you are looking for. Amazon Bedrock does not use them to train models.",
        "The assistant can make mistakes. Prices, availability and terms are confirmed by the business, not by the assistant. You can ask for a person at any time.",
      ],
    },
    {
      id: "sharing",
      title: "Who we share information with",
      bullets: [
        "The business you are talking to, and the staff it authorises.",
        "Meta Platforms, which runs WhatsApp and delivers the messages. Meta's own privacy policy applies to your use of WhatsApp.",
        "Amazon Web Services, which hosts our systems and runs the AI model.",
        "Authorities, when the law requires it.",
      ],
      after: ["Each provider may use the information only to provide its service to us."],
    },
    {
      id: "storage-and-security",
      title: "Where information is stored and how it is protected",
      paragraphs: [
        "Information is stored on Amazon Web Services in the Asia Pacific (Sydney) region, so it is held outside Pakistan. It is encrypted in transit and at rest. Access is limited to the business it belongs to and to our staff who need it to run the service. Phone numbers are masked in our logs.",
      ],
    },
    {
      id: "retention",
      title: "How long we keep information",
      bullets: [
        "Conversations and customer requirements are kept while the business uses Varcaz Dealers, and are deleted within 30 days after the business leaves.",
        "Past chats a business imports are kept as raw files only until they are processed, and for no more than 30 days. What remains has identity card numbers and payment details removed.",
        "Listing pages and tours are removed when the business deletes the listing.",
        "Page visit statistics are kept for up to 12 months.",
      ],
    },
    {
      id: "your-choices",
      title: "Your choices and rights",
      bullets: [
        "Reply STOP in the chat at any time and we will stop sending you messages.",
        "Ask in the chat to speak to a person.",
        `Email ${email || "us"} to ask for a copy of your information, to correct it, or to delete it. We reply within 30 days.`,
      ],
    },
    {
      id: "data-deletion",
      title: "How to delete your data",
      paragraphs: [
        `Send an email to ${email || "us"} with the subject "Delete my data" and the WhatsApp number you used. We confirm the request from that number, then delete your conversations, requirements and visit history from our systems and tell the business within 30 days. Messages already on your phone or the business's phone are not affected, because WhatsApp stores those.`,
        "Businesses can delete their account and all of its data by emailing us from the address on their account.",
      ],
    },
    {
      id: "children",
      title: "Children",
      paragraphs: ["Varcaz Dealers is meant for adults. We do not knowingly collect information from anyone under 18."],
    },
    {
      id: "changes",
      title: "Changes to this policy",
      paragraphs: ["We will post any changes on this page and update the date at the top. If a change is significant, we will tell businesses before it takes effect."],
    },
    {
      id: "contact",
      title: "Contact",
      paragraphs: [`Questions about this policy: ${email || "contact us through the business you are talking to"}.`],
    },
  ],
});
