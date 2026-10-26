import { Link } from "react-router-dom";
import { POKEMON_TYPES, TYPE_CLASSES } from "../constants";
import { pokedexTypePath } from "../utils";

/** "Browse by type" grid on the Home page. Each type links to the Pokédex filtered to it. */
const BrowseByType = () => (
  <section className="mt-6 rounded-3xl bg-surface p-6 shadow-sm sm:p-8">
    <h2 className="text-sm font-bold uppercase tracking-wide text-red">
      Browse by type
    </h2>
    <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-6">
      {POKEMON_TYPES.map((type) => (
        <Link
          key={type}
          to={pokedexTypePath(type)}
          className={`rounded-xl py-3 text-center text-xs font-bold uppercase tracking-wide transition hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-red ${TYPE_CLASSES[type]}`}
        >
          {type}
        </Link>
      ))}
    </div>
  </section>
);

export default BrowseByType;
