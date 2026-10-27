import { ShowMoreButton, StatusMessage } from "../components/GridFooter";
import PokedexFilters from "../components/PokedexFilters";
import PokemonCard from "../components/PokemonCard";
import PokemonDetail from "../components/PokemonDetail";
import Searchbar from "../components/Searchbar";
import Sidebar from "../components/Sidebar";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { useFilteredList } from "../hooks/useFilteredList";
import {
  usePokedexIndex,
  usePokemon,
  usePokemonList,
} from "../hooks/usePokemon";
import { usePokemonSearch } from "../hooks/usePokemonSearch";
import { useSidebarSelection } from "../hooks/useSidebarSelection";
import { useUrlFilters } from "../hooks/useUrlFilters";
import { pokemonDisplayName, toSlug, toTitleCase } from "../utils";
import {
  filterPokemon,
  needsPokedexIndex,
  readPokedexFilters,
} from "../utils/pokedexFilters";

// "25" or "#025" matches Pikachu by number; anything else matches by name.
const matchesNameOrNumber = (pokemon, query) => {
  const number = query.trim().replace(/^#/, "");
  if (/^\d+$/.test(number)) return pokemon.id === Number(number);
  return pokemon.name.includes(toSlug(query));
};

const Pokedex = () => {
  // The grid is built from the plain Pokémon list. The index (types,
  // abilities, size, weaknesses) is only needed once a filter uses it, so
  // the grid still works if the index fails to load.
  const allPokemon = usePokemonList();
  const pokedexIndex = usePokedexIndex();
  const pokedexFilters = useUrlFilters(readPokedexFilters);
  const { filters } = pokedexFilters;
  const isWaitingForIndex = needsPokedexIndex(filters) && !pokedexIndex.data;

  // Filters run first, then the search text inside useFilteredList.
  const pokemonList = filterPokemon(allPokemon.data, pokedexIndex.data, filters);
  const grid = useFilteredList(pokemonList, matchesNameOrNumber);

  const sidebar = useSidebarSelection();
  // Typing filters the grid; pressing Enter also opens an exact match in
  // the sidebar.
  const pokemonSearch = usePokemonSearch(sidebar.open);

  // Tab title: the open Pokémon's name, or "Pokémon". usePokemon shares its
  // cached request with the sidebar, so this doesn't fetch anything extra.
  const openPokemon = usePokemon(sidebar.isOpen ? sidebar.selectedId : null);
  useDocumentTitle(
    openPokemon.data ? toTitleCase(pokemonDisplayName(openPokemon.data)) : "Pokémon"
  );

  const handleQueryChange = (text) => {
    pokemonSearch.clearError();
    grid.changeQuery(text);
  };

  const handleFilterChange = (name, value) => {
    pokedexFilters.setFilter(name, value);
    grid.resetPage();
  };

  const handleResetFilters = () => {
    pokedexFilters.resetFilters();
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
      <PokedexFilters
        filters={filters}
        onChange={handleFilterChange}
        onReset={handleResetFilters}
        isActive={pokedexFilters.isActive}
        abilities={pokedexIndex.data?.abilities ?? []}
        resultCount={pokemonList ? grid.matchCount : null}
      />

      {allPokemon.isLoading && <StatusMessage>Loading Pokémon...</StatusMessage>}
      {allPokemon.error && (
        <StatusMessage>Couldn&apos;t load Pokémon. Try refreshing.</StatusMessage>
      )}
      {isWaitingForIndex && pokedexIndex.isLoading && (
        <StatusMessage>Loading filters...</StatusMessage>
      )}
      {isWaitingForIndex && pokedexIndex.error && (
        <StatusMessage>
          Couldn&apos;t load the data for these filters. Try refreshing, or
          reset the filters to see every Pokémon.
        </StatusMessage>
      )}
      {pokemonList && grid.matchCount === 0 && (
        <StatusMessage>No Pokémon match your search and filters.</StatusMessage>
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
