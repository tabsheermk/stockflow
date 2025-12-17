import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

type Params = { params: Promise<{ id: string }> };

export async function GET(_: Request, { params }: Params) {
  try {
    const user = await requireAuth();
    const orgId = user.orgId;
    const { id } = await params;

    const product = await prisma.product.findFirst({
      where: { id, orgId },
    });

    if (!product) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch {
    return NextResponse.json(
      { error: "Unauthorized: Invalid or missing token" },
      { status: 401 }
    );
  }
}

export async function PUT(req: Request, { params }: Params) {
  try {
    const user = await requireAuth();
    const orgId = user.orgId;
    const data = await req.json();

    const { id } = await params;

    const updated = await prisma.product.updateMany({
      where: { id, orgId },
      data,
    });

    if (updated.count === 0) {
      return NextResponse.json(
        { error: "Product doesn't exist for given ID" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Product updated successfully",
    });
  } catch {
    return NextResponse.json(
      { error: "Unauthorized: Invalid or missing token" },
      { status: 401 }
    );
  }
}

export async function DELETE(_: Request, { params }: Params) {
  try {
    const user = await requireAuth();
    const orgId = user.orgId;

    const { id } = await params;

    const deleted = await prisma.product.deleteMany({
      where: { id, orgId },
    });

    if (deleted.count === 0) {
      return NextResponse.json(
        { error: "Product doesn't exist for given ID" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      messsage: "Product deleted successfully",
    });
  } catch {
    return NextResponse.json(
      { error: "Unauthorized: Invalid or missing token" },
      { status: 401 }
    );
  }
}
