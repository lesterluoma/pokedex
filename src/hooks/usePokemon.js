import {
  getMoveGames,
  getPokedexIndex,
  getPokemon,
  getPokemonDetails,
  getPokemonForm,
  getPokemonFullDetails,
  getPokemonList,
  getPokemonMoves,
} from "../services/pokeapi";
import { NO_ARG, useResource } from "./useResource";

/** Every Pokémon as { id, name }. One request, cached for the whole session. */
export const usePokemonList = () => useResource(getPokemonList, NO_ARG);

/** Filter data for every Pokémon. See getPokedexIndex for the shape. */
export const usePokedexIndex = () => useResource(getPokedexIndex, NO_ARG);

/** Basic Pokémon data (name, types, sprite) for a grid card. */
export const usePokemon = (id) => useResource(getPokemon, id);

/** Full data for the detail sidebar. See getPokemonDetails for the shape. */
export const usePokemonDetails = (id) => useResource(getPokemonDetails, id);

/** Everything on the detail page. See getPokemonFullDetails for the shape. */
export const usePokemonFullDetails = (name) =>
  useResource(getPokemonFullDetails, name);

/** Types and weaknesses of one look, e.g. "arceus-fire". See getPokemonForm. */
export const usePokemonForm = (name) => useResource(getPokemonForm, name);

/** Games a Pokémon learns moves in, newest first. See getMoveGames. */
export const useMoveGames = (pokemonId) => useResource(getMoveGames, pokemonId);

// useResource takes one argument, so the id and game travel as "25|scarlet-violet".
const loadPokemonMoves = (key) => {
  const [pokemonId, game] = key.split("|");
  return getPokemonMoves(Number(pokemonId), game);
};

/** One game's moves for a Pokémon. Pass `game = null` to wait. See getPokemonMoves. */
export const usePokemonMoves = (pokemonId, game) =>
  useResource(loadPokemonMoves, game ? `${pokemonId}|${game}` : null);
