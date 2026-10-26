import { useState } from "react";
import { getPokemon } from "../services/pokeapi";

/**
 * Looks up one Pokémon by name or number (what the user typed in the
 * search bar and submitted with Enter).
 *
 * - `onFound(id)` runs when it exists, e.g. open it in the sidebar.
 * - `error` holds a message to show when it doesn't.
 *
 * Goes through the API, so alternate forms that aren't in the grid
 * (e.g. "charizard-mega-x") are found too.
 */
export const usePokemonSearch = (onFound) => {
  const [error, setError] = useState(null);

  const search = async (query) => {
    setError(null);
    try {
      const pokemon = await getPokemon(query);
      onFound(pokemon.id);
    } catch {
      setError(`No Pokémon found for "${query}".`);
    }
  };

  const clearError = () => setError(null);

  return { search, error, clearError };
};
