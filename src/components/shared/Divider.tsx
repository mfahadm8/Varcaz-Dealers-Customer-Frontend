import React from "react";
import { cn } from "@/utils/cn";

interface DividerProps {
  className?: string; // optional extra styling
  color?: string; // optional divider color
}

const Divider: React.FC<DividerProps> = ({
  className,
  color = "bg-neutral-100",
}) => {
  return (
    <div className={cn("w-full", className)}>
      <div className={cn("w-full h-[1px]", color)} />
    </div>
  );
};

export default Divider;
