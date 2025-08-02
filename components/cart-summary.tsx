"use client"

import type { CartItem } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { ShoppingCart, Plus, Minus, Trash2, Receipt } from "lucide-react"
import { formatCurrency } from "@/lib/utils"

interface CartSummaryProps {
  cart: CartItem[]
  onUpdateQuantity: (id: string, change: number) => void
  onRemoveItem: (id: string) => void
  onClearCart: () => void
  onCheckout: () => void
  isCheckingOut: boolean
}

export function CartSummary({
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onCheckout,
  isCheckingOut,
}: CartSummaryProps) {
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0)
  const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return (
    <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-orange-50 sticky top-4">
      <CardHeader className="bg-gradient-to-r from-orange-400 to-pink-500 text-white rounded-t-lg">
        <CardTitle className="flex items-center justify-between text-xl font-semibold">
          <span className="font-thai">รายการสั่งซื้อ</span>
          <Badge variant="secondary" className="bg-white/20 text-white rounded-full">
            {totalItems} รายการ
          </Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="p-6">
        <ScrollArea className="h-80 mb-6">
          {cart.length === 0 ? (
            <div className="text-center text-gray-500 py-12">
              <ShoppingCart className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-thai">ไม่มีรายการในตะกร้า</p>
              <p className="text-sm text-gray-400 mt-2">เลือกเครื่องดื่มที่ต้องการ</p>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm border border-orange-100"
                >
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-800 font-thai">{item.name}</h4>
                    <p className="text-sm text-gray-600">
                      {formatCurrency(item.price)} x {item.quantity}
                    </p>
                    <p className="text-sm font-semibold text-emerald-600">
                      = {formatCurrency(item.price * item.quantity)}
                    </p>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onUpdateQuantity(item.id, -1)}
                      className="h-8 w-8 p-0 rounded-full border-orange-200 hover:bg-orange-50"
                    >
                      <Minus className="h-3 w-3" />
                    </Button>

                    <span className="w-8 text-center font-semibold text-lg">{item.quantity}</span>

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onUpdateQuantity(item.id, 1)}
                      className="h-8 w-8 p-0 rounded-full border-orange-200 hover:bg-orange-50"
                    >
                      <Plus className="h-3 w-3" />
                    </Button>

                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => onRemoveItem(item.id)}
                      className="h-8 w-8 p-0 rounded-full ml-2"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        <Separator className="my-6" />

        <div className="space-y-4">
          <div className="flex justify-between items-center text-xl font-bold bg-gradient-to-r from-emerald-50 to-green-50 p-4 rounded-xl">
            <span className="font-thai">รวมทั้งหมด:</span>
            <span className="text-emerald-600">{formatCurrency(totalAmount)}</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              onClick={onClearCart}
              disabled={cart.length === 0}
              className="rounded-full border-orange-200 hover:bg-orange-50 font-thai bg-transparent"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              ล้างตะกร้า
            </Button>

            <Button
              onClick={onCheckout}
              disabled={cart.length === 0 || isCheckingOut}
              className="rounded-full bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 font-thai"
            >
              <Receipt className="h-4 w-4 mr-2" />
              {isCheckingOut ? "กำลังบันทึก..." : "ชำระเงิน"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
