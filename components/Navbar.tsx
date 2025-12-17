"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { logout } from "@/lib/auth-client";

export default function Navbar() {
  const router = useRouter();

  function handleLogout() {
    logout();
    router.push("/login");
  }

  return (
    <nav className="border-b px-6 py-3 flex justify-between items-center">
      <div className="flex items-center gap-6">
        <span className="font-bold text-lg">StockFlow</span>

        <Link href="/" className="text-sm">
          Dashboard
        </Link>

        <Link href="/products" className="text-sm">
          Products
        </Link>

        <Link href="/settings" className="text-sm">
          Settings
        </Link>
      </div>

      <button
        onClick={handleLogout}
        className="text-sm text-red-600 cursor-pointer"
      >
        Logout
      </button>
    </nav>
  );
}
