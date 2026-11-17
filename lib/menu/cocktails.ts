// The 10 signature cocktails. Names, ingredients and prices are as printed on the cocktail PDF
// (checked against its text); strength (1 Light, 2 Mild, 3 Strong) is the jellyfish rating from
// design/HANDOFF.md. Spelling slips on the print ("Tea Leave", "Vermount") are corrected here.
// Page numbers are the cocktail menu's own (page 1 is the cover).

export type Strength = 1 | 2 | 3;

export type Cocktail = {
  page: number;
  name: string;
  ingredients: string[];
  strength: Strength;
  price: number; // VND, VAT included
};

export const STRENGTH_WORDS: Record<"en" | "ru", Record<Strength, string>> = {
  en: { 1: "Light", 2: "Mild", 3: "Strong" },
  ru: { 1: "Лёгкий", 2: "Средний", 3: "Крепкий" }
};

export const COCKTAILS: Cocktail[] = [
  { page: 2, name: "Eyes of Meduza", ingredients: ["Vodka", "Citrus", "Blue"], strength: 2, price: 280_000 },
  { page: 3, name: "Frozen Gaze", ingredients: ["Gin", "Vanilla", "Crème menthe", "Citrus", "Yuzu bitter"], strength: 2, price: 260_000 },
  { page: 4, name: "The Siren Secret", ingredients: ["Whisky", "Coffee bean", "Tiramisu"], strength: 3, price: 260_000 },
  { page: 5, name: "Pearl Venom", ingredients: ["Tequila", "Grilled coconut", "Mango", "Citrus"], strength: 2, price: 260_000 },
  { page: 6, name: "Abyss Whisper", ingredients: ["Black rum", "Tea leaf", "Hibiscus", "Amaro", "Black walnut"], strength: 2, price: 260_000 },
  { page: 7, name: "Lush by Meduza", ingredients: ["Gin", "Green apple", "Melon"], strength: 1, price: 280_000 },
  { page: 8, name: "Neptune’s Kiss", ingredients: ["Vodka", "Guava", "Shiso", "Citrus"], strength: 1, price: 260_000 },
  { page: 9, name: "The Oasis", ingredients: ["Tequila", "Ginger", "Green chartreuse", "Mint", "Jasmine"], strength: 1, price: 260_000 },
  { page: 10, name: "Eden Above", ingredients: ["Whisky", "Tea", "Dry vermouth", "Elderflower", "Honey"], strength: 3, price: 280_000 },
  { page: 11, name: "Coastal Bloom", ingredients: ["Gin", "Cucumber", "Jasmine", "Molasses", "Salt"], strength: 1, price: 280_000 }
];
