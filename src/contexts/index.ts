/**
 * Context exports
 *
 * Copied from Calls Insight `src/contexts/index.ts`, keeping only the page
 * chrome exports that the copied Hero and PageHero components import.
 */

export {
  PageChromeProvider,
  type PageChromeAction,
  type PageChromeBackTarget,
  type PageChromeRegistration,
} from "./PageChromeContext";

export {
  useOptionalPageChrome,
  usePageChrome,
  useRegisterPageChrome,
} from "./page-chrome/hooks";
