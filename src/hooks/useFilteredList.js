import { useState } from "react";
import { GRID_PAGE_SIZE } from "../constants";

/**
 * Live filtering + "Show more" paging for a grid page (Pokédex, Items).
 *
 * - `list`: the full array, or null while it's still loading.
 * - `matches(entry, query)`: true if the entry should be shown for `query`.
 *
 * Only the first page of matches is rendered; `showMore()` adds another.
 * Typing a new query jumps back to the first page.
 */
export const useFilteredList = (list, matches) => {
  const [query, setQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(GRID_PAGE_SIZE);

  const changeQuery = (text) => {
    setQuery(text);
    setVisibleCount(GRID_PAGE_SIZE);
  };

  const filtered = (list ?? []).filter((entry) => matches(entry, query));

  return {
    query,
    changeQuery,
    matchCount: filtered.length,
    visible: filtered.slice(0, visibleCount),
    remaining: Math.max(filtered.length - visibleCount, 0),
    showMore: () => setVisibleCount((count) => count + GRID_PAGE_SIZE),
  };
};