import Link from "next/link";
export function Arrow() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path d="M4 12h15M13 5l7 7-7 7" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}
export function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <span className={`brand ${compact ? "compact" : ""}`}>
      <svg
        width="32"
        height="32"
        viewBox="0 0 36 36"
        fill="none"
        aria-hidden="true"
      >
        <path d="M18 1v8m0 18v8M1 18h8m18 0h8" stroke="currentColor" />
        <circle cx="18" cy="18" r="11" stroke="currentColor" />
        <path d="m18 9 5 14-5-3-5 3 5-14Z" fill="currentColor" />
        <circle cx="18" cy="18" r="2" fill="var(--paper)" />
      </svg>
      {!compact && (
        <span>
          FIELD COUNCIL<small>FOR SURVEYING OWNERS</small>
        </span>
      )}
    </span>
  );
}
export function Header({ simple = false }: { simple?: boolean }) {
  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <header className="header wrap">
        <Link href="/" aria-label="Field Council home">
          <Brand />
        </Link>
        {!simple && (
          <nav aria-label="Main navigation">
            <Link href="/#the-council">The council</Link>
            <Link href="/#membership">Membership</Link>
            <Link href="/#questions">Questions</Link>
          </nav>
        )}
        {simple ? (
          <Link href="/" className="back-link">
            ← Back to the council
          </Link>
        ) : (
          <Link href="/apply" className="header-cta">
            Apply to join <Arrow />
          </Link>
        )}
      </header>
    </>
  );
}
export function Footer() {
  return (
    <footer className="footer wrap">
      <Link href="/" aria-label="Field Council home">
        <Brand />
      </Link>
      <p>
        Owners helping owners
        <br />
        build stronger firms.
      </p>
      <div>
        <Link href="/privacy">Privacy & application information</Link>
        <span>© {new Date().getFullYear()} Field Council</span>
      </div>
    </footer>
  );
}
export function SurveyMap() {
  return (
    <svg
      className="survey-map"
      viewBox="0 0 560 510"
      fill="none"
      aria-hidden="true"
    >
      <defs>
        <pattern id="grid" width="28" height="28" patternUnits="userSpaceOnUse">
          <path d="M28 0H0v28" stroke="#cdd3c4" strokeWidth=".65" />
        </pattern>
        <pattern
          id="hatch"
          width="8"
          height="8"
          patternTransform="rotate(38)"
          patternUnits="userSpaceOnUse"
        >
          <path d="M0 0v8" stroke="#d7633d" strokeWidth=".8" opacity=".35" />
        </pattern>
      </defs>
      <rect width="560" height="510" fill="url(#grid)" />
      <g stroke="#c7cebc" strokeWidth="1">
        {Array.from({ length: 9 }, (_, i) => (
          <path
            key={i}
            transform={`translate(0 ${i * 24})`}
            d="M-15 330c100-175 100-120 182-221s154-30 233-123S600-90 580-115"
          />
        ))}
      </g>
      <path
        d="M35 60l193 47 160-59 123 155-30 200-212 59-179-91L35 60Z"
        fill="#eceddf"
        fillOpacity=".65"
        stroke="#566b50"
        strokeWidth="1.8"
      />
      <g stroke="#566b50" strokeWidth="1.25">
        <path d="M228 107l34 154 126-213M262 261l249-58M262 261l219 142M262 261l7 201M262 261L90 371M262 261L35 60" />
      </g>
      <path
        d="M228 107l34 154L35 60l193 47Z"
        fill="url(#hatch)"
        stroke="#d7633d"
        strokeWidth="2"
      />
      <g fill="#53624b" fontFamily="monospace" fontSize="10" letterSpacing="2">
        <text x="307" y="158">
          PARCEL 02
        </text>
        <text x="378" y="290">
          PARCEL 03
        </text>
        <text x="332" y="393">
          PARCEL 04
        </text>
        <text x="150" y="378">
          PARCEL 05
        </text>
        <text x="75" y="223">
          PARCEL 06
        </text>
      </g>
      <text
        x="133"
        y="151"
        fill="#b44926"
        fontFamily="monospace"
        fontSize="11"
        letterSpacing="2"
      >
        YOUR FIRM
      </text>
      <g stroke="#2d453c" strokeWidth="1.4">
        {[
          [35, 60],
          [228, 107],
          [388, 48],
          [511, 203],
          [481, 403],
          [269, 462],
          [90, 371],
          [262, 261],
        ].map(([x, y]) => (
          <g key={x}>
            <path d={`M${x - 5} ${y}h10M${x} ${y - 5}v10`} />
            <circle cx={x} cy={y} r="3" fill="#f0f0e6" />
          </g>
        ))}
      </g>
      <g transform="translate(481 47)">
        <path d="M0-18v36M-18 0h36" stroke="#354d42" />
        <path d="m0-14 4 14-4-3-4 3 4-14Z" fill="#354d42" />
        <text
          y="-25"
          x="-3"
          fill="#354d42"
          fontSize="10"
          fontFamily="monospace"
        >
          N
        </text>
      </g>
      <g transform="translate(25 470)" stroke="#354d42">
        <path d="M0 0h100M0-5V5M50-5V5M100-5V5" />
        <text
          x="0"
          y="21"
          stroke="none"
          fill="#354d42"
          fontFamily="monospace"
          fontSize="8"
          letterSpacing="1"
        >
          A BROADER POINT OF VIEW
        </text>
      </g>
    </svg>
  );
}
