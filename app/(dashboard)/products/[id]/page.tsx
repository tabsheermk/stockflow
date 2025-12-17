"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import ProductForm from "@/components/ProductForm";
import { apiFetch } from "@/lib/api";

interface Product {
  name: string;
  sku: string;
  quantity: number | string;
  costPrice?: number | string;
  sellPrice?: number | string;
  lowStock?: number | string;
}

interface PageProps {
  params: Promise<{ id: string }>; // From Next.js 15, params is a Promise
}

export default function EditProductPage({ params }: PageProps) {
  const router = useRouter();
  const [product, setProduct] = useState<Product>();

  const resolvedParams = use(params);
  const id = resolvedParams.id;

  useEffect(() => {
    apiFetch(`/api/products/${id}`)
      .then((res) => res.json())
      .then(setProduct);
  }, []);

  async function onSubmit(data: Product) {
    await apiFetch(`/api/products/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
    router.push("/products");
  }

  if (!product) return null;

  return (
    <>
      <Navbar />
      <main className="p-6 bg-gray-50 min-h-screen">
        <div className="max-w-xl mx-auto bg-white p-6 border rounded">
          <h1 className="text-xl font-semibold mb-4">Edit Product</h1>
          <ProductForm initialData={product} onSubmit={onSubmit} />
        </div>
      </main>
    </>
  );
}
