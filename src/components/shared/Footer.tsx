import { CONTACT_EMAIL, LEGAL_ENTITY } from "@/config/site";

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
        <p className="text-xs text-neutral-400 opacity-60 pt-4 pb-14">
          Powered by RightHand, a service run by {LEGAL_ENTITY}
        </p>
      </div>
    </footer>
  );
};

export default Footer;
