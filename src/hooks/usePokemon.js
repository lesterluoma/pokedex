import { getPokemon, getPokemonDetails } from "../services/pokeapi";
import { useResource } from "./useResource";

/** Basic Pokémon data (name, types, sprite) for a grid card. */
export const usePokemon = (id) => useResource(getPokemon, id);

/** Full data for the detail sidebar. See getPokemonDetails for the shape. */
export const usePokemonDetails = (id) => useResource(getPokemonDetails, id);
