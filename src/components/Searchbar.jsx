import { pokeballImg } from "../utils";

const Searchbar = () => {
  return (
    <div className="w-4/5 max-w-full p-4 mx-auto flex justify-center items-center">
      <div className="flex items-center w-full bg-white rounded-lg shadow-md">
        <input
          type="text"
          placeholder="Find your Pokemon..."
          className="w-full p-3 text-gray font-semibold bg-transparent rounded-lg focus:outline-none"
        />
        <button className="px-2 py-2 bg-red text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 transition">
          <img
            src={pokeballImg}
            alt="search button"
            className="w-6 h-6 fill-white"
          />
        </button>
      </div>
    </div>
  );
};

export default Searchbar;
