/** 7 -> "N°007" */
export const formatPokedexNumber = (id) => `N°${String(id).padStart(3, "0")}`;

/** "mr-mime" -> "mr mime" (CSS `capitalize` handles the casing) */
export const formatName = (name) => name.replace(/-/g, " ");

/** Small pixel sprite by id, without needing an extra API request. */
export const spriteUrl = (id) =>
  `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;

/** Item sprite by name. Not every item has one, so use a fallback on error. */
export const itemSpriteUrl = (name) =>
  `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/${name}.png`;
