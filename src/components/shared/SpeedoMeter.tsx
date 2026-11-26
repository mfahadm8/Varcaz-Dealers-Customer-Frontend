import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface Props {
  value: number; // Range 0 to 10
  size?: number;
}

const Speedometer: React.FC<Props> = ({ value, size = 230 }) => {
  const [animatedValue, setAnimatedValue] = useState(0);
  const normalizedValue = value;

  useEffect(() => {
    const timer = setTimeout(() => setAnimatedValue(normalizedValue), 100);
    return () => clearTimeout(timer);
  }, [normalizedValue]);

  // --- CONFIGURATION ---
  const cx = size / 2;
  const cy = size / 2;
  const radius = 100;
  const strokeWidth = 18;

  // Arc spans 250 degrees instead of 180
  const arcAngle = 230;
  const startAngle = -204; // Places the opening at the bottom
  const endAngle = startAngle + arcAngle;

  // For the segments
  const segment1End = startAngle + arcAngle / 3;
  const segment2End = startAngle + (arcAngle * 2) / 3;

  // --- STATUS LOGIC ---
  const getStatus = (val: number) => {
    if (val <= 3)
      return {
        label: "Low",
        bg: "#F9B70E",
        text: "white",
        needle: "#222222",
      };
    if (val <= 6)
      return {
        label: "Warning",
        bg: "#FF802D",
        text: "#ffff",
        needle: "#222222",
      };
    return {
      label: "Critical",
      bg: "#DC425F",
      text: "#FFFFFF",
      needle: "#222222",
    };
  };

  const status = getStatus(normalizedValue);

  // --- NEEDLE LOGIC ---
  // Map value 0-10 to the angle range
  const needleAngle = startAngle + (arcAngle * animatedValue) / 10;

  // --- HELPER FUNCTIONS ---
  // Convert angle to X,Y coordinates
  const angleToCoord = (angle: number, r: number): { x: number; y: number } => {
    const rad = (angle * Math.PI) / 180;
    return {
      x: cx + r * Math.cos(rad),
      y: cy + r * Math.sin(rad),
    };
  };

  // Create an SVG arc path
  const createArc = (
    startAngle: number,
    endAngle: number,
    r: number
  ): string => {
    const start = angleToCoord(startAngle, r);
    const end = angleToCoord(endAngle, r);
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

    return `
      M ${start.x} ${start.y}
      A ${r} ${r} 0 ${largeArcFlag} 1 ${end.x} ${end.y}
    `;
  };

  // Generate dots along the arc
  const generateDots = () => {
    const dots: Array<{ id: number; cx: number; cy: number }> = [];
    const dotCount = 25;
    const dotArcRadius = radius - strokeWidth - 5;

    for (let i = 0; i < dotCount; i++) {
      const angle = startAngle + (arcAngle * i) / (dotCount - 1);
      const pos = angleToCoord(angle, dotArcRadius);

      dots.push({
        id: i,
        cx: pos.x,
        cy: pos.y,
      });
    }

    return dots;
  };

  const dots = generateDots();

  // Calculate needle positions for the tapered design
  const needleLength = 85;
  const needleTip = angleToCoord(needleAngle, needleLength);

  // Calculate points for the base with some width
  const baseWidth = 12;

  // Move needle center point slightly below the actual center
  const needleOffsetY = 18; // Offset to move needle down
  const needleCenterX = cx;
  const needleCenterY = cy + needleOffsetY;

  // Recalculate base points with the new center
  const baseAngleLeft = needleAngle + 90;
  const baseAngleRight = needleAngle - 90;
  const baseLeft = {
    x:
      needleCenterX +
      (baseWidth / 2) * Math.cos((baseAngleLeft * Math.PI) / 180),
    y:
      needleCenterY +
      (baseWidth / 2) * Math.sin((baseAngleLeft * Math.PI) / 180),
  };
  const baseRight = {
    x:
      needleCenterX +
      (baseWidth / 2) * Math.cos((baseAngleRight * Math.PI) / 180),
    y:
      needleCenterY +
      (baseWidth / 2) * Math.sin((baseAngleRight * Math.PI) / 180),
  };

  // Calculate a control point for the rounded bottom
  const controlPointDistance = 5;
  const controlPoint = {
    x:
      needleCenterX +
      controlPointDistance * Math.cos(((needleAngle + 180) * Math.PI) / 180),
    y:
      needleCenterY +
      controlPointDistance * Math.sin(((needleAngle + 180) * Math.PI) / 180),
  };

  // Create the needle path with a rounded bottom using quadratic bezier
  const needlePath = `
    M ${baseLeft.x},${baseLeft.y} 
    L ${needleTip.x},${needleTip.y} 
    L ${baseRight.x},${baseRight.y}
    Q ${controlPoint.x},${controlPoint.y} ${baseLeft.x},${baseLeft.y}
    Z
  `;

  return (
    <div
      className="relative flex flex-col items-center"
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Track Segments */}
        <path
          d={createArc(startAngle, segment1End, radius)}
          stroke="#F9B70E"
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
        />
        <path
          d={createArc(segment1End, segment2End, radius)}
          stroke="#FF802D"
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
        />
        <path
          d={createArc(segment2End, endAngle, radius)}
          stroke="#DC425F"
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
        />

        {/* Dots */}
        {dots.map((dot) => (
          <circle key={dot.id} cx={dot.cx} cy={dot.cy} r={1.5} fill="#CBD5E1" />
        ))}

        {/* Tapered Needle with Rounded Bottom */}
        <motion.path
          d={needlePath}
          fill={status.needle}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        />

        {/* Add a small circle at the offset center for a more polished look */}
        <circle
          cx={needleCenterX}
          cy={needleCenterY}
          r={7.5}
          fill={status.needle}
        />
      </svg>

      {/* Center Value Display */}
      <div className="absolute inset-0 top-32 flex flex-col items-center justify-center">
        <div
          className="px-3 py-1 -mt-5 rounded-full body-sm  "
          style={{ backgroundColor: status.bg, color: status.text }}
        >
          {status.label}
        </div>
      </div>
    </div>
  );
};

export default Speedometer;
