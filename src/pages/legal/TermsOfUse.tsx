import { CONTACT_EMAIL, LEGAL_ENTITY } from "@/config/site";
import { termsOfUse } from "@/content/legal/terms.en";
import LegalDocumentPage from "./LegalDocumentPage";

const TermsOfUse = () => (
  <LegalDocumentPage document={termsOfUse(LEGAL_ENTITY, CONTACT_EMAIL)} />
);

export default TermsOfUse;
