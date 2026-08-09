// Brand "JS" monogram as an inline SVG. Vector -> crisp at any size
// (including the 22x22 navbar slot), and inherits no raster blur.
// Blue gradient matches the site's brand palette.

type Props = {
  className?: string;
  size?: number;
  title?: string;
};

export default function LogoMark({
  className,
  size = 22,
  title = "Japnam.tech logo",
}: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      role="img"
      aria-label={title}
      className={className}
    >
      <defs>
        <linearGradient id="jm-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="55%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#8b5cf6" />
        </linearGradient>
        <linearGradient id="jm-grad2" x1="1" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#22d3ee" />
          <stop offset="100%" stopColor="#6366f1" />
        </linearGradient>
      </defs>

      {/* Outer ring */}
      <circle
        cx="32"
        cy="32"
        r="28"
        fill="none"
        stroke="url(#jm-grad)"
        strokeWidth="4"
      />

      {/* Stylized "J" */}
      <path
        d="M24 18 L24 38 Q24 46 32 46 Q39 46 39 39"
        fill="none"
        stroke="url(#jm-grad2)"
        strokeWidth="4.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Stylized "S" */}
      <path
        d="M44 22 Q36 18 33 24 Q30 30 38 32 Q46 34 43 40 Q40 46 33 42"
        fill="none"
        stroke="url(#jm-grad)"
        strokeWidth="4.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
