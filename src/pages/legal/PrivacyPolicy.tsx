import { CONTACT_EMAIL, LEGAL_ENTITY } from "@/config/site";
import { privacyPolicy } from "@/content/legal/privacy.en";
import LegalDocumentPage from "./LegalDocumentPage";

const PrivacyPolicy = () => (
  <LegalDocumentPage document={privacyPolicy(LEGAL_ENTITY, CONTACT_EMAIL)} />
);

export default PrivacyPolicy;
