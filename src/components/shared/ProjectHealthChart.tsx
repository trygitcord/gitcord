import React from "react";

interface ProjectHealthChartProps {
  score: number; // 0-100
  size?: number; // px
}

function getHealthLabel(score: number) {
  if (score >= 80) return "Healthy";
  if (score >= 50) return "Moderate";
  return "Stale";
}

function getHealthColor(score: number) {
  if (score >= 80) return "#5BC898"; // green
  if (score >= 50) return "#FFC107"; // yellow
  return "#FF7043"; // orange/red
}

const ProjectHealthChart: React.FC<ProjectHealthChartProps> = ({ score, size = 56 }) => {
  const radius = (size - 8) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.max(0, Math.min(score, 100)) / 100;
  const offset = circumference * (1 - progress);
  const color = getHealthColor(score);
  const label = getHealthLabel(score);

  return (
    <div style={{ width: size, height: size, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
      <svg width={size} height={size}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#E0E0E0"
          strokeWidth={6}
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={6}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 0.5s" }}
        />
        <text
          x="50%"
          y="70%"
          textAnchor="middle"
          dominantBaseline="central"
          fontSize={size * 0.32}
          fontWeight="bold"
          fill="#fff"
        >
          {score}
        </text>
      </svg>
      <span style={{ fontSize: size * 0.18, color, fontWeight: 500, marginTop: 2 }}>{label}</span>
    </div>
  );
};

export default ProjectHealthChart; 