export const fetchPokemonData = async (id) => {
  const url = `https://pokeapi.co/api/v2/pokemon/${id}`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const json = await response.json(); // Wait for the promise to resolve
    return json; // Return the JSON data
  } catch (error) {
    console.error("Error fetching Pokémon data:", error);
    return null;
  }
};
