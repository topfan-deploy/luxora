import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { addressSchema } from "@/lib/validation/schemas";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const addresses = await prisma.address.findMany({
      where: { userId: session.user.id },
      orderBy: [{ isDefault: "desc" }, { firstName: "asc" }],
    });

    return NextResponse.json({ success: true, data: addresses });
  } catch (error) {
    console.error("GET /api/account/addresses error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const result = addressSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Validation failed",
          details: result.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const data = result.data;
    const userId = session.user.id;

    // If this address is being set as default, unset all others first
    if (data.isDefault) {
      await prisma.address.updateMany({
        where: { userId, isDefault: true },
        data: { isDefault: false },
      });
    }

    // If this is the user's first address, make it default
    const existingCount = await prisma.address.count({ where: { userId } });
    const shouldBeDefault = data.isDefault || existingCount === 0;

    const address = await prisma.address.create({
      data: {
        label: data.label || null,
        firstName: data.firstName,
        lastName: data.lastName,
        street: data.street,
        apartment: data.apartment || null,
        city: data.city,
        state: data.state || null,
        zipCode: data.zipCode,
        country: data.country,
        phone: data.phone || null,
        isDefault: shouldBeDefault,
        userId,
      },
    });

    return NextResponse.json(
      { success: true, data: address },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/account/addresses error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
