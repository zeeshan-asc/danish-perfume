import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import dbConnect from "@/lib/mongodb";
import { withAuth, AuthenticatedRequest } from "@/lib/middleware";
import { getGridFSBucket, deleteGridFSFile } from "@/lib/gridfs";
import Perfume from "@/models/Perfume";
import { perfumeUpdateSchema } from "@/schemas/perfumeSchemas";
import { sanitizeString } from "@/lib/utils";

// GET /api/perfumes/[id]
async function handleGET(
  req: AuthenticatedRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;
    const userId = req.userId;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Perfume not found" }, { status: 404 });
    }

    const perfume = await Perfume.findOne({
      _id: new mongoose.Types.ObjectId(id),
      userId: new mongoose.Types.ObjectId(userId),
    });

    if (!perfume) {
      return NextResponse.json({ error: "Perfume not found" }, { status: 404 });
    }

    return NextResponse.json({ data: perfume.toJSON() });
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("GET /api/perfumes/[id] error:", error);
    }
    return NextResponse.json({ error: "Failed to fetch perfume" }, { status: 500 });
  }
}

// PUT /api/perfumes/[id]
async function handlePUT(
  req: AuthenticatedRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;
    const userId = req.userId;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Perfume not found" }, { status: 404 });
    }

    // Find existing perfume
    const existing = await Perfume.findOne({
      _id: new mongoose.Types.ObjectId(id),
      userId: new mongoose.Types.ObjectId(userId),
    });

    if (!existing) {
      return NextResponse.json({ error: "Perfume not found" }, { status: 404 });
    }

    let body: Record<string, unknown>;
    let imageFile: File | null = null;
    let removeImage = false;

    const contentType = req.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      imageFile = formData.get("image") as File | null;
      removeImage = formData.get("removeImage") === "true";
      const jsonData = formData.get("data") as string;
      body = JSON.parse(jsonData);
    } else {
      body = await req.json();
    }

    // Validate
    const parsed = perfumeUpdateSchema.safeParse(body);
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

    const updateData: Record<string, unknown> = {};

    // Sanitize string fields
    if (parsed.data.name !== undefined) updateData.name = sanitizeString(parsed.data.name);
    if (parsed.data.brand !== undefined) updateData.brand = sanitizeString(parsed.data.brand);
    if (parsed.data.inspired_by !== undefined) updateData.inspired_by = sanitizeString(parsed.data.inspired_by);
    if (parsed.data.notes !== undefined) {
      updateData.notes = {
        top: sanitizeString(parsed.data.notes.top || ""),
        heart: sanitizeString(parsed.data.notes.heart || ""),
        base: sanitizeString(parsed.data.notes.base || ""),
      };
    }
    if (parsed.data.scent_type !== undefined) updateData.scent_type = sanitizeString(parsed.data.scent_type);
    if (parsed.data.occasion !== undefined) updateData.occasion = sanitizeString(parsed.data.occasion);
    if (parsed.data.longevity !== undefined) updateData.longevity = sanitizeString(parsed.data.longevity);
    if (parsed.data.analysis !== undefined) updateData.analysis = sanitizeString(parsed.data.analysis);

    // Other fields
    if (parsed.data.seasons !== undefined) updateData.seasons = parsed.data.seasons;
    if (parsed.data.tags !== undefined) updateData.tags = parsed.data.tags.map((t: string) => sanitizeString(t));
    if (parsed.data.rating !== undefined) updateData.rating = parsed.data.rating;
    if (parsed.data.purchase_price !== undefined) updateData.purchase_price = parsed.data.purchase_price;
    if (parsed.data.size_ml !== undefined) updateData.size_ml = parsed.data.size_ml;
    if (parsed.data.sprays_remaining !== undefined) updateData.sprays_remaining = parsed.data.sprays_remaining;
    if (parsed.data.status !== undefined) updateData.status = parsed.data.status;
    if (parsed.data.purchase_date !== undefined) {
      if (parsed.data.purchase_date) {
        const d = new Date(parsed.data.purchase_date);
        if (!isNaN(d.getTime())) updateData.purchase_date = d;
      } else {
        updateData.purchase_date = null;
      }
    }

    // Handle image
    if (removeImage) {
      // Delete old image
      if (existing.imageId) {
        await deleteGridFSFile(existing.imageId.toString());
      }
      updateData.imageId = null;
    } else if (imageFile) {
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

      // Delete old image
      if (existing.imageId) {
        await deleteGridFSFile(existing.imageId.toString());
      }

      // Upload new image
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

      updateData.imageId = uploadStream.id;
    }

    // Update perfume
    const updated = await Perfume.findOneAndUpdate(
      { _id: new mongoose.Types.ObjectId(id), userId: new mongoose.Types.ObjectId(userId) },
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return NextResponse.json({ error: "Perfume not found" }, { status: 404 });
    }

    return NextResponse.json({
      data: updated.toJSON(),
      message: "Perfume updated successfully",
    });
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("PUT /api/perfumes/[id] error:", error);
    }
    return NextResponse.json({ error: "Failed to update perfume" }, { status: 500 });
  }
}

// DELETE /api/perfumes/[id]
async function handleDELETE(
  req: AuthenticatedRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;
    const userId = req.userId;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Perfume not found" }, { status: 404 });
    }

    const perfume = await Perfume.findOne({
      _id: new mongoose.Types.ObjectId(id),
      userId: new mongoose.Types.ObjectId(userId),
    });

    if (!perfume) {
      return NextResponse.json({ error: "Perfume not found" }, { status: 404 });
    }

    // Delete GridFS image if exists
    if (perfume.imageId) {
      await deleteGridFSFile(perfume.imageId.toString());
    }

    await Perfume.deleteOne({ _id: perfume._id });

    return NextResponse.json({
      message: "Perfume deleted successfully",
    });
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("DELETE /api/perfumes/[id] error:", error);
    }
    return NextResponse.json({ error: "Failed to delete perfume" }, { status: 500 });
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const GET = withAuth(handleGET as any);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const PUT = withAuth(handlePUT as any);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const DELETE = withAuth(handleDELETE as any);
