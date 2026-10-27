// All PokeAPI access lives here. Components never call fetch() directly.
// Every function throws on failure, so callers can catch and show an error.

import { pokemonDisplayName } from "../utils";

const BASE_URL = "https://pokeapi.co/api/v2";
// PokeAPI's GraphQL API. Only used for getPokedexIndex(), which needs data
// for every Pokémon at once (the REST API would take 1,025 requests).
const GRAPHQL_URL = "https://graphql.pokeapi.co/v1beta2";

// Cache of in-flight/finished requests. The grid card and the detail panel
// ask for the same Pokémon, so this keeps it to one request each.
const cache = new Map();

/** Runs `load()` once per `key` and shares the result with every caller. */
const cached = (key, load) => {
  if (!cache.has(key)) {
    const request = load();
    // Don't keep failed requests around, so the next attempt retries.
    request.catch(() => cache.delete(key));
    cache.set(key, request);
  }
  return cache.get(key);
};

const parseResponse = (url) => (response) => {
  if (!response.ok) {
    throw new Error(`Request failed (${response.status}): ${url}`);
  }
  return response.json();
};

const fetchJson = (url) => cached(url, () => fetch(url).then(parseResponse(url)));

const fetchGraphQL = (query) =>
  cached(query, async () => {
    const response = await fetch(GRAPHQL_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query }),
    });
    // GraphQL reports query mistakes as `errors` in a 200 response.
    const { data, errors } = await parseResponse(GRAPHQL_URL)(response);
    if (errors) throw new Error(`GraphQL error: ${errors[0].message}`);
    return data;
  });

// "https://pokeapi.co/api/v2/pokemon-species/7/" -> 7
const idFromUrl = (url) => Number(url.split("/").filter(Boolean).pop());

const englishEntry = (entries) =>
  entries.find((entry) => entry.language.name === "en");

/**
 * Turns what a user might type into what the API expects:
 * "Mr Mime" -> "mr-mime", "#025" -> "25", 7 -> "7"
 */
