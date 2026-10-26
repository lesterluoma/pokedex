import {
  HEIGHT_RANGES,
  MAX_POKEDEX_ID,
  POKEMON_TYPES,
  WEIGHT_RANGES,
} from "../constants";
import { formatName } from "../utils";
import {
  AbilityIcon,
  ChevronIcon,
  HeightIcon,
  ResetIcon,
  TypeIcon,
  WeaknessIcon,
  WeightIcon,
} from "./FilterIcons";

// "fire" -> "Fire". CSS `capitalize` doesn't style <option> text everywhere.
const capitalize = (text) => text.charAt(0).toUpperCase() + text.slice(1);

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
 * The filter controls above the Pokédex grid. Only displays the filters and
 * reports changes; the values live in the address bar (usePokedexFilters).
 *
 * - `filters`: from readFilters() in utils/pokedexFilters.js
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
  <div className="mt-6 space-y-4">
    <div className="flex flex-wrap items-center justify-between gap-3">
      <p className="text-sm font-semibold text-subtle">
        {resultCount != null && `${resultCount.toLocaleString()} Pokémon`}
      </p>
      <RangeFields from={filters.from} to={filters.to} onChange={onChange} />
    </div>

    {/* Two even columns on phones, one wrapping row on wider screens */}
    <div className="grid grid-cols-2 gap-3 sm:flex sm:flex-wrap sm:items-center">
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
      <AbilityField
        value={filters.ability}
        abilities={abilities}
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
      <button
        type="button"
        onClick={onReset}
        disabled={!isActive}
        aria-label="Reset filters"
        title="Reset filters"
        className="flex justify-center rounded-xl bg-muted p-2.5 text-white shadow-sm transition hover:bg-red focus:outline-none focus-visible:ring-2 focus-visible:ring-red disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-muted"
      >
        <ResetIcon />
      </button>
    </div>
  </div>
);

// ---------------------------------------------------------------------------
// Small building blocks used above
// ---------------------------------------------------------------------------

// Shared look for every filter "pill". Active filters turn red.
const pillClasses = (isActive) =>
  `relative flex items-center gap-2 rounded-xl bg-surface pl-3 text-sm font-semibold shadow-sm
   focus-within:ring-2 focus-within:ring-red
   ${isActive ? "text-red ring-1 ring-red/50" : "text-subtle"}`;

/** Dropdown filter. The first option (the label itself) means "any". */
const FilterSelect = ({ icon, label, value, options, onChange }) => (
  <label className={pillClasses(value != null)}>
    {icon}
    <select
      value={value ?? ""}
      onChange={(event) => onChange(event.target.value || null)}
      aria-label={label}
      className="min-w-0 flex-1 cursor-pointer appearance-none bg-transparent py-2.5 pr-9 focus:outline-none"
    >
      <option value="" className="text-ink">
        {label}
      </option>
      {options.map((option) => (
        <option key={option.value} value={option.value} className="text-ink">
          {option.label}
        </option>
      ))}
    </select>
    <span className="pointer-events-none absolute right-3">
      <ChevronIcon />
    </span>
  </label>
);

/** Ability text box. Suggests ability names as you type (via <datalist>). */
const AbilityField = ({ value, abilities, onChange }) => (
  <label className={pillClasses(value != null)}>
    <AbilityIcon />
    <input
      type="text"
      list="ability-options"
      value={value ?? ""}
      onChange={(event) => onChange(event.target.value)}
      placeholder="Ability"
      aria-label="Ability"
      className="min-w-0 flex-1 bg-transparent py-2.5 pr-3 capitalize sm:w-32 sm:flex-none placeholder:normal-case placeholder:text-subtle focus:outline-none"
    />
    <datalist id="ability-options">
      {abilities.map((name) => (
        <option key={name} value={formatName(name)} />
      ))}
    </datalist>
  </label>
);

/** "from [1] to [151]" Pokédex number range. Empty boxes mean no limit. */
const RangeFields = ({ from, to, onChange }) => (
  <div className="flex items-center gap-2 text-sm font-semibold text-subtle">
    <NumberField
      label="from"
      value={from}
      placeholder="1"
      onChange={(value) => onChange("from", value)}
    />
    <NumberField
      label="to"
      value={to}
      placeholder={String(MAX_POKEDEX_ID)}
      onChange={(value) => onChange("to", value)}
    />
  </div>
);

const NumberField = ({ label, value, placeholder, onChange }) => (
  <label className="flex items-center gap-2">
    {label}
    <input
      type="number"
      min="1"
      inputMode="numeric"
      value={value ?? ""}
      placeholder={placeholder}
      aria-label={`${capitalize(label)} Pokédex number`}
      onChange={(event) => onChange(event.target.value)}
      className={`w-24 rounded-xl bg-surface px-3 py-2 text-center text-ink shadow-sm placeholder:text-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-red ${
        value != null ? "ring-1 ring-red/50" : ""
      }`}
    />
  </label>
);

export default PokedexFilters;
