"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import ProductForm from "@/components/admin/ProductForm";
import type { Product } from "@/types";

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    fetch(`/api/admin/products/${id}`)
      .then((res) => res.json())
      .then((data) => setProduct(data))
      .catch(() => toast.error("Failed to load product"))
      .finally(() => setFetching(false));
  }, [id]);

  const handleSubmit = async (data: Record<string, unknown>) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to update");
      toast.success("Product updated successfully");
      router.push("/admin/products");
    } catch {
      toast.error("Failed to update product");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return <p className="py-12 text-center text-muted-foreground">Loading product...</p>;
  }

  if (!product) {
    return <p className="py-12 text-center text-red-400">Product not found</p>;
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/products">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="font-display text-3xl font-semibold">Edit Product</h1>
          <p className="text-muted-foreground">{product.name}</p>
        </div>
      </div>
      <ProductForm product={product} onSubmit={handleSubmit} isLoading={loading} />
    </div>
  );
}
