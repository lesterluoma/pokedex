import { usePokemon } from "../hooks/usePokemon";
import { formatName, formatPokedexNumber } from "../utils";
import TypeBadge from "./TypeBadge";

// Shared card shell so loading, error and loaded states are the same size.
const CardShell = ({ children, isSelected = false, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    disabled={!onClick}
    aria-pressed={isSelected}
    className={`relative flex h-36 w-full flex-col items-center justify-end rounded-3xl bg-white px-4 pb-5 shadow-sm transition
      enabled:hover:-translate-y-1 enabled:hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-red
      ${isSelected ? "ring-2 ring-red" : ""}`}
  >
    {children}
  </button>
);

const PokemonCard = ({ id, isSelected, onSelect }) => {
  const { data: pokemon, error, isLoading } = usePokemon(id);

  if (isLoading) {
    return (
      <CardShell>
        <span className="text-xs font-semibold text-gray-300">
          {formatPokedexNumber(id)}
        </span>
      </CardShell>
    );
  }

  if (error) {
    return (
      <CardShell>
        <span className="text-xs font-semibold text-red">
          Couldn&apos;t load {formatPokedexNumber(id)}
        </span>
      </CardShell>
    );
  }

  return (
    <CardShell isSelected={isSelected} onClick={() => onSelect(id)}>
      <img
        src={pokemon.sprites.front_default}
        alt={pokemon.name}
        loading="lazy"
        className="pixelated absolute -top-12 h-24 w-24"
      />
      <p className="text-xs font-semibold text-gray-400">
        {formatPokedexNumber(pokemon.id)}
      </p>
      <h2 className="mb-2 mt-1 text-lg font-bold capitalize">
        {formatName(pokemon.name)}
      </h2>
      <div className="flex gap-1.5">
        {pokemon.types.map(({ type }) => (
          <TypeBadge key={type.name} type={type.name} />
        ))}
      </div>
    </CardShell>
  );
};

export default PokemonCard;
