import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const order = await prisma.order.findUnique({
      where: { id: parseInt(params.id) },
      include: {
        items: {
          include: { menuItem: true }
        }
      }
    })
    
    if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 })
    
    return NextResponse.json(order)
  } catch (error) {
    console.error("Fetch Order Error:", error)
    return NextResponse.json({ error: "Failed to fetch order" }, { status: 500 })
  }
}

export async function PUT(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const body = await request.json()
        const { status, isPaid } = body
        
        const order = await prisma.order.update({
            where: { id: parseInt(params.id) },
            data: { 
                status: status as any,
                isPaid: isPaid !== undefined ? isPaid : undefined
            }
        })
        
        return NextResponse.json(order)
    } catch (error) {
        console.error("Update Order Error:", error)
        return NextResponse.json({ error: "Failed to update order" }, { status: 500 })
    }
}
