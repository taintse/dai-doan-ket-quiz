import type { UnitId } from "../game/balance";
import { ArtDefs, Eyes } from "./bits";

export function UnitArt({ type, uid }: { type: UnitId; uid: string }) {
  if (type === "den") return <Den uid={uid} />;
  if (type === "tuong") return <Tuong uid={uid} />;
  if (type === "phan") return <Phan uid={uid} />;
  if (type === "cau") return <Cau uid={uid} />;
  return <Moc uid={uid} />;
}

function Den({ uid }: { uid: string }) {
  const id = `den-${uid}`;
  return (
    <svg viewBox="0 0 80 80" className="h-full w-full overflow-visible">
      <ArtDefs id={id} a="#fde68a" b="#f59e0b" c="#b45309" />
      <g filter={`url(#${id}-glow)`}>
        <path d="M18 70 h44 l-6 -8 h-32 z" fill={`url(#${id}-body)`} />
        <path d="M24 62 h32 v-6 q0 -4 -6 -4 h-20 q-6 0 -6 4 z" fill="#78350f" />
        <path d="M36 52 h8 v-16 h-8 z" fill="#fbbf24" />
        <path d="M22 38 h36 l-4 8 h-28 z" fill="#f59e0b" />
        <path d="M18 36 q22 -28 44 0 q-6 10 -22 10 q-16 0 -22 -10 z" fill={`url(#${id}-body)`} />
        <path d="M30 18 q10 -16 20 0" fill="none" stroke="#fef3c7" strokeWidth="2" />
        <path d="M14 30 q8 -2 10 6 M66 30 q-8 -2 -10 6" fill="none" stroke="#fde68a" strokeWidth="2" strokeLinecap="round" />
      </g>
      <Eyes id={id} x={40} y={30} dx={6} r={2.7} />
      <path d="M40 8 l2 6 h-4 z" fill="#fff7d6" opacity="0.9" />
    </svg>
  );
}

function Tuong({ uid }: { uid: string }) {
  const id = `tuong-${uid}`;
  return (
    <svg viewBox="0 0 80 80" className="h-full w-full overflow-visible">
      <ArtDefs id={id} a="#6ee7b7" b="#059669" c="#064e3b" />
      <g filter={`url(#${id}-glow)`}>
        <path d="M10 18 h60 v40 h-10 l-4 12 h-32 l-4 -12 h-10 z" fill={`url(#${id}-body)`} />
        <path d="M18 26 h44 v22 h-44 z" fill="#022c22" opacity="0.35" />
        <path d="M24 34 h14 l-2 10 h-10 z M44 34 h12 l-2 10 h-8 z" fill="#a7f3d0" />
        <circle cx="28" cy="24" r="6" fill="#34d399" />
        <circle cx="52" cy="24" r="6" fill="#10b981" />
        <path d="M36 48 h8" stroke="#ecfdf5" strokeWidth="3" strokeLinecap="round" />
      </g>
      <Eyes id={id} x={28} y={24} dx={2.2} r={1.5} />
      <Eyes id={id} x={52} y={24} dx={2.2} r={1.5} />
    </svg>
  );
}

function Phan({ uid }: { uid: string }) {
  const id = `phan-${uid}`;
  return (
    <svg viewBox="0 0 80 80" className="h-full w-full overflow-visible">
      <ArtDefs id={id} a="#a5f3fc" b="#0891b2" c="#164e63" />
      <g filter={`url(#${id}-glow)`}>
        <path d="M22 70 q8 -24 6 -36 q10 6 14 2 q2 16 8 28 q-6 8 -20 8 q-6 0 -8 -2 z" fill={`url(#${id}-body)`} />
        <circle cx="34" cy="28" r="9" fill="#22d3ee" />
        <path d="M40 34 q16 -2 24 8" fill="none" stroke="#cffafe" strokeWidth="3" strokeLinecap="round" />
        <path d="M46 24 q18 6 22 18" fill="none" stroke="#67e8f9" strokeWidth="3" />
        <path d="M44 30 q20 2 28 10" fill="none" stroke="#155e75" strokeWidth="1.4" />
        <path d="M62 20 l8 6 l-10 2 z" fill="#ecfeff" />
        <path d="M18 46 q-8 2 -6 10" stroke="#22d3ee" strokeWidth="3" fill="none" strokeLinecap="round" />
      </g>
      <Eyes id={id} x={34} y={28} dx={3} r={2.2} />
    </svg>
  );
}

function Cau({ uid }: { uid: string }) {
  const id = `cau-${uid}`;
  return (
    <svg viewBox="0 0 80 80" className="h-full w-full overflow-visible">
      <ArtDefs id={id} a="#fde68a" b="#22d3ee" c="#0e7490" />
      <g filter={`url(#${id}-glow)`}>
        <path d="M8 62 q16 -28 24 -8" fill="none" stroke="#fbbf24" strokeWidth="4" strokeLinecap="round" />
        <path d="M72 62 q-16 -28 -24 -8" fill="none" stroke="#22d3ee" strokeWidth="4" strokeLinecap="round" />
        <path d="M16 58 q24 -26 48 0" fill="none" stroke="#e0f2fe" strokeWidth="3" />
        <circle cx="20" cy="40" r="8" fill="#f59e0b" />
        <circle cx="60" cy="40" r="8" fill="#06b6d4" />
        <path d="M26 48 q14 -8 28 0" fill="none" stroke="#fff" strokeWidth="2" opacity="0.8" />
        <path d="M12 70 h18 q2 -12 -2 -16 M50 70 h18 q-2 -12 2 -16" fill="#134e4a" opacity="0.9" />
      </g>
      <Eyes id={id} x={20} y={40} dx={2.6} r={1.8} />
      <Eyes id={id} x={60} y={40} dx={2.6} r={1.8} />
    </svg>
  );
}

function Moc({ uid }: { uid: string }) {
  const id = `moc-${uid}`;
  return (
    <svg viewBox="0 0 80 80" className="h-full w-full overflow-visible">
      <ArtDefs id={id} a="#ddd6fe" b="#7c3aed" c="#22d3ee" />
      <g filter={`url(#${id}-glow)`}>
        <path d="M28 74 h24 l4 -10 h-32 z" fill="#4c1d95" />
        <rect x="34" y="28" width="12" height="38" rx="3" fill={`url(#${id}-body)`} />
        <circle cx="40" cy="30" r="16" fill="none" stroke="#22d3ee" strokeWidth="3" />
        <circle cx="40" cy="30" r="10" fill="none" stroke="#c4b5fd" strokeWidth="2" />
        <circle cx="40" cy="30" r="5" fill="#ede9fe" />
      </g>
      <Eyes id={id} x={40} y={30} dx={0.1} r={2.4} />
    </svg>
  );
}
