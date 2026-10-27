import {
  HEIGHT_RANGES,
  MAX_POKEDEX_ID,
  POKEMON_TYPES,
  REGIONS,
  WEIGHT_RANGES,
} from "../constants";
import { capitalize, toTitleCase } from "../utils";
import { FilterBar, FilterSelect, FilterTextField } from "./FilterControls";
import {
  AbilityIcon,
  HeightIcon,
  RegionIcon,
  TypeIcon,
  WeaknessIcon,
  WeightIcon,
} from "./FilterIcons";

const TYPE_OPTIONS = POKEMON_TYPES.map((type) => ({
  value: type,
  label: capitalize(type),
}));
const WEAKNESS_OPTIONS = POKEMON_TYPES.map((type) => ({
  value: type,
  label: `Weak to ${capitalize(type)}`,
}));
const toOptions = (ranges) =>
  Object.entries(ranges).map(([value, { label }]) => ({ value, label }));

/**
 * The filter controls above the Pokédex grid.
 *
 * - `filters`: from readPokedexFilters() in utils/pokedexFilters.js
 * - `onChange(name, value)`: e.g. ("type", "fire"), or ("type", null) to clear
 * - `abilities`: every ability name, for the Ability suggestions ([] while loading)
 * - `resultCount`: how many Pokémon match, or null while loading
 */
const PokedexFilters = ({
  filters,
  onChange,
  onReset,
  isActive,
  abilities,
  resultCount,
}) => (
  <FilterBar
    resultCount={resultCount}
    singular="Pokémon"
    plural="Pokémon"
    from={filters.from}
    to={filters.to}
    rangeMax={MAX_POKEDEX_ID}
    onChange={onChange}
    onReset={onReset}
    isActive={isActive}
  >
    <FilterSelect
      icon={<RegionIcon />}
      label="Region"
      value={filters.region}
      options={toOptions(REGIONS)}
      onChange={(value) => onChange("region", value)}
    />
    <FilterSelect
      icon={<TypeIcon />}
      label="Type"
      value={filters.type}
      options={TYPE_OPTIONS}
      onChange={(value) => onChange("type", value)}
    />
    <FilterSelect
      icon={<WeaknessIcon />}
      label="Weaknesses"
      value={filters.weakness}
      options={WEAKNESS_OPTIONS}
      onChange={(value) => onChange("weakness", value)}
    />
    <FilterTextField
      icon={<AbilityIcon />}
      label="Ability"
      value={filters.ability}
      // Title cased here because the browser's suggestion list ignores CSS.
      suggestions={abilities.map(toTitleCase)}
      listId="ability-options"
      onChange={(value) => onChange("ability", value)}
    />
    <FilterSelect
      icon={<HeightIcon />}
      label="Height"
      value={filters.height}
      options={toOptions(HEIGHT_RANGES)}
      onChange={(value) => onChange("height", value)}
    />
    <FilterSelect
      icon={<WeightIcon />}
      label="Weight"
      value={filters.weight}
      options={toOptions(WEIGHT_RANGES)}
      onChange={(value) => onChange("weight", value)}
    />
  </FilterBar>
);

export default PokedexFilters;
