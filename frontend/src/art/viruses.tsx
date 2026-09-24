import type { VirusId } from "../game/balance";
import { ArtDefs, Eyes } from "./bits";

export function VirusArt({ type, uid }: { type: VirusId; uid: string }) {
  if (type === "tin") return <Tin uid={uid} />;
  if (type === "congkich") return <Cong uid={uid} />;
  if (type === "echo") return <Echo uid={uid} />;
  if (type === "spam") return <Spam uid={uid} />;
  return <Kich uid={uid} />;
}

function Tin({ uid }: { uid: string }) {
  const id = `tin-${uid}`;
  return (
    <svg viewBox="0 0 80 80" className="h-full w-full overflow-visible">
      <ArtDefs id={id} a="#f0abfc" b="#c026d3" c="#701a75" />
      <g filter={`url(#${id}-glow)`}>
        <path d="M14 30 q6 -20 26 -16 q8 -12 22 -2 q16 2 14 22 q8 10 -2 20 q-14 16 -36 8 q-18 -6 -24 -32 z" fill={`url(#${id}-body)`} />
        <path d="M18 34 q20 -8 36 6" fill="none" stroke="#fae8ff" strokeWidth="2" opacity="0.7" />
        <path d="M48 18 l14 -8 l-2 16 z" fill="#f5d0fe" />
        <path d="M22 16 l-8 -8 l10 2 z" fill="#e879f9" />
        <path d="M30 46 q12 14 28 2" fill="none" stroke="#4a044e" strokeWidth="2" />
        <path d="M24 28 l8 6 M34 26 l6 8" stroke="#2e1064" strokeWidth="1.4" />
      </g>
      <Eyes id={id} x={40} y={36} dx={8} r={3.4} mood="sly" />
    </svg>
  );
}

function Cong({ uid }: { uid: string }) {
  const id = `cong-${uid}`;
  return (
    <svg viewBox="0 0 80 80" className="h-full w-full overflow-visible">
      <ArtDefs id={id} a="#fda4af" b="#e11d48" c="#881337" />
      <g filter={`url(#${id}-glow)`}>
        <path d="M40 8 l6 14 l16 2 l-12 10 l4 16 l-14 -8 l-14 8 l4 -16 l-12 -10 l16 -2 z" fill={`url(#${id}-body)`} />
        <path d="M18 58 q10 -16 22 -8 q8 -14 22 0 q8 -8 16 10 q-8 16 -30 16 q-22 0 -30 -18 z" fill="#be123c" />
        <path d="M8 46 l16 6 l-4 8 z M62 44 l12 10 l-14 2 z" fill="#fb7185" />
      </g>
      <Eyes id={id} x={40} y={34} dx={6} r={2.8} mood="angry" />
    </svg>
  );
}

function Echo({ uid }: { uid: string }) {
  const id = `echo-${uid}`;
  return (
    <svg viewBox="0 0 80 80" className="h-full w-full overflow-visible">
      <ArtDefs id={id} a="#ddd6fe" b="#7c3aed" c="#4c1d95" />
      <g filter={`url(#${id}-glow)`} fill="none" stroke="#c4b5fd" strokeWidth="2">
        <ellipse cx="40" cy="40" rx="30" ry="26" />
        <ellipse cx="40" cy="40" rx="22" ry="18" />
        <ellipse cx="40" cy="40" rx="12" ry="10" fill="#6d28d9" stroke="none" />
      </g>
      <g opacity="0.9">
        <Eyes id={id} x={30} y={38} dx={3} r={2} mood="sly" />
        <Eyes id={id} x={52} y={38} dx={3} r={2} mood="sly" />
      </g>
      <path d="M34 48 q6 6 12 0" fill="none" stroke="#ede9fe" strokeWidth="2" />
    </svg>
  );
}

function Spam({ uid }: { uid: string }) {
  const id = `spam-${uid}`;
  return (
    <svg viewBox="0 0 80 80" className="h-full w-full overflow-visible">
      <ArtDefs id={id} a="#fb7185" b="#be123c" c="#4c0519" />
      <g filter={`url(#${id}-glow)`}>
        <path d="M10 46 q8 -16 16 -4 q4 -14 14 -6 q6 8 4 16 q10 -8 16 2 q4 12 -6 16 q-8 10 -20 6 q-12 6 -18 -2 q-10 2 -6 -28 z" fill={`url(#${id}-body)`} />
        <circle cx="24" cy="40" r="7" fill="#9f1239" />
        <circle cx="42" cy="34" r="8" fill="#e11d48" />
        <circle cx="58" cy="44" r="6" fill="#fb7185" />
        <path d="M16 28 l4 -8 M50 22 l6 -8 M64 36 l8 -4" stroke="#fecdd3" strokeWidth="2" />
      </g>
      <Eyes id={id} x={24} y={40} dx={2} r={1.5} mood="angry" />
      <Eyes id={id} x={42} y={34} dx={2.2} r={1.6} mood="angry" />
      <Eyes id={id} x={58} y={44} dx={1.8} r={1.3} mood="angry" />
    </svg>
  );
}

function Kich({ uid }: { uid: string }) {
  const id = `kich-${uid}`;
  return (
    <svg viewBox="0 0 80 80" className="h-full w-full overflow-visible">
      <ArtDefs id={id} a="#e879f9" b="#7c3aed" c="#9f1239" />
      <g filter={`url(#${id}-glow)`}>
        <path d="M40 6 l4 10 l8 -4 l-2 10 l10 2 l-8 6 l6 8 l-10 0 l0 8 l-8 -6 l-8 6 l0 -8 l-10 0 l6 -8 l-8 -6 l10 -2 l-2 -10 l8 4 z" fill={`url(#${id}-body)`} />
        <path d="M28 58 q12 16 24 0" fill="none" stroke="#fae8ff" strokeWidth="2" />
        <path d="M22 64 q4 10 10 8 M58 64 q-4 10 -10 8" stroke="#c026d3" strokeWidth="2" fill="none" />
        <path d="M18 70 h10 M52 70 h10" stroke="#f0abfc" strokeWidth="2" />
      </g>
      <Eyes id={id} x={40} y={32} dx={6} r={2.8} mood="angry" />
      <path d="M34 42 q6 5 12 0" fill="none" stroke="#2e1064" strokeWidth="2" />
    </svg>
  );
}
