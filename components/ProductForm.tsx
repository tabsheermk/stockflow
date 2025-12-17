"use client";

import { FormEvent, useState } from "react";

interface ProductData {
  name: string;
  sku: string;
  quantity: number | string;
  costPrice?: number | string;
  sellPrice?: number | string;
  lowStock?: number | string;
}

interface ProductFormProps {
  initialData?: Partial<ProductData>;
  onSubmit: (data: ProductData) => void;
}

export default function ProductForm({
  initialData = {},
  onSubmit,
}: ProductFormProps) {
  const [form, setForm] = useState({
    name: initialData.name || "",
    sku: initialData.sku || "",
    quantity: initialData.quantity || 0,
    costPrice: initialData.costPrice || "",
    sellPrice: initialData.sellPrice || "",
    lowStock: initialData.lowStock || "",
  });

  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    onSubmit({
      ...form,
      quantity: Number(form.quantity),
      costPrice: form.costPrice ? Number(form.costPrice) : undefined,
      sellPrice: form.sellPrice ? Number(form.sellPrice) : undefined,
      lowStock: form.lowStock ? Number(form.lowStock) : undefined,
    });
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      {Object.entries({
        name: "Name",
        sku: "SKU",
        quantity: "Quantity",
        costPrice: "Cost Price",
        sellPrice: "Selling Price",
        lowStock: "Low Stock Threshold",
      }).map(([key, label]) => (
        <div key={key}>
          <label className="text-sm">{label}</label>
          <input
            name={key}
            value={form[key as keyof ProductData]}
            onChange={(e) => setForm({ ...form, [key]: e.target.value })}
            className="w-full border p-2 rounded"
          />
        </div>
      ))}

      <button className="bg-black text-white px-4 py-2 rounded">Save</button>
    </form>
  );
}
