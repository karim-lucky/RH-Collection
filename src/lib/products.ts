import { connectDB } from "./mongodb";
import { Product } from "@/models/Product";
import { demoProducts } from "./demo-data";
import type { Product as ProductType } from "@/types";

export async function getProducts(filters?: {
  brand?: string;
  category?: string;
  gender?: string;
  strapType?: string;
  color?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  bestSeller?: boolean;
  newArrival?: boolean;
  featured?: boolean;
  search?: string;
  sort?: string;
  page?: number;
  limit?: number;
}): Promise<{ products: ProductType[]; total: number }> {
  try {
    await connectDB();
    const query: Record<string, unknown> = {};

    if (filters?.brand) query.brand = filters.brand;
    if (filters?.category) query.category = filters.category;
    if (filters?.gender) query.gender = filters.gender;
    if (filters?.strapType) query.strapType = filters.strapType;
    if (filters?.color) query.color = filters.color;
    if (filters?.bestSeller) query.bestSeller = true;
    if (filters?.newArrival) query.newArrival = true;
    if (filters?.featured) query.featured = true;
    if (filters?.inStock) query.stock = { $gt: 0 };
    if (filters?.minPrice || filters?.maxPrice) {
      query.price = {};
      if (filters.minPrice) (query.price as Record<string, number>).$gte = filters.minPrice;
      if (filters.maxPrice) (query.price as Record<string, number>).$lte = filters.maxPrice;
    }
    if (filters?.search) {
      query.$text = { $search: filters.search };
    }

    let sort: Record<string, 1 | -1> = { createdAt: -1 };
    if (filters?.sort === "price-asc") sort = { price: 1 };
    if (filters?.sort === "price-desc") sort = { price: -1 };
    if (filters?.sort === "best-selling") sort = { reviewCount: -1 };

    const page = filters?.page || 1;
    const limit = filters?.limit || 12;
    const skip = (page - 1) * limit;

    const [products, total] = await Promise.all([
      Product.find(query).sort(sort).skip(skip).limit(limit).lean(),
      Product.countDocuments(query),
    ]);

    return {
      products: JSON.parse(JSON.stringify(products)),
      total,
    };
  } catch {
    let filtered = [...demoProducts];

    if (filters?.brand) filtered = filtered.filter((p) => p.brand === filters.brand);
    if (filters?.category) filtered = filtered.filter((p) => p.category === filters.category);
    if (filters?.gender) filtered = filtered.filter((p) => p.gender === filters.gender);
    if (filters?.strapType) filtered = filtered.filter((p) => p.strapType === filters.strapType);
    if (filters?.color) filtered = filtered.filter((p) => p.color === filters.color);
    if (filters?.bestSeller) filtered = filtered.filter((p) => p.bestSeller);
    if (filters?.newArrival) filtered = filtered.filter((p) => p.newArrival);
    if (filters?.featured) filtered = filtered.filter((p) => p.featured);
    if (filters?.inStock) filtered = filtered.filter((p) => p.stock > 0);
    if (filters?.minPrice) filtered = filtered.filter((p) => p.price >= filters.minPrice!);
    if (filters?.maxPrice) filtered = filtered.filter((p) => p.price <= filters.maxPrice!);
    if (filters?.search) {
      const s = filters.search.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(s) ||
          p.brand.toLowerCase().includes(s) ||
          p.description.toLowerCase().includes(s)
      );
    }

    if (filters?.sort === "price-asc") filtered.sort((a, b) => a.price - b.price);
    if (filters?.sort === "price-desc") filtered.sort((a, b) => b.price - a.price);
    if (filters?.sort === "best-selling") filtered.sort((a, b) => b.reviewCount - a.reviewCount);

    const page = filters?.page || 1;
    const limit = filters?.limit || 12;
    const start = (page - 1) * limit;

    return {
      products: filtered.slice(start, start + limit),
      total: filtered.length,
    };
  }
}

export async function getProductBySlug(slug: string): Promise<ProductType | null> {
  try {
    await connectDB();
    const product = await Product.findOne({ slug }).lean();
    return product ? JSON.parse(JSON.stringify(product)) : null;
  } catch {
    return demoProducts.find((p) => p.slug === slug) || null;
  }
}

export async function getProductById(id: string): Promise<ProductType | null> {
  try {
    await connectDB();
    const product = await Product.findById(id).lean();
    return product ? JSON.parse(JSON.stringify(product)) : null;
  } catch {
    return demoProducts.find((p) => p._id === id) || null;
  }
}

export async function getBrands(): Promise<string[]> {
  try {
    await connectDB();
    return Product.distinct("brand");
  } catch {
    return [...new Set(demoProducts.map((p) => p.brand))];
  }
}
