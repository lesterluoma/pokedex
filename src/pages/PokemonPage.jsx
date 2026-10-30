import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import AlternateForms, { FormImage, ShinySwitch } from "../components/AlternateForms";
import { Pill, Section } from "../components/DetailPanel";
import Evolutions from "../components/Evolutions";
import { StatusMessage } from "../components/GridFooter";
import PrevNextNav from "../components/PrevNextNav";
import TypeBadge from "../components/TypeBadge";
import { STATS } from "../constants";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { usePokemonForm, usePokemonFullDetails } from "../hooks/usePokemon";
import { getPokemon } from "../services/pokeapi";
import {
  formatGender,
  formatName,
  formatPokedexNumber,
  pokemonDisplayName,
  pokemonPath,
  statRange,
  toTitleCase,
} from "../utils";

/**
 * Full page for one Pokémon at "/pokedex/:name". All data comes from
 * getPokemonFullDetails() in services/pokeapi.js.
 *
 * Pages opened from the Pokédex get `pokedexDepth` in the history state:
 * how many steps back the grid is. "Back to Pokédex" goes back that many
 * steps, so the grid's filters and search are kept. Opened any other way
 * (a shared link, a refresh), it just links to "/pokedex".
 */
const PokemonPage = () => {
  const { name } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const pokedexDepth = location.state?.pokedexDepth ?? null;
  const { data: pokemon, error, isLoading } = usePokemonFullDetails(name);

  // Normal/Shiny, kept when moving to another Pokémon like in the sidebar.
  const [isShiny, setIsShiny] = useState(false);
  // A look picked in Alternate Forms (e.g. "arceus-fire"), for the Pokémon
  // it belongs to: { pokemonId, look }. It swaps the large image, types and
  // damage taken; other forms open their own page.
  const [pick, setPick] = useState(null);
  const look = pick && pokemon && pick.pokemonId === pokemon.id ? pick.look : null;
  const lookData = usePokemonForm(look?.name ?? null).data;

  useDocumentTitle(pokemon ? toTitleCase(pokemon.name) : "Pokémon");

  // A new Pokémon starts at the top of the page.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [name]);

  // "/pokedex/25" or "/pokedex/giratina-altered" -> "/pokedex/giratina"
  useEffect(() => {
    if (pokemon && pokemon.name !== name) {
      navigate(pokemonPath(pokemon.name), { replace: true, state: location.state });
    }
  }, [pokemon, name, navigate, location.state]);

  // Evolutions, forms and previous/next only have an id. getPokemon is
  // usually cached already (the previous/next buttons load it for their
  // names), so this is instant.
  const openPokemon = async (id) => {
    try {
      const next = await getPokemon(id);
      navigate(pokemonPath(pokemonDisplayName(next)), {
        state: { pokedexDepth: pokedexDepth && pokedexDepth + 1 },
      });
    } catch (openError) {
      console.error(`Failed to open Pokémon ${id}:`, openError);
    }
  };

  const handleFormSelect = (form) => {
    if (form.isLook) {
      setPick({ pokemonId: pokemon.id, look: form });
    } else if (form.id === pokemon.id) {
      setPick(null);
    } else {
      openPokemon(form.id);
    }
  };

  const backLinkClasses =
    "rounded-full bg-page px-4 py-2 text-xs font-semibold text-subtle transition hover:text-red focus:outline-none focus-visible:ring-2 focus-visible:ring-red";
  const backLink = pokedexDepth ? (
    <button type="button" onClick={() => navigate(-pokedexDepth)} className={backLinkClasses}>
      ‹ Back to Pokédex
    </button>
  ) : (
    <Link to="/pokedex" className={backLinkClasses}>
      ‹ Back to Pokédex
    </Link>
  );

  if (!pokemon) {
    return (
      <div className="mt-6 flex flex-col items-center">
        {isLoading && <StatusMessage>Loading Pokémon...</StatusMessage>}
        {error && (
          <StatusMessage>
            Couldn&apos;t load &ldquo;{name}&rdquo;. Check the name, or try again.
          </StatusMessage>
        )}
        <div className="mt-4">{backLink}</div>
      </div>
    );
  }

  // Until a look's data arrives, the Pokémon's own types are shown.
  const types = lookData?.types ?? pokemon.types;
  const damageTaken = lookData?.damageTaken ?? pokemon.damageTaken;
  const isArtworkShiny = Boolean(isShiny && (look || pokemon.shinyArtwork));

  return (
    <>
      <PrevNextNav
        id={pokemon.speciesId}
        onSelect={openPokemon}
        className="mt-6 flex-wrap bg-surface shadow-sm"
        hoverClassName="hover:bg-page"
      >
        <span className="max-sm:order-first max-sm:w-full max-sm:text-center">
          {backLink}
        </span>
      </PrevNextNav>

      <section className="mt-6 grid gap-8 rounded-3xl bg-surface p-6 shadow-xl sm:p-8 md:grid-cols-[288px_1fr]">
        <div className="flex flex-col items-center">
          <div className="flex aspect-square w-full max-w-72 items-center justify-center rounded-full bg-page">
            {look ? (
              <FormImage
                key={look.name}
                imageKey={look.imageKey}
                isShiny={isShiny}
                alt={formatName(look.name)}
                className={ARTWORK_CLASSES}
              />
            ) : (
              <img
                src={isArtworkShiny ? pokemon.shinyArtwork : pokemon.artwork}
                alt={formatName(pokemon.name)}
                className={`object-contain ${ARTWORK_CLASSES}`}
              />
            )}
          </div>
          <ShinySwitch isShiny={isShiny} onChange={setIsShiny} className="mt-4" />
        </div>

        <div className="text-center md:text-left">
          <p className="text-sm font-semibold text-muted">
            {formatPokedexNumber(pokemon.speciesId)}
          </p>
          <h1 className="text-4xl font-bold capitalize">{formatName(pokemon.name)}</h1>
          <p className="text-sm text-muted">{pokemon.genus}</p>
          <div className="mt-3 flex justify-center gap-2 md:justify-start">
            {types.map((type) => (
              <TypeBadge key={type} type={type} />
            ))}
          </div>
          <p className="mt-4 text-sm text-subtle">{pokemon.description}</p>

          <div className="grid grid-cols-2 gap-x-3 text-center sm:grid-cols-4">
            <Section title="Height">
              <Pill>{pokemon.heightMeters}m</Pill>
            </Section>
            <Section title="Weight">
              <Pill>{pokemon.weightKg}kg</Pill>
            </Section>
            <Section title="Base Exp">
              <Pill>{pokemon.baseExperience ?? "—"}</Pill>
            </Section>
            <Section title="Gender">
              <Pill>{formatGender(pokemon.femaleRatio)}</Pill>
            </Section>
          </div>

          <Section title="Abilities">
            <Abilities abilities={pokemon.abilities} />
          </Section>
        </div>
      </section>

      <div className="mt-6 grid gap-6 md:grid-cols-3">
        <Card title="Training">
          <InfoList
            rows={[
              ["Catch rate", pokemon.catchRate],
              ["Base happiness", pokemon.baseHappiness ?? "—"],
              ["Growth rate", formatName(pokemon.growthRate)],
              [
                "EV yield",
                pokemon.evYield
                  .map(({ name, value }) => `${value} ${STATS[name].label}`)
                  .join(", ") || "—",
              ],
            ]}
          />
        </Card>
        <Card title="Breeding">
          <InfoList
            rows={[
              ["Egg groups", pokemon.eggGroups.map(formatName).join(", ")],
              ["Egg cycles", pokemon.eggCycles ?? "—"],
            ]}
          />
        </Card>
        <Card title="Other Names">
          <InfoList
            rows={pokemon.otherNames.map(({ language, name }) => [language, name])}
          />
        </Card>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[3fr_2fr]">
        <Card title="Base Stats">
          <StatTable stats={pokemon.stats} />
        </Card>
        <Card title="Damage Taken">
          <DamageTaken damageTaken={damageTaken} />
        </Card>
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <Card title="Evolution">
          {pokemon.evolutions.length > 1 ? (
            <Evolutions
              evolutions={pokemon.evolutions}
              onSelect={openPokemon}
              currentId={pokemon.speciesId}
              showNames
            />
          ) : (
            <p className="text-center text-sm text-muted">
              This Pokémon doesn&apos;t evolve.
            </p>
          )}
        </Card>
        <Card title="Alternate Forms" className="text-center">
          <AlternateForms
            forms={pokemon.forms}
            currentName={
              look?.name ?? pokemon.forms.find((form) => form.id === pokemon.id)?.name
            }
            isCurrentShiny={isArtworkShiny}
            speciesName={pokemon.speciesName}
            isShiny={isShiny}
            onShinyChange={setIsShiny}
            onSelect={handleFormSelect}
          />
        </Card>
      </div>

      <Card title="Pokédex Entries" className="mt-6">
        <PokedexEntries entries={pokemon.pokedexEntries} />
      </Card>
    </>
  );
};

