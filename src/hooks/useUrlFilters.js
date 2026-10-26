import { useSearchParams } from "react-router-dom";
import { hasActiveFilters } from "../utils/filterHelpers";
import { withParams } from "./useSearchParam";

/**
 * A set of filters stored in the address bar, e.g. "?type=fire&to=151".
 * Used by the Pokédex and Items pages.
 *
 * - `readFilters(params)` turns the address into a filters object, with
 *   null for anything not set or not valid. Its keys are the parameter names.
 *
 * Changes use `replace`, like the search text, so the Back button doesn't
 * step through every filter change.
 */
export const useUrlFilters = (readFilters) => {
  const [params, setParams] = useSearchParams();
  const filters = readFilters(params);

  // Several filters in a single update, e.g. { pocket: "berries", category: null }.
  // (Separate updates in the same click would overwrite each other.)
  const setFilters = (changes) =>
    setParams((current) => withParams(current, changes), { replace: true });

  // One filter, e.g. setFilter("type", "fire"), or ("type", null) to clear.
  const setFilter = (name, value) => setFilters({ [name]: value });

  // Clears every filter. Search text and the open card are left alone.
  const resetFilters = () =>
    setFilters(Object.fromEntries(Object.keys(filters).map((name) => [name, null])));

  return {
    filters,
    isActive: hasActiveFilters(filters),
    setFilter,
    setFilters,
    resetFilters,
  };
};
