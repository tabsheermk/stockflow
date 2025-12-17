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

    return NextResponse.json({
      defaultLowStock: settings?.defaultLowStock ?? 5,
    });
  } catch {
    return NextResponse.json(
      { error: "Unauthorized: Invalid or missing token" },
      { status: 401 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const user = await requireAuth();
    const orgId = user.orgId;

    const { defaultLowStock } = await req.json();

    if (typeof defaultLowStock !== "number" || defaultLowStock < 0) {
      return NextResponse.json({ error: "Invalid value" }, { status: 400 });
    }

    await prisma.settings.upsert({
      where: { orgId },
      update: { defaultLowStock },
      create: { orgId, defaultLowStock },
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Unauthorized: Invalid or missing token" },
      { status: 401 }
    );
  }
}
