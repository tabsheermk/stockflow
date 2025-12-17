"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { apiFetch } from "@/lib/api";
import { getToken } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const router = useRouter();
  const [value, setValue] = useState<number>(5);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!getToken()) {
      router.replace("/login");
      return;
    }

    apiFetch("/api/settings")
      .then((res) => res.json())
      .then((data) => setValue(data.defaultLowStock));
  }, [router]);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaved(false);

    await apiFetch("/api/settings", {
      method: "PUT",
      body: JSON.stringify({ defaultLowStock: value }),
    });

    setSaved(true);
  }

  return (
    <>
      <Navbar />

      <main className="p-6 bg-gray-50 min-h-screen">
        <div className="max-w-xl mx-auto bg-white border rounded-lg p-6 space-y-4">
          <h1 className="text-xl font-semibold">Settings</h1>

          <form onSubmit={save} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Default Low Stock Threshold
              </label>
              <input
                type="number"
                min={0}
                value={value}
                onChange={(e) => setValue(Number(e.target.value))}
                className="w-full border p-2 rounded"
              />
              <p className="text-xs text-gray-500 mt-1">
                Used when a product does not have its own threshold.
              </p>
            </div>

            <button className="bg-black text-white px-4 py-2 rounded cursor-pointer">
              Save
            </button>

            {saved && <p className="text-sm text-green-600">Settings saved</p>}
          </form>
        </div>
      </main>
    </>
  );
}
