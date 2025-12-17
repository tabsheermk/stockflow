import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

export async function GET() {
  try {
    const user = await requireAuth();
    const orgId = user.orgId;

    const products = await prisma.product.findMany({
      where: { orgId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(products);
  } catch {
    return NextResponse.json(
      { error: "Unauthorized: Invalid or missing token" },
      { status: 401 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const user = await requireAuth();
    const orgId = user.orgId;
    const body = await req.json();

    const { name, sku, description, quantity, costPrice, sellPrice, lowStock } =
      body;

    if (!name || !sku || quantity === undefined) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const product = await prisma.product.create({
      data: {
        orgId,
        name,
        sku,
        description,
        quantity,
        costPrice,
        sellPrice,
        lowStock,
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (e: any) {
    if (e.message === "Unauthorized") {
      return NextResponse.json(
        { error: "Unauthorized: Invalid or missing token" },
        { status: 401 }
      );
    }
    if (e.code === "P2002") {
      // This is prisma specific error code for unique constraint violation
      return NextResponse.json(
        { error: "SKU already exists" },
        { status: 409 }
      );
    }
    throw e;
  }
}
