// Brand "JS" monogram — faithful, crisp recreation of the original logo:
// a glossy blue circular ring enclosing an italic serif "JS", using the
// original blue gradient (light cyan -> royal blue -> deep navy).
//
// Vector = sharp at any size (including the 22-24px navbar slot). Transparent
// background so it reads on both the light header and any surface.
//
// If you later obtain the original vector source, drop it in and delete this.

import { useId } from "react";

type Props = {
  size?: number;
  className?: string;
};

export default function LogoMark({ size = 24, className }: Props) {
  const gid = useId().replace(/:/g, "");
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={className}
      role="img"
      aria-label="Japnam Singh logo"
    >
      <defs>
        <linearGradient id={`js-${gid}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#A3D5FF" />
          <stop offset="45%" stopColor="#2B8CD9" />
          <stop offset="100%" stopColor="#004080" />
        </linearGradient>
      </defs>

      {/* glossy blue ring */}
      <circle
        cx="50"
        cy="50"
        r="41"
        fill="none"
        stroke={`url(#js-${gid})`}
        strokeWidth="8"
      />
      {/* specular highlight on the ring (top-left), for the glossy look */}
      <path
        d="M 19 38 A 41 41 0 0 1 50 9"
        fill="none"
        stroke="#FFFFFF"
        strokeOpacity="0.75"
        strokeWidth="3"
        strokeLinecap="round"
      />

      {/* italic serif JS monogram, centered */}
      <text
        x="50"
        y="52"
        textAnchor="middle"
        dominantBaseline="central"
        fontFamily="Georgia, 'Times New Roman', serif"
        fontStyle="italic"
        fontWeight="700"
        fontSize="44"
        letterSpacing="-2"
        fill={`url(#js-${gid})`}
      >
        JS
      </text>
    </svg>
  );
}
