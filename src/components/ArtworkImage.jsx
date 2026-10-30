import { useEffect, useState } from "react";
import { artworkFit, contentBox } from "../utils";

// The CSS transform for each image address, measured once per page load.
// "" means leave the image as it is (blank, or its pixels can't be read).
const transforms = new Map();

// Images are measured from a copy this small, which is plenty for sizing
// and much faster than reading every pixel of a 475px artwork.
const MEASURE_SIZE = 100;

const measure = (image) => {
  try {
    const ratio = MEASURE_SIZE / Math.max(image.naturalWidth, image.naturalHeight);
    const width = Math.max(1, Math.round(image.naturalWidth * ratio));
    const height = Math.max(1, Math.round(image.naturalHeight * ratio));
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d", { willReadFrequently: true });
    context.drawImage(image, 0, 0, width, height);
    const box = contentBox(context.getImageData(0, 0, width, height).data, width, height);
    if (!box) return "";
    const { scale, x, y } = artworkFit(box, width, height);
    return `scale(${scale}) translate(${x}%, ${y}%)`;
  } catch {
    return "";
  }
};

/**
 * A Pokémon image that always fills its box the same way, however much
 * empty space the image file has around the Pokémon (see artworkFit). The
 * box should be square.
 *
 * When `src` changes, the image already on screen stays until the new one
 * has downloaded and been measured, then they swap, so there's no blank gap
 * and no jump in size. The very first image stays hidden until it's
 * measured. Images measured before show straight away.
 *
 * `crossOrigin` lets the canvas read the pixels; the sprite host allows it.
 */
const ArtworkImage = ({ src, alt, onError, className = "", ...props }) => {
  // The image on screen and its transform: { src, transform }.
  const [shown, setShown] = useState(null);
  const shownSrc = shown?.src;
  const isSwapping = shown && shownSrc !== src && !transforms.has(src);
  const displaySrc = isSwapping ? shownSrc : src;
  const transform =
    transforms.get(displaySrc) ?? (shownSrc === displaySrc ? shown.transform : undefined);

  // Download and measure the next image while the current one stays up.
  useEffect(() => {
    if (!shownSrc || shownSrc === src || transforms.has(src)) return undefined;
    let isCurrent = true;
    const next = new Image();
    next.crossOrigin = "anonymous";
    next.onload = () => {
      if (!transforms.has(src)) transforms.set(src, measure(next));
      if (isCurrent) setShown({ src, transform: transforms.get(src) });
    };
    // Swap anyway, so the <img> below hits the error and runs onError.
    next.onerror = () => {
      if (isCurrent) setShown({ src, transform: "" });
    };
    next.src = src;
    return () => {
      isCurrent = false;
    };
  }, [src, shownSrc]);

  const handleLoad = (event) => {
    if (!transforms.has(displaySrc)) {
      transforms.set(displaySrc, measure(event.currentTarget));
    }
    setShown({ src: displaySrc, transform: transforms.get(displaySrc) });
  };

  const handleError = (event) => {
    // Show the browser's broken image rather than nothing.
    setShown({ src: displaySrc, transform: "" });
    onError?.(event);
  };

  return (
    <img
      {...props}
      src={displaySrc}
      alt={alt}
      crossOrigin="anonymous"
      onLoad={handleLoad}
      onError={handleError}
      style={transform ? { transform } : undefined}
      className={`object-contain ${transform === undefined ? "opacity-0" : ""} ${className}`}
    />
  );
};

export default ArtworkImage;
