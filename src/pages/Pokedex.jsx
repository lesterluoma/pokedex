import { useState } from "react";
import PokemonCard from "../components/PokemonCard";
import PokemonDetail from "../components/PokemonDetail";
import Searchbar from "../components/Searchbar";
import Sidebar from "../components/Sidebar";
import { GRID_POKEMON_COUNT } from "../constants";
import { getPokemon } from "../services/pokeapi";

const GRID_IDS = Array.from({ length: GRID_POKEMON_COUNT }, (_, i) => i + 1);

const Pokedex = () => {
  // `selectedId` is kept after closing so the sidebar can slide out with its
  // content still showing. `isSidebarOpen` alone controls visibility.
  const [selectedId, setSelectedId] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchError, setSearchError] = useState(null);

  const openPokemon = (id) => {
    setSelectedId(id);
    setIsSidebarOpen(true);
  };

  const closeSidebar = () => setIsSidebarOpen(false);

  // Clicking the card that's already open closes the sidebar.
  // Clicking any other card opens (or switches) the sidebar to it.
  const handleCardClick = (id) => {
    if (isSidebarOpen && id === selectedId) {
      closeSidebar();
    } else {
      openPokemon(id);
    }
  };

  const handleSearch = async (query) => {
    setSearchError(null);
    try {
      const pokemon = await getPokemon(query);
      openPokemon(pokemon.id);
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
              isSelected={isSidebarOpen && id === selectedId}
              onSelect={handleCardClick}
            />
          ))}
        </section>

        <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar}>
          {selectedId && (
            <PokemonDetail
              id={selectedId}
              onSelect={openPokemon}
              onClose={closeSidebar}
            />
          )}
        </Sidebar>
      </div>
    </>
  );
};

export default Pokedex;
