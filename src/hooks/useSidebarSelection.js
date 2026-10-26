import { useState } from "react";
import { useSearchParam } from "./useSearchParam";

// "25" -> 25. Anything that isn't a positive whole number -> null.
const toId = (value) => (/^\d+$/.test(value ?? "") ? Number(value) : null);

/**
 * Which grid card is shown in the sidebar, and whether the sidebar is open.
 * Shared by the Pokédex and Items pages.
 *
 * The open card lives in the address bar as `?id=25`, so links can open a
 * specific Pokémon, a refresh keeps it open, and Back closes the sidebar.
 * Every open, switch and close adds a history entry.
 */
export const useSidebarSelection = () => {
  const [idParam, setIdParam] = useSearchParam("id");
  const openId = toId(idParam);
  const isOpen = openId != null;

  // After closing, `?id` is gone, but the sidebar still needs something to
  // show while it slides out. So remember the last id that was open.
  // (Updating state during render is React's recommended way to track a
  // previous value: https://react.dev/reference/react/useState#storing-information-from-previous-renders)
  const [lastOpenId, setLastOpenId] = useState(openId);
  if (isOpen && openId !== lastOpenId) setLastOpenId(openId);
  const selectedId = openId ?? lastOpenId;

  const open = (id) => setIdParam(id);
  const close = () => setIdParam(null);

  // Clicking the card that's already open closes the sidebar.
  // Clicking any other card opens (or switches) the sidebar to it.
  const toggle = (id) => {
    if (id === openId) {
      close();
    } else {
      open(id);
    }
  };

  const isSelected = (id) => id === openId;

  return { selectedId, isOpen, open, close, toggle, isSelected };
};
