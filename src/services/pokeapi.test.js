import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// These tests never touch the real PokeAPI. `fetch` is replaced with a fake
// that answers from ROUTES below, so the tests run offline and always give
// the same result.

const API = "https://pokeapi.co/api/v2";
const GRAPHQL = "https://graphql.pokeapi.co/v1beta2";

// --- Sample REST responses (trimmed to the fields the app reads) -----------

const charizard = {
  id: 6,
  name: "charizard",
  is_default: true,
  height: 17,
  weight: 905,
  base_experience: 267,
  sprites: {
    front_default: "sprite.png",
    other: {
      "official-artwork": { front_default: "artwork.png", front_shiny: "artwork-shiny.png" },
    },
  },
  species: { name: "charizard", url: `${API}/pokemon-species/6/` },
  forms: [{ name: "charizard" }],
  types: [
    { type: { name: "fire", url: `${API}/type/10/` } },
    { type: { name: "flying", url: `${API}/type/3/` } },
  ],
  abilities: [
    { ability: { name: "blaze" }, is_hidden: false },
    { ability: { name: "solar-power" }, is_hidden: true },
  ],
  stats: [
    { stat: { name: "hp" }, base_stat: 78 },
    { stat: { name: "speed" }, base_stat: 100 },
  ],
};

const charizardSpecies = {
  genera: [
    { genus: "Flammen-Pokémon", language: { name: "de" } },
    { genus: "Flame Pokémon", language: { name: "en" } },
  ],
  flavor_text_entries: [
    { flavor_text: "Crache du feu.", language: { name: "fr" } },
    { flavor_text: "Spits fire that\nis hot enough\fto melt boulders.", language: { name: "en" } },
  ],
  evolution_chain: { url: `${API}/evolution-chain/2/` },
  // Not in the API's order, to check the default form comes first.
  varieties: [
    { is_default: false, pokemon: { name: "charizard-mega-x", url: `${API}/pokemon/10034/` } },
    { is_default: true, pokemon: { name: "charizard", url: `${API}/pokemon/6/` } },
    { is_default: false, pokemon: { name: "charizard-gmax", url: `${API}/pokemon/10196/` } },
  ],
};

// A form that isn't the default: same species, its own id and name.
const charizardMegaX = {
  ...charizard,
  id: 10034,
  name: "charizard-mega-x",
  is_default: false,
  forms: [{ name: "charizard-mega-x" }],
};

// Giratina's default form has its own name, and there is no /pokemon/giratina.
const giratinaAltered = {
  ...charizard,
  id: 487,
  name: "giratina-altered",
  species: { name: "giratina", url: `${API}/pokemon-species/487/` },
  forms: [{ name: "giratina-altered" }],
};

// Arceus is one Pokémon with a look per type; the first look is the default.
const arceus = {
  ...charizard,
  id: 493,
  name: "arceus",
  species: { name: "arceus", url: `${API}/pokemon-species/493/` },
  forms: [{ name: "arceus-normal" }, { name: "arceus-fire" }, { name: "arceus-grass" }],
  types: [{ type: { name: "normal", url: `${API}/type/1/` } }],
};
const arceusSpecies = {
  ...charizardSpecies,
  varieties: [{ is_default: true, pokemon: { name: "arceus", url: `${API}/pokemon/493/` } }],
};
const arceusGrass = {
  name: "arceus-grass",
  types: [{ type: { name: "grass", url: `${API}/type/12/` } }],
};
const giratinaSpecies = {
  ...charizardSpecies,
  varieties: [
    { is_default: true, pokemon: { name: "giratina-altered", url: `${API}/pokemon/487/` } },
    { is_default: false, pokemon: { name: "giratina-origin", url: `${API}/pokemon/10007/` } },
  ],
};

const typeRelations = (double, half, none = []) => ({
  damage_relations: {
    double_damage_from: double.map((name) => ({ name })),
    half_damage_from: half.map((name) => ({ name })),
    no_damage_from: none.map((name) => ({ name })),
  },
});

// Real Fire and Flying type matchups.
const fireType = typeRelations(
  ["water", "ground", "rock"],
  ["fire", "grass", "ice", "bug", "steel", "fairy"]
);
const flyingType = typeRelations(
  ["electric", "ice", "rock"],
  ["grass", "fighting", "bug"],
  ["ground"]
);

const evolutionStage = (id, name, details, evolvesTo = []) => ({
  species: { name, url: `${API}/pokemon-species/${id}/` },
  evolution_details: details ? [details] : [],
  evolves_to: evolvesTo,
});

const charmanderChain = {
  chain: evolutionStage(4, "charmander", null, [
    evolutionStage(5, "charmeleon", { min_level: 16 }, [
      evolutionStage(6, "charizard", { min_level: 36 }),
    ]),
  ]),
};

