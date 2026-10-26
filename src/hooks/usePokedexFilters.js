import { useSearchParams } from "react-router-dom";
import {
  FILTER_NAMES,
  hasActiveFilters,
  readFilters,
} from "../utils/pokedexFilters";
import { withParams } from "./useSearchParam";

/**
 * The Pokédex filters, stored in the address bar (e.g. "?type=fire&to=151").
 * See utils/pokedexFilters.js for what each filter does.
 *
 * Changes use `replace`, like the search text, so the Back button doesn't
 * step through every filter change.
 */
export const usePokedexFilters = () => {
  const [params, setParams] = useSearchParams();
  const filters = readFilters(params);

  const update = (changes) =>
    setParams((current) => withParams(current, changes), { replace: true });

  // e.g. setFilter("height", "tall"), or setFilter("height", null) to clear.
  const setFilter = (name, value) => update({ [name]: value });

  // Clears every filter in a single update (search text and the open
  // Pokémon are left alone).
  const resetFilters = () =>
    update(Object.fromEntries(FILTER_NAMES.map((name) => [name, null])));

  return {
    filters,
    isActive: hasActiveFilters(filters),
    setFilter,
    resetFilters,
  };
};
