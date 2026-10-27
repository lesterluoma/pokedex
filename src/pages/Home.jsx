import { useNavigate } from "react-router-dom";
import BrowseByType from "../components/BrowseByType";
import FeaturedPokemon from "../components/FeaturedPokemon";
import Searchbar from "../components/Searchbar";
import { ItemsIcon, PokeballIcon } from "../components/Icon";
import ShortcutCard from "../components/ShortcutCard";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { useItemList } from "../hooks/useItems";
import { usePokemonList } from "../hooks/usePokemon";
import { usePokemonSearch } from "../hooks/usePokemonSearch";
import { pokedexPath, pokemonOfTheDayId } from "../utils";

const Home = () => {
  useDocumentTitle(null); // just the site name, "Pokédex"

  const navigate = useNavigate();
  // Enter in the search bar goes to the Pokédex with that Pokémon open.
  const pokemonSearch = usePokemonSearch((id) => navigate(pokedexPath(id)));

  // Only used for the counts on the shortcut cards. Both lists are cached,
  // so the Pokédex and Items pages load faster afterwards too.
  const { data: pokemonList } = usePokemonList();
  const { data: items } = useItemList();

  return (
    <>
      <section className="mt-10 text-center">
        <img
          src="/assets/pokedex-banner.png"
          alt="Pokémon"
          className="mx-auto w-full max-w-xs drop-shadow sm:max-w-sm"
        />
        <h1 className="mt-6 text-2xl font-bold sm:text-3xl">
          Welcome to your Pokédex
        </h1>
        <p className="mt-2 text-sm text-subtle">
          Look up any Pokémon by name or number, or browse every Pokémon and
          item.
        </p>
      </section>

      <Searchbar
        onSearch={pokemonSearch.search}
        onQueryChange={pokemonSearch.clearError}
        error={pokemonSearch.error}
      />

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <FeaturedPokemon id={pokemonOfTheDayId()} className="lg:col-span-2" />

        <div className="flex flex-col gap-6">
          <ShortcutCard
            to="/pokedex"
            icon={<PokeballIcon className="h-8 w-8" />}
            count={pokemonList?.length}
            title="Pokémon"
            description="Every Pokémon, with stats, weaknesses and evolutions."
          />
          <ShortcutCard
            to="/items"
            icon={<ItemsIcon className="h-8 w-8" />}
            count={items?.length}
            title="Items"
            description="Poké Balls, potions, berries, TMs and more."
          />
        </div>
      </div>

      <BrowseByType />
    </>
  );
};

export default Home;
