"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { apiFetch } from "@/lib/api-client";

interface Listing {
  id: string;
  inputPricePerMillion: string;
  outputPricePerMillion: string;
  maxConcurrency: number;
  currentConcurrency: number;
  isVerified: boolean;
  seller: { id: string; name: string };
  model: { slug: string; name: string; provider: string };
}

interface Pagination {
  page: number;
  totalPages: number;
  total: number;
}

export default function MarketplacePage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          page: String(page),
          limit: "20",
          verified: "true",
          ...(search && { model: search }),
        });
        const res = await apiFetch<{ listings: Listing[]; pagination: Pagination }>(
          `/api/marketplace/listings?${params}`
        );
        setListings(res.listings);
        setPagination(res.pagination);
      } catch {
        // handle
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [page, search]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Marketplace</h1>
        <Input
          placeholder="Filter by model slug..."
          className="w-64"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />
      </div>

      {loading ? (
        <div className="h-32 flex items-center justify-center text-sm text-gray-500">
          Loading listings...
        </div>
      ) : listings.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-sm text-gray-500">
            No verified listings available
            {search ? ` for "${search}"` : ""}. Check back soon.
          </CardContent>
        </Card>
      ) : (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                Available Providers ({pagination?.total ?? 0})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr className="text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    <th className="px-6 py-3">Model</th>
                    <th className="px-6 py-3">Provider</th>
                    <th className="px-6 py-3">Seller</th>
                    <th className="px-6 py-3">Input $/1M</th>
                    <th className="px-6 py-3">Output $/1M</th>
                    <th className="px-6 py-3">Availability</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {listings.map((listing) => {
                    const available =
                      listing.maxConcurrency - listing.currentConcurrency;
                    return (
                      <tr key={listing.id}>
                        <td className="px-6 py-3 text-sm font-medium text-gray-900">
                          {listing.model.name}
                        </td>
                        <td className="px-6 py-3 text-sm text-gray-600">
                          {listing.model.provider}
                        </td>
                        <td className="px-6 py-3 text-sm text-gray-600">
                          {listing.seller.name}
                        </td>
                        <td className="px-6 py-3 text-sm font-mono text-gray-700">
                          ${parseFloat(listing.inputPricePerMillion).toFixed(2)}
                        </td>
                        <td className="px-6 py-3 text-sm font-mono text-gray-700">
                          ${parseFloat(listing.outputPricePerMillion).toFixed(2)}
                        </td>
                        <td className="px-6 py-3">
                          <Badge
                            variant={available > 3 ? "default" : available > 0 ? "secondary" : "destructive"}
                          >
                            {available}/{listing.maxConcurrency}
                          </Badge>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </CardContent>
          </Card>

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="px-3 py-1.5 text-sm border rounded-md disabled:opacity-50"
              >
                Previous
              </button>
              <span className="text-sm text-gray-600">
                Page {page} of {pagination.totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                disabled={page >= pagination.totalPages}
                className="px-3 py-1.5 text-sm border rounded-md disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
