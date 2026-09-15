"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Product } from "@/types";

const productSchema = z.object({
  name: z.string().min(2, "Name is required"),
  slug: z.string().optional(),
  sku: z.string().min(2, "SKU is required"),
  brand: z.string().min(1, "Brand is required"),
  category: z.enum(["dress", "sport", "diver", "chronograph", "smart", "luxury"]),
  gender: z.enum(["men", "women", "unisex"]),
  strapType: z.enum(["leather", "metal", "rubber", "nylon", "ceramic"]),
  color: z.string().min(1, "Color is required"),
  description: z.string().min(10, "Description is required"),
  price: z.coerce.number().min(1, "Price is required"),
  discountPrice: z.coerce.number().optional(),
  stock: z.coerce.number().min(0),
  images: z.string().min(1, "At least one image URL is required"),
  featured: z.boolean(),
  bestSeller: z.boolean(),
  newArrival: z.boolean(),
  movement: z.string().optional(),
  caseSize: z.string().optional(),
  caseMaterial: z.string().optional(),
  waterResistance: z.string().optional(),
  dialColor: z.string().optional(),
  crystal: z.string().optional(),
  warranty: z.string().optional(),
});

export type ProductFormValues = z.infer<typeof productSchema>;

interface ProductFormProps {
  product?: Product;
  onSubmit: (data: Record<string, unknown>) => Promise<void>;
  isLoading?: boolean;
}

function toFormValues(product?: Product): ProductFormValues {
  if (!product) {
    return {
      name: "",
      slug: "",
      sku: "",
      brand: "Rehmat",
      category: "luxury",
      gender: "unisex",
      strapType: "metal",
      color: "",
      description: "",
      price: 0,
      discountPrice: undefined,
      stock: 0,
      images: "",
      featured: false,
      bestSeller: false,
      newArrival: false,
      movement: "",
      caseSize: "",
      caseMaterial: "",
      waterResistance: "",
      dialColor: "",
      crystal: "",
      warranty: "",
    };
  }

  return {
    name: product.name,
    slug: product.slug,
    sku: product.sku,
    brand: product.brand,
    category: product.category,
    gender: product.gender,
    strapType: product.strapType,
    color: product.color,
    description: product.description,
    price: product.price,
    discountPrice: product.discountPrice,
    stock: product.stock,
    images: product.images.join("\n"),
    featured: product.featured,
    bestSeller: product.bestSeller,
    newArrival: product.newArrival,
    movement: product.specifications.movement || "",
    caseSize: product.specifications.caseSize || "",
    caseMaterial: product.specifications.caseMaterial || "",
    waterResistance: product.specifications.waterResistance || "",
    dialColor: product.specifications.dialColor || "",
    crystal: product.specifications.crystal || "",
    warranty: product.specifications.warranty || "",
  };
}

