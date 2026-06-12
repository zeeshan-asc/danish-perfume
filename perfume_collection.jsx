import { useState } from "react";

const perfumes = [
  {
    id: 1,
    name: "Lattafa Khamrah Qahwa",
    brand: "Lattafa",
    inspired: "Kilian Angel's Share (coffee twist)",
    notes: {
      top: "Cinnamon, Cardamom, Ginger",
      heart: "Praline, Candied Fruits, White Flowers",
      base: "Coffee, Vanilla, Tonka Bean, Musk"
    },
    scent_type: "Gourmand Oriental",
    seasons: ["Fall", "Winter"],
    occasion: "Special Occasion / Evening",
    longevity: "8–10 hrs | Beast Mode",
    analysis: "A dark, cozy coffee-spice bomb that smells like spiced Arabic coffee drizzled over praline and vanilla. The coffee note is stunning in the opening but softens into warm amber and creamy sweetness over time. Strong sillage — you will be noticed. Too heavy for summer; built for cold nights and close encounters.",
    tags: ["Compliment Magnet", "Cold Weather King", "Heavy Hitter"]
  },
  {
    id: 2,
    name: "Lattafa Asad Elixir",
    brand: "Lattafa",
    inspired: "Dior Sauvage Elixir / Boss Bottled Absolu",
    notes: {
      top: "Pink Pepper, Saffron, Grapefruit",
      heart: "Tobacco, Vanilla, Cedar",
      base: "Incense, Amber, Patchouli, Cashmeran"
    },
    scent_type: "Spicy Oriental Woody",
    seasons: ["Fall", "Winter"],
    occasion: "Special Occasion / Evening",
    longevity: "9–10 hrs | Near-Eternal",
    analysis: "Darker and more concentrated than original Asad. Opens with sharp spice and saffron tension, then settles into a smoky, sweet tobacco-vanilla heart that is unmistakably masculine yet wearable. Projection is moderate but longevity is nuclear — clothes will carry it for days. One of the most complimented budget fragrances of 2025.",
    tags: ["Most Complimented", "Office-Safe (light hand)", "Date Night"]
  },
  {
    id: 3,
    name: "Rayhaan Obsidian",
    brand: "Rayhaan",
    inspired: "Dior Homme Intense",
    notes: {
      top: "Iris, Bergamot, Citrus",
      heart: "Suede, Leather, Powdery Iris",
      base: "Oud, Sandalwood, Cedar"
    },
    scent_type: "Powdery Iris / Leather",
    seasons: ["Fall", "Winter"],
    occasion: "Special Occasion / Date Night",
    longevity: "7–9 hrs | Strong",
    analysis: "A dark, iris-forward masculine that channels Dior Homme Intense without the ultra-sweetness. Cool, elegant, slightly powdery with suede-leather depth. The oud in the base is tame and refined — not Arabic-loud. This is a fragrance you wear to be noticed at a dinner or evening event. Deeply sophisticated for its price. Not an office scent — more candlelit restaurant.",
    tags: ["Date Night", "Sophisticated", "Iris-Leather"]
  },
  {
    id: 4,
    name: "Rayhaan Aquatica",
    brand: "Rayhaan",
    inspired: "Creed Virgin Island Water",
    notes: {
      top: "Bergamot, Lime, Mandarin, Coconut Milk",
      heart: "Jasmine, Gardenia, Hibiscus, Sugarcane",
      base: "Patchouli, Musk, Tonka Bean, Rum"
    },
    scent_type: "Aquatic Tropical / Fruity",
    seasons: ["Spring", "Summer"],
    occasion: "Daily Wear (Casual)",
    longevity: "3–5 hrs | Moderate (freshie caveat)",
    analysis: "A vibrant Caribbean getaway in a bottle — sun, rum cocktails, creamy coconut, and crystal-clear turquoise water. Opens with sparkling lime and bergamot, then the coconut-gardenia heart blooms beautifully. Longevity is the Achilles heel (2–5 hours on skin), but on clothes it performs better. A genuine summer essential for casual outdoor wear.",
    tags: ["Summer Staple", "Vacation Vibes", "Blind Buy Winner"]
  },
  {
    id: 5,
    name: "Afnan Supremacy Collectors Edition",
    brand: "Afnan",
    inspired: "Creed Aventus Absolu",
    notes: {
      top: "Pineapple, Bergamot, Apple, White Flowers",
      heart: "Orange Blossom, Birch, Amber",
      base: "Oakmoss, Musk, Ambergris"
    },
    scent_type: "Chypre Fruity",
    seasons: ["Spring", "Summer", "Fall"],
    occasion: "Daily Wear / Evening",
    longevity: "8–12 hrs | Beast",
    analysis: "Arguably the finest Aventus interpretation ever made at budget pricing. Opens with a thick, realistic pineapple that slowly gives way to a mossy, slightly salty drydown that is hauntingly beautiful. Not identical to Aventus Absolu but arguably better — fresher, crisper, with a maritime moss finish. Compliment machine for spring through fall.",
    tags: ["Best Aventus Dupe", "Compliment Magnet", "Versatile"]
  },
  {
    id: 6,
    name: "Afnan Supremacy Noir",
    brand: "Afnan",
    inspired: "Bottega Veneta Pour Homme / Tom Ford Grey Vetiver",
    notes: {
      top: "Spruce, Bergamot, Violet",
      heart: "Pine Tree, Leather, Lavender, Patchouli",
      base: "Labdanum, Clary Sage, Amber"
    },
    scent_type: "Green Resinous / Woody",
    seasons: ["Fall", "Winter", "Spring"],
    occasion: "Daily Wear / Office",
    longevity: "6–8 hrs | Moderate-Strong",
    analysis: "Underrated gem. Opens with authentic conifer/pine freshness — not synthetic or sharp, but like a real forest. Leather and patchouli add masculine depth in the heart, while labdanum and amber make the drydown warm and resiny. Described as 'Fritz Cola' by one reviewer — cola-like but never sweet. A mature, serious daily driver that is very wearable year-round except peak summer.",
    tags: ["Underrated", "Office Safe", "Forest Vibe"]
  },
  {
    id: 7,
    name: "Afnan Turathi Brown",
    brand: "Afnan",
    inspired: "YSL Tuxedo",
    notes: {
      top: "Amber, Patchouli, Ozonic, Woody",
      heart: "Warm Spices, Vanilla, Aromatic Spices",
      base: "Balsamic, Rose, Aquatic notes"
    },
    scent_type: "Spicy Woody / Oriental",
    seasons: ["Fall", "Winter"],
    occasion: "Evening / Special Occasion",
    longevity: "8–10 hrs | Strong",
    analysis: "A spicy, warm oriental that channels YSL Tuxedo's patchouli-spice DNA but pushes it into heavier, denser territory. Amber and patchouli anchor the opening firmly in cold-weather territory. The balsamic-rose drydown is smooth and woody. After 10 minutes, tobacco and dark woods emerge. Formal, confident, evening-forward. The gorgeous heavy bottle and wooden box make it feel premium far above its price.",
    tags: ["Cold Weather", "Formal", "Statement Scent"]
  },
  {
    id: 8,
    name: "Ahmed Al Maghribi Kaaf",
    brand: "Ahmed Al Maghribi",
    inspired: "Parfums de Marly Percival",
    notes: {
      top: "Watermelon, Red Fruits, Lavender, Sicilian Orange",
      heart: "Lotus, Jasmine, Lily of the Valley, Sea Accord",
      base: "Warm Musk, Woods, Amber"
    },
    scent_type: "Fresh Aquatic / Fruity Clean",
    seasons: ["Spring", "Summer"],
    occasion: "Daily Wear (All-Day)",
    longevity: "8–10 hrs | Impressive for its type",
    analysis: "One of the best fresh budget buys. A Percival-inspired composition that smells cleaner, juicier, and arguably more natural than the original at 10% the price. Opens with vibrant citrus-fruit freshness and sea accord, settling into a clean musk-woods base. Versatile enough for office, gym, and casual outings. Performs exceptionally in heat and humidity.",
    tags: ["Summer Daily", "Office Safe", "Value Champion"]
  },
  {
    id: 9,
    name: "Armaf Odyssey Mandarin Sky Elixir",
    brand: "Armaf",
    inspired: "Original Mandarin Sky (more refined/concentrated)",
    notes: {
      top: "Mandarin, Orange, Black Pepper, Cardamom, Lavender",
      heart: "Tonka Bean, Patchouli, Incense, Caramel",
      base: "Vanilla, Vetiver"
    },
    scent_type: "Oriental Woody / Sweet Citrus",
    seasons: ["Fall", "Winter", "Spring"],
    occasion: "Daily Wear / Evening",
    longevity: "10–30 hrs | Nuclear",
    analysis: "The Elixir version tones down the wildness of the original Mandarin Sky into something more refined and wearable. Vibrant mandarin opening that doesn't feel synthetic, with caramel and incense adding unexpected depth. Unisex in the best way. Sillage is moderate but longevity is insane — some users report 30 hours on skin. A year-round daily driver that shines in cooler months.",
    tags: ["Nuclear Longevity", "All-Rounder", "Citrus-Gourmand"]
  },
  {
    id: 10,
    name: "Armaf Odyssey Spectra",
    brand: "Armaf",
    inspired: "JPG Ultra Male / Caudalie Tuxedo-adjacent",
    notes: {
      top: "Cinnamon, Apple, Bergamot",
      heart: "Cinnamon, Lavender, Orange Blossom, Lily of the Valley",
      base: "Vanilla, Tobacco, Tonka Bean, Amber, Patchouli"
    },
    scent_type: "Oriental Spicy / Gourmand",
    seasons: ["Fall", "Winter"],
    occasion: "Evening / Date Night",
    longevity: "7–9 hrs | Strong",
    analysis: "A cinnamon-forward gourmand oriental that is bold and attention-grabbing. Apple and bergamot sweeten the spicy opening, then lavender bridges to a warm tobacco-vanilla base that is deeply attractive. Some compare it to JPG Ultra Male in spirit. Better suited for evenings and colder outings — it can feel intense in heat. The cinnamon note is dominant, so light-handed application is key.",
    tags: ["Date Night", "Cold Weather", "Cinnamon Bomb"]
  },
  {
    id: 11,
    name: "Peirama Intense Along",
    brand: "Peirama Parfums",
    inspired: "Emporio Armani Stronger With You Intensely",
    notes: {
      top: "Sweet Chestnut, Cardamom, Pineapple, Sage",
      heart: "Caramel, Vanilla, Fougère",
      base: "Amber, Cedarwood, Labdanum, Cashmere"
    },
    scent_type: "Oriental Fougère / Gourmand Woody",
    seasons: ["Fall", "Winter"],
    occasion: "Evening / Date Night",
    longevity: "6–8 hrs | Good",
    analysis: "A faithful impression of Stronger With You Intensely — that iconic sweet, woody, fougère DNA. Rich chestnut and caramel with aromatic sage make it feel mature yet sensual. Peirama's concentration makes it project well for a local brand. A great value if you love the DNA but don't want to pay SWY prices. Best for cooler evenings — the sweetness can feel heavy in heat.",
    tags: ["SWY Inspired", "Intimate Evenings", "Gourmand Fougère"]
  },
  {
    id: 12,
    name: "Peirama Lost in Love",
    brand: "Peirama Parfums",
    inspired: "Tiziana Terenzi Kirke No. 4",
    notes: {
      top: "Lemon Zest, Bitter Orange Blossom",
      heart: "Ambroxan, Salt, Woody Accord",
      base: "Musk, Sandalwood, Clean Amber"
    },
    scent_type: "Woody Ambroxan / Clean Skin",
    seasons: ["Spring", "Summer", "Fall"],
    occasion: "Daily Wear (All-Day)",
    longevity: "6–8 hrs | Beast Mode Projection Initially",
    analysis: "Inspired by TK No. 4 — that dry, salty-sweet ambroxan skin scent that smells like expensive clean skin on steroids. Opens bright with citrus, then the ambroxan accord takes over, creating that signature 'crisp skin' aura that draws people close. House-filling projection in the opening. Unisex and surprisingly versatile — works across three seasons as a refined daily wear.",
    tags: ["Clean Skin Effect", "Ambroxan Beast", "House-Filler"]
  },
  {
    id: 13,
    name: "Peirama Lazur",
    brand: "Peirama Parfums",
    inspired: "Fresh Aquatic / Original Creation (Lazur DNA)",
    notes: {
      top: "Passionfruit, Lemon, Nutmeg, Rosemary",
      heart: "Apple, Freesia, Hibiscus, Lotus",
      base: "White Musk, Vetiver"
    },
    scent_type: "Floral Aquatic / Tropical",
    seasons: ["Spring", "Summer"],
    occasion: "Special Occasion / Evening",
    longevity: "4–6 hrs | Moderate",
    analysis: "A tropical aquatic that evokes the Indian Ocean shoreline — light breeze, white sand, turquoise water. Passionfruit and lemon burst upfront, then the exotic floral heart of hibiscus and lotus blooms. Dries down to a clean white musk. Not a beast mode performer but the scent quality is excellent. Perfect for sunny days, outdoor gatherings, and casual summer wear.",
    tags: ["Summer Casual", "Tropical Aquatic", "Light & Airy"]
  },
  {
    id: 14,
    name: "Pacifist by Bahaar Scentiments",
    brand: "Bahaar Scentiments",
    inspired: "LV Pacific Chill",
    notes: {
      top: "Citrus, Apricot/Carrot, Peppermint, Coriander",
      heart: "Blackcurrant, Rose, Fruity Accord",
      base: "Ambrette, Fig, Clean Musk"
    },
    scent_type: "Aromatic Fruity / Wellness",
    seasons: ["Spring", "Summer"],
    occasion: "Daily Wear",
    longevity: "4–6 hrs | Moderate",
    analysis: "An impression of LV Pacific Chill — that sunny wellness-vibe smoothie-in-a-bottle energy. Opens with vivid citrus and carrot-peppermint, creating a unique, slightly vegetal freshness that feels alive and modern. The fruity-berry heart is soft and feminine-leaning. Clean musk base. Lighter in presence than heavy Middle Eastern scents — this is your 'gym to brunch' summer pickup.",
    tags: ["Wellness Vibe", "Summer Casual", "Unisex Fresh"]
  },
  {
    id: 15,
    name: "Galaxy Edge by Bahaar Scentiments",
    brand: "Bahaar Scentiments",
    inspired: "Xerjoff Erba Pura",
    notes: {
      top: "Sicilian Lemon, Orange, Bergamot, Calabrian Citrus",
      heart: "Musk, Fruity Accord, Sandalwood",
      base: "Vanilla, Amber, White Musk"
    },
    scent_type: "Fruity Sweet / Citrus Musk",
    seasons: ["Spring", "Summer"],
    occasion: "Daily Wear / Casual",
    longevity: "5–7 hrs | Moderate-Good",
    analysis: "Inspired by the legendary Erba Pura — a bright, joyful, citrus-musk-vanilla bomb that radiates positivity. Xerjoff's original is nuclear; this impression captures the DNA at a fraction of the price. Sparkling citrus opening, smooth fruity heart, warm musk-vanilla base. A crowd-pleasing warm-weather scent that suits anyone. Bahaar's concentration ensures it performs better than typical freshies.",
    tags: ["Crowd Pleaser", "Warm Weather", "Erba Pura DNA"]
  },
  {
    id: 16,
    name: "Armaf Infinity Silver",
    brand: "Armaf",
    inspired: "Dior Sauvage / YSL Ultime adjacent",
    notes: {
      top: "Bergamot, Ginger, Grapefruit",
      heart: "Apple, Cardamom, Geranium, Pink Rose",
      base: "Cashmere Wood, Cedarwood, Vetiver"
    },
    scent_type: "Fresh Floral / Aromatic Woody",
    seasons: ["Spring", "Summer", "Fall"],
    occasion: "Daily Wear / Office",
    longevity: "7–10 hrs | Strong (Potent — 2 sprays max)",
    analysis: "A stunning fresh-floral masculine that centres on a jammy rose over clean cedar. The citrus-ginger opening is energising, then the apple-geranium-rose heart is surprisingly beautiful. Dries to a smooth cashmere-wood finish. POTENT — 3 sprays will dominate a room. Best at 2 sprays for office/everyday. Received compliments on first wear. One of Armaf's best 2024 releases.",
    tags: ["Compliment Magnet", "Office Favourite", "Rose-Cedar"]
  },
  {
    id: 17,
    name: "North Stag Expression 2 Deux",
    brand: "Paris Corner",
    inspired: "Parfums de Marly Layton",
    notes: {
      top: "Apple, Lavender, Bergamot, Mandarin Orange",
      heart: "Geranium, Violet, Jasmine",
      base: "Vanilla, Cardamom, Sandalwood, Patchouli, Guaiac Wood"
    },
    scent_type: "Woody Aromatic / Fruity Floral",
    seasons: ["Spring", "Winter", "Fall"],
    occasion: "Daily Wear / Evening",
    longevity: "6–8 hrs | Moderate-Strong",
    analysis: "A very solid Layton interpretation that captures the apple-lavender signature and transitions into a refined woody-vanilla drydown. Dry apple and lavender with a creamy vanilla heart — confident, clean, masculine without being sharp. A reliable daily driver for three seasons. Office-appropriate, compliment-worthy, and versatile enough for both casual and smart-casual settings.",
    tags: ["Layton Dupe", "Office Friendly", "All-Rounder"]
  },
  {
    id: 18,
    name: "Soleil De Rose by Riifs",
    brand: "Riifs",
    inspired: "God of Fire",
    notes: {
      top: "Mango, Lemon, Berries",
      heart: "Ginger, Jasmine, Tonka Bean",
      base: "Musk, Amber, Vetiver"
    },
    scent_type: "Floral Fruity / Tropical",
    seasons: ["Summer", "Spring"],
    occasion: "Daily Wear",
    longevity: "7-8 hrs | Above Average",
    analysis: "Rose de Soleil Eclat is a floral fruity fragrance with a vibrant citrus opening and a woody-musk base. The top notes feature bergamot and citrus with mango, leading to a floral heart of rose, jasmine, and peony. The base combines amber, musk, and sandalwood, creating a balanced blend suited for daytime wear, particularly in spring. Its versatility makes it appropriate for both casual and formal occasions.",
    tags: ["Feminine Leaning", "Seductive", "EDaily Wear"]
  },
  {
    id: 19,
    name: "French Avenue Liquid Brun",
    brand: "French Avenue",
    inspired: "Parfums de Marly Althaïr",
    notes: {
      top: "Cinnamon, Orange Blossom, Cardamom, Bergamot",
      heart: "Bourbon Vanilla, Elemi",
      base: "Praline, Woody Notes, Musk"
    },
    scent_type: "Sweet Gourmand Vanilla",
    seasons: ["Fall", "Winter"],
    occasion: "Evening / Special Occasion",
    longevity: "10–13 hrs | Beast Mode",
    analysis: "A near-perfect Althaïr clone — that creamy, vanilla ice-cream DNA that smells expensive and indulgent. Opens with a spiced cinnamon-cardamom warmth, then melts into a smooth bourbon vanilla heart. The drydown is simply gorgeous — deep, woody-sweet, moreish. One of the most uncanny dupes in the budget space. Beast mode longevity. Best for cold evenings and romantic settings.",
    tags: ["Althaïr Clone", "Cold Weather Boss", "Vanilla Heaven"]
  },
  {
    id: 20,
    name: "French Avenue Atlantis Extrait",
    brand: "French Avenue",
    inspired: "Original Tropical Composition",
    notes: {
      top: "Watermelon, Citrus, Lemon",
      heart: "Coconut, Tropical Accord, Floral",
      base: "Ambergris, Amberwood, Cacao"
    },
    scent_type: "Tropical Aquatic / Fresh Sweet",
    seasons: ["Spring", "Summer"],
    occasion: "Daily Wear / Casual",
    longevity: "6–9 hrs | Strong for a Freshie (Extrait concentration)",
    analysis: "A realistic, juicy watermelon bomb that transitions into a creamy tropical-beach accord. The Extrait concentration means it performs far better than typical fresh fragrances — strong projection initially, then a comfortable skin-hugging presence for hours. The cacao in the base adds surprising depth. Ideal for outdoor summer occasions when you want to smell fresh, tropical, and unique.",
    tags: ["Summer Tropical", "Extrait Power", "Watermelon King"]
  },
  {
    id: 21,
    name: "Azzaro Wanted by Bavari",
    brand: "Bavari",
    inspired: "Azzaro Wanted (EDT)",
    notes: {
      top: "Lemon, Ginger, Lavender, Mint",
      heart: "Cardamom, Juniper, Apple",
      base: "Cedar, Vetiver, Guaiac Wood"
    },
    scent_type: "Woody Spicy / Aromatic",
    seasons: ["Spring", "Summer", "Fall"],
    occasion: "Daily Wear",
    longevity: "6–8 hrs | Good",
    analysis: "A clean, confident aromatic-woody impression of Azzaro Wanted — vibrant lemon-ginger opening, fresh spice heart, smooth woody cedar finish. Versatile and approachable. Not too sweet, not too sharp. The kind of fragrance anyone can wear to almost any setting. Inoffensive, fresh, and reliably pleasant. A safe choice for when you want to smell good without making a statement.",
    tags: ["All-Rounder", "Inoffensive", "Spring-Summer Daily"]
  },
  {
    id: 22,
    name: "Prime Intense by EdenRobe",
    brand: "EdenRobe",
    inspired: "Original Amber Woody Composition",
    notes: {
      top: "Fresh Spicy, Citrus",
      heart: "Amber, Whiskey, White Floral",
      base: "Patchouli, Guaiacwood, Cypriol, Frankincense"
    },
    scent_type: "Oriental Amber / Woody Smoky",
    seasons: ["Fall", "Winter", "Spring"],
    occasion: "Daily Wear",
    longevity: "6–9 hrs | Strong (improves with maceration)",
    analysis: "A bold, smoky-amber oriental that punches well above its price bracket. Fresh spicy opening gives way to a whiskey-amber heart that feels luxurious. The base of patchouli, guaiacwood, and frankincense creates a rich, resinous trail that echoes oud without going full-Arabic. Dark, intense, and perfect for cold evenings. Best suited to those who love warm, smoky sophistication.",
    tags: ["Smoky Oriental", "Winter Evening", "Pakistani Gem"]
  },
  {
    id: 23,
    name: "Lost Echo by WB Hemani",
    brand: "WB Hemani",
    inspired: "Initio Side Effect / Musky Oriental",
    notes: {
      top: "Citrus, Aldehydic, Clean",
      heart: "Ambroxan, Vanilla, Musky Accord",
      base: "Sandalwood, Amber, Musk"
    },
    scent_type: "Clean Musky Oriental",
    seasons: ["Fall", "Winter", "Spring"],
    occasion: "Daily Wear / Evening",
    longevity: "5–7 hrs | Good",
    analysis: "A warm, skin-close musky fragrance with aldehydic-clean top notes and a vanilla-ambroxan heart. Part of WB Hemani's premium line, it carries that 'expensive clean skin' effect that makes people want to lean in. More refined than most local brands. Works well as an everyday comfort scent in cooler months and transitions nicely into evening wear.",
    tags: ["Skin Scent", "Musky Comfort", "Everyday Premium"]
  },
  {
    id: 24,
    name: "Exclusive Intense by WB Hemani",
    brand: "WB Hemani",
    inspired: "Bleu de Chanel",
    notes: {
      top: "Bergamot, Lemon, Grapefruit, Sea Accord, Peppermint",
      heart: "Pink Pepper, Nutmeg, Ginger, Jasmine",
      base: "Cedarwood, Vetiver, Patchouli, Labdanum, Frankincense"
    },
    scent_type: "Aromatic Woody / Fresh Masculine",
    seasons: ["Spring", "Summer", "Fall"],
    occasion: "Daily Wear / Office",
    longevity: "6–8 hrs | Strong",
    analysis: "A well-executed Bleu de Chanel impression that captures the clean, aromatic, woody-herbal DNA of the original. Fresh citrus and sea accord in the opening, a mildly spiced heart of ginger-jasmine, and a sophisticated cedarwood-labdanum base. Extremely office-appropriate and versatile. The 20% oil concentration ensures longevity that beats many designer alternatives. Safe, classy, crowd-pleasing.",
    tags: ["Office Classic", "Bleu de Chanel DNA", "Safe Powerhouse"]
  },
  {
    id: 25,
    name: "Rose Tobacco by Surrati",
    brand: "Surrati",
    inspired: "Original Oriental Composition",
    notes: {
      top: "Rose, Plum, Chocolate",
      heart: "Oud, Sandalwood, Honey",
      base: "Amber, Leather, Tobacco"
    },
    scent_type: "Oriental Floral Gourmand / Rose Tobacco",
    seasons: ["Fall", "Winter"],
    occasion: "Special Occasion / Evening",
    longevity: "6–8 hrs (skin scent after ~5 hrs)",
    analysis: "A dense, rich rose oriental that demands attention. Rose and honey dominate the opening — sweet but not cloying. Then chocolate and coffee weave through the middle, creating an intoxicating gourmand rose effect. The tobacco-leather-oud base adds smokiness and depth. Smooth, romantic, slightly animalic. Perfect for intimate evenings and special occasions in cold weather. Made in Makkah — genuine Arabian heritage.",
    tags: ["Arabian Heritage", "Romantic Evening", "Rose Gourmand"]
  },
  {
    id: 26,
    name: "Khair by Paris Corner",
    brand: "Paris Corner",
    inspired: "Maison de Tahiti Tiare / Davana Oriental",
    notes: {
      top: "Davana, Bergamot, Pink Pepper",
      heart: "Agarwood, Oud, Amber, Rosemary",
      base: "Leather, Vetiver, Musk"
    },
    scent_type: "Oriental Woody / Oud Spice",
    seasons: ["Fall", "Winter"],
    occasion: "Daily Wear / Evening",
    longevity: "5–7 hrs | Moderate (variable batch quality)",
    analysis: "A warm, sophisticated oriental that opens with the unusual davana fruit — slightly spiced, slightly fruity, very distinctive. The oud and amber heart creates depth without going heavy-oud. Leather and vetiver in the base give it a modern masculine edge. Versatile between a smart daily wear and evening use. Note: some batches have reportedly been stronger than others; longevity can be inconsistent.",
    tags: ["Distinctive DNA", "Oud-Oriental", "All-Season Dark"]
  },
  {
    id: 27,
    name: "Sugar Chrome by AMD Perfumes",
    brand: "AMD Perfumes",
    inspired: "Azzaro Chrome DNA",
    notes: {
      top: "Lemon, Rosemary, Bergamot, Neroli, Pineapple",
      heart: "Jasmine, Oakmoss, Cyclamen, Coriander",
      base: "Musk, Oakmoss, Cedar, Sandalwood, Cardamom, Tonka Bean"
    },
    scent_type: "Citrus Aromatic / Clean Woody",
    seasons: ["Spring", "Summer"],
    occasion: "Daily Wear / Casual",
    longevity: "5–7 hrs | Decent",
    analysis: "A bright, clean citrus-aromatic with an Azzaro Chrome spirit — fresh bergamot and neroli with a subtle oakmoss-woody backbone. The pineapple adds a light sweetness to prevent it from being too austere. Clean, inoffensive, easy to wear. A good daytime summer option when you want to smell fresh and groomed without making a big statement. Works well at the office or on casual outings.",
    tags: ["Clean Citrus", "Everyday Refresh", "Spring-Summer Easy"]
  },
  {
    id: 28,
    name: "Mancera French Riviera",
    brand: "Mancera",
    inspired: "Original composition — released 2022, composed by Pierre Montale",
    notes: {
      top: "Lemon, Orange, Tangerine, Ginger, Pepper",
      heart: "Sea Notes/Iodine, Tiare Flower, Pine, Mimosa, Vetiver",
      base: "Sea Salt, White Musk, Amber"
    },
    scent_type: "Aromatic Aquatic / Fresh Floral Marine",
    seasons: ["Spring", "Summer"],
    occasion: "Daily Wear / Casual Outdoor",
    longevity: "4–6 hrs | Moderate (skin dependent)",
    analysis: "French Riviera is Mancera's ode to the Mediterranean coast — citrus and ginger-pepper open bright and zesty before settling into a green, salty heart of pine, iodine, and mimosa, with tiare flower adding a soft floral lift. The dry-down is a clean, musky amber-sea-salt blend that reads as 'sunscreen on a yacht' rather than the heavier, more mineral-animalic profile of Profondo. It's a polarizing scent on skin chemistry — some get a vivid, sweet citrus-marine experience that lasts 6+ hours with great compliments, while others find it fades quickly into a faint floral-powdery skin scent within a couple hours. When it works, it's praised as smelling expensive and effortlessly summery. Best deployed as a warm-weather daily wear or vacation scent, ideally with a reapply on hand for longer days.",
    tags: ["Summer Signature", "Marine Floral", "Vacation Scent"]
  },
  {
    id: 29,
    name: "Faris Al Adham by Asghar Ali",
    brand: "Asghar Ali",
    inspired: "Original Fougère Oriental — Bahraini heritage house, 100-year-old brand",
    notes: {
      top: "Bergamot, Saffron, Coriander",
      heart: "Lily of the Valley, Grey Amber, Vanilla",
      base: "Black Amber, Sandalwood, Powdery Musk"
    },
    scent_type: "Spicy Fougère Oriental / Amber Woody",
    seasons: ["Fall", "Winter", "Spring"],
    occasion: "Daily Wear / Evening",
    longevity: "8–10 hrs | Strong",
    analysis: "A beautifully constructed Arabian fougère oriental from one of the Gulf's most storied perfume houses. Opens with an intriguing trio of bergamot, saffron, and coriander — simultaneously fresh, golden, and spiced. The heart of lily of the valley and grey amber is unexpectedly refined, balancing femininity and masculine depth in a way that feels luxurious. The base is where it truly shines: black amber and sandalwood create a deep, powdery-sweet warmth that is distinctly Arabian in character but wearable without being heavy-oud. The horse-and-black-leather bottle is genuinely premium. In your collection, this fills the 'refined heritage oriental' slot that nothing else quite covers — more structured and restrained than your Lattafa orientals, but richer and more traditional than the Armaf line. Best in cooler evenings and special occasions.",
    tags: ["Heritage House", "Saffron-Amber", "Refined Oriental"]
  }
];

