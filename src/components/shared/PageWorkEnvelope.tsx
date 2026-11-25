import type { PropsWithChildren } from "react";
import { cn } from "@/utils/cn";

type PageWorkEnvelopeProps = PropsWithChildren<{
  className?: string;
}>;

/**
 * Keeps the white work surface visually attached beneath compact navigation.
 * The body stays in normal document flow; the sticky dock is decorative only.
 */
export function PageWorkEnvelope({
  children,
  className,
}: PageWorkEnvelopeProps) {
  return (
    <section
      className="page-work-envelope page-chrome-main"
      data-testid="page-work-envelope"
    >
      <div
        aria-hidden="true"
        className="page-work-envelope-dock"
        data-testid="page-work-envelope-cap"
      >
        <div className="page-work-envelope-cap-fill" />
      </div>
      <main className={cn("page-work-envelope-body app-layout", className)}>
        {children}
      </main>
    </section>
  );
}
