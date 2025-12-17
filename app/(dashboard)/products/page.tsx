"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { apiFetch } from "@/lib/api";
import { getToken } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

type Product = {
  id: string;
  name: string;
  sku: string;
  quantity: number;
  sellPrice?: number;
  lowStock?: number;
};

export default function ProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [filtered, setFiltered] = useState<Product[]>([]);
  const [search, setSearch] = useState("");

  async function load() {
    const res = await apiFetch("/api/products");
    const data = await res.json();
    setProducts(data);
    setFiltered(data);
  }

  useEffect(() => {
    if (!getToken()) {
      router.replace("/login");
      return;
    }
    load();
  }, []);

  async function remove(id: string) {
    if (!confirm("Delete this product?")) return;
    await apiFetch(`/api/products/${id}`, { method: "DELETE" });
    setProducts((p) => p.filter((x) => x.id !== id));
  }

  async function adjust(id: string, delta: number) {
    const product = products.find((p) => p.id === id);
    if (!product) return;

    const newQty = product.quantity + delta;
    if (newQty < 0) return;

    await apiFetch(`/api/products/${id}`, {
      method: "PUT",
      body: JSON.stringify({ quantity: newQty }),
    });

    load();
  }

  useEffect(() => {
    const handler = setTimeout(() => {
      if (!search.trim()) {
        setFiltered(products);
        return;
      }

      const q = search.toLowerCase();
      setFiltered(
        products.filter(
          (p) =>
            p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q)
        )
      );
    }, 300); // debounce delay

    return () => clearTimeout(handler);
  }, [search, products]);

  return (
    <>
      <Navbar />
      <main className="p-6 bg-gray-50 min-h-screen">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h1 className="text-2xl font-semibold">Products</h1>

            <div className="flex items-center gap-3">
              <div className="relative">
                <input
                  placeholder="Search products..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-64 pl-9 pr-3 py-2 border rounded-md text-sm
                   focus:outline-none focus:ring-2 focus:ring-black/20"
                />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                  🔍
                </span>
              </div>

              <Link
                href="/products/new"
                className="bg-black text-white px-4 py-2 rounded-md text-sm
                 hover:bg-black/90"
              >
                Add Product
              </Link>
            </div>
          </div>

          <div className="bg-white border rounded-lg overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left">Name</th>
                  <th className="px-6 py-3 text-left">SKU</th>
                  <th className="px-6 py-3 text-left">Quantity</th>
                  <th className="px-6 py-3 text-left">Low Stock</th>
                  <th className="px-6 py-3 text-left">Price</th>
                  <th />
                </tr>
              </thead>

              <tbody>
                {filtered.map((p) => {
                  const isLow =
                    p.lowStock !== undefined && p.quantity <= p.lowStock;

                  return (
                    <tr key={p.id} className="border-t">
                      <td className="px-6 py-4 font-medium">{p.name}</td>
                      <td className="px-6 py-4 text-gray-600">{p.sku}</td>

                      <td className="px-6 py-4 flex gap-2 items-center">
                        <button
                          className="cursor-pointer"
                          onClick={() => adjust(p.id, -1)}
                        >
                          −
                        </button>
                        <span>{p.quantity}</span>
                        <button
                          className="cursor-pointer"
                          onClick={() => adjust(p.id, 1)}
                        >
                          +
                        </button>
                      </td>

                      <td className="px-6 py-4">
                        {isLow ? (
                          <span className="text-red-600 text-xs">LOW</span>
                        ) : (
                          <span className="text-green-700 text-xs">OK</span>
                        )}
                      </td>

                      <td className="px-6 py-4">
                        {p.sellPrice ? `₹${p.sellPrice}` : "—"}
                      </td>

                      <td className="px-6 py-4 text-right space-x-2">
                        <Link
                          href={`/products/${p.id}`}
                          className="text-blue-600"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => remove(p.id)}
                          className="text-red-600"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </>
  );
}
