import { MAX_POKEDEX_ID } from "../constants";
import { usePokemon } from "../hooks/usePokemon";
import { formatName, pokemonDisplayName, spriteUrl } from "../utils";

/**
 * Buttons for the previous and next Pokémon in the Pokédex. Used by the
 * sidebar and the detail page; `children` goes in the middle.
 * `hoverClassName` is the buttons' hover background, which has to differ
 * from the bar's own (set in `className`).
 * `id` is the Pokédex number, so alternate forms (e.g. Mega Charizard X,
 * id 10034) still link to their neighbors in the Pokédex.
 */
const PrevNextNav = ({
  id,
  onSelect,
  className = "",
  hoverClassName = "hover:bg-surface",
  children,
}) => (
  <div
    className={`flex items-center justify-between gap-2 rounded-2xl p-2 text-sm font-semibold ${className}`}
  >
    {id > 1 ? (
      <NeighborButton
        id={id - 1}
        onSelect={onSelect}
        hoverClassName={hoverClassName}
      />
    ) : <span />}
    {children}
    {id < MAX_POKEDEX_ID ? (
      <NeighborButton
        id={id + 1}
        onSelect={onSelect}
        hoverClassName={hoverClassName}
        isNext
      />
    ) : (
      <span />
    )}
  </div>
);

const NeighborButton = ({ id, onSelect, hoverClassName, isNext = false }) => {
  const { data: pokemon } = usePokemon(id);

  return (
    <button
      type="button"
      onClick={() => onSelect(id)}
      className={`flex items-center gap-1 rounded-xl px-2 py-1 capitalize ${hoverClassName} ${
        isNext ? "flex-row-reverse" : ""
      }`}
    >
      <span className="text-muted">{isNext ? "›" : "‹"}</span>
      <img src={spriteUrl(id)} alt="" className="pixelated h-8 w-8" />
      {pokemon && formatName(pokemonDisplayName(pokemon))}
      <span className="text-muted">#{id}</span>
    </button>
  );
};

export default PrevNextNav;
