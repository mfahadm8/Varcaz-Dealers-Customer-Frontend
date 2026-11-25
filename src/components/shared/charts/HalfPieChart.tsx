import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";

interface Props {
  value?: number;
  unavailableLabel?: string;
  colors?: string[];
  size?: number;
  valueFont?: number;
  sufix?: string;
  mt?: string;
  showLabel?: boolean;
  strokeWidth?: number;
}

const HalfPieChart: React.FC<Props> = ({
  value,
  unavailableLabel,
  colors,
  size = 260,
  valueFont = 50,
  sufix = "",
  mt = "mt-14",
  showLabel = true,
  strokeWidth = 7,
}) => {
  const [animatedValue, setAnimatedValue] = useState(0);

  // Normalize value to be between 0-100
  const normalizedValue = Math.min(100, Math.max(0, value ?? 0));

  // Animate value changes
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedValue(normalizedValue);
    }, 100);
    return () => clearTimeout(timer);
  }, [normalizedValue]);

  // Determine color and label based on value
  const getColorAndLabel = (val: number) => {
    if (val >= 70) {
      return {
        color: "#82C441", // Green
        label: "Excellent",
      };
    } else if (val >= 50) {
      return {
        color: "#FF802D",
        label: "Poor",
      };
    } else {
      return {
        color: "#DC425F", // Red
        label: "Very Poor",
      };
    }
  };

  const unavailable = Boolean(unavailableLabel);
  const { color: derivedColor, label } = unavailable
    ? { color: "#A3A3A3", label: unavailableLabel ?? "Unavailable" }
    : getColorAndLabel(value ?? 0);
  const color = colors?.[0] || derivedColor;
  const trackColor = colors?.[1] || "#E5E7EB";

  // SVG parameters
  const viewBoxSize = 100;
  const centerX = viewBoxSize / 2;
  const centerY = viewBoxSize / 2;
  const radius = 40;

  // Calculate circumference
  const circumference = radius * 2 * Math.PI;

  // MODIFIED: Setting arc angle to 250° to create a 110° opening at the bottom
  const arcAngle = 250;
  const arcLength = circumference * (arcAngle / 360);

  // Calculate how much of the arc should be colored based on the progress value
  const progressArc = arcLength * (animatedValue / 100);

  // Calculate stroke-dasharray and stroke-dashoffset for the progress arc
  const dashArray = `${arcLength} ${circumference}`;

  // MODIFIED: For a 250° arc with opening centered at bottom, rotate 145°
  const rotation = 145;

  // Calculate positions for dots along the gauge
  const dots = [];
  const dotCount = 25;
  const dotRadius = 0.6;
  const dotRadius2 = radius - strokeWidth + 0;

  for (let i = 0; i < dotCount; i++) {
    // Calculate the angle in the range of 0-250 degrees
    const angle = (i / (dotCount - 1)) * arcAngle;

    // Convert to radians and adjust for the rotation
    const angleInRadians = ((angle + rotation) % 360) * (Math.PI / 180);

    // Calculate the dot position
    const x = centerX + dotRadius2 * Math.cos(angleInRadians);
    const y = centerY + dotRadius2 * Math.sin(angleInRadians);

    // Determine if the dot should be active based on the progress
    const isActive = !unavailable && (i / (dotCount - 1)) * 100 <= animatedValue;

    dots.push({
      id: i,
      cx: x,
      cy: y,
      active: isActive,
    });
  }

  return (
    <div className="relative" style={{ width: size, height: size - 8 }}>
      <svg
        width="100%"
        height="100%"
        viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}
      >
        {/* Track Circle (background) */}
        <circle
          cx={centerX}
          cy={centerY}
          r={radius}
          fill="none"
          stroke={trackColor}
          strokeWidth={strokeWidth}
          strokeDasharray={dashArray}
          strokeDashoffset="0"
          strokeLinecap="round"
          style={{
            transform: `rotate(${rotation}deg)`,
            transformOrigin: "center center",
          }}
          opacity={0.5}
        />

        {/* Progress Circle */}
        <motion.circle
          cx={centerX}
          cy={centerY}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={dashArray}
          strokeLinecap="round"
          style={{
            transform: `rotate(${rotation}deg)`,
            transformOrigin: "center center",
          }}
          strokeDashoffset={arcLength}
          animate={{
            strokeDashoffset: arcLength - progressArc,
          }}
          transition={{ duration: 1, ease: "easeOut" }}
        />

        {/* Dots */}
        {dots.map((dot) => (
          <motion.circle
            key={dot.id}
            cx={dot.cx}
            cy={dot.cy}
            r={dotRadius}
            fill={dot.active ? color : "#CBD5E1"}
            initial={{ opacity: 0 }}
            animate={{ opacity: dot.active ? 1 : 0.7 }}
            transition={{ duration: 0.4 }}
          />
        ))}
      </svg>

      {/* Value display with % */}
      <motion.div
        className="absolute inset-0 -mt-7 flex items-center justify-center pt-2"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.span
          className="h2 !font-medium"
          style={{ color, fontSize: `${valueFont}px` }}
          key={unavailable ? "unavailable" : Math.round(animatedValue)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {unavailable ? "—" : Math.round(animatedValue)}
          {unavailable ? "" : sufix ?? ""}
        </motion.span>
      </motion.div>

      {/* Label */}
      {showLabel ? (
        <motion.div
          className={cn(
            "absolute left-0 right-0 flex justify-center top-1/2 ",
            mt
          )}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <motion.div
            className="px-2.5 py-0.5 rounded-full text-white text-xs font-medium"
            style={{ backgroundColor: color }}
          >
            {label}
          </motion.div>
        </motion.div>
      ) : null}
    </div>
  );
};
export default HalfPieChart;
