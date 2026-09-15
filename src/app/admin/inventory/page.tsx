"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AlertTriangle, Package } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatPrice } from "@/lib/utils";

const LOW_STOCK_THRESHOLD = 10;

interface InventoryItem {
  _id: string;
  name: string;
  sku: string;
  brand: string;
  stock: number;
  price: number;
  images: string[];
}

export default function AdminInventoryPage() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editStock, setEditStock] = useState(0);

  const fetchInventory = () => {
    fetch("/api/admin/inventory")
      .then((res) => res.json())
      .then(setItems)
      .catch(() => toast.error("Failed to load inventory"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const lowStockItems = items.filter((i) => i.stock <= LOW_STOCK_THRESHOLD);
  const outOfStock = items.filter((i) => i.stock === 0);

  const startEdit = (item: InventoryItem) => {
    setEditingId(item._id);
    setEditStock(item.stock);
  };

  const saveStock = async (productId: string) => {
    try {
      const res = await fetch("/api/admin/inventory", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, stock: editStock }),
      });
      if (!res.ok) throw new Error();
      const updated = await res.json();
      setItems((prev) =>
        prev.map((i) => (i._id === productId ? { ...i, stock: updated.stock } : i))
      );
      setEditingId(null);
      toast.success("Stock updated");
    } catch {
      toast.error("Failed to update stock");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-semibold">Inventory</h1>
        <p className="text-muted-foreground">Track stock levels and low stock alerts</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="luxury-border">
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gold/10">
              <Package className="h-6 w-6 text-gold" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total SKUs</p>
              <p className="font-display text-2xl font-semibold">{items.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="luxury-border border-amber-500/30">
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10">
              <AlertTriangle className="h-6 w-6 text-amber-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Low Stock</p>
              <p className="font-display text-2xl font-semibold text-amber-400">
                {lowStockItems.length}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="luxury-border border-red-500/30">
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-500/10">
              <AlertTriangle className="h-6 w-6 text-red-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Out of Stock</p>
              <p className="font-display text-2xl font-semibold text-red-400">
                {outOfStock.length}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {lowStockItems.length > 0 && (
        <Card className="luxury-border border-amber-500/20 bg-amber-500/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-display text-lg text-amber-400">
              <AlertTriangle className="h-5 w-5" />
              Low Stock Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {lowStockItems.map((item) => (
                <Badge key={item._id} variant="outline" className="border-amber-500/50 text-amber-400">
                  {item.name}: {item.stock} left
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="luxury-border">
        <CardHeader>
          <CardTitle className="font-display text-lg">Stock Levels</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="py-8 text-center text-muted-foreground">Loading inventory...</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead>Brand</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Update</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items
                  .sort((a, b) => a.stock - b.stock)
                  .map((item) => (
                    <TableRow key={item._id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="relative h-10 w-10 overflow-hidden rounded-lg bg-muted">
                            {item.images[0] && (
                              <Image
                                src={item.images[0]}
                                alt={item.name}
                                fill
                                className="object-cover"
                              />
                            )}
                          </div>
                          <span className="font-medium">{item.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{item.sku}</TableCell>
                      <TableCell>{item.brand}</TableCell>
                      <TableCell>{formatPrice(item.price)}</TableCell>
                      <TableCell>
                        {editingId === item._id ? (
                          <Input
                            type="number"
                            min={0}
                            value={editStock}
                            onChange={(e) => setEditStock(Number(e.target.value))}
                            className="w-20 h-8"
                          />
                        ) : (
                          <span
                            className={
                              item.stock === 0
                                ? "text-red-400 font-semibold"
                                : item.stock <= LOW_STOCK_THRESHOLD
                                  ? "text-amber-400 font-semibold"
                                  : ""
                            }
                          >
                            {item.stock}
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        {item.stock === 0 ? (
                          <Badge variant="destructive">Out of Stock</Badge>
                        ) : item.stock <= LOW_STOCK_THRESHOLD ? (
                          <Badge variant="outline" className="border-amber-500/50 text-amber-400">
                            Low Stock
                          </Badge>
                        ) : (
                          <Badge variant="default">In Stock</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        {editingId === item._id ? (
                          <div className="flex justify-end gap-1">
                            <Button size="sm" variant="luxury" onClick={() => saveStock(item._id)}>
                              Save
                            </Button>
                            <Button size="sm" variant="ghost" onClick={() => setEditingId(null)}>
                              Cancel
                            </Button>
                          </div>
                        ) : (
                          <Button size="sm" variant="outline" onClick={() => startEdit(item)}>
                            Edit Stock
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
