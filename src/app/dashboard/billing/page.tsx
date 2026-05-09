"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { apiFetch } from "@/lib/api-client";

interface Transaction {
  id: string;
  type: string;
  amount: number;
  balanceAfter: number;
  description: string;
  createdAt: string;
}

export default function BillingPage() {
  const [balance, setBalance] = useState<number>(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [topUpAmount, setTopUpAmount] = useState("10");

  useEffect(() => {
    async function load() {
      try {
        const [userRes, txRes] = await Promise.all([
          apiFetch<{ user: { balanceUsd: string } }>("/api/auth/me"),
          apiFetch<{ transactions: Transaction[] }>("/api/dashboard/transactions?limit=10"),
        ]);
        setBalance(parseFloat(userRes.user.balanceUsd));
        setTransactions(txRes.transactions);
      } catch {
        // handle
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const typeColors: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
    DEPOSIT: "default",
    WITHDRAWAL: "destructive",
    USAGE: "secondary",
    REFUND: "outline",
    ESCROW_LOCK: "secondary",
    ESCROW_RELEASE: "outline",
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900">Billing</h1>

      {/* Balance */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-500">
            Current Balance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-semibold text-gray-900">
            {loading ? "..." : `$${balance.toFixed(2)}`}
          </p>
        </CardContent>
      </Card>

      {/* Top-up options */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Top Up with Card</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">$</span>
              <Input
                type="number"
                min="5"
                max="10000"
                value={topUpAmount}
                onChange={(e) => setTopUpAmount(e.target.value)}
                className="w-32"
              />
              <span className="text-sm text-gray-500">USD</span>
            </div>
            <div className="flex gap-2">
              {[10, 25, 50, 100].map((amt) => (
                <button
                  key={amt}
                  onClick={() => setTopUpAmount(String(amt))}
                  className={`px-3 py-1.5 text-sm border rounded-md transition-colors ${
                    topUpAmount === String(amt)
                      ? "border-gray-900 bg-gray-900 text-white"
                      : "border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  ${amt}
                </button>
              ))}
            </div>
            <Button
              className="w-full"
              onClick={async () => {
                try {
                  const res = await apiFetch<{ url: string }>("/api/payments/checkout", {
                    method: "POST",
                    body: JSON.stringify({ amount: parseFloat(topUpAmount) }),
                  });
                  if (res.url) window.location.href = res.url;
                } catch {
                  // handle error
                }
              }}
            >
              Pay with Stripe
            </Button>
            <p className="text-xs text-gray-400">
              Stripe Checkout will open in a new window.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Top Up with Crypto</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-600">
              Send USDC or USDT on Polygon or Arbitrum to your deposit address.
            </p>
            <div className="rounded-md bg-gray-50 p-3">
              <p className="text-xs text-gray-500 mb-1">Your deposit address</p>
              <p className="font-mono text-sm text-gray-700 break-all">
                Generated on first deposit — Phase 5
              </p>
            </div>
            <div className="flex gap-2">
              <Badge variant="outline">USDC</Badge>
              <Badge variant="outline">USDT</Badge>
              <Badge variant="outline">Polygon</Badge>
              <Badge variant="outline">Arbitrum</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      <Separator />

      {/* Transaction history */}
      <div>
        <h2 className="text-lg font-medium text-gray-900 mb-4">
          Recent Transactions
        </h2>
        {loading ? (
          <p className="text-sm text-gray-500">Loading...</p>
        ) : transactions.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-sm text-gray-500">
              No transactions yet.
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="p-0">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr className="text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    <th className="px-4 py-3">Type</th>
                    <th className="px-4 py-3">Amount</th>
                    <th className="px-4 py-3">Balance After</th>
                    <th className="px-4 py-3">Description</th>
                    <th className="px-4 py-3">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {transactions.map((tx) => (
                    <tr key={tx.id}>
                      <td className="px-4 py-3">
                        <Badge variant={typeColors[tx.type] ?? "secondary"}>
                          {tx.type}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-sm font-mono">
                        {tx.type === "DEPOSIT" || tx.type === "REFUND" || tx.type === "ESCROW_RELEASE"
                          ? "+"
                          : "-"}
                        ${tx.amount.toFixed(6)}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        ${tx.balanceAfter.toFixed(4)}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 max-w-xs truncate">
                        {tx.description}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">
                        {new Date(tx.createdAt).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
