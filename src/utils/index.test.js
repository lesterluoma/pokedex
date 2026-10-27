import { afterEach, describe, expect, it, vi } from "vitest";
import { MAX_POKEDEX_ID } from "../constants";
import {
  capitalize,
  formatName,
  formatPokedexNumber,
  pokedexPath,
  pokedexTypePath,
  pokemonDisplayName,
  pokemonOfTheDayId,
  randomPokemonId,
  toSlug,
  toTitleCase,
} from "./index";

describe("text helpers", () => {
  it("pads Pokédex numbers to three digits", () => {
    expect(formatPokedexNumber(7)).toBe("N°007");
    expect(formatPokedexNumber(25)).toBe("N°025");
    expect(formatPokedexNumber(1025)).toBe("N°1025");
  });

  it("turns typed text into API-style names", () => {
    expect(toSlug(" Mr Mime ")).toBe("mr-mime");
    expect(toSlug("Poke   Ball")).toBe("poke-ball");
  });

  it("turns API names into readable text", () => {
    expect(formatName("mr-mime")).toBe("mr mime");
    expect(capitalize("fire")).toBe("Fire");
    expect(toTitleCase("solar-power")).toBe("Solar Power");
    expect(toTitleCase("charizard-mega-x")).toBe("Charizard Mega X");
  });

  it("only capitalizes the start of each word, even with accents", () => {
    // A regex word boundary would wrongly capitalize the "b" after "é".
    expect(toTitleCase("flabébé")).toBe("Flabébé");
  });
});

describe("pokemonDisplayName", () => {
  it("uses the species name for the default form only", () => {
    const species = { name: "giratina" };
    expect(pokemonDisplayName({ name: "giratina-altered", is_default: true, species })).toBe("giratina");
    expect(pokemonDisplayName({ name: "giratina-origin", is_default: false, species })).toBe(
      "giratina-origin"
    );
  });
});

describe("pokemonOfTheDayId", () => {
  it("is the same all day and changes the next day", () => {
    const morning = pokemonOfTheDayId(new Date(2026, 9, 26, 0, 1));
    const night = pokemonOfTheDayId(new Date(2026, 9, 26, 23, 59));
    const tomorrow = pokemonOfTheDayId(new Date(2026, 9, 27, 0, 1));

    expect(night).toBe(morning);
    expect(tomorrow).not.toBe(morning);
  });

  it(`shows every Pokémon exactly once over ${MAX_POKEDEX_ID} days`, () => {
    const ids = Array.from({ length: MAX_POKEDEX_ID }, (_, day) =>
      pokemonOfTheDayId(new Date(2026, 0, 1 + day))
    );

    expect(Math.min(...ids)).toBe(1);
    expect(Math.max(...ids)).toBe(MAX_POKEDEX_ID);
    expect(new Set(ids).size).toBe(MAX_POKEDEX_ID);
  });
});

describe("randomPokemonId", () => {
  afterEach(() => vi.restoreAllMocks());

  it("stays between 1 and MAX_POKEDEX_ID", () => {
    vi.spyOn(Math, "random").mockReturnValue(0);
    expect(randomPokemonId()).toBe(1);

    vi.spyOn(Math, "random").mockReturnValue(0.99999);
    expect(randomPokemonId()).toBe(MAX_POKEDEX_ID);
  });
});

describe("links", () => {
  it("builds Pokédex addresses", () => {
    expect(pokedexPath(25)).toBe("/pokedex?id=25");
    expect(pokedexTypePath("fire")).toBe("/pokedex?type=fire");
  });
});
