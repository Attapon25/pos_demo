import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import type { OrderRequest } from "@/lib/types"

export async function POST(request: NextRequest) {
  try {
    const body: OrderRequest = await request.json()

    if (!body.items || body.items.length === 0) {
      return NextResponse.json({ success: false, message: "กรุณาเลือกสินค้าอย่างน้อย 1 รายการ" }, { status: 400 })
    }

    const productIds = body.items.map((item) => Number(item.productId))
    const products = await prisma.product.findMany({
      where: {
        id: { in: productIds },
        isActive: true,
      },
    })

    if (products.length !== productIds.length) {
      return NextResponse.json({ success: false, message: "พบสินค้าที่ไม่ถูกต้อง" }, { status: 400 })
    }

    let total = 0
    const orderItemsData = body.items.map((item) => {
      const product = products.find((p) => p.id === item.productId)
      if (!product) {
        throw new Error(`Product not found: ${item.productId}`)
      }
      if (typeof product.price !== "number") {
        throw new Error(`Product price is invalid for product ID: ${item.productId}`)
      }
      const itemTotal = product.price * item.quantity
      total += itemTotal

      return {
        productId: item.productId,
        quantity: item.quantity,
        price: product.price,
      }
    })

    console.log("Order total:", total)
    console.log("Order items:", orderItemsData)

    const order = await prisma.order.create({
      data: {
        total,
        items: {
          create: orderItemsData,
        },
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    })

    const response = {
      id: order.id,
      total: order.total,
      createdAt: order.createdAt.toISOString(),
      items: order.items.map((item) => ({
        id: item.id,
        name: item.product.name,
        price: item.price,
        quantity: item.quantity,
      })),
    }

    return NextResponse.json({
      success: true,
      message: "บันทึกออเดอร์เรียบร้อยแล้ว",
      order: response,
    })
  } catch (error) {
    console.error("Error creating order:", error)
    return NextResponse.json({ success: false, message: "เกิดข้อผิดพลาดในการบันทึกออเดอร์" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const dateStr = searchParams.get("date")

    if (!dateStr) {
      return NextResponse.json({ success: false, message: "กรุณาระบุวันที่" }, { status: 400 })
    }

    const startDate = new Date(dateStr)
    if (isNaN(startDate.getTime())) {
      return NextResponse.json({ success: false, message: "วันที่ไม่ถูกต้อง" }, { status: 400 })
    }
    startDate.setHours(0, 0, 0, 0)

    const endDate = new Date(dateStr)
    endDate.setHours(23, 59, 59, 999)

    const orders = await prisma.order.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    const total = orders.reduce((sum, order) => sum + order.total, 0)

    const formattedOrders = orders.map((order) => ({
      id: order.id,
      total: order.total,
      createdAt: order.createdAt.toISOString(),
      items: order.items.map((item) => ({
        id: item.id,
        name: item.product.name,
        price: item.price,
        quantity: item.quantity,
      })),
    }))

    return NextResponse.json({
      success: true,
      total: Number(total.toFixed(2)),
      orders: formattedOrders,
    })
  } catch (error) {
    console.error("Error fetching orders:", error)
    return NextResponse.json({ success: false, message: "เกิดข้อผิดพลาดในการดึงข้อมูล" }, { status: 500 })
  }
}
