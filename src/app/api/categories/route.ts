import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { id: 'asc' }
    })
    return NextResponse.json(categories)
  } catch (error) {
    console.error('Fetch Categories Error:', error)
    return NextResponse.json([], { status: 200 })
  }
}
