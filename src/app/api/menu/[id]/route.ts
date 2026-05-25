import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id)
    const body = await req.json()
    
    const updatedItem = await prisma.menuItem.update({
      where: { id },
      data: {
        ...body,
        price: body.price ? parseFloat(body.price) : undefined,
        categoryId: body.categoryId ? parseInt(body.categoryId) : undefined,
      }
    })

    return NextResponse.json(updatedItem)
  } catch (error) {
    console.error('Update Menu Error:', error)
    return NextResponse.json({ error: 'Failed to update menu' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id)
    await prisma.menuItem.delete({
      where: { id }
    })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete Menu Error:', error)
    return NextResponse.json({ error: 'Failed to delete menu' }, { status: 500 })
  }
}
