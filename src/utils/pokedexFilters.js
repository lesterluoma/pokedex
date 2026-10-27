// The Pokédex filters (region, type, weakness, ability, height, weight, from, to)
// as plain functions. No React here: the Pokédex page reads the values from
// the address bar with useUrlFilters(readPokedexFilters) and passes them to
// filterPokemon().

import { HEIGHT_RANGES, POKEMON_TYPES, REGIONS, WEIGHT_RANGES } from "../constants";
import { isInIdRange, oneOf, toWholeNumber } from "./filterHelpers";
import { toSlug } from "./index";

// Filters that need the Pokédex index (getPokedexIndex in services/pokeapi.js).
// "region", "from" and "to" only compare Pokédex numbers, so they work without it.
const INDEX_FILTERS = ["type", "weakness", "ability", "height", "weight"];

/**
 * Reads every filter from URLSearchParams. The keys are the address bar
 * parameter names. Values that aren't valid (e.g. "?type=banana") come back
 * as null, which means "not filtering".
 */
export const readPokedexFilters = (params) => ({
  region: oneOf(params.get("region"), Object.keys(REGIONS)),
  type: oneOf(params.get("type"), POKEMON_TYPES),
  weakness: oneOf(params.get("weakness"), POKEMON_TYPES),
  ability: params.get("ability") || null, // free text, e.g. "solar power"
  height: oneOf(params.get("height"), Object.keys(HEIGHT_RANGES)),
  weight: oneOf(params.get("weight"), Object.keys(WEIGHT_RANGES)),
  from: toWholeNumber(params.get("from")),
  to: toWholeNumber(params.get("to")),
});

export const needsPokedexIndex = (filters) =>
  INDEX_FILTERS.some((name) => filters[name] != null);

const isInRange = (value, { min, max }) => value >= min && value < max;

/**
 * True if one Pokémon passes every active filter.
 * `pokemon` is { id, name } from the grid list; `details` is its entry in
 * the Pokédex index (only needed when needsPokedexIndex(filters) is true).
 */
const matchesFilters = (pokemon, details, filters) => {
  const { region, type, weakness, ability, height, weight, from, to } = filters;

  // A region and a from/to range both apply, so "?region=johto&to=200"
  // shows #152 to #200.
  if (region && !isInIdRange(pokemon.id, REGIONS[region].min, REGIONS[region].max)) {
    return false;
  }
  if (!isInIdRange(pokemon.id, from, to)) return false;
  if (!needsPokedexIndex(filters)) return true;
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
  if (needsPokedexIndex(filters) && !index) return null;

  const detailsById = new Map(index?.pokemon.map((entry) => [entry.id, entry]));
  return pokemonList.filter((pokemon) =>
    matchesFilters(pokemon, detailsById.get(pokemon.id), filters)
  );
};
