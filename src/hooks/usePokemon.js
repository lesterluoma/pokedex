import { useEffect, useState } from "react";
import { getPokemon, getPokemonDetails } from "../services/pokeapi";

/**
 * Runs `loader(arg)` whenever `arg` changes and tracks the result.
 * Pass `arg = null` to skip loading.
 * Returns { data, error, isLoading }.
 */
const useResource = (loader, arg) => {
  // `result.arg` remembers which request the data belongs to. When `arg`
  // changes, the old result no longer matches, so we never show the previous
  // Pokémon's data (not even for a single render).
  const [result, setResult] = useState({ arg: null, data: null, error: null });

  useEffect(() => {
    if (arg == null) return;

    // If `arg` changes before the request finishes, ignore the old result.
    let isStale = false;

    loader(arg)
      .then((data) => {
        if (!isStale) setResult({ arg, data, error: null });
      })
      .catch((error) => {
        console.error(`Failed to load Pokémon "${arg}":`, error);
        if (!isStale) setResult({ arg, data: null, error });
      });

    return () => {
      isStale = true;
    };
  }, [loader, arg]);

  const isCurrent = arg != null && result.arg === arg;
  return {
    data: isCurrent ? result.data : null,
    error: isCurrent ? result.error : null,
    isLoading: arg != null && !isCurrent,
  };
};

/** Basic Pokémon data (name, types, sprite) for a grid card. */
export const usePokemon = (id) => useResource(getPokemon, id);

/** Full data for the detail sidebar. See getPokemonDetails for the shape. */
export const usePokemonDetails = (id) => useResource(getPokemonDetails, id);
