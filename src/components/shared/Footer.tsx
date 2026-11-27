import { CONTACT_EMAIL, LEGAL_ENTITY } from "@/config/site";
import Logo from "@/assets/brand/righthand-logo-dark.svg";
import VarcazLogo from "@/assets/brand/varcaz-logo-dark.svg";

const Footer = () => {
  return (
    <footer className="w-full   border-t border-neutral-100 pt-14 ">
      <div className=" x-auto px-4  text-center text-sm text-neutral-500  ">
        <div className="flex justify-center space-x-6 mb-2">
          <a href="/terms" className="hover:text-gray-800 transition-colors">
            Terms of Use
          </a>
          <a href="/privacy" className="hover:text-gray-800 transition-colors">
            Privacy Policy
          </a>
          <a href={`mailto:${CONTACT_EMAIL}`} className="hover:text-gray-800 transition-colors">
            Contact Us
          </a>
        </div>
        <img src={Logo} alt="RightHand" className="mx-auto mt-6 h-6 w-auto" />
        <p className="flex items-center justify-center gap-1.5 text-xs text-neutral-400 pt-3 pb-14">
          <span className="opacity-60">A service run by</span>
          <img src={VarcazLogo} alt={LEGAL_ENTITY} className="h-4 w-auto opacity-70" />
        </p>
      </div>
    </footer>
  );
};

export default Footer;
