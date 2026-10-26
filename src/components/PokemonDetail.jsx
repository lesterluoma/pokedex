import { MAX_POKEDEX_ID, STATS } from "../constants";
import { usePokemon, usePokemonDetails } from "../hooks/usePokemon";
import { formatName, formatPokedexNumber, spriteUrl } from "../utils";
import DetailPanel, { Pill, Section } from "./DetailPanel";
import TypeBadge from "./TypeBadge";

/**
 * Contents of the sidebar for one Pokémon. All data comes from
 * getPokemonDetails() in services/pokeapi.js.
 * `onSelect(id)` switches to another Pokémon (evolutions, prev/next).
 */
const PokemonDetail = ({ id, onSelect, onClose }) => {
  const { data: pokemon, error, isLoading } = usePokemonDetails(id);

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
            src={pokemon.artwork}
            alt={pokemon.name}
            className="pointer-events-none absolute -top-24 left-1/2 h-40 w-40 -translate-x-1/2 object-contain drop-shadow-lg"
          />
          <div className="min-h-0 flex-1 overflow-y-auto px-6 pb-4 pt-16 text-center">
            <Header pokemon={pokemon} />
            <Section title="Pokédex Entry">
              <p className="text-sm text-gray-600">{pokemon.description}</p>
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
              <Stats stats={pokemon.stats} />
            </Section>
            {pokemon.evolutions.length > 1 && (
              <Section title="Evolution">
                <Evolutions
                  evolutions={pokemon.evolutions}
                  onSelect={onSelect}
                />
              </Section>
            )}
          </div>
          <PrevNextNav id={pokemon.id} onSelect={onSelect} />
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
    <p className="text-sm font-semibold text-gray-400">
      {formatPokedexNumber(pokemon.id)}
    </p>
    <h2 className="text-2xl font-bold capitalize">
      {formatName(pokemon.name)}
    </h2>
    <p className="text-sm text-gray-400">{pokemon.genus}</p>
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
          <span className="absolute -top-2 right-4 bg-white px-1 text-[10px] font-semibold uppercase leading-none text-red">
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

const Stats = ({ stats }) => {
  const total = stats.reduce((sum, stat) => sum + stat.value, 0);
  const statBubbles = [
    ...stats.map(({ name, value }) => ({ ...STATS[name], value })),
    { label: "TOT", className: "bg-stats-total", value: total },
  ];

  return (
    <div className="flex justify-center gap-1.5">
      {statBubbles.map(({ label, className, value }) => (
        <div
          key={label}
          className="flex w-10 flex-col items-center rounded-full bg-page p-1 pb-2"
        >
          <span
            className={`flex h-8 w-8 items-center justify-center rounded-full text-[9px] font-bold text-white ${className}`}
          >
            {label}
          </span>
          <span className="mt-1 text-xs font-semibold">{value}</span>
        </div>
      ))}
    </div>
  );
};

const Evolutions = ({ evolutions, onSelect }) => (
  <div className="flex flex-wrap items-center justify-center gap-2">
    {evolutions.map(({ id, name, trigger }) => (
      <div key={id} className="flex items-center gap-2">
        {trigger && (
          <span className="rounded-full bg-page px-3 py-1 text-xs font-semibold capitalize text-gray-500">
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

const PrevNextNav = ({ id, onSelect }) => {
  // Alternate forms found by search (e.g. "charizard-mega-x") have ids
  // above 10000, so "previous/next" has no meaning for them.
  if (id > MAX_POKEDEX_ID) return null;

  return (
    <div className="mx-3 mb-3 flex items-center justify-between rounded-2xl bg-page p-2 text-sm font-semibold">
      {id > 1 ? <NeighborButton id={id - 1} onSelect={onSelect} /> : <span />}
      {id < MAX_POKEDEX_ID && (
        <NeighborButton id={id + 1} onSelect={onSelect} isNext />
      )}
    </div>
  );
};

const NeighborButton = ({ id, onSelect, isNext = false }) => {
  const { data: pokemon } = usePokemon(id);

  return (
    <button
      type="button"
      onClick={() => onSelect(id)}
      className={`flex items-center gap-1 rounded-xl px-2 py-1 capitalize hover:bg-white ${
        isNext ? "flex-row-reverse" : ""
      }`}
    >
      <span className="text-gray-400">{isNext ? "›" : "‹"}</span>
      <img src={spriteUrl(id)} alt="" className="pixelated h-8 w-8" />
      {pokemon && formatName(pokemon.name)}
      <span className="text-gray-400">#{id}</span>
    </button>
  );
};

export default PokemonDetail;
