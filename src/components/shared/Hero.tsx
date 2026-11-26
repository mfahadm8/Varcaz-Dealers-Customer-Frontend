import React from "react";
import { useRegisterPageChrome, type PageChromeAction, type PageChromeBackTarget } from "@/contexts";
import "./shared.scss";

interface HeroProps {
  name: string;
  description: string;
  compactScope?: string;
  back?: PageChromeBackTarget;
  compactAction?: PageChromeAction;
}

const Hero: React.FC<HeroProps> = ({
  name,
  description,
  compactScope,
  back,
  compactAction,
}) => {
  useRegisterPageChrome({
    title: name,
    description,
    scopeSummary: compactScope,
    back,
    compactAction,
  });

  return (
    <div
      data-testid="page-hero-expanded"
      className="bg-neutral-900 hero-wrapper"
    >
      <div className="flex items-center app-layout h-full">
        <div>
          <p className="h2 text-white">{name}</p>
          <p className="text-white opacity-70 mt-1 font-regular">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Hero;
