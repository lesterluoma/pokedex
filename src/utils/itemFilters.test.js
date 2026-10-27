import { describe, expect, it } from "vitest";
import { filterItems, needsItemIndex, readItemFilters } from "./itemFilters";

// Reads filters from an address bar query, the same way the Items page does.
const filtersFor = (query) => readItemFilters(new URLSearchParams(query));

// What the grid list looks like (from getItemList).
const LIST = [
  { id: 1, name: "master-ball" },
  { id: 17, name: "potion" },
  { id: 126, name: "cheri-berry" },
  { id: 305, name: "tm01" },
];

// What the item index looks like (from getItemIndex), with real data.
const INDEX = {
  items: [
    {
      id: 1,
      pocket: "pokeballs",
      category: "standard-balls",
      attributes: ["countable", "consumable", "usable-in-battle", "holdable"],
      isHeldByWildPokemon: false,
    },
    {
      id: 17,
      pocket: "medicine",
      category: "healing",
      attributes: ["countable", "consumable", "usable-overworld", "usable-in-battle", "holdable"],
      isHeldByWildPokemon: true,
    },
    {
      id: 126,
      pocket: "berries",
      category: "medicine",
      attributes: ["countable", "consumable", "holdable", "holdable-active"],
      isHeldByWildPokemon: true,
    },
    {
      id: 305,
      pocket: "machines",
      category: "all-machines",
      attributes: [],
      isHeldByWildPokemon: false,
    },
  ],
};

const namesFor = (query) =>
  filterItems(LIST, INDEX, filtersFor(query)).map((item) => item.name);

describe("readItemFilters", () => {
  it("reads every filter from the address", () => {
    expect(
      filtersFor("pocket=berries&category=medicine&attribute=holdable&held=yes&from=1&to=200")
    ).toEqual({
      pocket: "berries",
      category: "medicine",
      attribute: "holdable",
      held: "yes",
      from: 1,
      to: 200,
    });
  });

  it("ignores values that aren't valid", () => {
    expect(filtersFor("pocket=nope&attribute=nope&held=maybe&from=x")).toEqual({
      pocket: null,
      category: null,
      attribute: null,
      held: null,
      from: null,
      to: null,
    });
  });

  it("knows which filters need the index", () => {
    expect(needsItemIndex(filtersFor("from=1"))).toBe(false);
    expect(needsItemIndex(filtersFor("held=yes"))).toBe(true);
  });
});

describe("filterItems", () => {
  it("returns everything when no filter is set", () => {
    expect(namesFor("")).toEqual(["master-ball", "potion", "cheri-berry", "tm01"]);
  });

  it("returns null while data is loading", () => {
    expect(filterItems(null, INDEX, filtersFor(""))).toBeNull();
    expect(filterItems(LIST, null, filtersFor("pocket=berries"))).toBeNull();
    expect(filterItems(LIST, null, filtersFor("to=17"))).toHaveLength(2);
  });

  it("filters by pocket, category and attribute", () => {
    expect(namesFor("pocket=berries")).toEqual(["cheri-berry"]);
    expect(namesFor("category=healing")).toEqual(["potion"]);
    expect(namesFor("attribute=usable-in-battle")).toEqual(["master-ball", "potion"]);
  });

  it("filters to items held by wild Pokémon", () => {
    expect(namesFor("held=yes")).toEqual(["potion", "cheri-berry"]);
  });

  it("filters by item number range", () => {
    expect(namesFor("from=17&to=200")).toEqual(["potion", "cheri-berry"]);
  });

  it("matches nothing for an unknown category", () => {
    expect(namesFor("category=not-a-category")).toEqual([]);
  });

  it("combines filters", () => {
    expect(namesFor("attribute=holdable&held=yes&to=100")).toEqual(["potion"]);
  });
});
