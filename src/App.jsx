import {
  Navigate,
  BrowserRouter as Router,
  Route,
  Routes,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Items from "./pages/Items";
import Pokedex from "./pages/Pokedex";

const App = () => (
  <Router>
    {/* overflow-x-clip: the closed sidebar sits just off-screen to the right */}
    <div className="relative min-h-screen overflow-x-clip">
      {/* Decorative pokéball in the top-left corner. The SVG is a fixed light
          gray, so it's faded way down in dark mode. */}
      <img
        src="/assets/background.svg"
        alt=""
        className="pointer-events-none absolute -left-60 -top-60 -z-10 h-[800px] w-[800px] dark:opacity-5"
      />

      <main className="mx-auto max-w-6xl px-4 pb-16">
        <Navbar />
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/pokedex" element={<Pokedex />} />
          <Route path="/items" element={<Items />} />
          {/* Anything else (including "/") goes to the Pokédex */}
          <Route path="*" element={<Navigate to="/pokedex" replace />} />
        </Routes>
      </main>
    </div>
  </Router>
);

export default App;
