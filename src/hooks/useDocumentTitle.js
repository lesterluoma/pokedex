import { useEffect } from "react";
import { SITE_NAME } from "../constants";

/**
 * Sets the browser tab title, most specific part first:
 *   useDocumentTitle("Pikachu") -> "Pikachu | Pokédex"
 *   useDocumentTitle(null)      -> "Pokédex"
 *
 * Every page calls this, so the title always matches the page you're on,
 * including after Back/Forward.
 */
export const useDocumentTitle = (title) => {
  useEffect(() => {
    document.title = title ? `${title} | ${SITE_NAME}` : SITE_NAME;
  }, [title]);
};
