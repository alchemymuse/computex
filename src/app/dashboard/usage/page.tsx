"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { apiFetch } from "@/lib/api-client";

interface DailyUsage {
  date: string;
  requests: number;
  inputTokens: number;
  outputTokens: number;
  totalCost: number;
}

interface ModelBreakdown {
  model: { slug: string; name: string };
  requests: number;
  inputTokens: number;
  outputTokens: number;
  totalCost: number;
}

interface UsageData {
  period: { days: number };
  totals: {
    requests: number;
    inputTokens: number;
    outputTokens: number;
    totalCost: number;
  };
  daily: DailyUsage[];
  byModel: ModelBreakdown[];
}

export default function UsagePage() {
  const [data, setData] = useState<UsageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(30);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const res = await apiFetch<UsageData>(`/api/dashboard/usage?days=${days}`);
        setData(res);
      } catch {
        // handle
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [days]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Usage</h1>
        <div className="flex items-center gap-2">
          {[7, 14, 30, 90].map((d) => (
            <button
              key={d}
              onClick={() => setDays(d)}
              className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                days === d
                  ? "bg-gray-900 text-white"
                  : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
              }`}
            >
              {d}d
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="h-64 flex items-center justify-center text-sm text-gray-500">
          Loading usage data...
        </div>
      ) : !data || data.daily.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-sm text-gray-500">
            No usage data for this period. Make some API requests to see stats
            here.
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">
                  Total Requests
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-semibold">
                  {data.totals.requests.toLocaleString()}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">
                  Input Tokens
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-semibold">
                  {data.totals.inputTokens.toLocaleString()}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">
                  Output Tokens
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-semibold">
                  {data.totals.outputTokens.toLocaleString()}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">
                  Total Spend
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-semibold">
                  ${data.totals.totalCost.toFixed(4)}
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Daily Requests</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data.daily}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis
                      dataKey="date"
                      tick={{ fontSize: 12 }}
                      tickFormatter={(v) =>
                        new Date(v).toLocaleDateString("en", { month: "short", day: "numeric" })
                      }
                    />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip labelFormatter={(v) => new Date(v as string).toLocaleDateString()} />
                    <Line type="monotone" dataKey="requests" stroke="#111" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Daily Cost (USD)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.daily}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis
                      dataKey="date"
                      tick={{ fontSize: 12 }}
                      tickFormatter={(v) =>
                        new Date(v).toLocaleDateString("en", { month: "short", day: "numeric" })
                      }
                    />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip
                      labelFormatter={(v) => new Date(v as string).toLocaleDateString()}
                      formatter={(v) => [`$${Number(v).toFixed(6)}`, "Cost"]}
                    />
                    <Bar dataKey="totalCost" fill="#374151" radius={[2, 2, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {data.byModel.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Usage by Model</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr className="text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      <th className="px-6 py-3">Model</th>
                      <th className="px-6 py-3">Requests</th>
                      <th className="px-6 py-3">Input Tokens</th>
                      <th className="px-6 py-3">Output Tokens</th>
                      <th className="px-6 py-3">Cost</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {data.byModel.map((m) => (
                      <tr key={m.model.slug}>
                        <td className="px-6 py-3 text-sm font-medium text-gray-900">{m.model.name}</td>
                        <td className="px-6 py-3 text-sm text-gray-600">{m.requests.toLocaleString()}</td>
                        <td className="px-6 py-3 text-sm text-gray-600">{m.inputTokens.toLocaleString()}</td>
                        <td className="px-6 py-3 text-sm text-gray-600">{m.outputTokens.toLocaleString()}</td>
                        <td className="px-6 py-3 text-sm text-gray-600">${m.totalCost.toFixed(4)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
