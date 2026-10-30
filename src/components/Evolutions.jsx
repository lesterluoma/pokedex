import { formatName, spriteUrl } from "../utils";

/**
 * Evolution chain from getPokemonDetails' `evolutions`, with how each stage
 * evolves between the sprites. Used by the sidebar and the detail page.
 * `onSelect(id)` opens a stage. `currentId` gets a circle behind its sprite,
 * and `showNames` writes each name under its sprite.
 */
const Evolutions = ({ evolutions, onSelect, currentId = null, showNames = false }) => (
  <div className="flex flex-wrap items-center justify-center gap-2">
    {evolutions.map(({ id, name, trigger }) => (
      <div key={id} className="flex items-center gap-2">
        {trigger && (
          <span className="rounded-full bg-page px-3 py-1 text-xs font-semibold capitalize text-subtle">
            {trigger}
          </span>
        )}
        <button
          type="button"
          onClick={() => onSelect(id)}
          title={formatName(name)}
          aria-current={id === currentId ? "page" : undefined}
          className="group flex flex-col items-center rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-red"
        >
          <span
            className={`rounded-full transition group-hover:bg-page ${
              id === currentId ? "bg-page" : ""
            }`}
          >
            <img src={spriteUrl(id)} alt={name} className="pixelated h-16 w-16" />
          </span>
          {showNames && (
            <span className="text-xs font-semibold capitalize">
              {formatName(name)}
            </span>
          )}
        </button>
      </div>
    ))}
  </div>
);

export default Evolutions;
