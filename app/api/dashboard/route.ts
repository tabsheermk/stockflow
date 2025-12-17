import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

export async function GET() {
  try {
    const user = await requireAuth();
    const orgId = user.orgId;

    const settings = await prisma.settings.findUnique({
      where: { orgId },
    });

    const defaultThreshold = settings?.defaultLowStock ?? 5;

    const products = await prisma.product.findMany({
      where: { orgId },
      select: {
        id: true,
        name: true,
        sku: true,
        quantity: true,
        lowStock: true,
      },
    });

    const totalProducts = products.length;
    const totalQuantity = products.reduce((sum, p) => sum + p.quantity, 0);

    const lowStockProducts = products
      .map((p) => {
        const threshold = Math.min(p.lowStock || 0, defaultThreshold);
        return {
          ...p,
          effectiveLowStock: threshold,
        };
      })
      .filter((p) => p.quantity <= p.effectiveLowStock)
      .sort((a, b) => a.quantity - b.quantity);

    return NextResponse.json({
      totalProducts,
      totalQuantity,
      lowStockProducts,
    });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
