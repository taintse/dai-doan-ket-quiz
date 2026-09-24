export function ArtDefs({ id, a, b, c }: { id: string; a: string; b: string; c?: string }) {
  return (
    <defs>
      <linearGradient id={`${id}-body`} x1="20%" y1="0%" x2="80%" y2="100%">
        <stop offset="0%" stopColor={a} />
        <stop offset="55%" stopColor={b} />
        <stop offset="100%" stopColor={c ?? b} />
      </linearGradient>
      <radialGradient id={`${id}-eye`} cx="40%" cy="35%" r="65%">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="35%" stopColor={a} />
        <stop offset="100%" stopColor={b} />
      </radialGradient>
      <filter id={`${id}-glow`} x="-45%" y="-45%" width="190%" height="190%">
        <feGaussianBlur stdDeviation="2.2" result="blur" />
        <feMerge>
          <feMergeNode in="blur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>
  );
}

export function Eyes({
  id,
  x,
  y,
  dx = 7,
  r = 3.2,
  mood = "calm",
}: {
  id: string;
  x: number;
  y: number;
  dx?: number;
  r?: number;
  mood?: "calm" | "angry" | "sly";
}) {
  const brow = mood === "angry" ? -2.2 : mood === "sly" ? 1.4 : 0;
  return (
    <g filter={`url(#${id}-glow)`}>
      {mood !== "calm" && (
        <g stroke="#1a1024" strokeWidth="1.4" strokeLinecap="round" fill="none">
          <path d={`M${x - dx - r} ${y - r - 1 + brow} l${r * 1.7} ${mood === "angry" ? 2.2 : -1.2}`} />
          <path d={`M${x + dx + r} ${y - r - 1 + brow} l${-r * 1.7} ${mood === "angry" ? 2.2 : -1.2}`} />
        </g>
      )}
      <ellipse cx={x - dx} cy={y} rx={r} ry={r * 1.15} fill={`url(#${id}-eye)`} />
      <ellipse cx={x + dx} cy={y} rx={mood === "sly" ? r * 0.7 : r} ry={r * 1.15} fill={`url(#${id}-eye)`} />
      <circle cx={x - dx - 0.7} cy={y + 0.4} r={1.05} fill="#14081c" />
      <circle cx={x + dx - 0.2} cy={y + 0.4} r={mood === "sly" ? 0.7 : 1.05} fill="#14081c" />
      <circle cx={x - dx - 1.3} cy={y - 0.8} r={0.55} fill="#fff" />
    </g>
  );
}
