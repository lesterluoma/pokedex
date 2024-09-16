export const fetchPokemonData = async (id) => {
  const url = `https://pokeapi.co/api/v2/pokemon/${id}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const json = await response.json();
    console.log(json);
    return json;
  } catch (error) {
    console.error(error.message);
    return null;
  }
};
