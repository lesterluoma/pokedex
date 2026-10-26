import { POKEMON_TYPES } from "../constants";

// "fire" -> "Fire". CSS `capitalize` doesn't style <option> text everywhere.
const capitalize = (text) => text.charAt(0).toUpperCase() + text.slice(1);

/**
 * Type dropdown above the Pokédex grid.
 * `value` is a type name like "fire", or null for all types.
 * `onChange(type)` gets the new type, or null for "All types".
 */
const TypeFilter = ({ value, onChange }) => (
  <label className="flex items-center gap-2 text-sm font-semibold text-subtle">
    Type
    <select
      value={value ?? ""}
      onChange={(event) => onChange(event.target.value || null)}
      className="rounded-xl bg-surface px-4 py-2.5 text-sm font-semibold text-ink shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-red"
    >
      <option value="">All types</option>
      {POKEMON_TYPES.map((type) => (
        <option key={type} value={type}>
          {capitalize(type)}
        </option>
      ))}
    </select>
  </label>
);

export default TypeFilter;
