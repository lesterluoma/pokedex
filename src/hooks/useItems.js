import { getItemDetails, getItemList } from "../services/pokeapi";
import { NO_ARG, useResource } from "./useResource";

/** Every item as { id, name }. One request, cached for the whole session. */
export const useItemList = () => useResource(getItemList, NO_ARG);

/** Full data for the item sidebar. See getItemDetails for the shape. */
export const useItemDetails = (id) => useResource(getItemDetails, id);
