import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Brand from "@/models/Brand";
import { z } from "zod";

const brandCreateSchema = z.object({
  name: z.string().min(1, "Brand name is required").max(100).trim(),
});

// GET /api/brands — search brands
export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const limit = Math.min(Math.max(parseInt(searchParams.get("limit") || "20", 10) || 20, 1), 50);

    const query: Record<string, unknown> = {};
    if (search) {
      query.name = { $regex: search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), $options: "i" };
    }

    const brands = await Brand.find(query)
      .collation({ locale: "en", strength: 2 })
      .sort({ name: 1 })
      .limit(limit);

    return NextResponse.json({ data: brands.map((b) => b.toJSON()) });
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("GET /api/brands error:", error);
    }
    return NextResponse.json({ error: "Failed to fetch brands" }, { status: 500 });
  }
}

// POST /api/brands — add a new brand (upsert)
export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const body = await req.json();
    const parsed = brandCreateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Invalid brand name" },
        { status: 400 }
      );
    }

    const brand = await Brand.findOneAndUpdate(
      { name: parsed.data.name },
      { $setOnInsert: { name: parsed.data.name } },
      { upsert: true, new: true, runValidators: true }
    );

    return NextResponse.json({ data: brand.toJSON(), message: "Brand saved" }, { status: 201 });
  } catch (error: any) {
    if (error?.code === 11000) {
      // Duplicate key - should not happen with upsert but just in case
      return NextResponse.json({ error: "Brand already exists" }, { status: 409 });
    }
    if (process.env.NODE_ENV !== "production") {
      console.error("POST /api/brands error:", error);
    }
    return NextResponse.json({ error: "Failed to save brand" }, { status: 500 });
  }
}
