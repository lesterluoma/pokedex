// The Pokédex filters (type, weakness, ability, height, weight, from, to)
// as plain functions. No React here: usePokedexFilters reads the values from
// the address bar, and the Pokédex page calls filterPokemon() with them.

import { HEIGHT_RANGES, POKEMON_TYPES, WEIGHT_RANGES } from "../constants";
import { toSlug } from "./index";

/** Address bar parameter names, e.g. "/pokedex?type=fire&from=1&to=151". */
export const FILTER_NAMES = [
  "type",
  "weakness",
  "ability",
  "height",
  "weight",
  "from",
  "to",
];

// Filters that need the Pokédex index (getPokedexIndex in services/pokeapi.js).
// "from" and "to" only compare Pokédex numbers, so they work without it.
const INDEX_FILTERS = ["type", "weakness", "ability", "height", "weight"];

const oneOf = (value, options) => (options.includes(value) ? value : null);
const toNumber = (value) => (/^\d+$/.test(value ?? "") ? Number(value) : null);

/**
 * Reads every filter from URLSearchParams. Values that aren't valid
 * (e.g. "?type=banana") come back as null, which means "not filtering".
 */
export const readFilters = (params) => ({
  type: oneOf(params.get("type"), POKEMON_TYPES),
  weakness: oneOf(params.get("weakness"), POKEMON_TYPES),
  ability: params.get("ability") || null, // free text, e.g. "solar power"
  height: oneOf(params.get("height"), Object.keys(HEIGHT_RANGES)),
  weight: oneOf(params.get("weight"), Object.keys(WEIGHT_RANGES)),
  from: toNumber(params.get("from")),
  to: toNumber(params.get("to")),
});

export const hasActiveFilters = (filters) =>
  FILTER_NAMES.some((name) => filters[name] != null);

export const needsIndex = (filters) =>
  INDEX_FILTERS.some((name) => filters[name] != null);

const isInRange = (value, { min, max }) => value >= min && value < max;

/**
 * True if one Pokémon passes every active filter.
 * `pokemon` is { id, name } from the grid list; `details` is its entry in
 * the Pokédex index (only needed when needsIndex(filters) is true).
 */
const matchesFilters = (pokemon, details, filters) => {
  const { type, weakness, ability, height, weight, from, to } = filters;

  if (from != null && pokemon.id < from) return false;
  if (to != null && pokemon.id > to) return false;
  if (!needsIndex(filters)) return true;
  if (!details) return false;

  if (type && !details.types.includes(type)) return false;
  if (weakness && !details.weaknesses.includes(weakness)) return false;
  // Partial matches count, so "lev" already finds Levitate.
  if (ability && !details.abilities.some((name) => name.includes(toSlug(ability)))) {
    return false;
  }
  if (height && !isInRange(details.heightMeters, HEIGHT_RANGES[height])) return false;
  if (weight && !isInRange(details.weightKg, WEIGHT_RANGES[weight])) return false;
  return true;
};

/**
 * The grid list with every filter applied.
 * Returns null while the data it needs is still loading.
 */
export const filterPokemon = (pokemonList, index, filters) => {
  if (!pokemonList) return null;
  if (needsIndex(filters) && !index) return null;

  const detailsById = new Map(index?.pokemon.map((entry) => [entry.id, entry]));
  return pokemonList.filter((pokemon) =>
    matchesFilters(pokemon, detailsById.get(pokemon.id), filters)
  );
};
