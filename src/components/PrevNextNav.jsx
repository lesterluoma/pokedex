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
 * `isCompact` is for narrow spaces like the sidebar: smaller text, with the
 * number under the name instead of beside it.
 */
const PrevNextNav = ({
  id,
  onSelect,
  className = "",
  hoverClassName = "hover:bg-surface",
  isCompact = false,
  children,
}) => (
  <div
    className={`flex items-center justify-between gap-2 rounded-2xl p-2 font-semibold ${
      isCompact ? "text-xs" : "text-sm"
    } ${className}`}
  >
    {id > 1 ? (
      <NeighborButton
        id={id - 1}
        onSelect={onSelect}
        hoverClassName={hoverClassName}
        isCompact={isCompact}
      />
    ) : <span />}
    {children}
    {id < MAX_POKEDEX_ID ? (
      <NeighborButton
        id={id + 1}
        onSelect={onSelect}
        hoverClassName={hoverClassName}
        isCompact={isCompact}
        isNext
      />
    ) : (
      <span />
    )}
  </div>
);

// `min-w-0` and `truncate` let a name that still doesn't fit end in "…"
// (full name on hover) rather than run into the other button.
const NeighborButton = ({
  id,
  onSelect,
  hoverClassName,
  isCompact,
  isNext = false,
}) => {
  const { data: pokemon } = usePokemon(id);
  const name = pokemon ? formatName(pokemonDisplayName(pokemon)) : "";

  return (
    <button
      type="button"
      onClick={() => onSelect(id)}
      title={name || undefined}
      className={`flex min-w-0 items-center gap-1 rounded-xl px-2 py-1 capitalize ${hoverClassName} ${
        isNext ? "flex-row-reverse text-right" : "text-left"
      }`}
    >
      <span className="text-muted">{isNext ? "›" : "‹"}</span>
      <img
        src={spriteUrl(id)}
        alt=""
        className={`pixelated shrink-0 ${isCompact ? "h-7 w-7" : "h-8 w-8"}`}
      />
      {isCompact ? (
        <span className="flex min-w-0 flex-col leading-tight">
          <span className="truncate">{name}</span>
          <span className="text-[10px] text-muted">#{id}</span>
        </span>
      ) : (
        <>
          <span className="truncate">{name}</span>
          <span className="shrink-0 text-muted">#{id}</span>
        </>
      )}
    </button>
  );
};

export default PrevNextNav;
