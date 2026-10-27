import { describe, expect, it } from "vitest";
import {
  filterPokemon,
  needsPokedexIndex,
  readPokedexFilters,
} from "./pokedexFilters";

// Reads filters from an address bar query, the same way the Pokédex page does.
const filtersFor = (query) => readPokedexFilters(new URLSearchParams(query));

// What the grid list looks like (from getPokemonList).
const LIST = [
  { id: 1, name: "bulbasaur" },
  { id: 4, name: "charmander" },
  { id: 6, name: "charizard" },
  { id: 74, name: "geodude" },
];

// What the Pokédex index looks like (from getPokedexIndex), with real data.
const INDEX = {
  pokemon: [
    {
      id: 1,
      types: ["grass", "poison"],
      weaknesses: ["fire", "ice", "flying", "psychic"],
      abilities: ["overgrow", "chlorophyll"],
      heightMeters: 0.7,
      weightKg: 6.9,
    },
    {
      id: 4,
      types: ["fire"],
      weaknesses: ["water", "ground", "rock"],
      abilities: ["blaze", "solar-power"],
      heightMeters: 0.6,
      weightKg: 8.5,
    },
    {
      id: 6,
      types: ["fire", "flying"],
      weaknesses: ["water", "electric", "rock"],
      abilities: ["blaze", "solar-power"],
      heightMeters: 1.7,
      weightKg: 90.5,
    },
    {
      id: 74,
      types: ["rock", "ground"],
      weaknesses: ["water", "grass", "ice", "fighting", "ground", "steel"],
      abilities: ["rock-head", "sturdy", "sand-veil"],
      heightMeters: 0.4,
      weightKg: 20,
    },
  ],
};

const namesFor = (query) =>
  filterPokemon(LIST, INDEX, filtersFor(query)).map((pokemon) => pokemon.name);

describe("readPokedexFilters", () => {
  it("reads every filter from the address", () => {
    expect(
      filtersFor("type=fire&weakness=water&ability=blaze&height=tall&weight=heavy&from=1&to=151")
    ).toEqual({
      type: "fire",
      weakness: "water",
      ability: "blaze",
      height: "tall",
      weight: "heavy",
      from: 1,
      to: 151,
    });
  });

  it("ignores values that aren't valid", () => {
    expect(filtersFor("type=banana&height=huge&from=abc&to=-5")).toEqual({
      type: null,
      weakness: null,
      ability: null,
      height: null,
      weight: null,
      from: null,
      to: null,
    });
  });

  it("knows which filters need the index", () => {
    expect(needsPokedexIndex(filtersFor("from=1&to=151"))).toBe(false);
    expect(needsPokedexIndex(filtersFor("type=fire"))).toBe(true);
  });
});

describe("filterPokemon", () => {
  it("returns everything when no filter is set", () => {
    expect(namesFor("")).toEqual(["bulbasaur", "charmander", "charizard", "geodude"]);
  });

  it("returns null while data is loading", () => {
    expect(filterPokemon(null, INDEX, filtersFor(""))).toBeNull();
    // Type needs the index...
    expect(filterPokemon(LIST, null, filtersFor("type=fire"))).toBeNull();
    // ...but the number range doesn't.
    expect(filterPokemon(LIST, null, filtersFor("to=4"))).toHaveLength(2);
  });

  it("filters by number range, including both ends", () => {
    expect(namesFor("from=4&to=6")).toEqual(["charmander", "charizard"]);
  });

  it("filters by type, including second types", () => {
    expect(namesFor("type=fire")).toEqual(["charmander", "charizard"]);
    expect(namesFor("type=ground")).toEqual(["geodude"]);
  });

  it("filters by weakness", () => {
    // Charizard is immune to Ground (it's part Flying), so it's left out.
    expect(namesFor("weakness=ground")).toEqual(["charmander", "geodude"]);
  });

  it("filters by ability, with partial and title-cased text", () => {
    expect(namesFor("ability=solar+pow")).toEqual(["charmander", "charizard"]);
    expect(namesFor("ability=Solar+Power")).toEqual(["charmander", "charizard"]);
  });

  it("filters by height and weight, counting the lower limit as inside", () => {
    expect(namesFor("height=short")).toEqual(["bulbasaur", "charmander", "geodude"]);
    expect(namesFor("height=medium")).toEqual(["charizard"]);
    // Geodude is exactly 20 kg, which is "medium", not "light".
    expect(namesFor("weight=light")).toEqual(["bulbasaur", "charmander"]);
    expect(namesFor("weight=medium")).toEqual(["charizard", "geodude"]);
  });

  it("combines filters", () => {
    expect(namesFor("type=fire&weakness=electric")).toEqual(["charizard"]);
    expect(namesFor("type=fire&weakness=water&height=short&to=5")).toEqual(["charmander"]);
  });

  it("leaves out Pokémon missing from the index", () => {
    const list = [...LIST, { id: 999, name: "missingno" }];
    const names = filterPokemon(list, INDEX, filtersFor("weight=heavy")).map((p) => p.name);
    expect(names).not.toContain("missingno");
  });
});
