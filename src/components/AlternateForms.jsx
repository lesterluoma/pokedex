import { useState } from "react";
import { artworkUrl, formatName, spriteUrl, visibleCount } from "../utils";

// Tiles shown at first and added per "Show more" click (three rows of three).
const PAGE_SIZE = 9;

// API form names that read badly on their own.
const FORM_LABELS = { gmax: "gigantamax" };

/** "mega-x" -> "mega x", "" (the plain species) -> the species name. */
const formLabel = (formName, speciesName) =>
  formatName(FORM_LABELS[formName] ?? (formName || speciesName));

/**
 * The "Alternate Forms" section of the Pokémon sidebar: one tile per form
 * (from getPokemonDetails' `forms`), with a Normal/Shiny switch
 * (`isShiny`, `onShinyChange(isShiny)`) and a "Show more" button for long
 * lists (Alcremie has 63 looks).
 * `onSelect(form)` is called with the clicked entry of `forms`. Like the
 * Evolution section, a circle shows behind the image on hover; it stays on
 * for the image shown large at the top of the sidebar: the form named
 * `currentName`, and only in the color it's shown in (`isCurrentShiny`).
 */
const AlternateForms = ({
  forms,
  currentName,
  isCurrentShiny,
  speciesName,
  isShiny,
  onShinyChange,
  onSelect,
}) => {
  // Starts over for each Pokémon, because the section unmounts while the
  // sidebar loads the next one.
  const [pagesShown, setPagesShown] = useState(1);
  const currentIndex = forms.findIndex(({ name }) => name === currentName);
  const shown = forms.slice(
    0,
    visibleCount(PAGE_SIZE, pagesShown, currentIndex),
  );
  const remaining = forms.length - shown.length;

  return (
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
        {shown.map((form) => {
          const label = formLabel(form.formName, speciesName);
          const isCurrent =
            form.name === currentName && isShiny === isCurrentShiny;
          return (
            <button
              key={form.name}
              type="button"
              onClick={() => onSelect(form)}
              aria-pressed={isCurrent}
              title={label}
              className="group flex w-20 flex-col items-center rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-red"
            >
              <span
                className={`rounded-full p-1 transition group-hover:bg-page ${
                  isCurrent ? "bg-page" : ""
                }`}
              >
                <FormImage
                  imageKey={form.imageKey}
                  isShiny={isShiny}
                  alt={label}
                  className="h-16 w-16"
                />
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
      {remaining > 0 && (
        <button
          type="button"
          onClick={() => setPagesShown(shown.length / PAGE_SIZE + 1)}
          className="mt-3 rounded-full bg-page px-4 py-1.5 text-xs font-semibold text-subtle transition hover:text-red focus:outline-none focus-visible:ring-2 focus-visible:ring-red"
        >
          Show more ({remaining} left)
        </button>
      )}
    </>
  );
};

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

/**
 * Official artwork for a form's `imageKey`, falling back to the small sprite
 * for the forms that have no artwork. Also used for the large image at the
 * top of the sidebar when a look is picked.
 */
export const FormImage = ({ imageKey, isShiny, alt, className = "" }) => {
  const [failedSrc, setFailedSrc] = useState(null);
  const artwork = artworkUrl(imageKey, isShiny);
  const useSprite = failedSrc === artwork;

  return (
    <img
      src={useSprite ? spriteUrl(imageKey, isShiny) : artwork}
      alt={alt}
      loading="lazy"
      onError={() => setFailedSrc(artwork)}
      className={`object-contain ${useSprite ? "pixelated" : ""} ${className}`}
    />
  );
};

export default AlternateForms;
