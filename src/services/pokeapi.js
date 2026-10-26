// All PokeAPI access lives here. Components never call fetch() directly.
// Every function throws on failure, so callers can catch and show an error.

const BASE_URL = "https://pokeapi.co/api/v2";

// Cache of in-flight/finished requests keyed by URL. The grid card and the
// detail panel ask for the same Pokémon, so this keeps it to one request each.
const cache = new Map();

const fetchJson = (url) => {
  if (!cache.has(url)) {
    const request = fetch(url).then((response) => {
      if (!response.ok) {
        throw new Error(`Request failed (${response.status}): ${url}`);
      }
      return response.json();
    });
    // Don't keep failed requests around, so the next attempt retries.
    request.catch(() => cache.delete(url));
    cache.set(url, request);
  }
  return cache.get(url);
};

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

/** Raw /pokemon/{idOrName} response. Used by the grid cards and search. */
export const getPokemon = (idOrName) =>
  fetchJson(`${BASE_URL}/pokemon/${toApiKey(idOrName)}`);

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
    name: pokemon.name,
    artwork:
      pokemon.sprites.other["official-artwork"].front_default ??
      pokemon.sprites.front_default,
    types: pokemon.types.map(({ type }) => type.name),
    genus: englishEntry(species.genera)?.genus ?? "",
    description: cleanFlavorText(
      englishEntry(species.flavor_text_entries)?.flavor_text ?? ""
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
      englishEntry(item.flavor_text_entries)?.text ?? ""
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
