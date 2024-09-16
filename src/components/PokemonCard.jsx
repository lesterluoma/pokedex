import { useEffect, useState } from "react";
import { fetchPokemonData } from "../services/pokeapi";

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
    <div className="bg-white-100 hover:bg-blue-100 rounded-lg block justify-center items-center">
      <img
        src={sprites.front_default}
        alt={name}
        className="w-full h-full object-cover rounded-lg z-10"
      />
      <div className="flex flex-col p-4 items-center">
        <p className="text-gray-600 font-bold">No{pokemonId}</p>
        <h1 className="text-2xl font-bold capitalize text-gray-800 mb-2">
          {name}
        </h1>
        <span className="capitalize">
          {types.map((type) => (
            <span key={type.type.name} className={`text-${type.type.name}`}>
              {type.type.name} &nbsp;
            </span>
          ))}
        </span>
      </div>
    </div>
  );
};

export default PokemonCard;
