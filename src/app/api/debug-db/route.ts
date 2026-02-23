import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const dbUrl = process.env.DATABASE_URL || "NOT SET";
  const masked = dbUrl !== "NOT SET"
    ? dbUrl.replace(/\/\/([^:]+):([^@]+)@/, "//***:***@")
    : "NOT SET";

  try {
    const result = await prisma.$queryRaw`SELECT current_database(), current_schema()`;
    const tables = await prisma.$queryRaw`SELECT tablename FROM pg_tables WHERE schemaname = 'public' ORDER BY tablename`;
    return NextResponse.json({
      success: true,
      databaseUrl: masked,
      connection: result,
      tables,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({
      success: false,
      databaseUrl: masked,
      error: message,
    }, { status: 500 });
  }
}
