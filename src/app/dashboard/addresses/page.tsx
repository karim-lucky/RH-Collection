"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { MapPin, Plus, Trash2, Star } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import type { Address } from "@/types";

export default function AddressesPage() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<Address>({
    label: "Home",
    country: "Pakistan",
    province: "",
    city: "",
    address: "",
    postalCode: "",
    isDefault: false,
  });

  useEffect(() => {
    fetch("/api/user/addresses")
      .then((r) => r.json())
      .then((data) => setAddresses(data.addresses || []))
      .catch(() => {});
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/user/addresses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setAddresses(data.addresses);
      setShowForm(false);
      setForm({
        label: "Home",
        country: "Pakistan",
        province: "",
        city: "",
        address: "",
        postalCode: "",
        isDefault: false,
      });
      toast.success("Address added");
    } catch {
      toast.error("Failed to add address");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/user/addresses?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setAddresses(data.addresses);
      toast.success("Address removed");
    } catch {
      toast.error("Failed to remove address");
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="font-display flex items-center gap-2">
          <MapPin className="h-5 w-5 text-gold" />
          Saved Addresses
        </CardTitle>
        <Button variant="outline" size="sm" onClick={() => setShowForm(!showForm)}>
          <Plus className="h-4 w-4" /> Add Address
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        {showForm && (
          <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-white/10 p-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Label</Label>
                <Input
                  value={form.label}
                  onChange={(e) => setForm({ ...form, label: e.target.value })}
                  placeholder="Home, Office..."
                />
              </div>
              <div className="space-y-2">
                <Label>Country</Label>
                <Input
                  value={form.country}
                  onChange={(e) => setForm({ ...form, country: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Province</Label>
                <Input
                  value={form.province}
                  onChange={(e) => setForm({ ...form, province: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>City</Label>
                <Input
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label>Street Address</Label>
                <Input
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Postal Code</Label>
                <Input
                  value={form.postalCode}
                  onChange={(e) => setForm({ ...form, postalCode: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="default"
                checked={form.isDefault}
                onCheckedChange={(checked) =>
                  setForm({ ...form, isDefault: checked === true })
                }
              />
              <Label htmlFor="default">Set as default address</Label>
            </div>
            <div className="flex gap-2">
              <Button type="submit" variant="luxury">Save Address</Button>
              <Button type="button" variant="ghost" onClick={() => setShowForm(false)}>
                Cancel
              </Button>
            </div>
          </form>
        )}

        {addresses.length === 0 && !showForm ? (
          <div className="py-8 text-center text-muted-foreground">
            <MapPin className="mx-auto h-12 w-12 opacity-30" />
            <p className="mt-4">No saved addresses</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {addresses.map((addr, i) => (
              <div
                key={addr._id || i}
                className="relative rounded-xl border border-white/10 p-4"
              >
                {addr.isDefault && (
                  <span className="absolute right-4 top-4 flex items-center gap-1 text-xs text-gold">
                    <Star className="h-3 w-3 fill-gold" /> Default
                  </span>
                )}
                <p className="font-medium">{addr.label || "Address"}</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  {addr.address}<br />
                  {addr.city}, {addr.province}<br />
                  {addr.country} {addr.postalCode}
                </p>
                <button
                  onClick={() => addr._id && handleDelete(addr._id)}
                  className="mt-4 flex items-center gap-1 text-sm text-red-400 hover:text-red-300"
                >
                  <Trash2 className="h-4 w-4" /> Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
