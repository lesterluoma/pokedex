import { useState } from "react";

/**
 * Which grid card is shown in the sidebar, and whether the sidebar is open.
 * Shared by the Pokédex and Items pages.
 *
 * `selectedId` is kept after closing so the sidebar can slide out with its
 * content still showing. `isOpen` alone controls visibility.
 */
export const useSidebarSelection = () => {
  const [selectedId, setSelectedId] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const open = (id) => {
    setSelectedId(id);
    setIsOpen(true);
  };

  const close = () => setIsOpen(false);

  // Clicking the card that's already open closes the sidebar.
  // Clicking any other card opens (or switches) the sidebar to it.
  const toggle = (id) => {
    if (isOpen && id === selectedId) {
      close();
    } else {
      open(id);
    }
  };

  const isSelected = (id) => isOpen && id === selectedId;

  return { selectedId, isOpen, open, close, toggle, isSelected };
};
