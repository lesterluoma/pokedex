/**
 * The white card inside the sidebar, shared by PokemonDetail and ItemDetail.
 * Handles the close button and the loading/error messages; the caller
 * renders its content as `children` once the data has loaded.
 */
const DetailPanel = ({ onClose, isLoading, error, errorMessage, children }) => (
  <div className="relative flex h-full flex-col rounded-t-3xl bg-white shadow-xl lg:h-auto lg:max-h-[calc(100vh-7.5rem)] lg:rounded-3xl">
    <button
      type="button"
      onClick={onClose}
      aria-label="Close details"
      className="absolute right-4 top-4 z-10 rounded-full p-1 text-xl leading-none text-gray-400 hover:bg-page hover:text-ink"
    >
      ×
    </button>

    {isLoading && <Message>Loading...</Message>}
    {error && <Message>{errorMessage}</Message>}
    {children}
  </div>
);

// ---------------------------------------------------------------------------
// Small building blocks for panel content
// ---------------------------------------------------------------------------

const Message = ({ children }) => (
  <p className="p-10 text-center text-sm text-gray-400">{children}</p>
);

export const Section = ({ title, children }) => (
  <section className="mt-4">
    <h3 className="mb-1.5 text-sm font-bold uppercase tracking-wide">{title}</h3>
    {children}
  </section>
);

export const Pill = ({ children, className = "" }) => (
  <div
    className={`rounded-full bg-page px-4 py-2 text-sm font-medium ${className}`}
  >
    {children}
  </div>
);

export default DetailPanel;
