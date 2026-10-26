import { Link, useNavigate } from "react-router-dom";
import { usePokemonDetails } from "../hooks/usePokemon";
import {
  formatName,
  formatPokedexNumber,
  pokedexPath,
  randomPokemonId,
} from "../utils";
import { StatusMessage } from "./GridFooter";
import StatBubbles from "./StatBubbles";
import TypeBadge from "./TypeBadge";

/**
 * "Pokémon of the day" card on the Home page. Uses the same data as the
 * detail sidebar (getPokemonDetails in services/pokeapi.js).
 */
const FeaturedPokemon = ({ id, className = "" }) => {
  const { data: pokemon, error, isLoading } = usePokemonDetails(id);
  const navigate = useNavigate();

  const today = new Date().toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <section className={`rounded-3xl bg-surface p-6 shadow-sm sm:p-8 ${className}`}>
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="text-sm font-bold uppercase tracking-wide text-red">
          Pokémon of the day
        </h2>
        <p className="text-xs font-semibold text-muted">{today}</p>
      </div>

      {isLoading && <StatusMessage>Loading...</StatusMessage>}
      {error && (
        <StatusMessage>Couldn&apos;t load today&apos;s Pokémon.</StatusMessage>
      )}
      {pokemon && (
        <div className="mt-6 flex flex-col items-center gap-6 text-center md:flex-row md:items-start md:text-left">
          <div className="flex h-48 w-48 shrink-0 items-center justify-center rounded-full bg-page">
            <img
              src={pokemon.artwork}
              alt={pokemon.name}
              className="h-44 w-44 object-contain drop-shadow-lg"
            />
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-muted">
              {formatPokedexNumber(pokemon.id)}
            </p>
            <h3 className="text-3xl font-bold capitalize">
              {formatName(pokemon.name)}
            </h3>
            <p className="text-sm text-muted">{pokemon.genus}</p>
            <div className="mt-3 flex justify-center gap-2 md:justify-start">
              {pokemon.types.map((type) => (
                <TypeBadge key={type} type={type} />
              ))}
            </div>
            <p className="mt-4 text-sm text-subtle">{pokemon.description}</p>
            <StatBubbles
              stats={pokemon.stats}
              className="mt-4 justify-center md:justify-start"
            />

            <div className="mt-6 flex flex-wrap justify-center gap-3 md:justify-start">
              <Link
                to={pokedexPath(pokemon.id)}
                className="rounded-xl bg-red px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-red/40 transition hover:bg-red-dark"
              >
                View in Pokédex
              </Link>
              <button
                type="button"
                onClick={() => navigate(pokedexPath(randomPokemonId()))}
                className="rounded-xl bg-page px-5 py-2.5 text-sm font-semibold text-subtle transition hover:text-red"
              >
                Surprise me
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default FeaturedPokemon;