const toApiKey = (idOrName) => {
  const key = String(idOrName).trim().toLowerCase().replace(/^#/, "");
  if (/^\d+$/.test(key)) return String(Number(key)); // drop leading zeros
  return key.replace(/[.']/g, "").replace(/\s+/g, "-");
};

/**
 * Every Pokémon in National Pokédex order: [{ id: 1, name: "bulbasaur" }, ...]
 * Uses /pokemon-species (one entry per Pokédex number) rather than /pokemon,
 * which also lists ~300 alternate forms like "charizard-mega-x".
 */
export const getPokemonList = async () => {
  const { results } = await fetchJson(
    `${BASE_URL}/pokemon-species?limit=10000`,
  );
  return results.map(({ name, url }) => ({ id: idFromUrl(url), name }));
};

/**
 * Raw /pokemon/{idOrName} response. Used by the grid cards and search.
 * Some Pokémon have no /pokemon entry under their own name, only under their
 * default form's (there's no "giratina", only "giratina-altered"), so a name
 * that isn't found is looked up as a species and its default form is returned.
 */
export const getPokemon = async (idOrName) => {
  const key = toApiKey(idOrName);
  try {
    return await fetchJson(`${BASE_URL}/pokemon/${key}`);
  } catch (error) {
    if (/^\d+$/.test(key)) throw error;
    const species = await fetchJson(`${BASE_URL}/pokemon-species/${key}`).catch(() => {
      throw error; // report the original "not found", not the fallback's
    });
    const variety = species.varieties.find((entry) => entry.is_default);
    return getPokemon(idFromUrl(variety.pokemon.url));
  }
};

/**
 * Everything the detail panel needs, flattened into one plain object.
 * If the panel shows something wrong, log the return value of this function.
 */
export const getPokemonDetails = async (id) => {
  const pokemon = await getPokemon(id);
  const species = await fetchJson(pokemon.species.url);

  const [evolutionChain, typeData] = await Promise.all([
    fetchJson(species.evolution_chain.url),
    Promise.all(pokemon.types.map(({ type }) => fetchJson(type.url))),
  ]);

  return {
    id: pokemon.id,
    // The Pokédex number. Same as `id`, except for alternate forms
    // (Charizard's Mega X form has id 10034 but is still N°006).
    speciesId: idFromUrl(pokemon.species.url),
    speciesName: pokemon.species.name,
    name: pokemonDisplayName(pokemon),
    artwork:
      pokemon.sprites.other["official-artwork"].front_default ??
      pokemon.sprites.front_default,
    shinyArtwork:
      pokemon.sprites.other["official-artwork"].front_shiny ??
      pokemon.sprites.front_shiny,
    types: pokemon.types.map(({ type }) => type.name),
    genus: englishEntry(species.genera)?.genus ?? "",
    description: cleanFlavorText(
      englishEntry(species.flavor_text_entries)?.flavor_text ?? "",
    ),
    abilities: pokemon.abilities.map(({ ability, is_hidden }) => ({
      name: ability.name,
      isHidden: is_hidden,
    })),
    heightMeters: pokemon.height / 10, // API gives decimeters
    weightKg: pokemon.weight / 10, // API gives hectograms
    baseExperience: pokemon.base_experience,
    stats: pokemon.stats.map(({ stat, base_stat }) => ({
      name: stat.name,
      value: base_stat,
    })),
    weaknesses: getWeaknesses(typeData),
    evolutions: flattenEvolutionChain(evolutionChain.chain),
    forms: [
      ...listForms(species.varieties, pokemon.species.name),
      ...listLooks(pokemon),
    ],
  };
};

/**
 * Every version of the species that has its own stats (Mega Evolutions,
 * regional forms, sizes, Giratina's Origin form...), default first.
 * `formName` is the name without the species, e.g. "mega-x", or "" when the
 * form is just the species name ("charizard"). `imageKey` is what
 * artworkUrl() and spriteUrl() in utils take.
 * [{ id: 6, name: "charizard", formName: "", imageKey: 6, isLook: false }, ...]
 */
const listForms = (varieties, speciesName) =>
  varieties
    .toSorted((a, b) => b.is_default - a.is_default)
    .map(({ pokemon }) => {
      const id = idFromUrl(pokemon.url);
      return {
        id,
        name: pokemon.name,
        formName: pokemon.name.replace(new RegExp(`^${speciesName}-?`), ""),
        imageKey: id,
        isLook: false,
      };
    });

/**
 * Forms that only change how this Pokémon looks, and sometimes its type
 * (Arceus's 18 types, Unown's letters, Vivillon's patterns). They share the
 * Pokémon's stats, so they have no /pokemon entry of their own, only a
 * /pokemon-form one (see getPokemonForm). The first form is the default
 * look, which is the Pokémon itself, so it's left out.
 * Artwork is named "493-fire" (Pokémon id, then the form name).
 * [{ id: null, name: "arceus-fire", formName: "fire", imageKey: "493-fire", isLook: true }, ...]
 */
const listLooks = (pokemon) =>
  pokemon.forms.slice(1).map(({ name }) => {
    const formName = name.replace(new RegExp(`^${pokemon.name}-?`), "");
    return {
      id: null,
      name,
      formName,
      imageKey: `${pokemon.id}-${formName}`,
      isLook: true,
    };
  });

/**
 * Types and weaknesses of one look from `forms` in getPokemonDetails, by
 * name, e.g. "arceus-grass" -> { types: ["grass"], weaknesses: [...] }.
 * The sidebar shows these in place of the Pokémon's own when it's picked.
 */
export const getPokemonForm = async (name) => {
  const form = await fetchJson(`${BASE_URL}/pokemon-form/${name}`);
  const typeData = await Promise.all(
    form.types.map(({ type }) => fetchJson(type.url)),
  );
  return {
    name: form.name,
    types: form.types.map(({ type }) => type.name),
    weaknesses: getWeaknesses(typeData),
  };
};

// Flavor text contains form feeds and hard line breaks from the games.
const cleanFlavorText = (text) => text.replace(/[\f\n\r]+/g, " ");

/**
 * Multiplies the damage taken from each attacking type across all of the
 * Pokémon's types, then keeps the ones that deal more than normal damage.
 * Returns e.g. [{ type: "electric", multiplier: 2 }]
 */
const getWeaknesses = (typeData) => {
  const multipliers = {};
  const apply = (relations, factor) =>
    relations.forEach(({ name }) => {
      multipliers[name] = (multipliers[name] ?? 1) * factor;
    });

  typeData.forEach(({ damage_relations: relations }) => {
    apply(relations.double_damage_from, 2);
    apply(relations.half_damage_from, 0.5);
    apply(relations.no_damage_from, 0);
  });

  return Object.entries(multipliers)
    .filter(([, multiplier]) => multiplier > 1)
    .map(([type, multiplier]) => ({ type, multiplier }))
    .sort((a, b) => b.multiplier - a.multiplier);
};

/**
 * Evolution chains are trees (Eevee branches a lot). This walks the tree
 * depth-first and returns a flat list in evolution order:
 * [{ id: 1, name: "bulbasaur", trigger: null }, { id: 2, name: "ivysaur", trigger: "Lvl 16" }, ...]
 */
const flattenEvolutionChain = (node, list = []) => {
  list.push({
    id: idFromUrl(node.species.url),
    name: node.species.name,
    trigger: describeEvolutionTrigger(node.evolution_details[0]),
  });
  node.evolves_to.forEach((child) => flattenEvolutionChain(child, list));
  return list;
};

const describeEvolutionTrigger = (details) => {
  if (!details) return null; // first stage
  if (details.min_level) return `Lvl ${details.min_level}`;
  if (details.item) return details.item.name.replace(/-/g, " ");
  return details.trigger.name.replace(/-/g, " "); // e.g. "trade", "level up"
};

// ---------------------------------------------------------------------------
// Items
// ---------------------------------------------------------------------------

/**
 * Every item as [{ id: 1, name: "master-ball" }, ...] (about 2,200 of them).
 * The list endpoint only has names, so grid cards build their sprite URL
 * from the name instead of fetching each item.
 */
export const getItemList = async () => {
  const { results } = await fetchJson(`${BASE_URL}/item?limit=10000`);
  return results.map(({ name, url }) => ({ id: idFromUrl(url), name }));
};

/**
 * Everything the item sidebar needs, flattened into one plain object.
 * If the panel shows something wrong, log the return value of this function.
 */
export const getItemDetails = async (id) => {
  const item = await fetchJson(`${BASE_URL}/item/${id}`);

  return {
    id: item.id,
    name: item.name,
    sprite: item.sprites.default, // can be null
    category: item.category.name,
    effect: englishEntry(item.effect_entries)?.short_effect ?? "",
    // Item flavor text lives under `text` (Pokémon species use `flavor_text`)
    description: cleanFlavorText(
      englishEntry(item.flavor_text_entries)?.text ?? "",
    ),
    price: latestPurchasePrice(item.prices),
    attributes: item.attributes.map(({ name }) => name),
    heldBy: item.held_by_pokemon.map(({ pokemon }) => ({
      id: idFromUrl(pokemon.url),
      name: pokemon.name,
    })),
  };
};

// Prices are listed per game, oldest first. Returns null when the API has no
// purchase price (many items, e.g. Potion, simply have no price data).
const latestPurchasePrice = (prices) =>
  prices.findLast((price) => price.purchase_price)?.purchase_price ?? null;

// ---------------------------------------------------------------------------
// Pokédex index (data for the filters)
// ---------------------------------------------------------------------------

// `is_default` skips alternate forms, so there's one entry per Pokédex number.
// typeefficacy is the type chart: how much damage each type does to each other
// type, as a percentage (0, 50, 100 or 200).
const POKEDEX_INDEX_QUERY = `{
  pokemon(where: { is_default: { _eq: true } }, order_by: { pokemon_species_id: asc }) {
    id: pokemon_species_id
    name
    height
    weight
    pokemontypes { type { name } }
    pokemonabilities { ability { name } }
  }
  typeefficacy {
    damage_factor
    attacker: type { name }
    defender: TypeByTargetTypeId { name }
  }
}`;

/**
 * Types, abilities, size and weaknesses for every Pokémon, in one request.
 * Used by the Pokédex filters. Returns:
 * {
 *   pokemon: [{ id: 6, name: "charizard", types: ["fire", "flying"],
 *               abilities: ["blaze", "solar-power"], heightMeters: 1.7,
 *               weightKg: 90.5, weaknesses: ["water", "electric", "rock"] }, ...],
 *   abilities: ["adaptability", "aerilate", ...]  // every ability, A to Z
 * }
 */
export const getPokedexIndex = async () => {
  const data = await fetchGraphQL(POKEDEX_INDEX_QUERY);

  // { fire: { grass: 2, water: 0.5, ... }, ... } (attacker -> defender -> multiplier)
  const typeChart = {};
  data.typeefficacy.forEach(({ damage_factor, attacker, defender }) => {
    typeChart[attacker.name] ??= {};
    typeChart[attacker.name][defender.name] = damage_factor / 100;
  });

  const pokemon = data.pokemon.map((entry) => {
    const types = entry.pokemontypes.map(({ type }) => type.name);
    return {
      id: entry.id,
      name: entry.name,
      types,
      abilities: entry.pokemonabilities.map(({ ability }) => ability.name),
      heightMeters: entry.height / 10, // API gives decimeters
      weightKg: entry.weight / 10, // API gives hectograms
      weaknesses: weaknessesFromChart(types, typeChart),
    };
  });

  const abilities = [...new Set(pokemon.flatMap((entry) => entry.abilities))];
  return { pokemon, abilities: abilities.sort() };
};

// Attacking types that do more than normal damage to a Pokémon with these
// types. Multipliers stack: Water does 2 x 2 = 4x to a Rock/Ground Pokémon.
const weaknessesFromChart = (types, typeChart) =>
  Object.keys(typeChart).filter((attacker) => {
    const multiplier = types.reduce(
      (total, type) => total * (typeChart[attacker][type] ?? 1),
      1
    );
    return multiplier > 1;
  });

// ---------------------------------------------------------------------------
// Item index (data for the item filters)
// ---------------------------------------------------------------------------

// pokemonitems_aggregate counts the wild Pokémon that can hold the item.
const ITEM_INDEX_QUERY = `{
  item(order_by: { id: asc }) {
    id
    itemcategory { name itempocket { name } }
    itemattributemaps { itemattribute { name } }
    pokemonitems_aggregate { aggregate { count } }
  }
}`;

/**
 * Pocket, category and attributes for every item, in one request.
 * Used by the item filters. Returns:
 * {
 *   items: [{ id: 17, pocket: "medicine", category: "healing",
 *             attributes: ["countable", "consumable", ...],
 *             isHeldByWildPokemon: true }, ...],
 *   categories: [{ name: "healing", pocket: "medicine" }, ...]  // A to Z
 * }
 */
export const getItemIndex = async () => {
  const data = await fetchGraphQL(ITEM_INDEX_QUERY);

  const items = data.item.map((entry) => ({
    id: entry.id,
    pocket: entry.itemcategory?.itempocket.name ?? null,
    category: entry.itemcategory?.name ?? null,
    attributes: entry.itemattributemaps.map(({ itemattribute }) => itemattribute.name),
    isHeldByWildPokemon: entry.pokemonitems_aggregate.aggregate.count > 0,
  }));

  // One entry per category, remembering which pocket it belongs to.
  const pocketByCategory = new Map(
    items
      .filter((item) => item.category)
      .map((item) => [item.category, item.pocket])
  );
  const categories = [...pocketByCategory]
    .map(([name, pocket]) => ({ name, pocket }))
    .sort((a, b) => a.name.localeCompare(b.name));

  return { items, categories };
};
