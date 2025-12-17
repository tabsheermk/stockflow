"use client";

import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import ProductForm from "@/components/ProductForm";
import { apiFetch } from "@/lib/api";

export default function NewProductPage() {
  const router = useRouter();

  async function onSubmit(data: any) {
    await apiFetch("/api/products", {
      method: "POST",
      body: JSON.stringify(data),
    });
    router.push("/products");
  }

  return (
    <>
      <Navbar />
      <main className="p-6 bg-gray-50 min-h-screen">
        <div className="max-w-xl mx-auto bg-white p-6 border rounded">
          <h1 className="text-xl font-semibold mb-4">Add Product</h1>
          <ProductForm onSubmit={onSubmit} />
        </div>
      </main>
    </>
  );
}