// Eevee branches: one evolution by item, one by friendship (no level).
const eeveeChain = {
  chain: evolutionStage(133, "eevee", null, [
    evolutionStage(134, "vaporeon", { item: { name: "water-stone" } }),
    evolutionStage(196, "espeon", { trigger: { name: "level-up" } }),
  ]),
};

const eevee = {
  ...charizard,
  id: 133,
  name: "eevee",
  species: { name: "eevee", url: `${API}/pokemon-species/133/` },
  forms: [{ name: "eevee" }],
  types: [{ type: { name: "normal", url: `${API}/type/1/` } }],
};

const potion = {
  id: 17,
  name: "potion",
  sprites: { default: "potion.png" },
  category: { name: "healing" },
  effect_entries: [{ short_effect: "Restores 20 HP.", language: { name: "en" } }],
  flavor_text_entries: [
    { text: "A spray-type medicine\nfor wounds.", language: { name: "en" } },
  ],
  prices: [],
  attributes: [{ name: "countable" }, { name: "consumable" }],
  held_by_pokemon: [{ pokemon: { name: "zigzagoon", url: `${API}/pokemon/263/` } }],
};

const tm01 = {
  ...potion,
  id: 305,
  name: "tm01",
  // Oldest game first; the newest one with a purchase price wins.
  prices: [
    { purchase_price: 3000 },
    { purchase_price: 2000 },
    { purchase_price: null },
  ],
  held_by_pokemon: [],
};

const ROUTES = {
  [`${API}/pokemon/6`]: charizard,
  [`${API}/pokemon-species/6/`]: charizardSpecies,
  [`${API}/evolution-chain/2/`]: charmanderChain,
  [`${API}/type/10/`]: fireType,
  [`${API}/type/3/`]: flyingType,
  [`${API}/pokemon/10034`]: charizardMegaX,
  [`${API}/pokemon/487`]: giratinaAltered,
  [`${API}/pokemon-species/487/`]: giratinaSpecies,
  [`${API}/pokemon-species/giratina`]: giratinaSpecies,
  [`${API}/pokemon/493`]: arceus,
  [`${API}/pokemon-species/493/`]: arceusSpecies,
  [`${API}/pokemon-form/arceus-grass`]: arceusGrass,
  // Real Grass type matchups.
  [`${API}/type/12/`]: typeRelations(
    ["fire", "ice", "poison", "flying", "bug"],
    ["ground", "water", "grass", "electric"]
  ),
  [`${API}/pokemon/133`]: eevee,
  [`${API}/pokemon-species/133/`]: {
    ...charizardSpecies,
    evolution_chain: { url: `${API}/evolution-chain/67/` },
  },
  [`${API}/evolution-chain/67/`]: eeveeChain,
  [`${API}/type/1/`]: typeRelations(["fighting"], [], ["ghost"]),
  [`${API}/item/17`]: potion,
  [`${API}/item/305`]: tm01,
  [`${API}/pokemon-species?limit=10000`]: {
    results: [
      { name: "bulbasaur", url: `${API}/pokemon-species/1/` },
      { name: "ivysaur", url: `${API}/pokemon-species/2/` },
    ],
  },
};

// --- Fake fetch -------------------------------------------------------------

let graphqlData; // what the fake GraphQL API answers with
let api; // a fresh copy of services/pokeapi.js for each test

const jsonResponse = (body, status = 200) => ({
  ok: status < 400,
  status,
  json: async () => body,
});

beforeEach(async () => {
  graphqlData = null;
  vi.stubGlobal(
    "fetch",
    vi.fn(async (url) => {
      if (url === GRAPHQL) return jsonResponse(graphqlData);
      return url in ROUTES ? jsonResponse(ROUTES[url]) : jsonResponse({}, 404);
    })
  );
  // The service caches requests in a module-level Map. Re-importing it gives
  // every test an empty cache.
  vi.resetModules();
  api = await import("./pokeapi");
});

afterEach(() => vi.unstubAllGlobals());

const requestedUrls = () => fetch.mock.calls.map(([url]) => url);

// --- Tests ------------------------------------------------------------------

