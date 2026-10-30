/**
 * White card with a small uppercase heading, used for the sections of the
 * Pokémon detail page. `action` (e.g. a dropdown) sits at the right of the
 * heading.
 */
const PageCard = ({ title, action = null, className = "", children }) => (
  <section className={`rounded-3xl bg-surface p-6 shadow-sm ${className}`}>
    <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
      <h2 className="text-left text-sm font-bold uppercase tracking-wide">
        {title}
      </h2>
      {action}
    </div>
    {children}
  </section>
);

export default PageCard;
