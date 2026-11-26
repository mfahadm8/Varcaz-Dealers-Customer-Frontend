/** Public site settings. Values come from VITE_* build variables (see .env.example). */
export const CONTACT_EMAIL: string = import.meta.env.VITE_CONTACT_EMAIL || "contact@varcaz.com";
export const LEGAL_ENTITY: string = import.meta.env.VITE_LEGAL_ENTITY ?? "Varcaz";
