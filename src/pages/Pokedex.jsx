import { ShowMoreButton, StatusMessage } from "../components/GridFooter";
import PokemonCard from "../components/PokemonCard";
import PokemonDetail from "../components/PokemonDetail";
import Searchbar from "../components/Searchbar";
import Sidebar from "../components/Sidebar";
import TypeFilter from "../components/TypeFilter";
import { POKEMON_TYPES } from "../constants";
import { useFilteredList } from "../hooks/useFilteredList";
import { usePokemonIdsOfType, usePokemonList } from "../hooks/usePokemon";
import { usePokemonSearch } from "../hooks/usePokemonSearch";
import { useSearchParam } from "../hooks/useSearchParam";
import { useSidebarSelection } from "../hooks/useSidebarSelection";
import { toSlug } from "../utils";

// "25" or "#025" matches Pikachu by number; anything else matches by name.
const matchesNameOrNumber = (pokemon, query) => {
  const number = query.trim().replace(/^#/, "");
  if (/^\d+$/.test(number)) return pokemon.id === Number(number);
  return pokemon.name.includes(toSlug(query));
};

// Keeps only the Pokémon whose id is in `typeIds`.
// Returns null while either list is still loading.
const filterByType = (pokemonList, typeIds) => {
  if (!pokemonList || !typeIds) return null;
  const ids = new Set(typeIds);
  return pokemonList.filter((pokemon) => ids.has(pokemon.id));
};

const Pokedex = () => {
  const allPokemon = usePokemonList();

  // The type filter lives in the address bar as `?type=fire`.
  // Unknown values (e.g. "?type=banana") are ignored.
  const [typeParam, setTypeParam] = useSearchParam("type");
  const type = POKEMON_TYPES.includes(typeParam) ? typeParam : null;
  const typeIds = usePokemonIdsOfType(type);

  // The type filter runs first, then the text filter inside useFilteredList.
  const pokemonList = type
    ? filterByType(allPokemon.data, typeIds.data)
    : allPokemon.data;
  const grid = useFilteredList(pokemonList, matchesNameOrNumber);
  const isLoading = allPokemon.isLoading || typeIds.isLoading;
  const error = allPokemon.error || typeIds.error;

  const sidebar = useSidebarSelection();
  // Typing filters the grid; pressing Enter also opens an exact match in
  // the sidebar.
  const pokemonSearch = usePokemonSearch(sidebar.open);

  const handleQueryChange = (text) => {
    pokemonSearch.clearError();
    grid.changeQuery(text);
  };

  const handleTypeChange = (newType) => {
    // `replace` like the text filter, so Back doesn't step through each type.
    setTypeParam(newType, { replace: true });
    grid.resetPage();
  };

  return (
    <>
      <Searchbar
        onSearch={pokemonSearch.search}
        onQueryChange={handleQueryChange}
        initialQuery={grid.query}
        error={pokemonSearch.error}
      />
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <TypeFilter value={type} onChange={handleTypeChange} />
      </div>

      {isLoading && <StatusMessage>Loading Pokémon...</StatusMessage>}
      {error && (
        <StatusMessage>Couldn&apos;t load Pokémon. Try refreshing.</StatusMessage>
      )}
      {pokemonList && grid.matchCount === 0 && (
        <StatusMessage>
          No {type && <span className="capitalize">{type}-type </span>}
          Pokémon match &quot;{grid.query}&quot;.
        </StatusMessage>
      )}

      <div className="mt-20 flex items-start">
        <div className="min-w-0 flex-1">
          <section className="grid grid-cols-[repeat(auto-fill,minmax(190px,1fr))] gap-x-4 gap-y-16">
            {grid.visible.map(({ id }) => (
              <PokemonCard
                key={id}
                id={id}
                isSelected={sidebar.isSelected(id)}
                onSelect={sidebar.toggle}
              />
            ))}
          </section>
          <ShowMoreButton remaining={grid.remaining} onClick={grid.showMore} />
        </div>

        <Sidebar isOpen={sidebar.isOpen} onClose={sidebar.close}>
          {sidebar.selectedId && (
            <PokemonDetail
              id={sidebar.selectedId}
              onSelect={sidebar.open}
              onClose={sidebar.close}
            />
          )}
        </Sidebar>
      </div>
    </>
  );
};

export default Pokedex;
