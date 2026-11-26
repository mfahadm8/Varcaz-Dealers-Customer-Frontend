import advisorIcon from "@/assets/AI advisor.svg";
import "./AnimatedAdvisorOrb.css";

type AdvisorOrbSize = "nav" | "panel" | "hero";

export function AnimatedAdvisorOrb({
  size = "panel",
  className = "",
}: {
  size?: AdvisorOrbSize;
  className?: string;
}) {
  return (
    <span
      className={`advisor-orb advisor-orb--${size} ${className}`}
      aria-hidden="true"
    >
      <span className="advisor-orb__core">
        <img src={advisorIcon} alt="" />
      </span>
    </span>
  );
}
