// Shown when an item has no sprite (the URL 404s or the API returns null).
const FALLBACK_SPRITE = "/assets/items.svg";

const ItemSprite = ({ src, alt, className = "" }) => (
  <img
    src={src ?? FALLBACK_SPRITE}
    alt={alt}
    loading="lazy"
    onError={(event) => {
      // Guard so a broken fallback can't cause an endless error loop.
      if (!event.currentTarget.src.endsWith(FALLBACK_SPRITE)) {
        event.currentTarget.src = FALLBACK_SPRITE;
      }
    }}
    className={`pixelated object-contain ${className}`}
  />
);

export default ItemSprite;
