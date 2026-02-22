import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;

    const product = await prisma.product.findUnique({
      where: { slug },
      include: {
        images: {
          orderBy: { position: "asc" },
        },
        category: true,
        reviews: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
          orderBy: { createdAt: "desc" },
        },
        _count: {
          select: { reviews: true },
        },
      },
    });

    if (!product || !product.isActive) {
      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: 404 }
      );
    }

    const reviewCount = product._count.reviews;
    const avgRating =
      reviewCount > 0
        ? product.reviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount
        : 0;

    const relatedProducts = await prisma.product.findMany({
      where: {
        categoryId: product.categoryId,
        isActive: true,
        id: { not: product.id },
      },
      include: {
        images: {
          orderBy: { position: "asc" },
        },
        category: true,
        reviews: true,
        _count: {
          select: { reviews: true },
        },
      },
      take: 4,
      orderBy: { createdAt: "desc" },
    });

    const relatedWithStats = relatedProducts.map((p) => {
      const count = p._count.reviews;
      const avg =
        count > 0
          ? p.reviews.reduce((sum, r) => sum + r.rating, 0) / count
          : 0;
      return {
        ...p,
        avgRating: Math.round(avg * 10) / 10,
        reviewCount: count,
      };
    });

    return NextResponse.json({
      success: true,
      data: {
        ...product,
        avgRating: Math.round(avgRating * 10) / 10,
        reviewCount,
        relatedProducts: relatedWithStats,
      },
    });
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch product" },
      { status: 500 }
    );
  }
}
