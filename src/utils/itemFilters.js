// The item filters (pocket, category, attribute, held, from, to) as plain
// functions. No React here: the Items page reads the values from the
// address bar with useUrlFilters(readItemFilters) and passes them to
// filterItems().

import { ITEM_ATTRIBUTES, ITEM_POCKETS } from "../constants";
import { isInIdRange, oneOf, toWholeNumber } from "./filterHelpers";

// Filters that need the item index (getItemIndex in services/pokeapi.js).
// "from" and "to" only compare item numbers, so they work without it.
const INDEX_FILTERS = ["pocket", "category", "attribute", "held"];

/**
 * Reads every item filter from URLSearchParams. The keys are the address
 * bar parameter names. Values that aren't valid come back as null, which
 * means "not filtering".
 */
export const readItemFilters = (params) => ({
  pocket: oneOf(params.get("pocket"), Object.keys(ITEM_POCKETS)),
  // Category names come from the API, so they can't be checked until it
  // has loaded. An unknown category just matches nothing.
  category: params.get("category") || null,
  attribute: oneOf(params.get("attribute"), Object.keys(ITEM_ATTRIBUTES)),
  held: params.get("held") === "yes" ? "yes" : null, // only held by wild Pokémon
  from: toWholeNumber(params.get("from")),
  to: toWholeNumber(params.get("to")),
});

export const needsItemIndex = (filters) =>
  INDEX_FILTERS.some((name) => filters[name] != null);

/**
 * True if one item passes every active filter.
 * `item` is { id, name } from the grid list; `details` is its entry in the
 * item index (only needed when needsItemIndex(filters) is true).
 */
const matchesFilters = (item, details, filters) => {
  const { pocket, category, attribute, held, from, to } = filters;

  if (!isInIdRange(item.id, from, to)) return false;
  if (!needsItemIndex(filters)) return true;
  if (!details) return false;

  if (pocket && details.pocket !== pocket) return false;
  if (category && details.category !== category) return false;
  if (attribute && !details.attributes.includes(attribute)) return false;
  if (held && !details.isHeldByWildPokemon) return false;
  return true;
};

/**
 * The grid list with every filter applied.
 * Returns null while the data it needs is still loading.
 */
export const filterItems = (itemList, index, filters) => {
  if (!itemList) return null;
  if (needsItemIndex(filters) && !index) return null;

  const detailsById = new Map(index?.items.map((entry) => [entry.id, entry]));
  return itemList.filter((item) =>
    matchesFilters(item, detailsById.get(item.id), filters)
  );
};
