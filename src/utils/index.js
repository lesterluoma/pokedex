import { MAX_POKEDEX_ID } from "../constants";

/** 7 -> "N°007" */
export const formatPokedexNumber = (id) => `N°${String(id).padStart(3, "0")}`;

/** " Mr Mime " -> "mr-mime", so typed text matches API names. */
export const toSlug = (text) => text.trim().toLowerCase().replace(/\s+/g, "-");

/** "mr-mime" -> "mr mime" (CSS `capitalize` handles the casing) */
export const formatName = (name) => name.replace(/-/g, " ");

/**
 * "fire" -> "Fire". For text CSS can't style, like <option> labels and the
 * browser tab title.
 */
export const capitalize = (text) => text.charAt(0).toUpperCase() + text.slice(1);

/** "mr-mime" -> "Mr Mime", "flabébé" -> "Flabébé" */
export const toTitleCase = (name) =>
  formatName(name).split(" ").map(capitalize).join(" ");

/**
 * Name to show for a raw /pokemon response. The default form goes by the
 * species name ("giratina", not "giratina-altered"); other forms keep their
 * full name ("charizard-mega-x").
 */
export const pokemonDisplayName = (pokemon) =>
  pokemon.is_default ? pokemon.species.name : pokemon.name;

const SPRITES_URL = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon";

/**
 * Small pixel sprite by id, without needing an extra API request. Also takes
 * a look's image key like "493-fire" (see `forms` in getPokemonDetails).
 */
export const spriteUrl = (id, isShiny = false) =>
  `${SPRITES_URL}/${isShiny ? "shiny/" : ""}${id}.png`;

/** Large official artwork by id or image key. Missing for a few rare forms. */
export const artworkUrl = (id, isShiny = false) =>
  `${SPRITES_URL}/other/official-artwork/${isShiny ? "shiny/" : ""}${id}.png`;

/**
 * How many items of a "Show more" list to render: `pagesShown` pages of
 * `pageSize`, but always far enough to include `keepIndex` (the open item,
 * or -1 for none), so it's never hidden behind the button.
 */
export const visibleCount = (pageSize, pagesShown, keepIndex = -1) =>
  Math.max(pagesShown, Math.floor(keepIndex / pageSize) + 1) * pageSize;

/** Item sprite by name. Not every item has one, so use a fallback on error. */
export const itemSpriteUrl = (name) =>
  `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/${name}.png`;

const MS_PER_DAY = 24 * 60 * 60 * 1000;

/**
 * Same Pokémon for everyone all day (by local date), a new one tomorrow.
 * Days are numbered from 1 Jan 1970, then multiplied by a prime so that
 * consecutive days aren't consecutive Pokédex numbers. 7919 shares no
 * factor with 1025, so every Pokémon comes up once every 1,025 days.
 */
export const pokemonOfTheDayId = (date = new Date()) => {
  const dayNumber = Math.floor(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / MS_PER_DAY
  );
  return ((dayNumber * 7919) % MAX_POKEDEX_ID) + 1;
};

/** Any National Pokédex number, 1 to MAX_POKEDEX_ID. */
export const randomPokemonId = () =>
  Math.floor(Math.random() * MAX_POKEDEX_ID) + 1;

/**
 * Address of the Pokédex page with one Pokémon open in the sidebar.
 * `id` is the query parameter read by useSidebarSelection.
 */
export const pokedexPath = (id) => `/pokedex?id=${id}`;

/**
 * Address of a Pokémon's detail page, by the name pokemonDisplayName()
 * gives, e.g. "/pokedex/giratina".
 */
export const pokemonPath = (name) => `/pokedex/${name}`;

/** Address of the Pokédex page filtered to one type, e.g. "/pokedex?type=fire". */
export const pokedexTypePath = (type) => `/pokedex?type=${type}`;

/**
 * Lowest and highest value of a stat at level 100: no IVs or EVs and a
 * hindering nature for the lowest, 31 IVs, 252 EVs and a helpful nature for
 * the highest. HP has no nature and its own formula. Shedinja's HP is
 * always 1.
 */
export const statRange = (name, base) => {
  if (name === "hp") {
    if (base === 1) return { min: 1, max: 1 };
    return { min: 2 * base + 110, max: 2 * base + 204 };
  }
  return {
    min: Math.floor((2 * base + 5) * 0.9),
    max: Math.floor((2 * base + 99) * 1.1),
  };
};

/** 0.125 -> "87.5% ♂ 12.5% ♀", 1 -> "100% ♀", null -> "Genderless" */
export const formatGender = (femaleRatio) => {
  if (femaleRatio == null) return "Genderless";
  const female = `${femaleRatio * 100}% ♀`;
  const male = `${(1 - femaleRatio) * 100}% ♂`;
  if (femaleRatio === 0) return male;
  if (femaleRatio === 1) return female;
  return `${male} ${female}`;
};
