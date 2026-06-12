// Curated fragrance data for searchable dropdowns

export const SCENT_TYPES = [
  "Gourmand Oriental",
  "Woody Oriental",
  "Fresh Aquatic",
  "Floral Aldehydic",
  "Citrus Aromatic",
  "Oud Woody",
  "Leather Spicy",
  "Green Chypre",
  "Fougère Aromatic",
  "Ambery Spicy",
  "Floral Fruity",
  "Oriental Vanilla",
  "Woody Musk",
  "Fresh Citrus",
  "Aquatic Ozone",
  "Gourmand Vanilla",
  "Spicy Oriental",
  "Woody Chypre",
  "White Floral",
  "Oriental Amber",
  "Tobacco Vanilla",
  "Leather Oud",
  "Incense Resin",
  "Rose Oud",
  "Mediterranean Aquatic",
  "Sweet Gourmand",
  "Powdery Floral",
  "Earthy Woody",
  "Fresh Spicy",
  "Warm Amber",
  "Animalic Musk",
  "Green Aromatic",
  "Fruity Chypre",
  "Resin Incense",
  "Aromatic Aquatic",
  "Leather Tobacco",
  "Oud Incense",
  "Clean Cotton",
  "Smoky Woody",
  "Honey Tobacco",
];

export const OCCASIONS = [
  "Everyday Wear",
  "Casual",
  "Formal",
  "Office / Professional",
  "Date Night",
  "Party / Clubbing",
  "Evening Out",
  "Wedding",
  "Religious / Festive",
  "Special Event",
  "Summer Day",
  "Winter Evening",
  "Spring Afternoon",
  "Rainy Day",
  "Sport / Gym",
  "Travel",
  "Romantic Dinner",
  "Night Out",
  "Family Gathering",
  "Interview",
  "Vacation",
  "Cold Weather",
  "Hot Weather",
  "Layering Base",
];

export const LONGEVITY = [
  "Soft (1–2 hours)",
  "Moderate (3–4 hours)",
  "Good (5–6 hours)",
  "Long-lasting (7–8 hours)",
  "Very Long (9–12 hours)",
  "Beast Mode (12+ hours)",
  "Eau de Parfum (6–8 hours)",
  "Eau de Toilette (3–5 hours)",
  "Eau de Cologne (2–3 hours)",
  "Extrait / Parfum (8–12 hours)",
  "Eau Fraîche (1–2 hours)",
];

