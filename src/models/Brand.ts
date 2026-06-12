import mongoose, { Schema, Document, Model } from "mongoose";

export interface IBrandDocument extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
}

const brandSchema = new Schema<IBrandDocument>(
  {
    name: {
      type: String,
      required: [true, "Brand name is required"],
      trim: true,
      unique: true,
      minlength: [1, "Brand name is required"],
      maxlength: [100, "Brand name must be at most 100 characters"],
    },
  },
  { timestamps: true }
);

// Case-insensitive unique index
brandSchema.index(
  { name: 1 },
  { unique: true, collation: { locale: "en", strength: 2 } }
);

brandSchema.set("toJSON", {
  transform: (_doc: unknown, ret: any) => {
    ret.id = String(ret._id);
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

const Brand: Model<IBrandDocument> =
  mongoose.models.Brand || mongoose.model<IBrandDocument>("Brand", brandSchema);

export default Brand;
