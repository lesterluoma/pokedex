export const fetchPokemonData = async (id) => {
  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    console.log(response.json());
    return await response.json();
  } catch (error) {
    console.error("Error fetching Pokémon data:", error);
    throw error;
  }
};
