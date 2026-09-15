"use client";

import { useEffect, useState } from "react";
import { Check, Trash2, Star } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
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
import type { Review } from "@/types";
import { format } from "date-fns";

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/reviews")
      .then((res) => res.json())
      .then(setReviews)
      .catch(() => toast.error("Failed to load reviews"))
      .finally(() => setLoading(false));
  }, []);

  const approveReview = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/reviews/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ approved: true }),
      });
      if (!res.ok) throw new Error();
      const updated = await res.json();
      setReviews((prev) => prev.map((r) => (r._id === id ? updated : r)));
      toast.success("Review approved");
    } catch {
      toast.error("Failed to approve review");
    }
  };

  const deleteReview = async (id: string) => {
    if (!confirm("Delete this review?")) return;
    try {
      await fetch(`/api/admin/reviews/${id}`, { method: "DELETE" });
      setReviews((prev) => prev.filter((r) => r._id !== id));
      toast.success("Review deleted");
    } catch {
      toast.error("Failed to delete review");
    }
  };

  const pendingCount = reviews.filter((r) => !r.approved).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-semibold">Reviews</h1>
        <p className="text-muted-foreground">
          Approve or manage customer product reviews
          {pendingCount > 0 && (
            <Badge variant="gold" className="ml-2">
              {pendingCount} pending
            </Badge>
          )}
        </p>
      </div>

      <Card className="luxury-border">
        <CardHeader>
          <CardTitle className="font-display text-lg">All Reviews ({reviews.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="py-8 text-center text-muted-foreground">Loading reviews...</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Comment</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reviews.map((review) => (
                  <TableRow key={review._id}>
                    <TableCell className="font-medium">{review.userName}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-gold text-gold" />
                        {review.rating}
                      </div>
                    </TableCell>
                    <TableCell className="max-w-xs truncate">{review.comment}</TableCell>
                    <TableCell>
                      <Badge variant={review.approved ? "default" : "outline"}>
                        {review.approved ? "Approved" : "Pending"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {format(new Date(review.createdAt), "MMM d, yyyy")}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        {!review.approved && (
                          <Button variant="outline" size="sm" onClick={() => approveReview(review._id)}>
                            <Check className="h-4 w-4" />
                            Approve
                          </Button>
                        )}
                        <Button variant="ghost" size="icon" onClick={() => deleteReview(review._id)}>
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
