import { useItemDetails } from "../hooks/useItems";
import { formatName, formatPokedexNumber, spriteUrl } from "../utils";
import DetailPanel, { Pill, Section } from "./DetailPanel";
import ItemSprite from "./ItemSprite";

/**
 * Contents of the sidebar for one item. All data comes from
 * getItemDetails() in services/pokeapi.js.
 */
const ItemDetail = ({ id, onClose }) => {
  const { data: item, error, isLoading } = useItemDetails(id);

  return (
    <DetailPanel
      onClose={onClose}
      isLoading={isLoading}
      error={error}
      errorMessage="Couldn't load this item. Try again."
    >
      {item && (
        <>
          {/* Sprite bubble pokes out above the top of the card */}
          <div className="absolute -top-12 left-1/2 flex h-24 w-24 -translate-x-1/2 items-center justify-center rounded-full bg-white shadow-lg">
            <ItemSprite src={item.sprite} alt={item.name} className="h-16 w-16" />
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto px-6 pb-6 pt-16 text-center">
            <p className="text-sm font-semibold text-gray-400">
              {formatPokedexNumber(item.id)}
            </p>
            <h2 className="text-2xl font-bold capitalize">
              {formatName(item.name)}
            </h2>
            <p className="mt-2 inline-block rounded-md bg-blue-soft px-2.5 py-1 text-xs font-bold uppercase tracking-wide text-blue">
              {formatName(item.category)}
            </p>

            {item.effect && (
              <Section title="Effect">
                <p className="text-sm text-gray-600">{item.effect}</p>
              </Section>
            )}
            {item.description && (
              <Section title="Description">
                <p className="text-sm text-gray-600">{item.description}</p>
              </Section>
            )}
            <Section title="Shop Price">
              <Pill>
                {item.price ? `₽${item.price.toLocaleString()}` : "No price listed"}
              </Pill>
            </Section>
            {item.attributes.length > 0 && (
              <Section title="Attributes">
                <Attributes attributes={item.attributes} />
              </Section>
            )}
            {item.heldBy.length > 0 && (
              <Section title="Held by wild Pokémon">
                <HeldBy pokemon={item.heldBy} />
              </Section>
            )}
          </div>
        </>
      )}
    </DetailPanel>
  );
};

// ---------------------------------------------------------------------------
// Small building blocks used above
// ---------------------------------------------------------------------------

const Attributes = ({ attributes }) => (
  <div className="flex flex-wrap justify-center gap-1.5">
    {attributes.map((attribute) => (
      <span
        key={attribute}
        className="rounded-full bg-page px-3 py-1 text-xs font-semibold capitalize text-gray-500"
      >
        {formatName(attribute)}
      </span>
    ))}
  </div>
);

const HeldBy = ({ pokemon }) => (
  <div className="flex flex-wrap justify-center gap-1">
    {pokemon.map(({ id, name }) => (
      <img
        key={id}
        src={spriteUrl(id)}
        alt={name}
        title={formatName(name)}
        className="pixelated h-14 w-14 capitalize"
      />
    ))}
  </div>
);

export default ItemDetail;
