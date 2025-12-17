import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import prisma from "@/lib/prisma";
import { signToken } from "@/lib/jwt";

export async function POST(req: Request) {
  const { email, password, orgName } = await req.json();

  if (!email || !password || !orgName) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json(
      { error: "Email already exists" },
      { status: 409 }
    );
  }

  const hashed = await bcrypt.hash(password, 10);

  const { user, org } = await prisma.$transaction(async (tx) => {
    const org = await tx.organization.create({
      data: { name: orgName },
    });

    const user = await tx.user.create({
      data: {
        email,
        password: hashed,
        orgId: org.id,
      },
    });

    await tx.settings.create({
      data: { orgId: org.id },
    });

    return { user, org };
  });

  const token = signToken({ userId: user.id, orgId: org.id });

  return NextResponse.json(
    {
      token,
      message: "Sign up successfull",
    },
    { status: 201 }
  );
}
