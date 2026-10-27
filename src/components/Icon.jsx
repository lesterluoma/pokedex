// Outline icons drawn on a 24x24 grid, shared by the nav bar, search bar,
// Home shortcuts and filters (FilterIcons.jsx). They use `currentColor`, so
// they take the text color around them.

export const OutlineIcon = ({ children, className = "h-4 w-4" }) => (
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

/** Home: a house. */
export const HomeIcon = ({ className }) => (
  <OutlineIcon className={className}>
    <path d="M3 10.5L12 3l9 7.5" />
    <path d="M5 9v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V9" />
    <path d="M10 21v-6h4v6" />
  </OutlineIcon>
);

/** Pokédex (and the Type filter): a pokéball. */
export const PokeballIcon = ({ className }) => (
  <OutlineIcon className={className}>
    <circle cx="12" cy="12" r="9" />
    <path d="M3 12h6M15 12h6" />
    <circle cx="12" cy="12" r="3" />
  </OutlineIcon>
);

/** Items: a shopping bag. */
export const ItemsIcon = ({ className }) => (
  <OutlineIcon className={className}>
    <path d="M5 8h14l-1 13H6z" />
    <path d="M9 8V6a3 3 0 0 1 6 0v2" />
  </OutlineIcon>
);
