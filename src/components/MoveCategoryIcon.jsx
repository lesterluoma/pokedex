// Move category badges in the style of the games: a red tile with a
// starburst (physical), a blue tile with rings (special) and a gray tile
// with a swirl (status). Drawn as SVG so they stay sharp at any size and
// look the same in light and dark mode.

import { capitalize } from "../utils";

const STAR_POINTS =
  "22,1.8 23.6,6.7 28.7,4.2 25.8,8.6 31.4,10 25.8,11.4 28.7,15.8 23.6,13.3 22,18.2 20.4,13.3 15.3,15.8 18.2,11.4 12.6,10 18.2,8.6 15.3,4.2 20.4,6.7";

const Physical = () => (
  <>
    <rect x="0.5" y="0.5" width="43" height="19" rx="2" fill="#E5603B" stroke="#7A2A1A" />
    {/* Darker copy underneath, offset, as the star's shadow */}
    <polygon points={STAR_POINTS} fill="#A63A22" transform="translate(1 1)" />
    <polygon points={STAR_POINTS} fill="#F8C94A" />
  </>
);

// Three rings, each a dark outline under a white line.
const RINGS = [
  [11, 6.4],
  [7.4, 4.2],
  [3.8, 2.1],
];

const Special = () => (
  <>
    <rect x="0.5" y="0.5" width="43" height="19" rx="2" fill="#5B7DCB" stroke="#26386B" />
    {RINGS.map(([rx, ry]) => (
      <g key={rx} fill="none">
        <ellipse cx="22" cy="10" rx={rx} ry={ry} stroke="#26386B" strokeWidth="2.6" />
        <ellipse cx="22" cy="10" rx={rx} ry={ry} stroke="#fff" strokeWidth="1.2" />
      </g>
    ))}
  </>
);

// Right half of a yin-yang inside an oval, squashed to the oval's shape.
const SWIRL = "M22 3.5 A10 6.5 0 0 1 22 16.5 A5 3.25 0 0 1 22 10 A5 3.25 0 0 0 22 3.5 Z";

const Status = () => (
  <>
    <rect x="0.5" y="0.5" width="43" height="19" rx="2" fill="#AAA492" stroke="#5B574B" />
    <ellipse cx="22" cy="10" rx="10" ry="6.5" fill="none" stroke="#5B574B" strokeWidth="2.8" />
    <path d={SWIRL} fill="#5B574B" stroke="#5B574B" strokeWidth="1.6" strokeLinejoin="round" />
    <ellipse cx="22" cy="10" rx="10" ry="6.5" fill="none" stroke="#fff" strokeWidth="1.3" />
    <path d={SWIRL} fill="#fff" />
  </>
);

const ICONS = { physical: Physical, special: Special, status: Status };

/**
 * Badge for a move's category ("physical", "special" or "status"). Hovering
 * shows the name ("Physical") in a tooltip above it, which screen readers
 * get as the icon's label instead.
 */
const MoveCategoryIcon = ({ category, className = "h-5 w-11" }) => {
  const Icon = ICONS[category];
  if (!Icon) return null;
  const label = capitalize(category);

  return (
    <span className="group relative inline-flex">
      <svg viewBox="0 0 44 20" role="img" aria-label={label} className={className}>
        <Icon />
      </svg>
      {/* Not a native `title`: that one waits about a second and can't be styled */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-1 -translate-x-1/2 whitespace-nowrap rounded-md bg-ink px-2 py-1 text-xs font-semibold text-surface opacity-0 shadow-lg transition-opacity group-hover:opacity-100 dark:bg-ink/85"
      >
        {label}
      </span>
    </span>
  );
};

export default MoveCategoryIcon;