export default function ProductForm({ product, onSubmit, isLoading }: ProductFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: toFormValues(product),
  });

  const featured = watch("featured");
  const bestSeller = watch("bestSeller");
  const newArrival = watch("newArrival");

  const handleFormSubmit = async (values: ProductFormValues) => {
    const payload = {
      name: values.name,
      slug: values.slug || undefined,
      sku: values.sku,
      brand: values.brand,
      category: values.category,
      gender: values.gender,
      strapType: values.strapType,
      color: values.color,
      description: values.description,
      price: values.price,
      discountPrice: values.discountPrice || undefined,
      stock: values.stock,
      images: values.images.split("\n").map((s) => s.trim()).filter(Boolean),
      featured: values.featured,
      bestSeller: values.bestSeller,
      newArrival: values.newArrival,
      specifications: {
        movement: values.movement,
        caseSize: values.caseSize,
        caseMaterial: values.caseMaterial,
        waterResistance: values.waterResistance,
        dialColor: values.dialColor,
        crystal: values.crystal,
        warranty: values.warranty,
      },
    };
    await onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <Card className="luxury-border">
        <CardHeader>
          <CardTitle className="font-display">Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="name">Product Name</Label>
            <Input id="name" {...register("name")} placeholder="Royal Chronograph Gold" />
            {errors.name && <p className="text-xs text-red-400">{errors.name.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="sku">SKU</Label>
            <Input id="sku" {...register("sku")} placeholder="RW-RCG-001" />
            {errors.sku && <p className="text-xs text-red-400">{errors.sku.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="slug">Slug (optional)</Label>
            <Input id="slug" {...register("slug")} placeholder="royal-chronograph-gold" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="brand">Brand</Label>
            <Input id="brand" {...register("brand")} />
          </div>
          <div className="space-y-2">
            <Label>Category</Label>
            <Select
              defaultValue={watch("category")}
              onValueChange={(v) => setValue("category", v as ProductFormValues["category"])}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {["dress", "sport", "diver", "chronograph", "smart", "luxury"].map((c) => (
                  <SelectItem key={c} value={c}>
                    {c.charAt(0).toUpperCase() + c.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Gender</Label>
            <Select
              defaultValue={watch("gender")}
              onValueChange={(v) => setValue("gender", v as ProductFormValues["gender"])}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {["men", "women", "unisex"].map((g) => (
                  <SelectItem key={g} value={g}>
                    {g.charAt(0).toUpperCase() + g.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Strap Type</Label>
            <Select
              defaultValue={watch("strapType")}
              onValueChange={(v) => setValue("strapType", v as ProductFormValues["strapType"])}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {["leather", "metal", "rubber", "nylon", "ceramic"].map((s) => (
                  <SelectItem key={s} value={s}>
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="color">Color</Label>
            <Input id="color" {...register("color")} placeholder="Gold" />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" {...register("description")} rows={4} />
            {errors.description && (
              <p className="text-xs text-red-400">{errors.description.message}</p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="luxury-border">
        <CardHeader>
          <CardTitle className="font-display">Pricing & Stock</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="price">Price</Label>
            <Input id="price" type="number" {...register("price")} />
            {errors.price && <p className="text-xs text-red-400">{errors.price.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="discountPrice">Discount Price</Label>
            <Input id="discountPrice" type="number" {...register("discountPrice")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="stock">Stock</Label>
            <Input id="stock" type="number" {...register("stock")} />
          </div>
        </CardContent>
      </Card>

      <Card className="luxury-border">
        <CardHeader>
          <CardTitle className="font-display">Specifications</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="movement">Movement</Label>
            <Input id="movement" {...register("movement")} placeholder="Swiss Automatic" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="caseSize">Case Size</Label>
            <Input id="caseSize" {...register("caseSize")} placeholder="42mm" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="caseMaterial">Case Material</Label>
            <Input id="caseMaterial" {...register("caseMaterial")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="waterResistance">Water Resistance</Label>
            <Input id="waterResistance" {...register("waterResistance")} placeholder="100m" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="dialColor">Dial Color</Label>
            <Input id="dialColor" {...register("dialColor")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="crystal">Crystal</Label>
            <Input id="crystal" {...register("crystal")} placeholder="Sapphire" />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="warranty">Warranty</Label>
            <Input id="warranty" {...register("warranty")} placeholder="2 Years International" />
          </div>
        </CardContent>
      </Card>

      <Card className="luxury-border">
        <CardHeader>
          <CardTitle className="font-display">Images & Flags</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="images">Image URLs (one per line)</Label>
            <Textarea
              id="images"
              {...register("images")}
              rows={3}
              placeholder="https://images.unsplash.com/..."
            />
            {errors.images && <p className="text-xs text-red-400">{errors.images.message}</p>}
          </div>
          <div className="flex flex-wrap gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <Checkbox
                checked={featured}
                onCheckedChange={(v) => setValue("featured", !!v)}
              />
              <span className="text-sm">Featured</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <Checkbox
                checked={bestSeller}
                onCheckedChange={(v) => setValue("bestSeller", !!v)}
              />
              <span className="text-sm">Best Seller</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <Checkbox
                checked={newArrival}
                onCheckedChange={(v) => setValue("newArrival", !!v)}
              />
              <span className="text-sm">New Arrival</span>
            </label>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <Button type="submit" variant="luxury" disabled={isLoading}>
          {isLoading ? "Saving..." : product ? "Update Product" : "Create Product"}
        </Button>
      </div>
    </form>
  );
}
