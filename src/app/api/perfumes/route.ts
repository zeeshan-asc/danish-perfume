import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import dbConnect from "@/lib/mongodb";
import { withAuth, AuthenticatedRequest } from "@/lib/middleware";
import { getGridFSBucket, deleteGridFSFile } from "@/lib/gridfs";
import Perfume from "@/models/Perfume";
import Brand from "@/models/Brand";
import { perfumeCreateSchema } from "@/schemas/perfumeSchemas";
import { sanitizeString } from "@/lib/utils";

// GET /api/perfumes — list perfumes with search, filter, sort, paginate
async function handleGET(req: AuthenticatedRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const userId = req.userId;

    const query: Record<string, unknown> = { userId: new mongoose.Types.ObjectId(userId) };

    // Full-text search
    const search = searchParams.get("search");
    if (search) {
      query.$text = { $search: search };
    }

    // Filters
    const brand = searchParams.get("brand");
    if (brand) {
      query.brand = { $regex: `^${sanitizeString(brand)}$`, $options: "i" };
    }

    const status = searchParams.get("status");
    if (status && ["Owned", "Sold", "Wishlist"].includes(status)) {
      query.status = status;
    }

    const season = searchParams.get("season");
    if (season && ["Spring", "Summer", "Fall", "Winter"].includes(season)) {
      query.seasons = season;
    }

    const scentType = searchParams.get("scent_type");
    if (scentType) {
      query.scent_type = { $regex: sanitizeString(scentType), $options: "i" };
    }

    // Price range
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    if (minPrice || maxPrice) {
      query.purchase_price = {};
      if (minPrice) (query.purchase_price as Record<string, number>).$gte = parseFloat(minPrice);
      if (maxPrice) (query.purchase_price as Record<string, number>).$lte = parseFloat(maxPrice);
    }

    // Rating range
    const minRating = searchParams.get("minRating");
    const maxRating = searchParams.get("maxRating");
    if (minRating || maxRating) {
      query.rating = {};
      if (minRating) (query.rating as Record<string, number>).$gte = parseInt(minRating);
      if (maxRating) (query.rating as Record<string, number>).$lte = parseInt(maxRating);
    }

    // Sort
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") === "asc" ? 1 : -1;
    const allowedSortFields = ["createdAt", "name", "brand", "rating", "purchase_price"];
    const sortField = allowedSortFields.includes(sortBy) ? sortBy : "createdAt";
    const sort: Record<string, 1 | -1> = { [sortField]: sortOrder as 1 | -1 };

    // Pagination
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "20")));
    const skip = (page - 1) * limit;

    // Execute query
    const [perfumes, total] = await Promise.all([
      Perfume.find(query).sort(sort).skip(skip).limit(limit).lean(),
      Perfume.countDocuments(query),
    ]);

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      data: {
        perfumes,
        total,
        page,
        totalPages,
      },
    });
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("GET /api/perfumes error:", error);
    }
    return NextResponse.json(
      { error: "Failed to fetch perfumes" },
      { status: 500 }
    );
  }
}

// POST /api/perfumes — create a new perfume (with optional image)
async function handlePOST(req: AuthenticatedRequest) {
  try {
    await dbConnect();
    const userId = req.userId;

    let body: Record<string, unknown>;
    let imageFile: File | null = null;

    const contentType = req.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      imageFile = formData.get("image") as File | null;
      const jsonData = formData.get("data") as string;
      body = JSON.parse(jsonData);
    } else {
      body = await req.json();
    }

    // Validate
    const parsed = perfumeCreateSchema.safeParse(body);
    if (!parsed.success) {
      const fieldErrors: Record<string, string[]> = {};
      parsed.error.issues.forEach((issue) => {
        const field = issue.path.map(p => String(p)).join(".");
        if (!fieldErrors[field]) fieldErrors[field] = [];
        fieldErrors[field].push(issue.message);
      });
      return NextResponse.json(
        { error: "Validation failed", details: fieldErrors },
        { status: 400 }
      );
    }

    // Sanitize string fields
    const data = parsed.data;
    const sanitized = {
      ...data,
      name: sanitizeString(data.name),
      brand: sanitizeString(data.brand),
      inspired_by: sanitizeString(data.inspired_by || ""),
      notes: {
        top: sanitizeString(data.notes?.top || ""),
        heart: sanitizeString(data.notes?.heart || ""),
        base: sanitizeString(data.notes?.base || ""),
      },
      scent_type: sanitizeString(data.scent_type || ""),
      occasion: sanitizeString(data.occasion || ""),
      longevity: sanitizeString(data.longevity || ""),
      analysis: sanitizeString(data.analysis || ""),
    };

    // Auto-save brand to brand collection
    try {
      await Brand.findOneAndUpdate(
        { name: sanitized.brand },
        { $setOnInsert: { name: sanitized.brand } },
        { upsert: true, new: true }
      ).collation({ locale: "en", strength: 2 });
    } catch {
      // Silent fail — brand auto-save is non-critical
    }

    // Handle image upload
    let imageId: mongoose.Types.ObjectId | null = null;
    if (imageFile) {
      // Validate image
      const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
      if (!allowedTypes.includes(imageFile.type)) {
        return NextResponse.json(
          { error: "Invalid image type. Only JPEG, PNG, and WebP are allowed." },
          { status: 400 }
        );
      }
      if (imageFile.size > 4 * 1024 * 1024) {
        return NextResponse.json(
          { error: "Image must be less than 4MB" },
          { status: 413 }
        );
      }

      const bucket = await getGridFSBucket();
      const buffer = Buffer.from(await imageFile.arrayBuffer());
      const uploadStream = bucket.openUploadStream(imageFile.name || "perfume-image", {
        contentType: imageFile.type,
      } as any);

      await new Promise<void>((resolve, reject) => {
        const stream = uploadStream;
        stream.end(buffer);
        stream.on("finish", () => resolve());
        stream.on("error", reject);
      });

      imageId = uploadStream.id as mongoose.Types.ObjectId;
    }

    // Handle purchase_date
    let purchaseDate: Date | null = null;
    if (data.purchase_date) {
      const d = new Date(data.purchase_date);
      if (!isNaN(d.getTime())) {
        purchaseDate = d;
      }
    }

    // Create perfume
    const perfume = await Perfume.create({
      userId: new mongoose.Types.ObjectId(userId),
      ...sanitized,
      purchase_date: purchaseDate || undefined,
      imageId,
      // Ensure optional number fields are null if undefined
      rating: data.rating ?? undefined,
      purchase_price: data.purchase_price ?? undefined,
      size_ml: data.size_ml ?? undefined,
      sprays_remaining: data.sprays_remaining ?? undefined,
    });

    return NextResponse.json(
      {
        data: perfume.toJSON(),
        message: "Perfume added successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("POST /api/perfumes error:", error);
    }
    return NextResponse.json(
      { error: "Failed to create perfume" },
      { status: 500 }
    );
  }
}

export const GET = withAuth(handleGET);
export const POST = withAuth(handlePOST);
