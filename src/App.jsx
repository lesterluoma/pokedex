import Navbar from "./components/Navbar";

import { pokeballBg } from "./utils";

const App = () => {
  return (
    <main>
      <div className="-top-80 -left-80 -z-10 absolute w-[900px] h-[900px]">
        <img
          src={pokeballBg}
          alt="pokeball background"
          className="w-full h-full"
        />
      </div>
      <Navbar />
    </main>
  );
};

export default App;
