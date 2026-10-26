import { ShowMoreButton, StatusMessage } from "../components/GridFooter";
import ItemCard from "../components/ItemCard";
import ItemDetail from "../components/ItemDetail";
import ItemFilters from "../components/ItemFilters";
import Searchbar from "../components/Searchbar";
import Sidebar from "../components/Sidebar";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { useFilteredList } from "../hooks/useFilteredList";
import { useItemDetails, useItemIndex, useItemList } from "../hooks/useItems";
import { useSidebarSelection } from "../hooks/useSidebarSelection";
import { useUrlFilters } from "../hooks/useUrlFilters";
import { toSlug, toTitleCase } from "../utils";
import {
  filterItems,
  needsItemIndex,
  readItemFilters,
} from "../utils/itemFilters";

const matchesName = (item, query) => item.name.includes(toSlug(query));

const Items = () => {
  // The grid is built from the plain item list. The index (pocket,
  // category, attributes) is only needed once a filter uses it, so the grid
  // still works if the index fails to load.
  const allItems = useItemList();
  const itemIndex = useItemIndex();
  const itemFilters = useUrlFilters(readItemFilters);
  const { filters } = itemFilters;
  const isWaitingForIndex = needsItemIndex(filters) && !itemIndex.data;

  // Filters run first, then the search text inside useFilteredList.
  const items = filterItems(allItems.data, itemIndex.data, filters);
  const grid = useFilteredList(items, matchesName);
  const sidebar = useSidebarSelection();

  // Tab title: the open item's name, or "Items". useItemDetails shares its
  // cached request with the sidebar, so this doesn't fetch anything extra.
  const openItem = useItemDetails(sidebar.isOpen ? sidebar.selectedId : null);
  useDocumentTitle(openItem.data ? toTitleCase(openItem.data.name) : "Items");

  const handleFilterChange = (changes) => {
    itemFilters.setFilters(changes);
    grid.resetPage();
  };

  const handleResetFilters = () => {
    itemFilters.resetFilters();
    grid.resetPage();
  };

  return (
    <>
      <Searchbar
        placeholder="Filter items by name..."
        onQueryChange={grid.changeQuery}
        initialQuery={grid.query}
      />
      <ItemFilters
        filters={filters}
        onChange={handleFilterChange}
        onReset={handleResetFilters}
        isActive={itemFilters.isActive}
        categories={itemIndex.data?.categories ?? []}
        resultCount={items ? grid.matchCount : null}
        maxId={allItems.data?.at(-1)?.id}
      />

      {allItems.isLoading && <StatusMessage>Loading items...</StatusMessage>}
      {allItems.error && (
        <StatusMessage>Couldn&apos;t load items. Try refreshing.</StatusMessage>
      )}
      {isWaitingForIndex && itemIndex.isLoading && (
        <StatusMessage>Loading filters...</StatusMessage>
      )}
      {isWaitingForIndex && itemIndex.error && (
        <StatusMessage>
          Couldn&apos;t load the data for these filters. Try refreshing, or
          reset the filters to see every item.
        </StatusMessage>
      )}
      {items && grid.matchCount === 0 && (
        <StatusMessage>No items match your search and filters.</StatusMessage>
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
