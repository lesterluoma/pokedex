// Small helpers shared by the Pokédex and item filters
// (utils/pokedexFilters.js and utils/itemFilters.js).

/** `value` if it's one of `options`, otherwise null ("not filtering"). */
export const oneOf = (value, options) => (options.includes(value) ? value : null);

/** "151" -> 151. Anything that isn't a whole number -> null. */
export const toWholeNumber = (value) =>
  /^\d+$/.test(value ?? "") ? Number(value) : null;

/** True if any filter has a value. */
export const hasActiveFilters = (filters) =>
  Object.values(filters).some((value) => value != null);

/** True if `id` is inside the from/to number range (either end can be null). */
export const isInIdRange = (id, from, to) =>
  (from == null || id >= from) && (to == null || id <= to);
