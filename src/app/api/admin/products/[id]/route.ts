import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils/format";

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return null;
  }
  return session;
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const product = await prisma.product.findUnique({
      where: { id: params.id },
      include: {
        images: { orderBy: { position: "asc" } },
        category: true,
        reviews: {
          include: {
            user: { select: { id: true, name: true, email: true } },
          },
          orderBy: { createdAt: "desc" },
        },
        _count: {
          select: { reviews: true, orderItems: true },
        },
      },
    });

    if (!product) {
      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: product });
  } catch (error) {
    console.error("Admin product GET error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch product" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const existing = await prisma.product.findUnique({
      where: { id: params.id },
      include: { images: true },
    });

    if (!existing) {
      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: 404 }
      );
    }

    const body = await request.json();

    // Build update data only with provided fields
    const updateData: Record<string, unknown> = {};

    if (body.name !== undefined) {
      updateData.name = body.name;
      // Regenerate slug if name changed
      if (body.name !== existing.name) {
        let slug = slugify(body.name);
        const existingSlug = await prisma.product.findFirst({
          where: { slug, id: { not: params.id } },
        });
        if (existingSlug) {
          slug = `${slug}-${Date.now().toString(36)}`;
        }
        updateData.slug = slug;
      }
    }

    if (body.description !== undefined) updateData.description = body.description;
    if (body.price !== undefined) updateData.price = body.price;
    if (body.compareAt !== undefined) updateData.compareAt = body.compareAt;
    if (body.categoryId !== undefined) updateData.categoryId = body.categoryId;
    if (body.stock !== undefined) updateData.stock = body.stock;
    if (body.sku !== undefined) updateData.sku = body.sku || null;
    if (body.isActive !== undefined) updateData.isActive = body.isActive;
    if (body.isFeatured !== undefined) updateData.isFeatured = body.isFeatured;

    const product = await prisma.product.update({
      where: { id: params.id },
      data: updateData,
      include: {
        images: { orderBy: { position: "asc" } },
        category: true,
      },
    });

    // Handle image update
    if (body.imageUrl !== undefined) {
      // Remove existing primary image if present
      if (existing.images.length > 0) {
        await prisma.productImage.deleteMany({
          where: { productId: params.id, isPrimary: true },
        });
      }
      // Create new primary image if URL provided
      if (body.imageUrl) {
        await prisma.productImage.create({
          data: {
            url: body.imageUrl,
            alt: product.name,
            isPrimary: true,
            position: 0,
            productId: params.id,
          },
        });
      }
    }

    // Audit log
    await prisma.auditLog.create({
      data: {
        action: "UPDATE",
        entity: "Product",
        entityId: product.id,
        details: { updatedFields: Object.keys(updateData) },
        userId: session.user.id,
      },
    });

    // Refetch with updated images
    const updated = await prisma.product.findUnique({
      where: { id: params.id },
      include: {
        images: { orderBy: { position: "asc" } },
        category: true,
      },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error: unknown) {
    console.error("Admin product PATCH error:", error);
    const message =
      error instanceof Error && error.message.includes("Unique constraint")
        ? "A product with this SKU already exists"
        : "Failed to update product";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const existing = await prisma.product.findUnique({
      where: { id: params.id },
      include: {
        _count: { select: { orderItems: true } },
      },
    });

    if (!existing) {
      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: 404 }
      );
    }

    // If product has associated orders, soft delete by setting isActive to false
    if (existing._count.orderItems > 0) {
      await prisma.product.update({
        where: { id: params.id },
        data: { isActive: false },
      });

      await prisma.auditLog.create({
        data: {
          action: "SOFT_DELETE",
          entity: "Product",
          entityId: params.id,
          details: { name: existing.name, reason: "Has associated orders" },
          userId: session.user.id,
        },
      });

      return NextResponse.json({
        success: true,
        message: "Product deactivated (has associated orders)",
      });
    }

    // Hard delete if no associated orders
    await prisma.product.delete({ where: { id: params.id } });

    await prisma.auditLog.create({
      data: {
        action: "DELETE",
        entity: "Product",
        entityId: params.id,
        details: { name: existing.name },
        userId: session.user.id,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Product deleted",
    });
  } catch (error) {
    console.error("Admin product DELETE error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete product" },
      { status: 500 }
    );
  }
}
