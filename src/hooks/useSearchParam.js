import { useSearchParams } from "react-router-dom";

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
    setParams(
      (current) => {
        const next = new URLSearchParams(current);
        if (newValue == null || newValue === "") {
          next.delete(name);
        } else {
          next.set(name, String(newValue));
        }
        return next;
      },
      { replace }
    );
  };

  return [params.get(name), setValue];
};
