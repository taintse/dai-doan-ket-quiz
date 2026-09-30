import type { ReactNode } from "react";
import { CommunityPod } from "../art/community";
import { UnitArt } from "../art/units";
import { VirusArt } from "../art/viruses";

const STARS: Array<[number, number, number, number]> = [
  [8, 12, 1.2, 0.7],
  [16, 28, 0.8, 0.45],
  [24, 8, 1.4, 0.8],
  [33, 22, 0.7, 0.4],
  [41, 6, 1.1, 0.65],
  [52, 16, 0.9, 0.5],
  [61, 9, 1.5, 0.85],
  [70, 24, 0.8, 0.4],
  [78, 7, 1.2, 0.7],
  [88, 18, 0.7, 0.45],
  [94, 11, 1.3, 0.75],
  [12, 40, 0.6, 0.3],
  [47, 34, 0.8, 0.35],
  [73, 38, 0.7, 0.3],
  [29, 18, 0.5, 0.55],
  [85, 32, 1, 0.4],
];

function SharedSun() {
  const rays = Array.from({ length: 18 }, (_, i) => {
    const angle = (i / 18) * Math.PI * 2;
    const long = i % 2 === 0 ? 92 : 68;
    return {
      x: 100 + Math.cos(angle) * long,
      y: 100 + Math.sin(angle) * long,
      wide: i % 2 === 0,
    };
  });
  return (
    <svg viewBox="0 0 200 200" className="poster-core h-full w-full overflow-visible">
      <defs>
        <radialGradient id="poster-sun" cx="50%" cy="42%" r="60%">
          <stop offset="0%" stopColor="#fffbeb" />
          <stop offset="42%" stopColor="#fbbf24" />
          <stop offset="100%" stopColor="#d97706" />
        </radialGradient>
      </defs>
      <g className="poster-rays">
        {rays.map((ray, i) => (
          <line
            key={i}
            x1="100"
            y1="100"
            x2={ray.x}
            y2={ray.y}
            stroke={ray.wide ? "#fff7d6" : "#fde68a"}
            strokeWidth={ray.wide ? 2.6 : 1.2}
            strokeLinecap="round"
            opacity={ray.wide ? 0.75 : 0.4}
          />
        ))}
      </g>
      <circle cx="100" cy="100" r="64" fill="rgba(251,191,36,0.14)" />
      <circle cx="100" cy="100" r="46" fill="none" stroke="#67e8f9" strokeWidth="1.4" opacity="0.75" />
      <circle cx="100" cy="100" r="34" fill="url(#poster-sun)" />
      <circle cx="88" cy="90" r="8" fill="#fff" opacity="0.55" />
    </svg>
  );
}

export function HomeArt() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <div className="poster-sky absolute inset-0" />
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        {STARS.map(([x, y, r, o]) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r={r * 0.18} fill="#e0f2fe" opacity={o} />
        ))}
      </svg>
      <div className="poster-floor" />
      <div className="poster-vignette absolute inset-0" />
    </div>
  );
}

function Cast({
  className,
  delay,
  children,
}: {
  className: string;
  delay: string;
  children: ReactNode;
}) {
  return (
    <div className={`absolute aspect-square ${className}`}>
      <div className="bob h-full w-full" style={{ animationDelay: delay }}>
        {children}
      </div>
    </div>
  );
}

export function HomeCast() {
  return (
    <div className="pointer-events-none relative mx-auto h-full w-full max-w-5xl" aria-hidden>
      <div className="poster-beam absolute left-[6%] right-[6%] top-[58%] h-px" />
      <Cast className="bottom-[2%] left-[1%] w-[22%] max-w-[9.5rem]" delay="0.15s">
        <CommunityPod bonds={3} uid="poster-com" />
      </Cast>
      <Cast className="bottom-[12%] left-[18%] w-[17%] max-w-[7.5rem]" delay="0.55s">
        <UnitArt type="tuong" uid="poster-tuong" />
      </Cast>
      <Cast className="bottom-[24%] left-[31%] w-[15%] max-w-[6.5rem]" delay="0.9s">
        <UnitArt type="den" uid="poster-den" />
      </Cast>
      <div className="absolute left-1/2 top-1/2 w-[34%] max-w-[15rem] -translate-x-1/2 -translate-y-[58%]">
        <SharedSun />
      </div>
      <Cast className="bottom-[20%] right-[30%] w-[14%] max-w-[6rem] opacity-75" delay="0.35s">
        <VirusArt type="echo" uid="poster-echo" />
      </Cast>
      <Cast className="bottom-[6%] right-[15%] w-[18%] max-w-[8rem]" delay="0.7s">
        <VirusArt type="congkich" uid="poster-cong" />
      </Cast>
      <Cast className="bottom-0 right-0 w-[22%] max-w-[10rem]" delay="1.1s">
        <VirusArt type="kichdong" uid="poster-kich" />
      </Cast>
    </div>
  );
}
