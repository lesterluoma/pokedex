import { useMoveGames, usePokemonMoves } from "../hooks/usePokemon";
import { formatName, toTitleCase } from "../utils";
import MoveCategoryIcon from "./MoveCategoryIcon";
import { ChevronIcon } from "./FilterIcons";
import PageCard from "./PageCard";
import TypeBadge from "./TypeBadge";

// Headings for the ways to learn a move. Others use the API's name
// ("train" -> "Train").
const METHOD_TITLES = {
  "level-up": "Level Up",
  machine: "TMs",
  egg: "Egg Moves",
  tutor: "Tutor Moves",
};


/**
 * The "Moves" card of the Pokémon detail page: a game picker and one table
 * per way of learning (level up, TM, egg, tutor...). Data comes from
 * getMoveGames() and getPokemonMoves() in services/pokeapi.js, one game at
 * a time.
 *
 * Starts on the newest game with level-up moves. A game picked by hand
 * (`pickedGame`, set through `onPickGame(name)`) is used for every Pokémon
 * that has it. The page holds it, because this card unmounts while the next
 * Pokémon loads.
 */
const PokemonMoves = ({ pokemonId, pickedGame, onPickGame, className = "" }) => {
  const games = useMoveGames(pokemonId);

  const gameList = games.data ?? [];
  const game = gameList.some(({ name }) => name === pickedGame)
    ? pickedGame
    : (gameList.find(({ hasLevelUp }) => hasLevelUp) ?? gameList[0])?.name ?? null;
  const moves = usePokemonMoves(pokemonId, game);

  const picker = gameList.length > 0 && (
    <GameSelect games={gameList} value={game} onChange={onPickGame} />
  );

  return (
    <PageCard title="Moves" action={picker} className={className}>
      {(games.isLoading || moves.isLoading) && <Note>Loading moves...</Note>}
      {(games.error || moves.error) && (
        <Note>Couldn&apos;t load moves. Try again.</Note>
      )}
      {games.data && gameList.length === 0 && (
        <Note>No moves are listed for this Pokémon.</Note>
      )}
      <div className="space-y-6">
        {moves.data?.map(({ method, moves: methodMoves }) => (
          <MoveTable key={method} method={method} moves={methodMoves} />
        ))}
      </div>
    </PageCard>
  );
};

// ---------------------------------------------------------------------------
// Small building blocks used above
// ---------------------------------------------------------------------------

const Note = ({ children }) => <p className="text-sm text-muted">{children}</p>;

// "scarlet-violet" is labeled from its versions: "Scarlet / Violet".
// Title case because CSS `capitalize` doesn't reach <option> text.
const gameLabel = ({ versions }) => versions.map(toTitleCase).join(" / ");

const GameSelect = ({ games, value, onChange }) => (
  <label className="relative flex items-center rounded-xl bg-page text-xs font-semibold text-subtle focus-within:ring-2 focus-within:ring-red">
    <select
      value={value ?? ""}
      onChange={(event) => onChange(event.target.value)}
      aria-label="Game"
      className="cursor-pointer appearance-none bg-transparent py-2 pl-3 pr-9 focus:outline-none"
    >
      {games.map((game) => (
        <option key={game.name} value={game.name} className="text-ink">
          {gameLabel(game)}
        </option>
      ))}
    </select>
    <span className="pointer-events-none absolute right-3">
      <ChevronIcon />
    </span>
  </label>
);

// First column of each table: the level or the TM, nothing for the rest.
const FIRST_COLUMNS = {
  "level-up": { title: "Lv.", value: ({ level }) => (level === 0 ? "Evo." : level) },
  machine: { title: "TM", value: ({ machine }) => machine?.toUpperCase() ?? "—" },
};

const MoveTable = ({ method, moves }) => {
  const firstColumn = FIRST_COLUMNS[method];

  return (
    <div>
      <h3 className="mb-1.5 text-sm font-bold capitalize">
        {METHOD_TITLES[method] ?? formatName(method)}{" "}
        <span className="font-semibold text-muted">({moves.length})</span>
      </h3>
      {/* Scrolls sideways on phones instead of squashing the columns */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[560px] text-sm">
          <thead>
            <tr className="text-left text-xs text-muted">
              {firstColumn && <th className="w-16 py-1 font-semibold">{firstColumn.title}</th>}
              <th className="py-1 font-semibold">Move</th>
              <th className="w-24 py-1 font-semibold">Type</th>
              <th className="w-24 py-1 font-semibold">Category</th>
              <th className="w-14 py-1 text-right font-semibold">Power</th>
              <th className="w-14 py-1 text-right font-semibold">Acc.</th>
              <th className="w-12 py-1 text-right font-semibold">PP</th>
            </tr>
          </thead>
          <tbody>
            {moves.map((move, index) => (
              <tr key={`${move.name}-${index}`} className="border-t-2 border-page">
                {firstColumn && (
                  <td
                    className="py-1.5 font-semibold text-subtle"
                    title={move.level === 0 ? "Learned when it evolves" : undefined}
                  >
                    {firstColumn.value(move)}
                  </td>
                )}
                <td className="py-1.5 font-semibold capitalize">{formatName(move.name)}</td>
                <td className="py-1.5">
                  <TypeBadge type={move.type} size="sm" />
                </td>
                <td className="py-1.5">
                  {/* The name shows on hover */}
                  <MoveCategoryIcon category={move.category} />
                </td>
                <td className="py-1.5 text-right text-subtle">{move.power ?? "—"}</td>
                <td className="py-1.5 text-right text-subtle">
                  {move.accuracy != null ? `${move.accuracy}%` : "—"}
                </td>
                <td className="py-1.5 text-right text-subtle">{move.pp ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PokemonMoves;
