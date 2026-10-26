// Small outline icons for the Pokédex filters, drawn on a 24x24 grid.
// They use `currentColor`, so they take the text color of the filter.

const OutlineIcon = ({ children, className = "h-4 w-4" }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={`shrink-0 ${className}`}
    aria-hidden="true"
  >
    {children}
  </svg>
);

/** Type: a pokéball. */
export const TypeIcon = () => (
  <OutlineIcon>
    <circle cx="12" cy="12" r="9" />
    <path d="M3 12h6M15 12h6" />
    <circle cx="12" cy="12" r="3" />
  </OutlineIcon>
);

/** Weaknesses: a shield with a crack through it. */
export const WeaknessIcon = () => (
  <OutlineIcon>
    <path d="M12 3l8 3v6c0 4.5-3.4 8-8 9-4.6-1-8-4.5-8-9V6z" />
    <path d="M13 7l-2.5 4.5h3L11 16" />
  </OutlineIcon>
);

/** Ability: a sparkle. */
export const AbilityIcon = () => (
  <OutlineIcon>
    <path d="M12 3l2 5.5L19.5 10.5 14 12.5 12 18l-2-5.5-5.5-2L10 8.5z" />
    <path d="M19 16v4M17 18h4" />
  </OutlineIcon>
);

/** Height: a ruler. */
export const HeightIcon = () => (
  <OutlineIcon>
    <rect x="7" y="2" width="10" height="20" rx="2" />
    <path d="M7 6h4M7 10h2.5M7 14h4M7 18h2.5" />
  </OutlineIcon>
);

/** Weight: a kettlebell. */
export const WeightIcon = () => (
  <OutlineIcon>
    <path d="M8.5 8a3.5 3.5 0 0 1 7 0" />
    <path d="M6 8h12l2 13H4z" />
  </OutlineIcon>
);

/** Reset: an arrow going round. */
export const ResetIcon = () => (
  <OutlineIcon className="h-5 w-5">
    <path d="M3 12a9 9 0 1 0 2.6-6.4L3 8" />
    <path d="M3 3v5h5" />
  </OutlineIcon>
);

/** Down arrow at the right of each dropdown. */
export const ChevronIcon = () => (
  <OutlineIcon>
    <path d="M6 9l6 6 6-6" />
  </OutlineIcon>
);