// ---------------------------------------------------------------------------
// Small building blocks used above
// ---------------------------------------------------------------------------

const ARTWORK_CLASSES = "h-[88%] w-[88%] drop-shadow-lg";

// Highest base stat of any Pokémon (Blissey's HP), so the bars share a scale.
const MAX_BASE_STAT = 255;

/** White card with a small uppercase heading, like the sidebar's sections. */
const Card = ({ title, className = "", children }) => (
  <section className={`rounded-3xl bg-surface p-6 shadow-sm ${className}`}>
    <h2 className="mb-3 text-left text-sm font-bold uppercase tracking-wide">
      {title}
    </h2>
    {children}
  </section>
);

/** Label/value rows: rows = [["Catch rate", 45], ...] */
const InfoList = ({ rows }) => (
  <dl className="space-y-2 text-sm">
    {rows.map(([label, value]) => (
      <div
        key={label}
        className="flex justify-between gap-3 rounded-full bg-page px-4 py-2"
      >
        <dt className="text-subtle">{label}</dt>
        <dd className="text-right font-semibold capitalize">{value}</dd>
      </div>
    ))}
  </dl>
);

const Abilities = ({ abilities }) => (
  <div className="grid gap-3 text-left sm:grid-cols-2">
    {abilities.map(({ name, isHidden, description }) => (
      <div
        key={name}
        className={`relative rounded-2xl border bg-page px-4 py-3 text-sm ${
          isHidden ? "border-red/60" : "border-blue/40"
        }`}
      >
        {isHidden && (
          <span className="absolute -top-2 right-4 bg-surface px-1 text-[10px] font-semibold uppercase leading-none text-red">
            hidden
          </span>
        )}
        <p className="font-semibold capitalize">{formatName(name)}</p>
        <p className="mt-0.5 text-xs text-subtle">{description}</p>
      </div>
    ))}
  </div>
);

