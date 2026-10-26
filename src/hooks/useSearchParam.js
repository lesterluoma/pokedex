import { useSearchParams } from "react-router-dom";

/**
 * Returns a copy of `current` (URLSearchParams) with `changes` applied,
 * e.g. { type: "fire", from: null }. null or "" removes a parameter.
 *
 * Use this to change several parameters at once: separate updates in the
 * same click would each start from the old address and overwrite each other.
 */
export const withParams = (current, changes) => {
  const next = new URLSearchParams(current);
  for (const [name, value] of Object.entries(changes)) {
    if (value == null || value === "") {
      next.delete(name);
    } else {
      next.set(name, String(value));
    }
  }
  return next;
};

/**
 * Reads and writes one query parameter in the address bar, e.g. `id` in
 * "/pokedex?id=25". Other parameters are left untouched.
 *
 * Returns [value, setValue]:
 * - `value` is the raw string, or null when the parameter is missing.
 * - `setValue(newValue)` updates it; null or "" removes it.
 *   Pass { replace: true } to change the current history entry instead of
 *   adding a new one (so the Back button skips it).
 */
export const useSearchParam = (name) => {
  const [params, setParams] = useSearchParams();

  const setValue = (newValue, { replace = false } = {}) => {
    setParams((current) => withParams(current, { [name]: newValue }), {
      replace,
    });
  };

  return [params.get(name), setValue];
};
