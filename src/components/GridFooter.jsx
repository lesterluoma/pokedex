/** Centered gray text for "Loading...", "No matches" and errors. */
export const StatusMessage = ({ children }) => (
  <p className="mt-10 text-center text-sm text-muted">{children}</p>
);

/** "Show more" button under a grid. Hidden when nothing is left to show. */
export const ShowMoreButton = ({ remaining, onClick }) =>
  remaining > 0 && (
    <button
      type="button"
      onClick={onClick}
      className="mx-auto mt-10 block rounded-xl bg-red px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-red/40 transition hover:bg-red-dark"
    >
      Show more ({remaining} left)
    </button>
  );
