import { useState } from "react";
import PokemonCard from "../components/PokemonCard";
import PokemonDetail from "../components/PokemonDetail";
import Searchbar from "../components/Searchbar";
import Sidebar from "../components/Sidebar";
import { GRID_POKEMON_COUNT } from "../constants";
import { useSidebarSelection } from "../hooks/useSidebarSelection";
import { getPokemon } from "../services/pokeapi";

const GRID_IDS = Array.from({ length: GRID_POKEMON_COUNT }, (_, i) => i + 1);

const Pokedex = () => {
  const sidebar = useSidebarSelection();
  const [searchError, setSearchError] = useState(null);

  const handleSearch = async (query) => {
    setSearchError(null);
    try {
      const pokemon = await getPokemon(query);
      sidebar.open(pokemon.id);
    } catch {
      setSearchError(`No Pokémon found for "${query}".`);
    }
  };

  return (
    <>
      <Searchbar onSearch={handleSearch} error={searchError} />

      <div className="mt-20 flex items-start">
        <section className="grid min-w-0 flex-1 grid-cols-[repeat(auto-fill,minmax(190px,1fr))] gap-x-4 gap-y-16">
          {GRID_IDS.map((id) => (
            <PokemonCard
              key={id}
              id={id}
              isSelected={sidebar.isSelected(id)}
              onSelect={sidebar.toggle}
            />
          ))}
        </section>

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
