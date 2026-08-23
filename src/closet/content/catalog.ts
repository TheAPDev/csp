import { CosmeticItemDefinition, CosmeticCategory } from "@apptypes";

/**
 * Dummy catalog data, per Batch 07 instructions. Every price uses one
 * currency only (never a mix) so Companion's Closet stays legible —
 * frequent Coin buys for small/cosmetic items, aspirational Adventure
 * Ticket buys for story-flavored unlocks, rare Collector Token buys
 * reserved for prestige items (collector cards). No real-money path
 * exists anywhere in this catalog.
 */
export const closetCatalog: CosmeticItemDefinition[] = [
  {
    id: "outfit-starlight-cloak",
    category: "outfits",
    name: "Starlight Cloak",
    description: "A cloak that shimmers like a clear night sky.",
    previewAssetId: "COSMETIC_OUTFIT_STARLIGHT_CLOAK",
    price: 120,
    currency: "coins",
    companionLine: "Ooh, I feel like I'm wearing the night sky!",
  },
  {
    id: "outfit-moss-explorer",
    category: "outfits",
    name: "Moss Explorer Set",
    description: "Sturdy, leafy gear for wandering the Grove.",
    previewAssetId: "COSMETIC_OUTFIT_MOSS_EXPLORER",
    price: 80,
    currency: "coins",
    companionLine: "Perfect for exploring! Let's go find something.",
  },
  {
    id: "accessory-lantern-charm",
    category: "accessories",
    name: "Lantern Charm",
    description: "A tiny lantern that glows softly at your side.",
    previewAssetId: "COSMETIC_ACCESSORY_LANTERN_CHARM",
    price: 60,
    currency: "coins",
    companionLine: "Now we'll always have a little light with us.",
  },
  {
    id: "accessory-acorn-crown",
    category: "accessories",
    name: "Acorn Crown",
    description: "A tiny crown woven from acorn caps.",
    previewAssetId: "COSMETIC_ACCESSORY_ACORN_CROWN",
    price: 2,
    currency: "adventureTickets",
    companionLine: "Royalty of the Grove, right here!",
  },
  {
    id: "expression-giggle",
    category: "expressions",
    name: "Giggle",
    description: "A bright, bubbly giggle animation.",
    previewAssetId: "COSMETIC_EXPRESSION_GIGGLE",
    price: 50,
    currency: "coins",
    companionLine: "Hehehe! Try me out anytime.",
  },
  {
    id: "expression-wonder-gasp",
    category: "expressions",
    name: "Wonder Gasp",
    description: "Wide-eyed wonder for the best surprises.",
    previewAssetId: "COSMETIC_EXPRESSION_WONDER_GASP",
    price: 50,
    currency: "coins",
    companionLine: "Whoaaaa! Save this one for something amazing.",
  },
  {
    id: "title-pathfinder",
    category: "titles",
    name: "Pathfinder",
    description: "A title for those who love finding new paths.",
    previewAssetId: "COSMETIC_TITLE_PATHFINDER",
    price: 3,
    currency: "adventureTickets",
    companionLine: "Pathfinder — that suits you perfectly.",
  },
  {
    id: "title-stargazer",
    category: "titles",
    name: "Stargazer",
    description: "For dreamers who look to The Beyond.",
    previewAssetId: "COSMETIC_TITLE_STARGAZER",
    price: 3,
    currency: "adventureTickets",
    companionLine: "Stargazer... I love the sound of that.",
  },
  {
    id: "badge-kind-heart",
    category: "badges",
    name: "Kind Heart Badge",
    description: "A little badge for a big heart.",
    previewAssetId: "COSMETIC_BADGE_KIND_HEART",
    price: 40,
    currency: "coins",
    companionLine: "You've earned every bit of this one.",
  },
  {
    id: "badge-brave-spark",
    category: "badges",
    name: "Brave Spark Badge",
    description: "For moments when courage led the way.",
    previewAssetId: "COSMETIC_BADGE_BRAVE_SPARK",
    price: 40,
    currency: "coins",
    companionLine: "That spark suits a brave one like you.",
  },
  {
    id: "homedecor-lantern-string",
    category: "homeDecor",
    name: "Lantern String",
    description: "Warm little lanterns strung across the Grove.",
    previewAssetId: "COSMETIC_HOMEDECOR_LANTERN_STRING",
    price: 90,
    currency: "coins",
    companionLine: "It's so cozy in here now!",
  },
  {
    id: "homedecor-moss-stones",
    category: "homeDecor",
    name: "Moss Stones",
    description: "Soft, rounded stones dressed in moss.",
    previewAssetId: "COSMETIC_HOMEDECOR_MOSS_STONES",
    price: 70,
    currency: "coins",
    companionLine: "These feel like they've always belonged here.",
  },
  {
    id: "theme-midnight-bloom",
    category: "profileThemes",
    name: "Midnight Bloom Theme",
    description: "A profile theme of deep blues and soft petals.",
    previewAssetId: "COSMETIC_THEME_MIDNIGHT_BLOOM",
    price: 4,
    currency: "adventureTickets",
    companionLine: "This theme feels just like you.",
  },
  {
    id: "theme-tidepool",
    category: "profileThemes",
    name: "Tidepool Theme",
    description: "Cool sea-glass greens and soft foam whites.",
    previewAssetId: "COSMETIC_THEME_TIDEPOOL",
    price: 4,
    currency: "adventureTickets",
    companionLine: "Calm and cool, just like the tide.",
  },
  {
    id: "card-ember-fox",
    category: "collectorCards",
    name: "Ember Fox Collector Card",
    description: "A rare illustrated card — pure prestige, no bonus.",
    previewAssetId: "COSMETIC_CARD_EMBER_FOX",
    price: 5,
    currency: "collectorTokens",
    companionLine: "A rare one! I've heard stories about this fox.",
  },
  {
    id: "card-tide-spirit",
    category: "collectorCards",
    name: "Tide Spirit Collector Card",
    description: "A rare illustrated card from the deep coves.",
    previewAssetId: "COSMETIC_CARD_TIDE_SPIRIT",
    price: 5,
    currency: "collectorTokens",
    companionLine: "The Tide Spirit... what a find!",
  },
];

export const closetCategories: CosmeticCategory[] = [
  "outfits",
  "accessories",
  "expressions",
  "titles",
  "badges",
  "homeDecor",
  "profileThemes",
  "collectorCards",
];

export const closetCategoryLabels: Record<CosmeticCategory, string> = {
  outfits: "Outfits",
  accessories: "Accessories",
  expressions: "Expressions",
  titles: "Titles",
  badges: "Badges",
  homeDecor: "Home Decorations",
  profileThemes: "Profile Themes",
  collectorCards: "Collector Cards",
};

export function itemsForCategory(category: CosmeticCategory): CosmeticItemDefinition[] {
  return closetCatalog.filter((item) => item.category === category);
}

export function findClosetItem(id: string): CosmeticItemDefinition | undefined {
  return closetCatalog.find((item) => item.id === id);
}
