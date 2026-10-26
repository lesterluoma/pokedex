import { ITEM_ATTRIBUTES, ITEM_POCKETS } from "../constants";
import { capitalize, formatName } from "../utils";
import { FilterBar, FilterSelect, FilterToggle } from "./FilterControls";
import {
  AttributeIcon,
  CategoryIcon,
  HeldIcon,
  PocketIcon,
} from "./FilterIcons";

const toOptions = (labels) =>
  Object.entries(labels).map(([value, label]) => ({ value, label }));

const POCKET_OPTIONS = toOptions(ITEM_POCKETS);
const ATTRIBUTE_OPTIONS = toOptions(ITEM_ATTRIBUTES);

// Category dropdown options, under a heading per pocket. When a pocket is
// chosen, only that pocket's categories are listed.
const categoryGroups = (categories, pocket) =>
  Object.entries(ITEM_POCKETS)
    .filter(([pocketName]) => !pocket || pocketName === pocket)
    .map(([pocketName, pocketLabel]) => ({
      label: pocketLabel,
      options: categories
        .filter((category) => category.pocket === pocketName)
        .map(({ name }) => ({ value: name, label: capitalize(formatName(name)) })),
    }))
    .filter((group) => group.options.length > 0);

/**
 * The filter controls above the Items grid.
 *
 * - `filters`: from readItemFilters() in utils/itemFilters.js
 * - `onChange(changes)`: e.g. { pocket: "berries" }, or { pocket: null } to
 *   clear. Takes an object because picking a pocket or category can change
 *   both at once.
 * - `categories`: [{ name, pocket }] from the item index ([] while loading)
 * - `resultCount`: how many items match, or null while loading
 * - `maxId`: highest item number, shown in the empty "to" box
 */
const ItemFilters = ({
  filters,
  onChange,
  onReset,
  isActive,
  categories,
  resultCount,
  maxId,
}) => {
  const pocketOfCategory = (name) =>
    categories.find((category) => category.name === name)?.pocket ?? null;

  // A new pocket clears the category, since it may belong to another pocket.
  const handlePocketChange = (pocket) => onChange({ pocket, category: null });

  // Picking a category also selects its pocket, so the two always agree.
  const handleCategoryChange = (category) =>
    onChange(
      category ? { category, pocket: pocketOfCategory(category) } : { category: null }
    );

  return (
    <FilterBar
      resultCount={resultCount}
      singular="item"
      plural="items"
      from={filters.from}
      to={filters.to}
      rangeMax={maxId}
      onChange={(name, value) => onChange({ [name]: value })}
      onReset={onReset}
      isActive={isActive}
    >
      <FilterSelect
        icon={<PocketIcon />}
        label="Pocket"
        value={filters.pocket}
        options={POCKET_OPTIONS}
        onChange={handlePocketChange}
      />
      <FilterSelect
        icon={<CategoryIcon />}
        label="Category"
        value={filters.category}
        groups={categoryGroups(categories, filters.pocket)}
        onChange={handleCategoryChange}
      />
      <FilterSelect
        icon={<AttributeIcon />}
        label="Attribute"
        value={filters.attribute}
        options={ATTRIBUTE_OPTIONS}
        onChange={(attribute) => onChange({ attribute })}
      />
      <FilterToggle
        icon={<HeldIcon />}
        label="Held by wild Pokémon"
        isOn={filters.held != null}
        onChange={(isOn) => onChange({ held: isOn ? "yes" : null })}
      />
    </FilterBar>
  );
};

export default ItemFilters;
