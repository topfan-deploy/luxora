import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const wishlistItems = await prisma.wishlistItem.findMany({
      where: { userId: session.user.id },
      include: {
        product: {
          include: {
            images: {
              where: { isPrimary: true },
              take: 1,
            },
            reviews: {
              select: {
                rating: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const items = wishlistItems.map((wi) => ({
      id: wi.id,
      productId: wi.productId,
      createdAt: wi.createdAt.toISOString(),
      product: {
        id: wi.product.id,
        name: wi.product.name,
        slug: wi.product.slug,
        price: wi.product.price,
        compareAt: wi.product.compareAt,
        image: wi.product.images[0]?.url ?? "",
        stock: wi.product.stock,
        isActive: wi.product.isActive,
        averageRating:
          wi.product.reviews.length > 0
            ? wi.product.reviews.reduce((sum, r) => sum + r.rating, 0) /
              wi.product.reviews.length
            : 0,
        reviewCount: wi.product.reviews.length,
      },
    }));

    return NextResponse.json({ items });
  } catch (error) {
    console.error("GET /api/wishlist error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { productId } = body;

    if (!productId || typeof productId !== "string") {
      return NextResponse.json(
        { error: "Invalid productId" },
        { status: 400 }
      );
    }

    // Verify the product exists
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    // Check if item already exists in wishlist
    const existing = await prisma.wishlistItem.findUnique({
      where: {
        userId_productId: {
          userId: session.user.id,
          productId,
        },
      },
    });

    if (existing) {
      // Remove from wishlist (toggle off)
      await prisma.wishlistItem.delete({
        where: { id: existing.id },
      });

      return NextResponse.json({
        action: "removed",
        productId,
      });
    } else {
      // Add to wishlist (toggle on)
      const wishlistItem = await prisma.wishlistItem.create({
        data: {
          userId: session.user.id,
          productId,
        },
      });

      return NextResponse.json({
        action: "added",
        productId,
        item: wishlistItem,
      });
    }
  } catch (error) {
    console.error("POST /api/wishlist error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