describe("getPokemon", () => {
  it("turns what the user typed into an API name or number", async () => {
    await api.getPokemon("Mr. Mime").catch(() => {});
    await api.getPokemon(" Pikachu ").catch(() => {});
    await api.getPokemon("#025").catch(() => {});
    await api.getPokemon("Farfetch'd").catch(() => {});

    // (Names that aren't found are also tried as species; see below.)
    expect(requestedUrls().filter((url) => url.includes("/pokemon/"))).toEqual([
      `${API}/pokemon/mr-mime`,
      `${API}/pokemon/pikachu`,
      `${API}/pokemon/25`,
      `${API}/pokemon/farfetchd`,
    ]);
  });

  it("makes one request when the same Pokémon is asked for twice", async () => {
    await Promise.all([api.getPokemon(6), api.getPokemon(6)]);
    await api.getPokemon("006");

    expect(fetch).toHaveBeenCalledTimes(1);
  });

  it("throws on a failed request and tries again next time", async () => {
    await expect(api.getPokemon("missingno")).rejects.toThrow(
      `Request failed (404): ${API}/pokemon/missingno`
    );
    await expect(api.getPokemon("missingno")).rejects.toThrow();

    // Each attempt also tries "missingno" as a species name.
    expect(fetch).toHaveBeenCalledTimes(4);
  });

  it("finds a species by name when the Pokémon goes by its form's name", async () => {
    const pokemon = await api.getPokemon("Giratina");
    expect(pokemon.name).toBe("giratina-altered");
  });

  it("doesn't look up numbers as species", async () => {
    await expect(api.getPokemon(9999)).rejects.toThrow();
    expect(requestedUrls()).toEqual([`${API}/pokemon/9999`]);
  });
});

describe("getPokemonList", () => {
  it("returns ids and names", async () => {
    expect(await api.getPokemonList()).toEqual([
      { id: 1, name: "bulbasaur" },
      { id: 2, name: "ivysaur" },
    ]);
  });
});

describe("getPokemonDetails", () => {
  it("flattens the API responses into one object", async () => {
    const details = await api.getPokemonDetails(6);

    expect(details).toMatchObject({
      id: 6,
      speciesId: 6,
      speciesName: "charizard",
      name: "charizard",
      artwork: "artwork.png",
      shinyArtwork: "artwork-shiny.png",
      types: ["fire", "flying"],
      genus: "Flame Pokémon",
      heightMeters: 1.7,
      weightKg: 90.5,
      baseExperience: 267,
      abilities: [
        { name: "blaze", isHidden: false },
        { name: "solar-power", isHidden: true },
      ],
      stats: [
        { name: "hp", value: 78 },
        { name: "speed", value: 100 },
      ],
    });
  });

  it("names the default form after its species", async () => {
    expect((await api.getPokemonDetails(487)).name).toBe("giratina");
  });

  it("keeps the full name and the Pokédex number for other forms", async () => {
    expect(await api.getPokemonDetails(10034)).toMatchObject({
      id: 10034,
      speciesId: 6,
      name: "charizard-mega-x",
    });
  });

  it("lists every form, default first, without the species in the name", async () => {
    const form = (id, name, formName) => ({ id, name, formName, imageKey: id, isLook: false });
    expect((await api.getPokemonDetails(6)).forms).toEqual([
      form(6, "charizard", ""),
      form(10034, "charizard-mega-x", "mega-x"),
      form(10196, "charizard-gmax", "gmax"),
    ]);
    expect((await api.getPokemonDetails(487)).forms).toEqual([
      form(487, "giratina-altered", "altered"),
      form(10007, "giratina-origin", "origin"),
    ]);
  });

  it("adds looks after the forms, leaving out the default look", async () => {
    expect((await api.getPokemonDetails(493)).forms).toEqual([
      { id: 493, name: "arceus", formName: "", imageKey: 493, isLook: false },
      { id: null, name: "arceus-fire", formName: "fire", imageKey: "493-fire", isLook: true },
      { id: null, name: "arceus-grass", formName: "grass", imageKey: "493-grass", isLook: true },
    ]);
  });

  it("picks the English description and removes line breaks", async () => {
    const { description } = await api.getPokemonDetails(6);
    expect(description).toBe("Spits fire that is hot enough to melt boulders.");
  });

  it("stacks type matchups when working out weaknesses", async () => {
    const { weaknesses } = await api.getPokemonDetails(6);

    // Rock is 2x against both types (4x). Ground is left out because Flying
    // is immune, and Ice is 2x vs Flying but 0.5x vs Fire (1x overall).
    expect(weaknesses).toEqual([
      { type: "rock", multiplier: 4 },
      { type: "water", multiplier: 2 },
      { type: "electric", multiplier: 2 },
    ]);
  });

  it("lists evolutions in order with how each one happens", async () => {
    const { evolutions } = await api.getPokemonDetails(6);

    expect(evolutions).toEqual([
      { id: 4, name: "charmander", trigger: null },
      { id: 5, name: "charmeleon", trigger: "Lvl 16" },
      { id: 6, name: "charizard", trigger: "Lvl 36" },
    ]);
  });

  it("handles branching evolutions and non-level triggers", async () => {
    const { evolutions } = await api.getPokemonDetails(133);

    expect(evolutions).toEqual([
      { id: 133, name: "eevee", trigger: null },
      { id: 134, name: "vaporeon", trigger: "water stone" },
      { id: 196, name: "espeon", trigger: "level up" },
    ]);
  });
});

