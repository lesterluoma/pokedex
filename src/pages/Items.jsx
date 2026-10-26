import { useState } from "react";
import ItemCard from "../components/ItemCard";
import ItemDetail from "../components/ItemDetail";
import Searchbar from "../components/Searchbar";
import Sidebar from "../components/Sidebar";
import { ITEMS_PAGE_SIZE } from "../constants";
import { useItemList } from "../hooks/useItems";
import { useSidebarSelection } from "../hooks/useSidebarSelection";

// "Poke ball" -> "poke-ball", so typed names match API names.
const normalize = (text) => text.trim().toLowerCase().replace(/\s+/g, "-");

const Items = () => {
  const { data: items, error, isLoading } = useItemList();
  const sidebar = useSidebarSelection();
  const [query, setQuery] = useState("");
  // There are ~2,200 items, so cards are rendered a page at a time.
  const [visibleCount, setVisibleCount] = useState(ITEMS_PAGE_SIZE);

  const handleQueryChange = (text) => {
    setQuery(text);
    setVisibleCount(ITEMS_PAGE_SIZE); // start from the top for a new filter
  };

  const matches = (items ?? []).filter((item) =>
    item.name.includes(normalize(query))
  );
  const visibleItems = matches.slice(0, visibleCount);

  return (
    <>
      <Searchbar
        placeholder="Filter items by name..."
        onQueryChange={handleQueryChange}
      />

      {isLoading && <Status>Loading items...</Status>}
      {error && <Status>Couldn&apos;t load items. Try refreshing.</Status>}
      {items && matches.length === 0 && (
        <Status>No items match &quot;{query}&quot;.</Status>
      )}

      <div className="mt-10 flex items-start">
        <div className="min-w-0 flex-1">
          <section className="grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-4">
            {visibleItems.map(({ id, name }) => (
              <ItemCard
                key={id}
                id={id}
                name={name}
                isSelected={sidebar.isSelected(id)}
                onSelect={sidebar.toggle}
              />
            ))}
          </section>

          {visibleCount < matches.length && (
            <button
              type="button"
              onClick={() => setVisibleCount((count) => count + ITEMS_PAGE_SIZE)}
              className="mx-auto mt-10 block rounded-xl bg-red px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-red/40 transition hover:bg-red-dark"
            >
              Show more ({matches.length - visibleCount} left)
            </button>
          )}
        </div>

        <Sidebar isOpen={sidebar.isOpen} onClose={sidebar.close}>
          {sidebar.selectedId && (
            <ItemDetail id={sidebar.selectedId} onClose={sidebar.close} />
          )}
        </Sidebar>
      </div>
    </>
  );
};

const Status = ({ children }) => (
  <p className="mt-10 text-center text-sm text-muted">{children}</p>
);

export default Items;
