"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { apiFetch } from "@/lib/api-client";

interface DashboardData {
  user: {
    name: string;
    balanceUsd: string;
    balanceCredits: string;
  };
  totals: {
    requests: number;
    inputTokens: number;
    outputTokens: number;
    totalCost: number;
  };
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [userRes, usageRes] = await Promise.all([
          apiFetch<{ user: DashboardData["user"] }>("/api/auth/me"),
          apiFetch<{ totals: DashboardData["totals"] }>(
            "/api/dashboard/usage?days=30"
          ),
        ]);
        setData({ user: userRes.user, totals: usageRes.totals });
      } catch {
        window.location.href = "/login";
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="pt-6">
                <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
                <div className="mt-2 h-8 w-24 bg-gray-100 rounded animate-pulse" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900">
        Welcome back{data?.user.name ? `, ${data.user.name}` : ""}
      </h1>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Balance (USD)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold text-gray-900">
              ${parseFloat(data?.user.balanceUsd ?? "0").toFixed(2)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Requests (30d)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold text-gray-900">
              {data?.totals.requests?.toLocaleString() ?? "0"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Tokens Used (30d)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold text-gray-900">
              {(
                (data?.totals.inputTokens ?? 0) +
                (data?.totals.outputTokens ?? 0)
              ).toLocaleString()}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Spend (30d)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold text-gray-900">
              ${data?.totals.totalCost?.toFixed(4) ?? "0.0000"}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
