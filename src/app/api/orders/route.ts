import { prisma } from "@/lib/prisma"
import { generateOrderCode } from "@/lib/utils"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { tableNumber, items, totalAmount, notes } = body

    const order = await prisma.order.create({
      data: {
        orderCode: generateOrderCode(),
        tableNumber: parseInt(tableNumber),
        totalAmount: parseFloat(totalAmount),
        notes: notes || "",
        items: {
          create: items.map((item: any) => ({
            menuItemId: item.id,
            quantity: item.quantity,
            subtotal: item.price * item.quantity,
          })),
        },
      },
    })

    return NextResponse.json(order)
  } catch (error) {
    console.error("Order error:", error)
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 })
  }
}

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    
    try {
        const orders = await prisma.order.findMany({
            where: status ? { status: status as any } : {},
            include: {
                items: {
                    include: {
                        menuItem: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        })
        return NextResponse.json(orders)
    } catch (error) {
        console.error("Fetch Orders Error:", error)
        return NextResponse.json([], { status: 200 })
    }
}
