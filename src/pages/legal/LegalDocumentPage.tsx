import { PageHero } from "@/components/shared/PageHero";
import Footer from "@/components/shared/Footer";
import type { LegalDocument } from "@/content/legal/types";
import LogoLight from "@/assets/brand/righthand-logo-light.svg";

interface LegalDocumentPageProps {
  document: LegalDocument;
}

/** Page layout for a legal document, built from the copied Calls Insight components and card pattern. */
const LegalDocumentPage = ({ document }: LegalDocumentPageProps) => (
  <div className="min-h-screen bg-neutral-50">
    <header className="bg-neutral-900">
      <div className="app-layout pt-6">
        <a href="/" aria-label="RightHand">
          <img src={LogoLight} alt="RightHand" className="h-8 w-auto" />
        </a>
      </div>
    </header>
    <PageHero
      eyebrow={document.eyebrow}
      title={document.title}
      description={document.description}
      statusInfo={document.lastUpdated}
    />
    <main className="app-layout py-8">
      <div className="mx-auto max-w-[880px] space-y-5">
        {document.sections.map((section) => (
          <section
            key={section.id}
            id={section.id}
            className="bg-white rounded-xl p-5 shadow-sm scroll-mt-6"
          >
            <h2 className="h4 mb-2">{section.title}</h2>
            <div className="space-y-3 text-[15px] leading-[1.6] text-neutral-700">
              {section.paragraphs?.map((text) => <p key={text}>{text}</p>)}
              {section.bullets && (
                <ul className="list-disc space-y-2 pl-5">
                  {section.bullets.map((text) => (
                    <li key={text}>{text}</li>
                  ))}
                </ul>
              )}
              {section.after?.map((text) => <p key={text}>{text}</p>)}
            </div>
          </section>
        ))}
      </div>
    </main>
    <Footer />
  </div>
);

export default LegalDocumentPage;
