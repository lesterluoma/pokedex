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

/** Small pixel sprite by id, without needing an extra API request. */
export const spriteUrl = (id) =>
  `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;

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

/** Address of the Pokédex page filtered to one type, e.g. "/pokedex?type=fire". */
export const pokedexTypePath = (type) => `/pokedex?type=${type}`;
