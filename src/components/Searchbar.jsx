import { useState } from "react";
import { POKEBALL_SVG_PATH } from "../constants";
import Icon from "./Icon";

/**
 * Just a form; the actual lookup happens in the parent page.
 * - `onSearch(query)`: called on submit (Enter or the button). Optional.
 * - `onQueryChange(text)`: called on every keystroke, for live filtering. Optional.
 * - `error`: message shown under the bar.
 */
const Searchbar = ({
  onSearch,
  onQueryChange,
  error,
  placeholder = "Search your Pokémon by name or number...",
}) => {
  const [query, setQuery] = useState("");

  const handleChange = (event) => {
    setQuery(event.target.value);
    onQueryChange?.(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault(); // stop the browser from reloading the page
    if (query.trim()) onSearch?.(query.trim());
  };

  return (
    <form onSubmit={handleSubmit} className="mt-6">
      <div className="flex items-center rounded-2xl bg-surface p-2 pl-5 shadow-sm">
        <input
          type="text"
          value={query}
          onChange={handleChange}
          placeholder={placeholder}
          className="w-full bg-transparent py-3 text-sm text-ink placeholder:text-muted focus:outline-none"
        />
        <button
          type="submit"
          aria-label="Search"
          className="rounded-xl bg-red p-2 text-white shadow-lg shadow-red/40 transition hover:bg-red-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-red focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
        >
          <Icon path={POKEBALL_SVG_PATH} className="h-7 w-7" />
        </button>
      </div>
      {error && <p className="mt-2 pl-5 text-sm text-red">{error}</p>}
    </form>
  );
};

export default Searchbar;
