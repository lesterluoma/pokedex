import { navLists } from "../constants";

const Navbar = () => {
  return (
    <header className="w-4/5 py-5 sm:px-10 px-5 flex justify-between items-center bg-white shadow-md rounded-lg mx-auto mt-10 max-sm:hidden">
      <nav className="flex w-full">
        <div className="flex flex-1 justify-center">
          {navLists.map(({ nav, img }) => (
            <div
              key={nav}
              className="flex items-center px-5 text-2xl cursor-pointer text-black font-bold hover:text-red transition-all"
            >
              <img src={img} alt={`${nav} Icon`} className="w-6 h-6 mr-2" />
              {nav}
            </div>
          ))}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
