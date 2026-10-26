import { useState } from "react";
import { GRID_PAGE_SIZE } from "../constants";
import { useSearchParam } from "./useSearchParam";

/**
 * Live filtering + "Show more" paging for a grid page (Pokédex, Items).
 *
 * - `list`: the full array, or null while it's still loading.
 * - `matches(entry, query)`: true if the entry should be shown for `query`.
 *
 * The filter text lives in the address bar as `?q=pika`, so a refresh or a
 * shared link keeps it. Only the first page of matches is rendered;
 * `showMore()` adds another. Typing a new query jumps back to the first page.
 */
export const useFilteredList = (list, matches) => {
  const [queryParam, setQueryParam] = useSearchParam("q");
  const query = queryParam ?? "";
  const [visibleCount, setVisibleCount] = useState(GRID_PAGE_SIZE);

  // Back to the first page. Call this when another filter changes the list.
  const resetPage = () => setVisibleCount(GRID_PAGE_SIZE);

  const changeQuery = (text) => {
    // `replace` so each keystroke doesn't add a Back button step.
    setQueryParam(text, { replace: true });
    resetPage();
  };

  const filtered = (list ?? []).filter((entry) => matches(entry, query));

  return {
    query,
    changeQuery,
    resetPage,
    matchCount: filtered.length,
    visible: filtered.slice(0, visibleCount),
    remaining: Math.max(filtered.length - visibleCount, 0),
    showMore: () => setVisibleCount((count) => count + GRID_PAGE_SIZE),
  };
};
