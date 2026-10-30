import { afterEach, describe, expect, it, vi } from "vitest";
import { MAX_POKEDEX_ID } from "../constants";
import {
  artworkFit,
  capitalize,
  contentBox,
  formatGender,
  formatMultiplier,
  formatName,
  formatPokedexNumber,
  pokedexPath,
  pokedexTypePath,
  pokemonDisplayName,
  pokemonPath,
  pokemonOfTheDayId,
  randomPokemonId,
  startingMoveGame,
  statRange,
  toSlug,
  toTitleCase,
  visibleCount,
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

describe("visibleCount", () => {
  it("shows whole pages", () => {
    expect(visibleCount(9, 1)).toBe(9);
    expect(visibleCount(9, 3)).toBe(27);
  });

  it("shows enough pages to include the open item", () => {
    expect(visibleCount(9, 1, 8)).toBe(9); // last item of page 1
    expect(visibleCount(9, 1, 9)).toBe(18); // first item of page 2
    expect(visibleCount(9, 3, 9)).toBe(27); // already showing
  });
});

describe("links", () => {
  it("builds Pokédex addresses", () => {
    expect(pokedexPath(25)).toBe("/pokedex?id=25");
    expect(pokedexTypePath("fire")).toBe("/pokedex?type=fire");
  });
});

describe("detail page helpers", () => {
  it("builds the detail page address from a name", () => {
    expect(pokemonPath("giratina")).toBe("/pokedex/giratina");
    expect(pokemonPath("charizard-mega-x")).toBe("/pokedex/charizard-mega-x");
  });

  it("works out the level 100 stat range", () => {
    // Alcremie's base stats.
    expect(statRange("hp", 65)).toEqual({ min: 240, max: 334 });
    expect(statRange("attack", 60)).toEqual({ min: 112, max: 240 });
    expect(statRange("special-defense", 121)).toEqual({ min: 222, max: 375 });
  });

  it("keeps Shedinja's HP at 1", () => {
    expect(statRange("hp", 1)).toEqual({ min: 1, max: 1 });
  });

  it("describes the gender ratio", () => {
    expect(formatGender(null)).toBe("Genderless");
    expect(formatGender(0)).toBe("100% ♂");
    expect(formatGender(1)).toBe("100% ♀");
    expect(formatGender(0.125)).toBe("87.5% ♂ 12.5% ♀");
    expect(formatGender(0.5)).toBe("50% ♂ 50% ♀");
  });

  it("labels damage multipliers", () => {
    expect(formatMultiplier(0)).toBe("0×");
    expect(formatMultiplier(0.25)).toBe("¼×");
    expect(formatMultiplier(0.5)).toBe("½×");
    expect(formatMultiplier(1)).toBe("1×");
    expect(formatMultiplier(4)).toBe("4×");
  });
});

describe("startingMoveGame", () => {
  // Newest first, like getMoveGames().
  const games = [
    { name: "champions", hasLevelUp: false },
    { name: "scarlet-violet", hasLevelUp: true },
    { name: "sword-shield", hasLevelUp: true },
  ];

  it("starts on the newest game with level-up moves", () => {
    expect(startingMoveGame(games, null)).toBe("scarlet-violet");
  });

  it("keeps a game picked by hand when the Pokémon has it", () => {
    expect(startingMoveGame(games, "sword-shield")).toBe("sword-shield");
    expect(startingMoveGame(games, "champions")).toBe("champions");
  });

  it("falls back when the picked game isn't in the list", () => {
    expect(startingMoveGame(games, "red-blue")).toBe("scarlet-violet");
  });

  it("uses the newest game when none have level-up moves", () => {
    const noLevelUp = games.map((game) => ({ ...game, hasLevelUp: false }));
    expect(startingMoveGame(noLevelUp, null)).toBe("champions");
  });

  it("is null when there are no games", () => {
    expect(startingMoveGame([], "scarlet-violet")).toBeNull();
  });
});

describe("artwork sizing", () => {
  // RGBA pixels for a width x height image, see-through except `filled`
  // ([x, y, alpha] triples).
  const pixels = (width, height, filled) => {
    const data = new Uint8ClampedArray(width * height * 4);
    for (const [x, y, alpha] of filled) data[(y * width + x) * 4 + 3] = alpha;
    return data;
  };

  it("finds the part of an image that isn't see-through", () => {
    const data = pixels(10, 10, [
      [2, 3, 255],
      [6, 7, 255],
    ]);
    expect(contentBox(data, 10, 10)).toEqual({ left: 2, top: 3, right: 7, bottom: 8 });
  });

  it("ignores faint pixels and blank images", () => {
    expect(contentBox(pixels(10, 10, [[0, 0, 16]]), 10, 10)).toBeNull();
    expect(contentBox(pixels(10, 10, [[0, 0, 16], [5, 5, 200]]), 10, 10)).toEqual({
      left: 5,
      top: 5,
      right: 6,
      bottom: 6,
    });
  });

  it("leaves an image that fills its box nearly as it is", () => {
    const fit = artworkFit({ left: 0, top: 0, right: 100, bottom: 100 }, 100, 100);
    expect(fit.scale).toBeCloseTo(0.9);
    expect(fit.x).toBeCloseTo(0);
    expect(fit.y).toBeCloseTo(0);
  });

  it("scales up and centers a Pokémon with empty space around it", () => {
    // 50px wide, 25px tall, in the top-left quarter.
    const fit = artworkFit({ left: 0, top: 0, right: 50, bottom: 25 }, 100, 100);
    expect(fit.scale).toBeCloseTo(1.8);
    expect(fit.x).toBeCloseTo(25);
    expect(fit.y).toBeCloseTo(37.5);
  });

  it("gives padded and edge-to-edge versions of one artwork the same size", () => {
    // Like Galarian Zapdos: the normal one has space around it, the shiny one doesn't.
    const normal = artworkFit({ left: 20, top: 30, right: 80, bottom: 70 }, 100, 100);
    const shiny = artworkFit({ left: 0, top: 15, right: 100, bottom: 82 }, 100, 100);
    expect(normal.scale * 60).toBeCloseTo(shiny.scale * 100);
  });
});
