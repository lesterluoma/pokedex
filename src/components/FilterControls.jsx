// Building blocks for the filter bars on the Pokédex and Items pages
// (PokedexFilters.jsx, ItemFilters.jsx). They only display values and report
// changes; the values themselves live in the address bar (useUrlFilters).

import { ChevronIcon, ResetIcon } from "./FilterIcons";

/**
 * The whole filter area: a top row with the result count and the from/to
 * number range, then the filters (`children`) and a reset button.
 *
 * - `resultCount`: how many cards match, or null while loading
 * - `singular`, `plural`: what's being counted, e.g. "item" and "items"
 * - `from`, `to`, `rangeMax`: the number range (null = no limit)
 * - `onChange(name, value)`: used for "from" and "to"
 */
export const FilterBar = ({
  resultCount,
  singular,
  plural,
  from,
  to,
  rangeMax,
  onChange,
  onReset,
  isActive,
  children,
}) => (
  <div className="mt-6 space-y-4">
    <div className="flex flex-wrap items-center justify-between gap-3">
      <p className="text-sm font-semibold text-subtle">
        {resultCount != null &&
          `${resultCount.toLocaleString()} ${resultCount === 1 ? singular : plural}`}
      </p>
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
          placeholder={rangeMax != null ? String(rangeMax) : ""}
          onChange={(value) => onChange("to", value)}
        />
      </div>
    </div>

    {/* Two even columns on phones, one wrapping row on wider screens */}
    <div className="grid grid-cols-2 gap-3 sm:flex sm:flex-wrap sm:items-center">
      {children}
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

// Shared look for every filter "pill". Active filters turn red.
const pillClasses = (isActive) =>
  `relative flex items-center gap-2 rounded-xl bg-surface pl-3 text-sm font-semibold shadow-sm
   focus-within:ring-2 focus-within:ring-red
   ${isActive ? "text-red ring-1 ring-red/50" : "text-subtle"}`;

const Options = ({ options }) =>
  options.map((option) => (
    <option key={option.value} value={option.value} className="text-ink">
      {option.label}
    </option>
  ));

/**
 * Dropdown filter. The first option (the label itself) means "any".
 * Pass `options` ([{ value, label }]), or `groups` ([{ label, options }])
 * to show the options under headings.
 */
export const FilterSelect = ({
  icon,
  label,
  value,
  options = [],
  groups,
  onChange,
}) => (
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
      {groups
        ? groups.map((group) => (
            <optgroup key={group.label} label={group.label} className="text-ink">
              <Options options={group.options} />
            </optgroup>
          ))
        : <Options options={options} />}
    </select>
    <span className="pointer-events-none absolute right-3">
      <ChevronIcon />
    </span>
  </label>
);

/**
 * Text box filter that suggests values as you type (via <datalist>).
 * `listId` must be unique on the page.
 */
export const FilterTextField = ({
  icon,
  label,
  value,
  suggestions,
  listId,
  onChange,
}) => (
  <label className={pillClasses(value != null)}>
    {icon}
    <input
      type="text"
      list={listId}
      value={value ?? ""}
      onChange={(event) => onChange(event.target.value)}
      placeholder={label}
      aria-label={label}
      className="min-w-0 flex-1 bg-transparent py-2.5 pr-3 capitalize placeholder:normal-case placeholder:text-subtle focus:outline-none sm:w-32 sm:flex-none"
    />
    <datalist id={listId}>
      {suggestions.map((suggestion) => (
        <option key={suggestion} value={suggestion} />
      ))}
    </datalist>
  </label>
);

/** On/off filter button, e.g. "Held by wild Pokémon". */
export const FilterToggle = ({ icon, label, isOn, onChange }) => (
  <button
    type="button"
    aria-pressed={isOn}
    onClick={() => onChange(!isOn)}
    className={`${pillClasses(isOn)} py-2.5 pr-4 text-left focus:outline-none`}
  >
    {icon}
    {label}
  </button>
);

/** One of the "from [ ] to [ ]" number boxes. Empty means no limit. */
const NumberField = ({ label, value, placeholder, onChange }) => (
  <label className="flex items-center gap-2">
    {label}
    <input
      type="number"
      min="1"
      inputMode="numeric"
      value={value ?? ""}
      placeholder={placeholder}
      aria-label={`${label === "from" ? "From" : "To"} number`}
      onChange={(event) => onChange(event.target.value)}
      className={`w-24 rounded-xl bg-surface px-3 py-2 text-center text-ink shadow-sm placeholder:text-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-red ${
        value != null ? "ring-1 ring-red/50" : ""
      }`}
    />
  </label>
);