const StatTable = ({ stats }) => {
  const total = stats.reduce((sum, stat) => sum + stat.value, 0);

  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="text-xs text-muted">
          <th className="w-12" />
          <th className="w-12 text-left font-semibold">Base</th>
          <th />
          <th className="w-14 text-right font-semibold">Min</th>
          <th className="w-14 text-right font-semibold">Max</th>
        </tr>
      </thead>
      <tbody>
        {stats.map(({ name, value }) => {
          const { label, className } = STATS[name];
          const { min, max } = statRange(name, value);
          return (
            <tr key={name}>
              <td className="py-1.5">
                <StatDot label={label} className={className} />
              </td>
              <td className="font-semibold">{value}</td>
              <td>
                <div className="h-2.5 rounded-full bg-page">
                  <div
                    className={`h-2.5 rounded-full ${className}`}
                    style={{ width: `${(value / MAX_BASE_STAT) * 100}%` }}
                  />
                </div>
              </td>
              <td className="text-right text-subtle">{min}</td>
              <td className="text-right text-subtle">{max}</td>
            </tr>
          );
        })}
        <tr className="border-t-2 border-page">
          <td className="py-1.5">
            <StatDot label="TOT" className="bg-stats-total" />
          </td>
          <td className="font-semibold">{total}</td>
          <td colSpan={3} className="text-xs text-muted">
            Min and max are at level 100
          </td>
        </tr>
      </tbody>
    </table>
  );
};

const StatDot = ({ label, className }) => (
  <span
    className={`flex h-8 w-8 items-center justify-center rounded-full text-[9px] font-bold text-white ${className}`}
  >
    {label}
  </span>
);

// 0.25 -> "¼×", 0.5 -> "½×", 2 -> "2×"
const MULTIPLIER_LABELS = { 0.25: "¼", 0.5: "½" };
const formatMultiplier = (multiplier) =>
  `${MULTIPLIER_LABELS[multiplier] ?? multiplier}×`;

const DamageTaken = ({ damageTaken }) => (
  <div className="grid grid-cols-3 gap-2 text-center text-xs font-semibold sm:grid-cols-6 lg:grid-cols-3">
    {damageTaken.map(({ type, multiplier }) => {
      const isWeakness = multiplier > 1;
      const textClass = isWeakness
        ? "text-red"
        : multiplier === 0
          ? "text-muted"
          : multiplier < 1
            ? "text-blue"
            : "";
      return (
        <div
          key={type}
          className={`flex flex-col items-center gap-1 rounded-xl border bg-page p-1.5 ${
            isWeakness ? "border-red/60" : "border-transparent"
          }`}
        >
          <TypeBadge type={type} size="sm" />
          <span className={textClass}>{formatMultiplier(multiplier)}</span>
        </div>
      );
    })}
  </div>
);

const PokedexEntries = ({ entries }) =>
  entries.length === 0 ? (
    <p className="text-sm text-muted">No Pokédex entries yet.</p>
  ) : (
    <div className="divide-y-2 divide-page text-sm">
      {entries.map(({ games, text }) => (
        <div key={text} className="flex flex-col gap-2 py-2 sm:flex-row sm:gap-4">
          <span className="shrink-0 self-start rounded-full bg-page px-3 py-1 text-xs font-semibold capitalize sm:w-48 sm:text-center">
            {games.map(formatName).join(" / ")}
          </span>
          <p className="text-subtle">{text}</p>
        </div>
      ))}
    </div>
  );

export default PokemonPage;
