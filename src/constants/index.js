// Shown in the browser tab, e.g. "Pikachu | Pokédex" (see useDocumentTitle).
// Keep it the same as the <title> in index.html, which shows before React loads.
export const SITE_NAME = "Pokédex";

// Highest National Pokédex number. Used to hide the "next" button.
export const MAX_POKEDEX_ID = 1025;
// Cards rendered per "Show more" click on the Pokédex and Items pages.
// Each Pokémon card makes its own request, so keep this modest.
export const GRID_PAGE_SIZE = 120;

// Options for the Pokédex region filter, keyed by the value stored in the
// address bar (e.g. "?region=kanto"), in display order. Each region covers
// the National Pokédex numbers its generation added, both ends included.
export const REGIONS = {
  kanto: { label: "Kanto", min: 1, max: 151 },
  johto: { label: "Johto", min: 152, max: 251 },
  hoenn: { label: "Hoenn", min: 252, max: 386 },
  sinnoh: { label: "Sinnoh", min: 387, max: 493 },
  unova: { label: "Unova", min: 494, max: 649 },
  kalos: { label: "Kalos", min: 650, max: 721 },
  alola: { label: "Alola", min: 722, max: 809 },
  galar: { label: "Galar", min: 810, max: 905 },
  paldea: { label: "Paldea", min: 906, max: 1025 },
};

// Options for the Pokédex height and weight filters, keyed by the value
// stored in the address bar (e.g. "?height=tall"). `min` counts as inside
// the range, `max` doesn't, so 1 m is "medium", not "short".
// Options for the item filters, keyed by the API's names (also what's
// stored in the address bar, e.g. "?pocket=berries"), in display order.
// Pockets are the sections of the bag in the games.
export const ITEM_POCKETS = {
  pokeballs: "Poké Balls",
  medicine: "Medicine",
  berries: "Berries",
  battle: "Battle items",
  machines: "TMs and HMs",
  key: "Key items",
  mail: "Mail",
  misc: "Other items",
};
export const ITEM_ATTRIBUTES = {
  "usable-in-battle": "Usable in battle",
  "usable-overworld": "Usable outside battle",
  consumable: "Used up when used",
  countable: "Stackable",
  holdable: "Holdable",
  "holdable-active": "Works when held",
  underground: "Found underground",
};

// Labels are kept short because a dropdown is as wide as its longest option.
export const HEIGHT_RANGES = {
  short: { label: "Under 1 m", min: 0, max: 1 },
  medium: { label: "1 to 2 m", min: 1, max: 2 },
  tall: { label: "2 m and up", min: 2, max: Infinity },
};
export const WEIGHT_RANGES = {
  light: { label: "Under 20 kg", min: 0, max: 20 },
  medium: { label: "20 to 100 kg", min: 20, max: 100 },
  heavy: { label: "100 kg and up", min: 100, max: Infinity },
};

// Tailwind only ships classes it can find as full strings in the source,
// so every type/stat class is spelled out here instead of built dynamically.
// The colors themselves live in tailwind.config.js.
export const TYPE_CLASSES = {
  normal: "bg-types-normal text-types-normal-text",
  fire: "bg-types-fire text-types-fire-text",
  water: "bg-types-water text-types-water-text",
  electric: "bg-types-electric text-types-electric-text",
  grass: "bg-types-grass text-types-grass-text",
  ice: "bg-types-ice text-types-ice-text",
  fighting: "bg-types-fighting text-types-fighting-text",
  poison: "bg-types-poison text-types-poison-text",
  ground: "bg-types-ground text-types-ground-text",
  flying: "bg-types-flying text-types-flying-text",
  psychic: "bg-types-psychic text-types-psychic-text",
  bug: "bg-types-bug text-types-bug-text",
  rock: "bg-types-rock text-types-rock-text",
  ghost: "bg-types-ghost text-types-ghost-text",
  dragon: "bg-types-dragon text-types-dragon-text",
  dark: "bg-types-dark text-types-dark-text",
  steel: "bg-types-steel text-types-steel-text",
  fairy: "bg-types-fairy text-types-fairy-text",
};

// The 18 Pokémon types, in the order shown on the Home page and in the
// Pokédex type filter.
export const POKEMON_TYPES = Object.keys(TYPE_CLASSES);

// Keyed by the stat names the API returns.
export const STATS = {
  hp: { label: "HP", className: "bg-stats-hp" },
  attack: { label: "ATK", className: "bg-stats-attack" },
  defense: { label: "DEF", className: "bg-stats-defense" },
  "special-attack": { label: "SpA", className: "bg-stats-special-attack" },
  "special-defense": { label: "SpD", className: "bg-stats-special-defense" },
  speed: { label: "SPD", className: "bg-stats-speed" },
};
