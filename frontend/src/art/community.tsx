import { ArtDefs } from "./bits";

const COLORS = [
  ["#fde68a", "#f59e0b"],
  ["#6ee7b7", "#059669"],
  ["#a5f3fc", "#0891b2"],
];

export function CommunityPod({ bonds, uid }: { bonds: number; uid: string }) {
  const id = `com-${uid}`;
  const dim = bonds <= 0 ? 0.35 : bonds === 1 ? 0.6 : 1;
  return (
    <svg viewBox="0 0 96 80" className="h-full w-full overflow-visible">
      <ArtDefs id={id} a="#fde68a" b="#34d399" c="#22d3ee" />
      <g opacity={dim} filter={`url(#${id}-glow)`}>
        <rect x="6" y="10" width="84" height="62" rx="16" fill="#07111f" stroke="#22d3ee" strokeOpacity="0.45" />
        {COLORS.map(([a, b], i) => (
          <g key={a} transform={`translate(${16 + i * 24} 18)`}>
            <path d={`M4 40 q8 -16 16 -2 q-2 10 -16 8 z`} fill={b} opacity={bonds >= 3 - i ? 1 : 0.25} />
            <circle cx="12" cy="16" r="7" fill={a} opacity={bonds >= 3 - i ? 1 : 0.25} />
            <circle cx="10" cy="15.5" r="1.1" fill="#082f49" />
            <circle cx="14.2" cy="15.5" r="1.1" fill="#082f49" />
          </g>
        ))}
        <path d="M48 8 v8" stroke="#fbbf24" strokeWidth="2" />
        <circle cx="48" cy="8" r="3" fill={bonds > 0 ? "#fde68a" : "#475569"} />
      </g>
      {bonds <= 0 && (
        <path d="M16 20 l64 44 M20 64 l60 -46" stroke="#fb7185" strokeWidth="2" opacity="0.8" />
      )}
    </svg>
  );
}
