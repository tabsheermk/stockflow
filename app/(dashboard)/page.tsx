"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { apiFetch } from "@/lib/api";
import { getToken } from "@/lib/auth-client";

type LowStockProduct = {
  id: string;
  name: string;
  sku: string;
  quantity: number;
  effectiveLowStock: number;
};

type DashboardData = {
  totalProducts: number;
  totalQuantity: number;
  lowStockProducts: LowStockProduct[];
};

export default function DashboardPage() {
  const router = useRouter();
  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => {
    if (!getToken()) {
      router.replace("/login");
      return;
    }

    apiFetch("/api/dashboard")
      .then((res) => res.json())
      .then(setData);
  }, [router]);

  if (!data) return null;

  return (
    <>
      <Navbar />

      <main className="p-6 bg-gray-50 min-h-screen">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Header */}
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
            <p className="text-sm text-gray-500">
              Inventory overview for your organization
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg border p-6">
              <p className="text-sm text-gray-500">Total Products</p>
              <p className="mt-2 text-3xl font-semibold text-gray-900">
                {data.totalProducts}
              </p>
            </div>

            <div className="bg-white rounded-lg border p-6">
              <p className="text-sm text-gray-500">Total Quantity on Hand</p>
              <p className="mt-2 text-3xl font-semibold text-gray-900">
                {data.totalQuantity}
              </p>
            </div>
          </div>

          {/* Low Stock */}
          <div className="bg-white rounded-lg border">
            <div className="px-6 py-4 border-b">
              <h2 className="font-semibold text-gray-900">Low Stock Items</h2>
            </div>

            {data.lowStockProducts.length === 0 ? (
              <div className="p-6 text-sm text-gray-500">
                All products are sufficiently stocked.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 text-gray-600">
                    <tr>
                      <th className="px-6 py-3 text-left font-medium">Name</th>
                      <th className="px-6 py-3 text-left font-medium">SKU</th>
                      <th className="px-6 py-3 text-left font-medium">
                        Quantity
                      </th>
                      <th className="px-6 py-3 text-left font-medium">
                        Low Stock Threshold
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.lowStockProducts.map((p) => (
                      <tr key={p.id} className="border-t hover:bg-gray-50">
                        <td className="px-6 py-4 font-medium text-gray-900">
                          {p.name}
                        </td>
                        <td className="px-6 py-4 text-gray-600">{p.sku}</td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-2 py-1 rounded bg-red-100 text-red-700 text-xs font-medium">
                            {p.quantity}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-600">
                          {p.effectiveLowStock}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