describe("getPokemonForm", () => {
  it("returns a look's own types and weaknesses", async () => {
    expect(await api.getPokemonForm("arceus-grass")).toEqual({
      name: "arceus-grass",
      types: ["grass"],
      weaknesses: [
        { type: "fire", multiplier: 2 },
        { type: "ice", multiplier: 2 },
        { type: "poison", multiplier: 2 },
        { type: "flying", multiplier: 2 },
        { type: "bug", multiplier: 2 },
      ],
    });
  });
});

describe("getItemDetails", () => {
  it("flattens the API response into one object", async () => {
    expect(await api.getItemDetails(17)).toEqual({
      id: 17,
      name: "potion",
      sprite: "potion.png",
      category: "healing",
      effect: "Restores 20 HP.",
      description: "A spray-type medicine for wounds.",
      price: null, // the API has no price data for Potion
      attributes: ["countable", "consumable"],
      heldBy: [{ id: 263, name: "zigzagoon" }],
    });
  });

  it("uses the newest game's purchase price", async () => {
    const { price } = await api.getItemDetails(305);
    expect(price).toBe(2000);
  });
});

describe("getPokedexIndex", () => {
  const efficacy = (attacker, defender, damageFactor) => ({
    damage_factor: damageFactor,
    attacker: { name: attacker },
    defender: { name: defender },
  });

  beforeEach(() => {
    graphqlData = {
      data: {
        pokemon: [
          {
            id: 74,
            name: "geodude",
            height: 4,
            weight: 200,
            pokemontypes: [{ type: { name: "rock" } }, { type: { name: "ground" } }],
            pokemonabilities: [{ ability: { name: "sturdy" } }, { ability: { name: "rock-head" } }],
          },
          {
            id: 16,
            name: "pidgey",
            height: 3,
            weight: 18,
            pokemontypes: [{ type: { name: "normal" } }, { type: { name: "flying" } }],
            pokemonabilities: [{ ability: { name: "keen-eye" } }, { ability: { name: "sturdy" } }],
          },
        ],
        // A small slice of the real type chart.
        typeefficacy: [
          efficacy("water", "rock", 200),
          efficacy("water", "ground", 200),
          efficacy("electric", "ground", 0),
          efficacy("electric", "flying", 200),
          efficacy("normal", "rock", 50),
          efficacy("grass", "flying", 50),
          efficacy("grass", "rock", 200),
          efficacy("grass", "ground", 200),
        ],
      },
    };
  });

  it("works out weaknesses from the type chart", async () => {
    const { pokemon } = await api.getPokedexIndex();
    const [geodude, pidgey] = pokemon;

    // Electric does 0x to Ground, so Geodude isn't weak to it even though
    // it's 1x against Rock.
    expect(geodude.weaknesses).toEqual(["water", "grass"]);
    expect(pidgey.weaknesses).toEqual(["electric"]);
  });

  it("converts units and lists every ability once, A to Z", async () => {
    const { pokemon, abilities } = await api.getPokedexIndex();

    expect(pokemon[0]).toMatchObject({ id: 74, heightMeters: 0.4, weightKg: 20 });
    expect(abilities).toEqual(["keen-eye", "rock-head", "sturdy"]);
  });

  it("throws when the GraphQL API reports an error", async () => {
    graphqlData = { errors: [{ message: "field 'x' not found" }] };
    await expect(api.getPokedexIndex()).rejects.toThrow("GraphQL error: field 'x' not found");
  });
});

describe("getItemIndex", () => {
  it("returns each item's pocket and every category once, A to Z", async () => {
    const entry = (id, category, pocket, heldCount) => ({
      id,
      itemcategory: category ? { name: category, itempocket: { name: pocket } } : null,
      itemattributemaps: [{ itemattribute: { name: "holdable" } }],
      pokemonitems_aggregate: { aggregate: { count: heldCount } },
    });
    graphqlData = {
      data: {
        item: [
          entry(17, "healing", "medicine", 2),
          entry(18, "healing", "medicine", 0),
          entry(126, "medicine", "berries", 5),
          entry(999, null, null, 0),
        ],
      },
    };

    const { items, categories } = await api.getItemIndex();

    expect(items[0]).toEqual({
      id: 17,
      pocket: "medicine",
      category: "healing",
      attributes: ["holdable"],
      isHeldByWildPokemon: true,
    });
    expect(items[1].isHeldByWildPokemon).toBe(false);
    expect(items[3]).toMatchObject({ pocket: null, category: null });
    expect(categories).toEqual([
      { name: "healing", pocket: "medicine" },
      { name: "medicine", pocket: "berries" },
    ]);
  });
});
