"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import type { Banner } from "@/types";

export default function AdminBannersPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    title: "",
    subtitle: "",
    image: "",
    link: "",
    type: "hero" as "hero" | "promo",
    active: true,
    order: 0,
  });

  const fetchBanners = () => {
    fetch("/api/admin/banners")
      .then((res) => res.json())
      .then(setBanners)
      .catch(() => toast.error("Failed to load banners"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/banners", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      toast.success("Banner created");
      setOpen(false);
      setForm({ title: "", subtitle: "", image: "", link: "", type: "hero", active: true, order: 0 });
      fetchBanners();
    } catch {
      toast.error("Failed to create banner");
    }
  };

  const toggleActive = async (banner: Banner) => {
    try {
      const res = await fetch(`/api/admin/banners/${banner._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: !banner.active }),
      });
      if (!res.ok) throw new Error();
      const updated = await res.json();
      setBanners((prev) => prev.map((b) => (b._id === banner._id ? updated : b)));
      toast.success("Banner updated");
    } catch {
      toast.error("Failed to update banner");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this banner?")) return;
    try {
      await fetch(`/api/admin/banners/${id}`, { method: "DELETE" });
      setBanners((prev) => prev.filter((b) => b._id !== id));
      toast.success("Banner deleted");
    } catch {
      toast.error("Failed to delete banner");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-semibold">Banners</h1>
          <p className="text-muted-foreground">Manage homepage hero and promo banners</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="luxury">
              <Plus className="h-4 w-4" />
              Add Banner
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="font-display">Create Banner</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="space-y-2">
                <Label>Title</Label>
                <Input
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Subtitle</Label>
                <Input
                  value={form.subtitle}
                  onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Image URL</Label>
                <Input
                  value={form.image}
                  onChange={(e) => setForm({ ...form, image: e.target.value })}
                  placeholder="https://..."
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Link</Label>
                <Input
                  value={form.link}
                  onChange={(e) => setForm({ ...form, link: e.target.value })}
                  placeholder="/shop"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Type</Label>
                  <Select
                    value={form.type}
                    onValueChange={(v) => setForm({ ...form, type: v as "hero" | "promo" })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hero">Hero</SelectItem>
                      <SelectItem value="promo">Promo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Order</Label>
                  <Input
                    type="number"
                    value={form.order}
                    onChange={(e) => setForm({ ...form, order: Number(e.target.value) })}
                  />
                </div>
              </div>
              <label className="flex items-center gap-2">
                <Checkbox
                  checked={form.active}
                  onCheckedChange={(v) => setForm({ ...form, active: !!v })}
                />
                <span className="text-sm">Active</span>
              </label>
              <Button type="submit" variant="luxury" className="w-full">
                Create Banner
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="luxury-border">
        <CardHeader>
          <CardTitle className="font-display text-lg">All Banners ({banners.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="py-8 text-center text-muted-foreground">Loading banners...</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Preview</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Order</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {banners.map((banner) => (
                  <TableRow key={banner._id}>
                    <TableCell>
                      <div className="relative h-12 w-20 overflow-hidden rounded-lg">
                        <Image src={banner.image} alt={banner.title} fill className="object-cover" />
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="font-medium">{banner.title}</p>
                      {banner.subtitle && (
                        <p className="text-xs text-muted-foreground">{banner.subtitle}</p>
                      )}
                    </TableCell>
                    <TableCell className="capitalize">{banner.type}</TableCell>
                    <TableCell>{banner.order}</TableCell>
                    <TableCell>
                      <Badge variant={banner.active ? "default" : "secondary"}>
                        {banner.active ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button variant="outline" size="sm" onClick={() => toggleActive(banner)}>
                          {banner.active ? "Hide" : "Show"}
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(banner._id)}>
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
