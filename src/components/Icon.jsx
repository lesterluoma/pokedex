/** Renders one of the 100x100 single-path icons from constants. */
const Icon = ({ path, className = "" }) => (
  <svg
    viewBox="0 0 100 100"
    xmlns="http://www.w3.org/2000/svg"
    className={`fill-current ${className}`}
    aria-hidden="true"
  >
    <path d={path} />
  </svg>
);

export default Icon;
