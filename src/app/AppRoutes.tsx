import { Navigate, Route, Routes } from "react-router-dom";
import PrivacyPolicy from "@/pages/legal/PrivacyPolicy";
import TermsOfUse from "@/pages/legal/TermsOfUse";

export const AppRoutes = () => (
  <Routes>
    <Route path="/privacy" element={<PrivacyPolicy />} />
    <Route path="/terms" element={<TermsOfUse />} />
    <Route path="/data-deletion" element={<Navigate to="/privacy#data-deletion" replace />} />
    <Route path="*" element={<Navigate to="/privacy" replace />} />
  </Routes>
);