const seasonColors = {
  Spring: "#7ecba1",
  Summer: "#f9c74f",
  Fall: "#f4845f",
  Winter: "#90c2e7"
};

const occasionIcon = {
  "Daily Wear": "☀️",
  "Special Occasion / Evening": "✨",
  "Evening / Date Night": "🌙",
  "Daily Wear / Evening": "🌅",
  "Evening / Special Occasion": "🎭",
  "Daily Wear / Office": "💼",
  "Daily Wear / Office-Safe": "💼",
  "Special Occasion / Date Night": "💫",
  "Daily Wear / Casual": "👟",
  "Daily Wear (All-Day)": "🔄",
  "Daily Wear (Casual/Outdoor)": "🌿",
  "Daily Wear (Casual)": "👟",
  "Daily Wear (All-Day)": "🔄",
  "Evening / Special Occasion": "🎭",
};

const filters = ["All", "Spring", "Summer", "Fall", "Winter"];
const occasionFilters = ["All Occasions", "Daily Wear", "Evening/Special"];

export default function PerfumeAnalysis() {
  const [activeSeason, setActiveSeason] = useState("All");
  const [activeOccasion, setActiveOccasion] = useState("All Occasions");
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState(null);

  const filtered = perfumes.filter((p) => {
    const matchSeason = activeSeason === "All" || p.seasons.includes(activeSeason);
    const matchOccasion =
      activeOccasion === "All Occasions" ||
      (activeOccasion === "Daily Wear" && p.occasion.toLowerCase().includes("daily")) ||
      (activeOccasion === "Evening/Special" && (p.occasion.toLowerCase().includes("evening") || p.occasion.toLowerCase().includes("special")));
    const matchSearch =
      search === "" ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.brand.toLowerCase().includes(search.toLowerCase()) ||
      p.scent_type.toLowerCase().includes(search.toLowerCase());
    return matchSeason && matchOccasion && matchSearch;
  });

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0d0d12 0%, #1a1025 40%, #0d1a1a 100%)",
      color: "#e8e0d5",
      fontFamily: "'Georgia', serif",
      padding: "0",
    }}>
      {/* Header */}
      <div style={{
        background: "linear-gradient(180deg, rgba(180,140,80,0.15) 0%, transparent 100%)",
        borderBottom: "1px solid rgba(180,140,80,0.3)",
        padding: "40px 32px 28px",
        position: "relative",
        overflow: "hidden"
      }}>
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
          backgroundImage: "radial-gradient(ellipse at 20% 50%, rgba(180,140,80,0.08) 0%, transparent 60%), radial-gradient(ellipse at 80% 50%, rgba(80,160,180,0.06) 0%, transparent 60%)",
          pointerEvents: "none"
        }} />
        <div style={{ maxWidth: 1100, margin: "0 auto", position: "relative" }}>
          <p style={{ fontSize: 11, letterSpacing: 5, color: "#b49c60", marginBottom: 6, textTransform: "uppercase" }}>
            Collection Analysis · June 2026
          </p>
          <h1 style={{
            fontSize: "clamp(26px, 4vw, 48px)",
            fontWeight: "normal",
            color: "#f0e6cc",
            margin: "0 0 10px",
            letterSpacing: "0.02em",
            lineHeight: 1.2
          }}>
            Danish's Fragrance Collection
          </h1>
          <p style={{ color: "#9a8e7a", fontSize: 15, margin: 0 }}>
            30 fragrances · Researched, rated & categorized
          </p>
        </div>
      </div>

      {/* Controls */}
      <div style={{
        maxWidth: 1100, margin: "0 auto", padding: "24px 32px 0",
      }}>
        {/* Search */}
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by name, brand, or scent type..."
          style={{
            width: "100%", boxSizing: "border-box",
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(180,140,80,0.25)",
            color: "#e8e0d5",
            borderRadius: 8,
            padding: "11px 16px",
            fontSize: 14,
            fontFamily: "Georgia, serif",
            marginBottom: 18,
            outline: "none"
          }}
        />

        {/* Season Filters */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 10 }}>
          <span style={{ fontSize: 12, color: "#7a7068", letterSpacing: 2, textTransform: "uppercase", alignSelf: "center", marginRight: 4 }}>Season</span>
          {filters.map(f => (
            <button key={f}
              onClick={() => setActiveSeason(f)}
              style={{
                padding: "6px 16px",
                borderRadius: 20,
                border: activeSeason === f ? "1px solid #b49c60" : "1px solid rgba(255,255,255,0.12)",
                background: activeSeason === f
                  ? (f === "All" ? "rgba(180,156,96,0.2)" : `${seasonColors[f]}22`)
                  : "rgba(255,255,255,0.04)",
                color: activeSeason === f ? (f === "All" ? "#c9a84c" : seasonColors[f]) : "#8a8078",
                fontSize: 13,
                cursor: "pointer",
                fontFamily: "Georgia, serif",
                transition: "all 0.2s"
              }}
            >
              {f === "All" ? "All Seasons" : f}
            </button>
          ))}
        </div>

        {/* Occasion Filters */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 24 }}>
          <span style={{ fontSize: 12, color: "#7a7068", letterSpacing: 2, textTransform: "uppercase", alignSelf: "center", marginRight: 4 }}>Occasion</span>
          {occasionFilters.map(f => (
            <button key={f}
              onClick={() => setActiveOccasion(f)}
              style={{
                padding: "6px 16px",
                borderRadius: 20,
                border: activeOccasion === f ? "1px solid rgba(130,180,200,0.6)" : "1px solid rgba(255,255,255,0.12)",
                background: activeOccasion === f ? "rgba(80,160,180,0.15)" : "rgba(255,255,255,0.04)",
                color: activeOccasion === f ? "#7ec8d8" : "#8a8078",
                fontSize: 13,
                cursor: "pointer",
                fontFamily: "Georgia, serif",
                transition: "all 0.2s"
              }}
            >
              {f}
            </button>
          ))}
        </div>

        <p style={{ fontSize: 12, color: "#5a5550", marginBottom: 20 }}>
          Showing {filtered.length} of {perfumes.length} fragrances
        </p>
      </div>

      {/* Cards Grid */}
      <div style={{
        maxWidth: 1100, margin: "0 auto",
        padding: "0 32px 60px",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
        gap: 20
      }}>
        {filtered.map((p) => {
          const isOpen = expanded === p.id;
          return (
            <div key={p.id}
              onClick={() => setExpanded(isOpen ? null : p.id)}
              style={{
                background: "linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)",
                border: isOpen ? "1px solid rgba(180,140,80,0.5)" : "1px solid rgba(255,255,255,0.08)",
                borderRadius: 14,
                padding: "20px 22px",
                cursor: "pointer",
                transition: "all 0.25s",
                position: "relative",
                overflow: "hidden",
                boxShadow: isOpen ? "0 8px 40px rgba(180,140,80,0.1)" : "0 2px 12px rgba(0,0,0,0.3)"
              }}
            >
              {/* Number */}
              <div style={{
                position: "absolute", top: 14, right: 16,
                fontSize: 11, color: "rgba(180,140,80,0.4)",
                letterSpacing: 1
              }}>#{p.id.toString().padStart(2, '0')}</div>

              {/* Brand + Name */}
              <p style={{ fontSize: 11, color: "#b49c60", letterSpacing: 2, textTransform: "uppercase", margin: "0 0 4px" }}>
                {p.brand}
              </p>
              <h3 style={{
                fontSize: 16, fontWeight: "normal", color: "#f0e6cc",
                margin: "0 0 12px", lineHeight: 1.3, paddingRight: 28
              }}>
                {p.name}
              </h3>

              {/* Season Chips */}
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 10 }}>
                {p.seasons.map(s => (
                  <span key={s} style={{
                    padding: "2px 10px",
                    borderRadius: 10,
                    background: `${seasonColors[s]}20`,
                    border: `1px solid ${seasonColors[s]}50`,
                    color: seasonColors[s],
                    fontSize: 11,
                  }}>{s}</span>
                ))}
                <span style={{
                  padding: "2px 10px",
                  borderRadius: 10,
                  background: "rgba(80,160,180,0.1)",
                  border: "1px solid rgba(80,160,180,0.3)",
                  color: "#7ec8d8",
                  fontSize: 11,
                }}>
                  {p.occasion.split(" / ")[0].replace("Daily Wear", "Daily").replace("Special Occasion", "Special")}
                </span>
              </div>

              {/* Scent Type */}
              <p style={{ fontSize: 13, color: "#c8b890", margin: "0 0 6px" }}>
                <span style={{ color: "#7a7068" }}>Scent: </span>{p.scent_type}
              </p>

              {/* Longevity */}
              <p style={{ fontSize: 12, color: "#8a9888", margin: "0 0 8px" }}>
                ⏱ {p.longevity}
              </p>

              {/* Inspired by */}
              <p style={{ fontSize: 12, color: "#6a6058", margin: "0 0 0", fontStyle: "italic" }}>
                Inspired by: {p.inspired}
              </p>

              {/* Expanded */}
              {isOpen && (
                <div style={{
                  marginTop: 18,
                  paddingTop: 18,
                  borderTop: "1px solid rgba(180,140,80,0.2)",
                }}>
                  {/* Notes */}
                  <div style={{ marginBottom: 14 }}>
                    <p style={{ fontSize: 11, color: "#b49c60", letterSpacing: 2, textTransform: "uppercase", margin: "0 0 8px" }}>Fragrance Notes</p>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                      {[
                        { label: "Top", val: p.notes.top, color: "#a8d8a8" },
                        { label: "Heart", val: p.notes.heart, color: "#f4d58d" },
                        { label: "Base", val: p.notes.base, color: "#d4a574" },
                      ].map(n => (
                        <div key={n.label} style={{
                          background: "rgba(255,255,255,0.04)",
                          borderRadius: 8,
                          padding: "8px 10px",
                        }}>
                          <p style={{ fontSize: 10, color: n.color, margin: "0 0 3px", letterSpacing: 1, textTransform: "uppercase" }}>{n.label}</p>
                          <p style={{ fontSize: 11, color: "#c8c0b0", margin: 0, lineHeight: 1.5 }}>{n.val}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Analysis */}
                  <p style={{ fontSize: 13.5, color: "#c0b8a8", lineHeight: 1.7, margin: "0 0 14px" }}>
                    {p.analysis}
                  </p>

                  {/* Tags */}
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    {p.tags.map(t => (
                      <span key={t} style={{
                        padding: "3px 10px",
                        borderRadius: 10,
                        background: "rgba(180,140,80,0.1)",
                        border: "1px solid rgba(180,140,80,0.25)",
                        color: "#c8a84c",
                        fontSize: 11,
                      }}>{t}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Expand hint */}
              <div style={{
                position: "absolute", bottom: 14, right: 14,
                fontSize: 14, color: isOpen ? "#b49c60" : "#4a4540",
                transition: "all 0.2s",
                transform: isOpen ? "rotate(180deg)" : "none"
              }}>▼</div>
            </div>
          );
        })}
      </div>

      {/* Legend Footer */}
      <div style={{
        borderTop: "1px solid rgba(180,140,80,0.15)",
        padding: "20px 32px",
        background: "rgba(0,0,0,0.2)",
        maxWidth: "100%"
      }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", gap: 24, flexWrap: "wrap" }}>
          {Object.entries(seasonColors).map(([s, c]) => (
            <span key={s} style={{ fontSize: 12, color: c, display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: c, display: "inline-block" }} />
              {s}
            </span>
          ))}
          <span style={{ fontSize: 12, color: "#5a5550", marginLeft: "auto" }}>
            Click any card to expand details
          </span>
        </div>
      </div>
    </div>
  );
}
