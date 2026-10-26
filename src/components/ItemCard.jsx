import { formatName, formatPokedexNumber, itemSpriteUrl } from "../utils";
import ItemSprite from "./ItemSprite";

/**
 * One item in the grid. Unlike PokemonCard it makes no request of its own:
 * `name` comes from the item list and the sprite URL is built from it.
 */
const ItemCard = ({ id, name, isSelected, onSelect }) => (
  <button
    type="button"
    onClick={() => onSelect(id)}
    aria-pressed={isSelected}
    className={`flex h-36 w-full flex-col items-center justify-center rounded-3xl bg-white px-3 shadow-sm transition
      hover:-translate-y-1 hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-red
      ${isSelected ? "ring-2 ring-red" : ""}`}
  >
    <ItemSprite src={itemSpriteUrl(name)} alt={name} className="h-12 w-12" />
    <p className="mt-2 text-xs font-semibold text-gray-400">
      {formatPokedexNumber(id)}
    </p>
    <h2 className="mt-0.5 line-clamp-2 text-sm font-bold capitalize">
      {formatName(name)}
    </h2>
  </button>
);

export default ItemCard;
