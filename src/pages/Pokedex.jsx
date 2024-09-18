import PokemonCard from "../components/PokemonCard";
import PokemonDetail from "../components/PokemonDetail";

const Pokedex = () => {
  return (
    <div>
      <div className="w-4/5 max-w-full grid grid-cols-4 md:grid-cols-3 gap-4 gap-y-10 mx-auto flex justify-center items-center p-4">
        {Array.from({ length: 150 }, (_, index) => index + 1).map((id) => (
          <PokemonCard key={id} id={id} />
        ))}
      </div>
    </div>
  );
};

export default Pokedex;
