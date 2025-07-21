import React, { useRef, useEffect, useState } from "react";

interface FuzzyTextProps {
  children: React.ReactNode;
  fontSize?: number | string;
  fontWeight?: string | number;
  fontFamily?: string;
  color?: string;
  enableHover?: boolean;
  baseIntensity?: number;
  hoverIntensity?: number;
  className?: string;
}

const FuzzyText: React.FC<FuzzyTextProps> = ({
  children,
  fontSize = "clamp(2rem, 8vw, 8rem)",
  fontWeight = 900,
  fontFamily = "inherit",
  color = "#fff",
  enableHover = true,
  baseIntensity = 0.18,
  hoverIntensity = 0.5,
  className = "",
}) => {
  const textRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const element = textRef.current;
    if (!element) return;

    const intensity = isHovered ? hoverIntensity : baseIntensity;

    // Create the fuzzy text effect using CSS filters and text-shadow
    const fuzzAmount = intensity * 2;
    const shadowBlur = intensity * 10;

    element.style.filter = `blur(${fuzzAmount}px) contrast(${1 + intensity})`;
    element.style.textShadow = `
      0 0 ${shadowBlur}px ${color}40,
      0 0 ${shadowBlur * 2}px ${color}20,
      0 0 ${shadowBlur * 3}px ${color}10
    `;
  }, [isHovered, baseIntensity, hoverIntensity, color]);

  const handleMouseEnter = () => {
    if (enableHover) {
      setIsHovered(true);
    }
  };

  const handleMouseLeave = () => {
    if (enableHover) {
      setIsHovered(false);
    }
  };

  return (
    <div
      ref={textRef}
      className={`fuzzy-text ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        fontSize,
        fontWeight,
        fontFamily,
        color,
        cursor: enableHover ? "pointer" : "default",
        display: "inline-block",
        transition: "all 0.3s ease-in-out",
        userSelect: "none",
        position: "relative",
      }}
    >
      {children}
    </div>
  );
};

export default FuzzyText;
