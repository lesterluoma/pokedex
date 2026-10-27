import { NavLink } from "react-router-dom";
import { HomeIcon, ItemsIcon, PokeballIcon } from "./Icon";
import ThemeToggle from "./ThemeToggle";

const NAV_ITEMS = [
  { label: "Home", href: "/", Icon: HomeIcon },
  { label: "Pokédex", href: "/pokedex", Icon: PokeballIcon },
  { label: "Items", href: "/items", Icon: ItemsIcon },
];

const NavItem = ({ label, href, Icon }) => (
  <NavLink
    to={href}
    // Without `end`, the "/" link would count as active on every page.
    end
    className={({ isActive }) =>
      `flex items-center gap-2 border-b-2 py-4 text-sm font-semibold transition-colors ${
        isActive
          ? "border-red text-red"
          : "border-transparent text-subtle hover:text-red"
      }`
    }
  >
    <Icon className="h-6 w-6" />
    {/* Icons only on phones; the label is still read by screen readers */}
    <span className="max-sm:sr-only">{label}</span>
  </NavLink>
);

const Navbar = () => (
  <header className="mt-6 flex items-center gap-2 rounded-2xl bg-surface px-4 shadow-sm sm:px-8">
    <nav className="flex flex-1 justify-around">
      {NAV_ITEMS.map((item) => (
        <NavItem key={item.href} {...item} />
      ))}
    </nav>
    <ThemeToggle />
  </header>
);

export default Navbar;
