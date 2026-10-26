import { ShowMoreButton, StatusMessage } from "../components/GridFooter";
import ItemCard from "../components/ItemCard";
import ItemDetail from "../components/ItemDetail";
import Searchbar from "../components/Searchbar";
import Sidebar from "../components/Sidebar";
import { useFilteredList } from "../hooks/useFilteredList";
import { useItemList } from "../hooks/useItems";
import { useSidebarSelection } from "../hooks/useSidebarSelection";
import { toSlug } from "../utils";

const matchesName = (item, query) => item.name.includes(toSlug(query));

const Items = () => {
  const { data: items, error, isLoading } = useItemList();
  const grid = useFilteredList(items, matchesName);
  const sidebar = useSidebarSelection();

  return (
    <>
      <Searchbar
        placeholder="Filter items by name..."
        onQueryChange={grid.changeQuery}
      />

      {isLoading && <StatusMessage>Loading items...</StatusMessage>}
      {error && (
        <StatusMessage>Couldn&apos;t load items. Try refreshing.</StatusMessage>
      )}
      {items && grid.matchCount === 0 && (
        <StatusMessage>No items match &quot;{grid.query}&quot;.</StatusMessage>
      )}

      <div className="mt-10 flex items-start">
        <div className="min-w-0 flex-1">
          <section className="grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-4">
            {grid.visible.map(({ id, name }) => (
              <ItemCard
                key={id}
                id={id}
                name={name}
                isSelected={sidebar.isSelected(id)}
                onSelect={sidebar.toggle}
              />
            ))}
          </section>
          <ShowMoreButton remaining={grid.remaining} onClick={grid.showMore} />
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

export default Items;
