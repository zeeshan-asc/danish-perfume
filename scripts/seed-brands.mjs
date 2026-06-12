// Seed script for brand collection
// Usage: node scripts/seed-brands.mjs
// Requires MONGODB_URI env var

import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error("❌ MONGODB_URI environment variable is required");
  process.exit(1);
}

const brandSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
}, { timestamps: true });

brandSchema.index({ name: 1 }, { collation: { locale: "en", strength: 2 }, unique: true });

const Brand = mongoose.model("Brand", brandSchema);

const seedBrands = [
  // === MIDDLE EASTERN ===
  "Lattafa", "Armaf", "Rasasi", "Ajmal", "Swiss Arabian",
  "Al Haramain", "Al Rehab", "Milton-Lloyd", "Afnan", "Maison Alhambra",
  "Paris Corner", "Fragrance World", "Emir", "Franck Olivier", "Oud 24 Hours",
  "Al Wataniah", "Ameer Al Oudh", "Al Naseem", "Abdul Samad Al Qurashi", "Arabian Oud",
  "Amouage", "Initio Parfums Privés", "Xerjoff", "Memo Paris", "Roja Dove",
  "Nishane", "Byredo", "Bortnikoff", "Areej Le Doré", "Sultan Pasha Attars",
  "Shaikha", "Al Majed Oud", "Anfas", "Ojar", "Ajanta",
  "Al Sharqiah", "Al Fares", "Bakhoor Al Khaleej", "Al Qasmi", "Al Shams",

  // === PAKISTANI ===
  "J.", "Scentsation", "S. & Co.", "Bonanza Satrangi", "Sapphire",
  "Limelight", "Crescent", "Splash by S. & Co.", "S. & Co. Men", "Bareeze",
  "Khaadi", "Al Karam", "Edenrobe", "Gulahmed", "Firdous",
  "ChenOne", "Generation", "Nishat Linen", "Outfitters", "Teenage",
  "Mushq", "Ishq", "Suffuse", "Scents n Stories", "Punjab Perfumes",
  "Pak Perfumes", "Al-Nabeel", "Al-Mustafa Perfumes", "Ibn-e-Safi", "Attar Bazaar",
  "Itr-e-Naqvi", "Scent & Style", "Fogg (Pakistan)", "Dunhill (Pakistan Edition)", "Boss fragrance (Pakistani variant)",

  // === INTERNATIONAL ===
  "Dior", "Chanel", "Louis Vuitton", "Gucci", "Yves Saint Laurent",
  "Tom Ford", "Creed", "Maison Francis Kurkdjian", "Kilian Paris", "Jo Malone London",
  "Diptyque", "Le Labo", "Prada", "Valentino", "Versace",
  "Dolce & Gabbana", "Giorgio Armani", "Bvlgari", "Burberry", "Givenchy",
  "Paco Rabanne", "Jean Paul Gaultier", "Viktor & Rolf", "Calvin Klein", "Hugo Boss",
  "Ralph Lauren", "Carolina Herrera", "Marc Jacobs", "Tiffany & Co.", "Tous",
  "Bentley", "Ferrari", "Montblanc", "Salvatore Ferragamo", "Coach",
  "Michael Kors", "Jimmy Choo", "Acqua di Parma", "Clive Christian", "Boadicea the Victorious",
  "Electimuss London", "Roja Parfums", "Tiziana Terenzi", "Profumum Roma", "Mancera",
  "Montale", "Parfums de Marly", "Merchant of Venice", "Carner Barcelona", "Etat Libre d'Orange",
  "L'Artisan Parfumeur", "Serge Lutens", "Guerlain", "Hermès", "Cartier",
  "Chopard", "Boucheron", "Lalique", "Molinard", "Thierry Mugler",
  "Nina Ricci", "Cacharel", "Laura Mercier", "Elizabeth Arden", "Estée Lauder",
  "Clinique", "Tommy Hilfiger", "Abercrombie & Fitch", "Hollister", "Ariana Grande",
  "Britney Spears", "Rihanna", "Kylie Jenner", "Davidoff", "Azzaro",
  "Nautica", "Police", "Benetton", "Adidas", "Replay",
  "Swiss Army", "Swiss Arabian",
];

async function main() {
  console.log("🌱 Connecting to MongoDB...");
  await mongoose.connect(MONGODB_URI, { dbName: "perfume_tracker" });
  console.log("✅ Connected. Seeding brands...");

  let inserted = 0;
  let skipped = 0;

  for (const name of seedBrands) {
    try {
      const result = await Brand.findOneAndUpdate(
        { name },
        { $setOnInsert: { name } },
        { upsert: true, new: true, collation: { locale: "en", strength: 2 } }
      );
      // Check if it was an upsert (insert) vs update
      if (result.createdAt && result.createdAt.getTime() === result.updatedAt?.getTime()) {
        inserted++;
        process.stdout.write(".");
      } else {
        skipped++;
        process.stdout.write("s");
      }
    } catch (err) {
      if (err.code === 11000) {
        skipped++;
        process.stdout.write("s");
      } else {
        console.error(`\n❌ Failed to seed brand "${name}":`, err.message);
      }
    }
  }

  const total = await Brand.countDocuments();
  console.log(`\n✅ Done! Inserted: ${inserted}, Skipped: ${skipped}, Total brands: ${total}`);
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error("❌ Script failed:", err);
  process.exit(1);
});
