/**
 * Slide-in panel. It only handles the open/close animation; whatever it
 * shows comes in as `children`.
 *
 * - Large screens (lg+): sits to the right of the grid. The outer <aside>
 *   animates its width so the grid smoothly makes room, and the panel slides
 *   in from the right. The <aside> is stretched to the grid's full height so
 *   the sticky panel has room to stay in view while the page scrolls.
 * - Small screens: a fixed overlay from the right with a dimmed backdrop.
 *
 * The panel stays mounted while closed so it can slide *out* with its
 * content still visible.
 */
const Sidebar = ({ isOpen, onClose, children }) => (
  <>
    {/* Backdrop (small screens only) */}
    <div
      onClick={onClose}
      className={`fixed inset-0 z-20 bg-ink/30 transition-opacity duration-500 lg:hidden ${
        isOpen ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
    />

    <aside
      // `inert` stops keyboard focus from reaching the hidden panel.
      // React 18 only passes it through as a string, hence "" instead of true.
      inert={isOpen ? undefined : ""}
      className={`shrink-0 transition-[width,margin] duration-500 ease-out lg:self-stretch ${
        isOpen ? "lg:ml-6 lg:w-[360px]" : "lg:ml-0 lg:w-0"
      }`}
    >
      <div
        className={`w-[360px] max-w-full pt-24 transition duration-500 ease-out
          max-lg:fixed max-lg:inset-y-0 max-lg:right-0 max-lg:z-30
          lg:sticky lg:top-6
          ${isOpen ? "translate-x-0 opacity-100" : "pointer-events-none translate-x-full opacity-0"}`}
      >
        {children}
      </div>
    </aside>
  </>
);

export default Sidebar;
