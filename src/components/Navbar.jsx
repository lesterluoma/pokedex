import { NavLink } from "react-router-dom";
import { NAV_ITEMS } from "../constants";
import Icon from "./Icon";

const NavItem = ({ label, svgPath, href }) => (
  <NavLink
    to={href}
    className={({ isActive }) =>
      `flex items-center gap-2 border-b-2 py-4 text-sm font-semibold transition-colors ${
        isActive
          ? "border-red text-red"
          : "border-transparent text-gray-500 hover:text-red"
      }`
    }
  >
    <Icon path={svgPath} className="h-7 w-7" />
    {/* Icons only on phones; the label is still read by screen readers */}
    <span className="max-sm:sr-only">{label}</span>
  </NavLink>
);

const Navbar = () => (
  <header className="mt-6 rounded-2xl bg-white px-4 shadow-sm sm:px-8">
    <nav className="flex justify-around">
      {NAV_ITEMS.map((item) => (
        <NavItem key={item.href} {...item} />
      ))}
    </nav>
  </header>
);

export default Navbar;
