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

  async function load() {
    const res = await apiFetch("/api/products");
    setProducts(await res.json());
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

    await apiFetch(`/api/products/${id}`, {
      method: "PUT",
      body: JSON.stringify({
        quantity: product.quantity + delta,
      }),
    });

    load();
  }

  return (
    <>
      <Navbar />
      <main className="p-6 bg-gray-50 min-h-screen">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-semibold">Products</h1>
            <Link
              href="/products/new"
              className="bg-black text-white px-4 py-2 rounded"
            >
              Add Product
            </Link>
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
                {products.map((p) => {
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
