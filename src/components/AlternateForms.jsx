import { useState } from "react";
import { artworkUrl, formatName, spriteUrl } from "../utils";

// API form names that read badly on their own.
const FORM_LABELS = { gmax: "gigantamax" };

/** "mega-x" -> "mega x", "" (the plain species) -> the species name. */
const formLabel = (formName, speciesName) =>
  formatName(FORM_LABELS[formName] ?? (formName || speciesName));

/**
 * The "Alternate Forms" section of the Pokémon sidebar: one tile per form
 * (from getPokemonDetails' `forms`), with a Normal/Shiny switch
 * (`isShiny`, `onShinyChange(isShiny)`).
 * `onSelect(id)` opens that form in the sidebar. Like the Evolution
 * section, a circle shows behind the image on hover; it stays on for the
 * image shown large at the top of the sidebar: the open form (`currentId`),
 * and only in the color it's shown in (`isCurrentShiny`).
 */
const AlternateForms = ({
  forms,
  currentId,
  isCurrentShiny,
  speciesName,
  isShiny,
  onShinyChange,
  onSelect,
}) => (
  <>
    <div className="mb-3 inline-flex rounded-full bg-page p-1 text-xs font-semibold">
      <ColorButton isActive={!isShiny} onClick={() => onShinyChange(false)}>
        Normal
      </ColorButton>
      <ColorButton isActive={isShiny} onClick={() => onShinyChange(true)}>
        Shiny
      </ColorButton>
    </div>
    <div className="flex flex-wrap justify-center gap-2">
      {forms.map(({ id, formName }) => {
        const label = formLabel(formName, speciesName);
        const isCurrent = id === currentId && isShiny === isCurrentShiny;
        return (
          <button
            key={id}
            type="button"
            onClick={() => onSelect(id)}
            aria-pressed={isCurrent}
            title={label}
            className="group flex w-20 flex-col items-center rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-red"
          >
            <span
              className={`rounded-full p-1 transition group-hover:bg-page ${
                isCurrent ? "bg-page" : ""
              }`}
            >
              <FormImage id={id} isShiny={isShiny} alt={label} />
            </span>
            <span
              className={`mt-1 block w-full truncate text-xs font-semibold capitalize ${
                isCurrent ? "text-red" : "text-subtle"
              }`}
            >
              {label}
            </span>
          </button>
        );
      })}
    </div>
  </>
);

const ColorButton = ({ isActive, onClick, children }) => (
  <button
    type="button"
    onClick={onClick}
    aria-pressed={isActive}
    className={`rounded-full px-3 py-1 transition ${
      isActive ? "bg-surface text-red shadow-sm" : "text-muted hover:text-ink"
    }`}
  >
    {children}
  </button>
);

// Uses the official artwork, falling back to the small sprite for the few
// forms that have no artwork.
const FormImage = ({ id, isShiny, alt }) => {
  const [failedSrc, setFailedSrc] = useState(null);
  const artwork = artworkUrl(id, isShiny);
  const useSprite = failedSrc === artwork;

  return (
    <img
      src={useSprite ? spriteUrl(id, isShiny) : artwork}
      alt={alt}
      loading="lazy"
      onError={() => setFailedSrc(artwork)}
      className={`h-16 w-16 object-contain ${useSprite ? "pixelated" : ""}`}
    />
  );
};

export default AlternateForms;
