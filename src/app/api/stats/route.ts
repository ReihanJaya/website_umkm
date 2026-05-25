import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const totalOrders = await prisma.order.count()
    const totalRevenue = await prisma.order.aggregate({
      where: { isPaid: true },
      _sum: { totalAmount: true }
    })
    
    const activeOrders = await prisma.order.count({
      where: {
        status: { in: ['PENDING', 'CONFIRMED', 'PROCESSING', 'READY'] }
      }
    })

    const topItems = await prisma.orderItem.groupBy({
        by: ['menuItemId'],
        _count: { menuItemId: true },
        orderBy: { _count: { menuItemId: 'desc' } },
        take: 5
    })

    // Get menu item names for top items
    let topMenu = '-'
    if (topItems.length > 0) {
      const topMenuItem = await prisma.menuItem.findUnique({
        where: { id: topItems[0].menuItemId }
      })
      topMenu = topMenuItem?.name || '-'
    }

    return NextResponse.json({
      totalOrders,
      totalRevenue: totalRevenue._sum.totalAmount || 0,
      activeOrders,
      topMenu,
      topItems
    })
  } catch (error) {
    console.error("Fetch Stats Error:", error)
    return NextResponse.json({ 
      totalOrders: 0, 
      totalRevenue: 0, 
      activeOrders: 0, 
      topMenu: '-' 
    })
  }
}
