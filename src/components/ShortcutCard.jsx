import { Link } from "react-router-dom";
import Icon from "./Icon";

/**
 * Big link card on the Home page, e.g. "1,025 Pokémon >".
 * `count` is a number, or null while it's still loading.
 */
const ShortcutCard = ({ to, svgPath, count, title, description }) => (
  <Link
    to={to}
    className="group flex items-center gap-4 rounded-3xl bg-surface p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-red"
  >
    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-red/10 text-red">
      <Icon path={svgPath} className="h-8 w-8" />
    </div>
    <div className="min-w-0 flex-1">
      <p className="text-2xl font-bold">
        {count == null ? "..." : count.toLocaleString()}
      </p>
      <p className="text-sm font-semibold">{title}</p>
      <p className="text-xs text-muted">{description}</p>
    </div>
    <span className="text-2xl text-muted transition group-hover:translate-x-1 group-hover:text-red">
      ›
    </span>
  </Link>
);

export default ShortcutCard;
