import { useState } from "react";
import { MAX_POKEDEX_ID } from "../constants";
import { usePokemon, usePokemonDetails } from "../hooks/usePokemon";
import {
  formatName,
  formatPokedexNumber,
  pokemonDisplayName,
  spriteUrl,
} from "../utils";
import AlternateForms from "./AlternateForms";
import DetailPanel, { Pill, Section } from "./DetailPanel";
import StatBubbles from "./StatBubbles";
import TypeBadge from "./TypeBadge";

/**
 * Contents of the sidebar for one Pokémon. All data comes from
 * getPokemonDetails() in services/pokeapi.js.
 * `onSelect(id)` switches to another Pokémon (evolutions, forms, prev/next).
 */
const PokemonDetail = ({ id, onSelect, onClose }) => {
  const { data: pokemon, error, isLoading } = usePokemonDetails(id);
  // The Alternate Forms Normal/Shiny switch. Kept here rather than in
  // AlternateForms, which unmounts while the next form loads.
  const [isShiny, setIsShiny] = useState(false);
  // The form last picked while the switch was on Shiny. Its large artwork
  // is shown shiny; anything opened another way (evolutions, prev/next)
  // shows the normal artwork.
  const [shinyFormId, setShinyFormId] = useState(null);

  const handleFormSelect = (formId) => {
    setShinyFormId(isShiny ? formId : null);
    onSelect(formId);
  };

  const isArtworkShiny =
    pokemon != null &&
    shinyFormId === pokemon.id &&
    pokemon.shinyArtwork != null;

  return (
    <DetailPanel
      onClose={onClose}
      isLoading={isLoading}
      error={error}
      errorMessage="Couldn't load this Pokémon. Try again."
    >
      {pokemon && (
        <>
          {/* Artwork pokes out above the top of the card */}
          <img
            src={isArtworkShiny ? pokemon.shinyArtwork : pokemon.artwork}
            alt={pokemon.name}
            className="pointer-events-none absolute -top-24 left-1/2 h-40 w-40 -translate-x-1/2 object-contain drop-shadow-lg"
          />
          <div className="min-h-0 flex-1 overflow-y-auto px-6 pb-4 pt-16 text-center">
            <Header pokemon={pokemon} />
            <Section title="Pokédex Entry">
              <p className="text-sm text-subtle">{pokemon.description}</p>
            </Section>
            <Section title="Abilities">
              <Abilities abilities={pokemon.abilities} />
            </Section>
            <div className="grid grid-cols-2 gap-x-3">
              <Section title="Height">
                <Pill>{pokemon.heightMeters}m</Pill>
              </Section>
              <Section title="Weight">
                <Pill>{pokemon.weightKg}kg</Pill>
              </Section>
              <Section title="Weaknesses">
                <Weaknesses weaknesses={pokemon.weaknesses} />
              </Section>
              <Section title="Base Exp">
                <Pill>{pokemon.baseExperience ?? "—"}</Pill>
              </Section>
            </div>
            <Section title="Stats">
              <StatBubbles stats={pokemon.stats} />
            </Section>
            {pokemon.evolutions.length > 1 && (
              <Section title="Evolution">
                <Evolutions
                  evolutions={pokemon.evolutions}
                  onSelect={onSelect}
                />
              </Section>
            )}
            <Section title="Alternate Forms">
              <AlternateForms
                forms={pokemon.forms}
                currentId={pokemon.id}
                isCurrentShiny={isArtworkShiny}
                speciesName={pokemon.speciesName}
                isShiny={isShiny}
                onShinyChange={setIsShiny}
                onSelect={handleFormSelect}
              />
            </Section>
          </div>
          <PrevNextNav id={pokemon.speciesId} onSelect={onSelect} />
        </>
      )}
    </DetailPanel>
  );
};

// ---------------------------------------------------------------------------
// Small building blocks used above
// ---------------------------------------------------------------------------

const Header = ({ pokemon }) => (
  <>
    <p className="text-sm font-semibold text-muted">
      {formatPokedexNumber(pokemon.speciesId)}
    </p>
    <h2 className="text-2xl font-bold capitalize">
      {formatName(pokemon.name)}
    </h2>
    <p className="text-sm text-muted">{pokemon.genus}</p>
    <div className="mt-3 flex justify-center gap-2">
      {pokemon.types.map((type) => (
        <TypeBadge key={type} type={type} />
      ))}
    </div>
  </>
);

const Abilities = ({ abilities }) => (
  <div className="grid grid-cols-2 gap-3">
    {abilities.map(({ name, isHidden }) => (
      <Pill
        key={name}
        className={`relative border capitalize ${
          isHidden ? "border-red/60" : "border-blue/40"
        }`}
      >
        <span className="block truncate">{formatName(name)}</span>
        {/* Small tag sitting on the border, so the name stays on one line */}
        {isHidden && (
          <span className="absolute -top-2 right-4 bg-surface px-1 text-[10px] font-semibold uppercase leading-none text-red">
            hidden
          </span>
        )}
      </Pill>
    ))}
  </div>
);

const Weaknesses = ({ weaknesses }) => (
  <div className="flex flex-wrap justify-center gap-1 rounded-2xl bg-page px-2 py-2">
    {weaknesses.map(({ type, multiplier }) => (
      <span key={type} title={`${multiplier}× damage`}>
        <TypeBadge type={type} size="sm" />
      </span>
    ))}
  </div>
);

const Evolutions = ({ evolutions, onSelect }) => (
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
          className="rounded-full transition hover:bg-page"
        >
          <img src={spriteUrl(id)} alt={name} className="pixelated h-16 w-16" />
        </button>
      </div>
    ))}
  </div>
);

// `id` is the Pokédex number, so alternate forms (e.g. Mega Charizard X,
// id 10034) still link to their neighbors in the Pokédex.
const PrevNextNav = ({ id, onSelect }) => (
  <div className="mx-3 mb-3 flex items-center justify-between rounded-2xl bg-page p-2 text-sm font-semibold">
    {id > 1 ? <NeighborButton id={id - 1} onSelect={onSelect} /> : <span />}
    {id < MAX_POKEDEX_ID && (
      <NeighborButton id={id + 1} onSelect={onSelect} isNext />
    )}
  </div>
);

const NeighborButton = ({ id, onSelect, isNext = false }) => {
  const { data: pokemon } = usePokemon(id);

  return (
    <button
      type="button"
      onClick={() => onSelect(id)}
      className={`flex items-center gap-1 rounded-xl px-2 py-1 capitalize hover:bg-surface ${
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

export default PokemonDetail;
