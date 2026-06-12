// Shared TypeScript interfaces for the Perfume Collection Tracker

export interface IBrand {
  _id: string;
  id: string;
  name: string;
  createdAt: string;
}

export interface IUser {
  _id: string;
  id: string;
  username: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface IUserDocument {
  _id: string;
  username: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidate: string): Promise<boolean>;
}

export interface INotes {
  top: string;
  heart: string;
  base: string;
}

export type PerfumeStatus = "Owned" | "Sold" | "Wishlist";
export type Season = "Spring" | "Summer" | "Fall" | "Winter";

export interface IPerfume {
  _id: string;
  id: string;
  userId: string;
  name: string;
  brand: string;
  inspired_by: string;
  notes: INotes;
  scent_type: string;
  seasons: Season[];
  occasion: string;
  longevity: string;
  analysis: string;
  tags: string[];
  rating: number;
  purchase_price: number;
  purchase_date: string;
  size_ml: number;
  sprays_remaining: number;
  status: PerfumeStatus;
  imageId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface IPerfumeFormData {
  name: string;
  brand: string;
  inspired_by?: string;
  notes: {
    top: string;
    heart: string;
    base: string;
  };
  scent_type?: string;
  seasons: Season[];
  occasion?: string;
  longevity?: string;
  analysis?: string;
  tags: string[];
  rating?: number | null;
  purchase_price?: number | null;
  purchase_date?: string | null;
  size_ml?: number | null;
  sprays_remaining?: number | null;
  status: PerfumeStatus;
  image?: File;
}

export interface IApiResponse<T = unknown> {
  data?: T;
  message?: string;
  error?: string;
  field?: string;
  details?: Record<string, string[]>;
}

export interface IAuthResponse {
  user: {
    id: string;
    username: string;
    email: string;
  };
  message?: string;
}

export interface IPaginatedResponse<T> {
  perfumes: T[];
  total: number;
  page: number;
  totalPages: number;
}

export interface IDashboardStats {
  totalPerfumes: number;
  totalOwned: number;
  totalWishlist: number;
  totalSold: number;
  totalValue: number;
  avgRating: number;
  topBrand: { brand: string; count: number };
  mostExpensive: IPerfume | null;
  highestRated: IPerfume | null;
  recentAdditions: IPerfume[];
  brandDistribution: { brand: string; count: number }[];
  seasonDistribution: { season: Season; count: number; percentage: number }[];
  scentTypeDistribution: { type: string; count: number }[];
  collectionGrowth: { month: string; count: number }[];
}

export type ToastType = "success" | "error" | "info";

export interface IToast {
  id: string;
  type: ToastType;
  message: string;
}

declare global {
  // eslint-disable-next-line no-var
  var mongooseConnection: {
    conn: typeof import("mongoose") | null;
    promise: Promise<typeof import("mongoose")> | null;
  };
}
