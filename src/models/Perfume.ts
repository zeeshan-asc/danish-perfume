import mongoose, { Schema, Document, Model } from "mongoose";
import { Season, PerfumeStatus } from "@/types";

export interface IPerfume extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  name: string;
  brand: string;
  inspired_by: string;
  notes: {
    top: string;
    heart: string;
    base: string;
  };
  scent_type: string;
  seasons: Season[];
  occasion: string;
  longevity: string;
  analysis: string;
  tags: string[];
  rating: number;
  purchase_price: number;
  purchase_date: Date;
  size_ml: number;
  sprays_remaining: number;
  status: PerfumeStatus;
  imageId: mongoose.Types.ObjectId | null;
  createdAt: Date;
  updatedAt: Date;
}

const perfumeSchema = new Schema<IPerfume>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [1, "Name is required"],
      maxlength: [100, "Name must be at most 100 characters"],
    },
    brand: {
      type: String,
      required: [true, "Brand is required"],
      trim: true,
      minlength: [1, "Brand is required"],
      maxlength: [100, "Brand must be at most 100 characters"],
    },
    inspired_by: {
      type: String,
      trim: true,
      maxlength: [200, "Inspired by must be at most 200 characters"],
      default: "",
    },
    notes: {
      top: { type: String, trim: true, maxlength: 500, default: "" },
      heart: { type: String, trim: true, maxlength: 500, default: "" },
      base: { type: String, trim: true, maxlength: 500, default: "" },
    },
    scent_type: {
      type: String,
      trim: true,
      maxlength: [100, "Scent type must be at most 100 characters"],
      default: "",
    },
    seasons: {
      type: [String],
      enum: ["Spring", "Summer", "Fall", "Winter"],
      validate: {
        validator: (v: string[]) => v.length <= 4,
        message: "Cannot have more than 4 seasons",
      },
      default: [],
    },
    occasion: {
      type: String,
      trim: true,
      maxlength: [100, "Occasion must be at most 100 characters"],
      default: "",
    },
    longevity: {
      type: String,
      trim: true,
      maxlength: [200, "Longevity must be at most 200 characters"],
      default: "",
    },
    analysis: {
      type: String,
      trim: true,
      maxlength: [2000, "Analysis must be at most 2000 characters"],
      default: "",
    },
    tags: {
      type: [String],
      validate: {
        validator: (v: string[]) => v.length <= 10,
        message: "Cannot have more than 10 tags",
      },
      default: [],
    },
    rating: {
      type: Number,
      min: [1, "Rating must be at least 1"],
      max: [10, "Rating must be at most 10"],
      default: null,
    },
    purchase_price: {
      type: Number,
      min: [0, "Price cannot be negative"],
      default: null,
    },
    purchase_date: {
      type: Date,
      default: null,
    },
    size_ml: {
      type: Number,
      min: [0, "Size cannot be negative"],
      default: null,
    },
    sprays_remaining: {
      type: Number,
      min: [0, "Sprays remaining cannot be negative"],
      default: null,
    },
    status: {
      type: String,
      enum: ["Owned", "Sold", "Wishlist"],
      default: "Owned",
    },
    imageId: {
      type: Schema.Types.ObjectId,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
perfumeSchema.index({ userId: 1, brand: 1 });
perfumeSchema.index({ userId: 1, status: 1 });

// Text index for search
perfumeSchema.index(
  { name: "text", brand: "text", tags: "text", analysis: "text" },
  { weights: { name: 10, brand: 5, tags: 3, analysis: 1 } }
);

// Transform output
perfumeSchema.set("toJSON", {
  transform: (_doc: unknown, ret: any) => {
    ret.id = String(ret._id);
    delete ret._id;
    delete ret.__v;
    if (ret.imageId) {
      ret.imageId = String(ret.imageId);
    }
    return ret;
  },
});

const Perfume: Model<IPerfume> =
  mongoose.models.Perfume || mongoose.model<IPerfume>("Perfume", perfumeSchema);

export default Perfume;
