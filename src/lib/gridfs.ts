import mongoose from "mongoose";
import { GridFSBucket } from "mongodb";
import dbConnect from "./mongodb";

let bucket: GridFSBucket | null = null;

export async function getGridFSBucket(): Promise<GridFSBucket> {
  if (bucket) {
    return bucket;
  }

  await dbConnect();
  const db = mongoose.connection.db;

  if (!db) {
    throw new Error("Database connection not established");
  }

  bucket = new GridFSBucket(db, {
    bucketName: "perfume_images",
  });

  return bucket;
}

export async function deleteGridFSFile(id: string): Promise<void> {
  const b = await getGridFSBucket();
  const objectId = new mongoose.Types.ObjectId(id);
  try {
    await b.delete(objectId);
  } catch {
    // File may not exist — that's OK
  }
}
