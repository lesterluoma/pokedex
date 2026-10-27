import { describe, expect, it } from "vitest";
import {
  HEIGHT_RANGES,
  MAX_POKEDEX_ID,
  POKEMON_TYPES,
  REGIONS,
  STATS,
  TYPE_CLASSES,
  WEIGHT_RANGES,
} from "./index";

describe("constants", () => {
  it("has all 18 types, each with badge colors", () => {
    expect(POKEMON_TYPES).toHaveLength(18);
    POKEMON_TYPES.forEach((type) => {
      expect(TYPE_CLASSES[type]).toMatch(/^bg-types-\S+ text-types-\S+$/);
    });
  });

  it("has a label and color for every stat the API returns", () => {
    const apiStats = ["hp", "attack", "defense", "special-attack", "special-defense", "speed"];
    expect(Object.keys(STATS)).toEqual(apiStats);
  });

  // If a range is edited and leaves a gap or overlap, some Pokémon would
  // silently disappear from every height or weight option.
  it.each([
    ["height", HEIGHT_RANGES],
    ["weight", WEIGHT_RANGES],
  ])("%s ranges start at 0, have no gaps, and have no upper limit", (_, ranges) => {
    const list = Object.values(ranges);
    expect(list[0].min).toBe(0);
    list.slice(1).forEach((range, i) => expect(range.min).toBe(list[i].max));
    expect(list.at(-1).max).toBe(Infinity);
  });

  // A gap or overlap would leave Pokémon out of every region, or in two.
  it("has regions that cover every Pokédex number once, in order", () => {
    const list = Object.values(REGIONS);
    expect(list[0].min).toBe(1);
    list.slice(1).forEach((region, i) => expect(region.min).toBe(list[i].max + 1));
    expect(list.at(-1).max).toBe(MAX_POKEDEX_ID);
  });
});
