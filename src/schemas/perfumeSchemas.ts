import { z } from "zod";

const seasonEnum = z.enum(["Spring", "Summer", "Fall", "Winter"]);
const statusEnum = z.enum(["Owned", "Sold", "Wishlist"]);

export const perfumeCreateSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name must be at most 100 characters").trim(),
  brand: z.string().min(1, "Brand is required").max(100, "Brand must be at most 100 characters").trim(),
  inspired_by: z.string().max(200).trim().optional().default(""),
  notes: z.object({
    top: z.string().max(500).trim().optional().default(""),
    heart: z.string().max(500).trim().optional().default(""),
    base: z.string().max(500).trim().optional().default(""),
  }).optional().default({ top: "", heart: "", base: "" }),
  scent_type: z.string().max(100).trim().optional().default(""),
  seasons: z.array(seasonEnum).max(4, "Cannot have more than 4 seasons").optional().default([]),
  occasion: z.string().max(100).trim().optional().default(""),
  longevity: z.string().max(200).trim().optional().default(""),
  analysis: z.string().max(2000).trim().optional().default(""),
  tags: z
    .array(z.string().max(50).trim())
    .max(10, "Cannot have more than 10 tags")
    .default([]),
  rating: z.number().min(1, "Rating must be at least 1").max(10, "Rating must be at most 10").optional().nullable(),
  purchase_price: z.number().min(0, "Price cannot be negative").optional().nullable(),
  purchase_date: z.string().optional().nullable(),
  size_ml: z.number().int().min(0, "Size cannot be negative").optional().nullable(),
  sprays_remaining: z.number().int().min(0, "Sprays cannot be negative").optional().nullable(),
  status: statusEnum.default("Owned"),
});

export const perfumeUpdateSchema = perfumeCreateSchema.partial();

export type PerfumeCreateInput = z.infer<typeof perfumeCreateSchema>;
export type PerfumeUpdateInput = z.infer<typeof perfumeUpdateSchema>;
