import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { getGridFSBucket } from "@/lib/gridfs";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Image not found" }, { status: 404 });
    }

    const bucket = await getGridFSBucket();
    const objectId = new mongoose.Types.ObjectId(id);

    // Find file metadata
    const files = await bucket.find({ _id: objectId }).toArray();

    if (files.length === 0) {
      return NextResponse.json({ error: "Image not found" }, { status: 404 });
    }

    const file = files[0];
    const downloadStream = bucket.openDownloadStream(objectId);

    // Convert stream to buffer
    const chunks: Buffer[] = [];
    for await (const chunk of downloadStream) {
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
    }
    const buffer = Buffer.concat(chunks);

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": (file as any).contentType || "image/jpeg",
        "Content-Length": file.length.toString(),
        "Cache-Control": "public, max-age=31536000, immutable",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("GET /api/images/[id] error:", error);
    }
    return NextResponse.json({ error: "Failed to fetch image" }, { status: 500 });
  }
}
