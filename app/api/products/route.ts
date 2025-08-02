import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      where: {
        isActive: true,
      },
      orderBy: {
        name: "asc",
      },
    })

    return NextResponse.json({
      success: true,
      products,
    })
  } catch (error) {
    console.error("Error fetching products:", error)
    return NextResponse.json(
      { success: false, message: "เกิดข้อผิดพลาดในการดึงข้อมูลสินค้า", error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}
export async function POST(request: Request) {
  try {
    const { name, price } = await request.json()

    if (!name || !price) {
      return NextResponse.json(
        { success: false, message: "กรุณาระบุชื่อและราคาสินค้า" },
        { status: 400 }
      )
    }

    const newProduct = await prisma.product.create({
      data: {
        name,
        price,
        isActive: true,
      },
    })

    return NextResponse.json({
      success: true,
      product: newProduct,
    })
  } catch (error) {
    console.error("Error creating product:", error)
    return NextResponse.json(
      { success: false, message: "เกิดข้อผิดพลาดในการสร้างสินค้า", error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}
