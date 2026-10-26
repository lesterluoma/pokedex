import { getItemDetails, getItemList } from "../services/pokeapi";
import { useResource } from "./useResource";

// useResource needs a non-null argument to start loading. The full list
// doesn't take one, so this is just a fixed placeholder.
const ALL_ITEMS = "all";

/** Every item as { id, name }. One request, cached for the whole session. */
export const useItemList = () => useResource(getItemList, ALL_ITEMS);

/** Full data for the item sidebar. See getItemDetails for the shape. */
export const useItemDetails = (id) => useResource(getItemDetails, id);