// Fragrance notes organized by category
export const NOTE_CATEGORIES: Record<string, string[]> = {
  "Top / Citrus": [
    "Bergamot", "Lemon", "Grapefruit", "Orange", "Mandarin", "Lime",
    "Yuzu", "Kumquat", "Cedrat", "Petitgrain", "Neroli", "Bitter Orange",
    "Tangerine", "Bergamot Mint", "Citron", "Lemongrass",
  ],
  "Top / Fruity": [
    "Apple", "Pear", "Pineapple", "Peach", "Blackcurrant", "Raspberry",
    "Strawberry", "Cherry", "Plum", "Apricot", "Mango", "Passionfruit",
    "Lychee", "Cranberry", "Pomegranate", "Fig", "Date", "Prune",
    "Green Apple", "Red Berries", "Tropical Fruits",
  ],
  "Top / Aromatic": [
    "Lavender", "Mint", "Basil", "Rosemary", "Thyme", "Sage",
    "Anise", "Tarragon", "Verbena", "Eucalyptus", "Coriander Leaf",
    "Peppermint", "Spearmint", "Artemisia", "Angelica",
  ],
  "Top / Spicy": [
    "Cardamom", "Cinnamon", "Pink Pepper", "Black Pepper", "Saffron",
    "Ginger", "Nutmeg", "Clove", "Star Anise", "Cumin", "Juniper Berries",
    "Elemi", "Pepper",
  ],
  "Top / Green": [
    "Green Notes", "Galbanum", "Violet Leaf", "Grass", "Fern",
    "Tomato Leaf", "Cucumber", "Bamboo", "Mate", "Tea",
    "Geranium Leaf", "Oakmoss", "Fig Leaf",
  ],
  "Top / Aldehydic": [
    "Aldehydes", "Ozonic Notes", "Marine Notes", "Calone",
    "Metallic Notes", "Helional", "Floralozone",
  ],
  "Heart / Floral": [
    "Rose", "Jasmine", "Lavender", "Geranium", "Iris", "Ylang-Ylang",
    "Lily of the Valley", "Violet", "Tuberose", "Carnation", "Heliotrope",
    "Orchid", "Magnolia", "Frangipani", "Honeysuckle", "Gardenia",
    "Lilac", "Peony", "Freesia", "Chamomile", "Linden Blossom",
    "Orange Blossom", "Narcissus", "Hyacinth", "Broom", "Boronia",
    "Osmanthus", "Mimosa", "Wisteria", "Lotus",
  ],
  "Heart / Spicy & Warm": [
    "Clove", "Cinnamon", "Nutmeg", "Pepper", "Saffron", "Coriander",
    "Pimento", "Allspice", "Caraway", "Ginger Lily", "Davana",
    "Cumin Seed", "Cardamom",
  ],
  "Heart / Herbal & Green": [
    "Sage", "Rosemary", "Thyme", "Basil", "Tarragon", "Verbena",
    "Artemisia", "Mate Absolute", "Green Tea", "Hay", "Chamomile",
    "Clary Sage", "Lavandin",
  ],
  "Heart / Honey & Gourmand": [
    "Honey", "Dates", "Rum", "Cognac", "Whiskey", "Maple Syrup",
    "Chestnut", "Almond", "Coconut", "Hazelnut", "Coffee", "Chocolate",
    "Caramel", "Toffee", "Marshmallow", "Cotton Candy",
  ],
  "Base / Woody": [
    "Sandalwood", "Cedarwood", "Vetiver", "Gaiac Wood", "Pine",
    "Cypress", "Cashmeran", "Agarwood (Oud)", "Amyris", "Cedar",
    "Oakwood", "Rosewood", "Teakwood", "Hinoki", "Juniper Wood",
    "Boisé", "Palo Santo",
  ],
  "Base / Amber & Resin": [
    "Amber", "Ambergris", "Benzoin", "Frankincense", "Myrrh",
    "Labdanum", "Copal", "Elemi", "Peru Balsam", "Tolu Balsam",
    "Vanilla Amber", "Amberwood", "Ambroxan", "Cistus",
  ],
  "Base / Animalic & Leather": [
    "Musk", "Leather", "Castoreum", "Civet", "Cascarilla",
    "Hyraceum", "Costus", "Birch Tar", "Suede", "Caviar",
    "White Musk", "Black Musk", "Red Musk", "Deer Musk",
  ],
  "Base / Gourmand": [
    "Vanilla", "Tonka Bean", "Cocoa", "Coffee", "Caramel",
    "Praline", "Hazelnut", "Almond", "Coconut", "Sesame",
    "Benzoin Vanilla", "Cream", "Butter", "Milk", "Rice",
  ],
  "Base / Woody Spicy": [
    "Patchouli", "Oakmoss", "Tree Moss", "Cedarwood", "Sandalwood",
    "Vetiver", "Ginger", "Nutmeg", "Pepper", "Cinnamon Bark",
  ],
};

// Flatten for quick search
export const ALL_NOTES = Object.values(NOTE_CATEGORIES).flat();

// Category-specific note lists
export const TOP_NOTES = [
  ...NOTE_CATEGORIES["Top / Citrus"],
  ...NOTE_CATEGORIES["Top / Fruity"],
  ...NOTE_CATEGORIES["Top / Aromatic"],
  ...NOTE_CATEGORIES["Top / Spicy"],
  ...NOTE_CATEGORIES["Top / Green"],
  ...NOTE_CATEGORIES["Top / Aldehydic"],
];

export const HEART_NOTES = [
  ...NOTE_CATEGORIES["Heart / Floral"],
  ...NOTE_CATEGORIES["Heart / Spicy & Warm"],
  ...NOTE_CATEGORIES["Heart / Herbal & Green"],
  ...NOTE_CATEGORIES["Heart / Honey & Gourmand"],
];

export const BASE_NOTES = [
  ...NOTE_CATEGORIES["Base / Woody"],
  ...NOTE_CATEGORIES["Base / Amber & Resin"],
  ...NOTE_CATEGORIES["Base / Animalic & Leather"],
  ...NOTE_CATEGORIES["Base / Gourmand"],
  ...NOTE_CATEGORIES["Base / Woody Spicy"],
];
