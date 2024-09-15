import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Searchbar from "./components/Searchbar";
import Home from "./pages/Home";
import Items from "./pages/Items";
import Pokedex from "./pages/Pokedex";

import { backgroundImg } from "./utils";

const App = () => {
  return (
    <Router>
      <main>
        <div className="-top-60 -left-60 -z-10 absolute w-[800px] h-[800px]">
          <img
            src={backgroundImg}
            alt="pokeball background"
            className="w-full h-full"
          />
        </div>
        <Navbar />
        <Searchbar />
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/pokedex" element={<Pokedex />} />
          <Route path="/items" element={<Items />} />
        </Routes>
      </main>
    </Router>
  );
};

export default App;
