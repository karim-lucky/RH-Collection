"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Coupon } from "@/types";
import { format } from "date-fns";

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    code: "",
    discountPercent: 10,
    expiryDate: "",
    maxUsage: 100,
    active: true,
  });

  const fetchCoupons = () => {
    fetch("/api/admin/coupons")
      .then((res) => res.json())
      .then(setCoupons)
      .catch(() => toast.error("Failed to load coupons"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/coupons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      toast.success("Coupon created");
      setOpen(false);
      setForm({ code: "", discountPercent: 10, expiryDate: "", maxUsage: 100, active: true });
      fetchCoupons();
    } catch {
      toast.error("Failed to create coupon");
    }
  };

  const toggleActive = async (coupon: Coupon) => {
    try {
      const res = await fetch(`/api/admin/coupons/${coupon._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: !coupon.active }),
      });
      if (!res.ok) throw new Error();
      const updated = await res.json();
      setCoupons((prev) => prev.map((c) => (c._id === coupon._id ? updated : c)));
      toast.success("Coupon updated");
    } catch {
      toast.error("Failed to update coupon");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this coupon?")) return;
    try {
      await fetch(`/api/admin/coupons/${id}`, { method: "DELETE" });
      setCoupons((prev) => prev.filter((c) => c._id !== id));
      toast.success("Coupon deleted");
    } catch {
      toast.error("Failed to delete coupon");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-semibold">Coupons</h1>
          <p className="text-muted-foreground">Manage discount codes</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="luxury">
              <Plus className="h-4 w-4" />
              Add Coupon
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="font-display">Create Coupon</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="space-y-2">
                <Label>Code</Label>
                <Input
                  value={form.code}
                  onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                  placeholder="LUXURY10"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Discount %</Label>
                <Input
                  type="number"
                  min={1}
                  max={100}
                  value={form.discountPercent}
                  onChange={(e) =>
                    setForm({ ...form, discountPercent: Number(e.target.value) })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Expiry Date</Label>
                <Input
                  type="date"
                  value={form.expiryDate}
                  onChange={(e) => setForm({ ...form, expiryDate: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Max Usage</Label>
                <Input
                  type="number"
                  value={form.maxUsage}
                  onChange={(e) => setForm({ ...form, maxUsage: Number(e.target.value) })}
                />
              </div>
              <label className="flex items-center gap-2">
                <Checkbox
                  checked={form.active}
                  onCheckedChange={(v) => setForm({ ...form, active: !!v })}
                />
                <span className="text-sm">Active</span>
              </label>
              <Button type="submit" variant="luxury" className="w-full">
                Create Coupon
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="luxury-border">
        <CardHeader>
          <CardTitle className="font-display text-lg">All Coupons ({coupons.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="py-8 text-center text-muted-foreground">Loading coupons...</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Discount</TableHead>
                  <TableHead>Usage</TableHead>
                  <TableHead>Expires</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {coupons.map((coupon) => (
                  <TableRow key={coupon._id}>
                    <TableCell className="font-mono font-semibold text-gold">
                      {coupon.code}
                    </TableCell>
                    <TableCell>{coupon.discountPercent}%</TableCell>
                    <TableCell>
                      {coupon.usageCount}
                      {coupon.maxUsage ? ` / ${coupon.maxUsage}` : ""}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {format(new Date(coupon.expiryDate), "MMM d, yyyy")}
                    </TableCell>
                    <TableCell>
                      <Badge variant={coupon.active ? "default" : "secondary"}>
                        {coupon.active ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button variant="outline" size="sm" onClick={() => toggleActive(coupon)}>
                          {coupon.active ? "Deactivate" : "Activate"}
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(coupon._id)}>
                          <Trash2 className="h-4 w-4 text-red-400" />
                        </Button>
                      </div>
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
