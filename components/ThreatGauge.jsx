// Semi-circular 0-100 gauge. Uses SVG's pathLength normalization
// (pathLength="100" on the path) so the dash array is just [score, 100]
// regardless of actual arc geometry — avoids hand-computing circumference.
const ARC_PATH = 'M14 92 A78 78 0 0 1 166 92';

export default function ThreatGauge({ score, color, size = 140 }) {
  return (
    <svg viewBox="0 0 180 100" width={size} height={(size * 100) / 180} className="overflow-visible">
      <path d={ARC_PATH} fill="none" stroke="currentColor" strokeWidth="14" strokeLinecap="round" className="text-white/10" />
      <path
        d={ARC_PATH}
        fill="none"
        stroke={color}
        strokeWidth="14"
        strokeLinecap="round"
        pathLength="100"
        strokeDasharray={`${score} 100`}
      />
    </svg>
  );
}
