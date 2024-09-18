import { useEffect, useState } from "react";
import { fetchPokemonData } from "../services/pokeapi";
import { typeMap } from "../utils";

const PokemonCard = ({ id }) => {
  const [pokemon, setPokemon] = useState(null);

  useEffect(() => {
    const fetchPokemon = async () => {
      try {
        const data = await fetchPokemonData(id);

        setPokemon(data);
      } catch (error) {
        console.error("Error fetching Pokémon:", error);
      }
    };

    fetchPokemon();
  }, [id]);

  if (!pokemon) {
    return <div>Loading...</div>;
  }

  const { name, types, sprites, id: pokemonId } = pokemon;

  return (
    <div className="relative bg-white-100 hover:bg-blue-100 cursor-pointer rounded-lg shadow-md p-4">
      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 z-10">
        <img
          src={sprites.front_default}
          alt={name}
          className="w-24 h-24 object-cover rounded-lg z-10"
        />
      </div>
      <div className="mt-12 text-center">
        <p className="text-gray-600 font-bold">
          N°{String(pokemonId).padStart(3, "0")}
        </p>
        <h1 className="text-2xl font-bold capitalize text-gray-800 mb-2 mt-2">
          {name}
        </h1>
        <div className="capitalize align-center ">
          {types.map((type) => (
            <span
              key={type.type.name}
              className={`font-bold ${typeMap[type.type.name]}`}
            >
              {type.type.name} &nbsp;
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PokemonCard;
