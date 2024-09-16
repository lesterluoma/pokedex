import { useState } from "react";
import { fetchPokemonData } from "../services/pokeapi.js";

const Searchbar = () => {
  const [searchQuery, setSearchQuery] = useState(""); // To track the input value

  const handleSearch = async () => {
    if (searchQuery.trim() !== "") {
      const data = await fetchPokemonData(searchQuery);
      if (data) {
        console.log(data); // Do something with this
      } else {
        console.error("No Pokemon found"); // Do something with this
      }
    }
  };

  return (
    <div className="w-4/5 max-w-full p-4 mx-auto flex justify-center items-center">
      <div className="flex items-center w-full bg-white text-gray-200 rounded-lg shadow-lg p-3">
        <input
          type="text"
          value={searchQuery} // Bind the input value to state
          onChange={(e) => setSearchQuery(e.target.value)} // Update state when the user types
          placeholder="Find your Pokémon..."
          className="w-full p-3 text-gray-300 font-semibold bg-transparent rounded-lg focus:outline-none"
        />
        <button
          onClick={handleSearch}
          className="rounded-lg bg-red text-white hover:bg-blue-100 hover:text-red-100 focus:outline focus:outline-offset-2 transition"
        >
          <svg
            width="30pt"
            height="30pt"
            version="1.1"
            viewBox="0 0 100 100"
            className="fill-current"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="m27.371 27.371c-6.0039 6-9.375 14.141-9.375 22.625 0 8.4883 3.3711 16.629 9.3711 22.629 6 6.0039 14.141 9.375 22.629 9.375 8.4844 0 16.625-3.3711 22.629-9.375 6-6 9.3711-14.141 9.3711-22.629 0-8.4844-3.375-16.625-9.375-22.625-5.9727-6.0547-14.121-9.4609-22.625-9.4609s-16.652 3.4062-22.625 9.4609zm5.6289 5.6289c4.1758-4.1836 9.7461-6.6797 15.648-7.0078 5.9023-0.33203 11.715 1.5273 16.332 5.2188 4.6172 3.6953 7.707 8.9609 8.6797 14.789h-10.25c-1.7695-5.9297-7.2266-9.9961-13.414-9.9961-6.1914 0-11.645 4.0664-13.418 9.9961h-10.238c0.80469-4.9258 3.1328-9.4727 6.6602-13zm21.238 21.238c-1.7148 1.7148-4.2969 2.2266-6.5352 1.3008-2.2422-0.92969-3.7031-3.1172-3.7031-5.543 0-2.4258 1.4609-4.6133 3.7031-5.543 2.2383-0.92969 4.8203-0.41797 6.5352 1.2969 1.1289 1.125 1.7617 2.6523 1.7617 4.2461 0 1.5898-0.63281 3.1172-1.7617 4.2422zm12.762 12.762c-4.5039 4.5195-10.621 7.0586-17 7.0586s-12.496-2.5391-17-7.0586c-3.5391-3.5234-5.8789-8.0742-6.6914-13h10.281c1.7695 5.9297 7.2266 9.9961 13.414 9.9961 6.1914 0 11.645-4.0664 13.418-9.9961h10.238c-0.80469 4.9258-3.1328 9.4727-6.6602 13z" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Searchbar;
