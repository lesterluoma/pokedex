import { usePokemon } from "../hooks/usePokemon";
import { formatName, formatPokedexNumber, pokemonDisplayName } from "../utils";
import TypeBadge from "./TypeBadge";

// Shared card shell so loading, error and loaded states are the same size.
const CardShell = ({ children, isSelected = false, onClick, onDoubleClick }) => (
  <button
    type="button"
    onClick={onClick}
    onDoubleClick={onDoubleClick}
    disabled={!onClick}
    aria-pressed={isSelected}
    className={`relative flex h-36 w-full flex-col items-center justify-end rounded-3xl bg-surface px-4 pb-5 shadow-sm transition
      enabled:hover:-translate-y-1 enabled:hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-red
      ${isSelected ? "ring-2 ring-red" : ""}`}
  >
    {children}
  </button>
);

/**
 * One grid card. Clicking calls `onSelect(id)` (the sidebar);
 * double-clicking calls `onOpen(pokemon)` with the raw /pokemon response
 * (the detail page).
 */
const PokemonCard = ({ id, isSelected, onSelect, onOpen }) => {
  const { data: pokemon, error, isLoading } = usePokemon(id);

  if (isLoading) {
    return (
      <CardShell>
        <span className="text-xs font-semibold text-muted/60">
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
    <CardShell
      isSelected={isSelected}
      onClick={() => onSelect(id)}
      onDoubleClick={() => onOpen(pokemon)}
    >
      <img
        src={pokemon.sprites.front_default}
        alt={pokemonDisplayName(pokemon)}
        loading="lazy"
        className="pixelated absolute -top-12 h-24 w-24"
      />
      <p className="text-xs font-semibold text-muted">
        {formatPokedexNumber(pokemon.id)}
      </p>
      <h2 className="mb-2 mt-1 text-lg font-bold capitalize">
        {formatName(pokemonDisplayName(pokemon))}
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
