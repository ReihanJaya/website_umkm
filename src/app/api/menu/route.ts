import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

// GET: Fetch all menu items
export async function GET() {
  try {
    const menuItems = await prisma.menuItem.findMany({
      orderBy: { createdAt: 'desc' }
    })
    return NextResponse.json(menuItems)
  } catch (error) {
    console.error('Fetch Menu Error:', error)
    return NextResponse.json([], { status: 200 })
  }
}

// POST: Create new menu item
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, description, price, image, categoryId, available } = body

    if (!name || !price || !categoryId) {
      return NextResponse.json({ error: 'Nama, Harga, dan Kategori wajib diisi' }, { status: 400 })
    }

    // Check if category exists
    const category = await prisma.category.findUnique({
      where: { id: parseInt(categoryId) }
    })

    if (!category) {
      return NextResponse.json({ error: 'Kategori tidak valid atau tidak ditemukan' }, { status: 400 })
    }

    const newItem = await prisma.menuItem.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        image,
        categoryId: parseInt(categoryId),
        available: available ?? true
      }
    })

    return NextResponse.json(newItem, { status: 201 })
  } catch (error: any) {
    console.error('Create Menu Error:', error)
    return NextResponse.json({ 
      error: 'Gagal menyimpan menu: ' + (error.message || 'Error tidak diketahui'),
      details: error
    }, { status: 500 })
  }
}
