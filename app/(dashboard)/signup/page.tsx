"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { saveToken } from "@/lib/auth-client";
import Link from "next/link";

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    orgName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        orgName: form.orgName,
        email: form.email,
        password: form.password,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Signup failed");
      return;
    }

    saveToken(data.token);
    router.push("/");
  }

  return (
    <form onSubmit={submit} className="max-w-sm mx-auto mt-20 space-y-4">
      <h1 className="text-2xl font-bold text-center">StockFlow</h1>
      <p className="text-center text-gray-500">Create your account</p>

      <input
        placeholder="Organization name"
        type="text"
        value={form.orgName}
        onChange={(e) => setForm({ ...form, orgName: e.target.value })}
        className="w-full border p-2"
      />

      <input
        placeholder="Email"
        type="email"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
        className="w-full border p-2"
      />

      <input
        placeholder="Password"
        type="password"
        value={form.password}
        minLength={8}
        onChange={(e) => setForm({ ...form, password: e.target.value })}
        className="w-full border p-2"
      />

      <input
        placeholder="Confirm password"
        type="password"
        value={form.confirmPassword}
        minLength={8}
        onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
        className="w-full border p-2"
      />

      {error && <p className="text-red-600 text-sm">{error}</p>}

      <button className="w-full bg-black text-white p-2">Sign up</button>
      <span>
        Already have an account?{" "}
        <Link href="/login" className="text-blue-600 hover:underline">
          Log in
        </Link>
      </span>
    </form>
  );
}
