import { ShowMoreButton, StatusMessage } from "../components/GridFooter";
import PokemonCard from "../components/PokemonCard";
import PokemonDetail from "../components/PokemonDetail";
import Searchbar from "../components/Searchbar";
import Sidebar from "../components/Sidebar";
import { useFilteredList } from "../hooks/useFilteredList";
import { usePokemonList } from "../hooks/usePokemon";
import { usePokemonSearch } from "../hooks/usePokemonSearch";
import { useSidebarSelection } from "../hooks/useSidebarSelection";
import { toSlug } from "../utils";

// "25" or "#025" matches Pikachu by number; anything else matches by name.
const matchesNameOrNumber = (pokemon, query) => {
  const number = query.trim().replace(/^#/, "");
  if (/^\d+$/.test(number)) return pokemon.id === Number(number);
  return pokemon.name.includes(toSlug(query));
};

const Pokedex = () => {
  const { data: pokemonList, error, isLoading } = usePokemonList();
  const grid = useFilteredList(pokemonList, matchesNameOrNumber);
  const sidebar = useSidebarSelection();
  // Typing filters the grid; pressing Enter also opens an exact match in
  // the sidebar.
  const pokemonSearch = usePokemonSearch(sidebar.open);

  const handleQueryChange = (text) => {
    pokemonSearch.clearError();
    grid.changeQuery(text);
  };

  return (
    <>
      <Searchbar
        onSearch={pokemonSearch.search}
        onQueryChange={handleQueryChange}
        initialQuery={grid.query}
        error={pokemonSearch.error}
      />

      {isLoading && <StatusMessage>Loading Pokémon...</StatusMessage>}
      {error && (
        <StatusMessage>Couldn&apos;t load Pokémon. Try refreshing.</StatusMessage>
      )}
      {pokemonList && grid.matchCount === 0 && (
        <StatusMessage>No Pokémon match &quot;{grid.query}&quot;.</StatusMessage>
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
