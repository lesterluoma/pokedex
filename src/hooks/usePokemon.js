import {
  getPokemon,
  getPokemonDetails,
  getPokemonIdsOfType,
  getPokemonList,
} from "../services/pokeapi";
import { NO_ARG, useResource } from "./useResource";

/** Every Pokémon as { id, name }. One request, cached for the whole session. */
export const usePokemonList = () => useResource(getPokemonList, NO_ARG);

/** Pokédex numbers of every Pokémon with `type`. Pass null to skip. */
export const usePokemonIdsOfType = (type) =>
  useResource(getPokemonIdsOfType, type);

/** Basic Pokémon data (name, types, sprite) for a grid card. */
export const usePokemon = (id) => useResource(getPokemon, id);

/** Full data for the detail sidebar. See getPokemonDetails for the shape. */
export const usePokemonDetails = (id) => useResource(getPokemonDetails, id);
