import PokemonCard from "../components/PokemonCard";

const Pokedex = () => {
  return (
    <div className="w-4/5 max-w-full grid grid-cols-4 gap-4 mx-auto flex justify-center items-center">
      {Array.from({ length: 50 }, (_, index) => index + 1).map((id) => (
        <PokemonCard key={id} id={id} />
      ))}
    </div>
  );
};

export default Pokedex;
