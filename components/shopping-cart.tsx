"use client"

import type { CartItem } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { ShoppingCart, Plus, Minus, Trash2, Receipt, ShoppingBag } from "lucide-react"
import { formatCurrency } from "@/lib/utils"

interface ShoppingCartProps {
  cart: CartItem[]
  onUpdateQuantity: (productId: string, change: number) => void
  onRemoveItem: (productId: string) => void
  onClearCart: () => void
  onCheckout: () => void
  isCheckingOut: boolean
}

export function ShoppingCartComponent({
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onCheckout,
  isCheckingOut,
}: ShoppingCartProps) {
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0)
  const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return (
    <Card className="shadow-2xl border-0 bg-gradient-to-br from-white via-amber-50/30 to-orange-50/30 sticky top-4">
      <CardHeader className="bg-gradient-to-r from-amber-400 via-orange-500 to-pink-500 text-white rounded-t-2xl">
        <CardTitle className="flex items-center justify-between text-xl font-bold font-thai">
          <div className="flex items-center space-x-3">
            <ShoppingBag className="h-6 w-6" />
            <span>ตะกร้าสินค้า</span>
          </div>
          <Badge variant="secondary" className="bg-white/20 text-white rounded-full px-3 py-1">
            {totalItems} รายการ
          </Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="p-6">
        <ScrollArea className="h-80 mb-6">
          {cart.length === 0 ? (
            <div className="text-center text-gray-500 py-12">
              <ShoppingCart className="h-20 w-20 mx-auto mb-4 text-gray-300" />
              <p className="text-xl font-thai mb-2">ตะกร้าว่างเปล่า</p>
              <p className="text-sm text-gray-400">เลือกเครื่องดื่มที่ต้องการ</p>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.map((item) => (
                <div
                  key={item.productId}
                  className="flex items-center justify-between p-4 bg-white rounded-2xl shadow-sm border-2 border-amber-100 hover:border-amber-200 transition-colors"
                >
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-800 font-thai text-lg mb-1">{item.name}</h4>
                    <p className="text-sm text-gray-600 mb-1">
                      {formatCurrency(item.price)} × {item.quantity}
                    </p>
                    <p className="text-base font-bold text-emerald-600">
                      = {formatCurrency(item.price * item.quantity)}
                    </p>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onUpdateQuantity(item.productId, -1)}
                      className="h-10 w-10 p-0 rounded-full border-2 border-amber-200 hover:bg-amber-50 hover:border-amber-300"
                    >
                      <Minus className="h-4 w-4" />
                    </Button>

                    <span className="w-12 text-center font-bold text-xl text-gray-800">{item.quantity}</span>

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onUpdateQuantity(item.productId, 1)}
                      className="h-10 w-10 p-0 rounded-full border-2 border-amber-200 hover:bg-amber-50 hover:border-amber-300"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>

                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => onRemoveItem(item.productId)}
                      className="h-10 w-10 p-0 rounded-full ml-2"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        <Separator className="my-6" />

        <div className="space-y-6">
          <div className="flex justify-between items-center text-2xl font-bold bg-gradient-to-r from-emerald-50 to-green-50 p-6 rounded-2xl border-2 border-emerald-200">
            <span className="font-thai text-gray-800">รวมทั้งหมด:</span>
            <span className="text-emerald-600 font-thai">{formatCurrency(totalAmount)}</span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Button
              variant="outline"
              onClick={onClearCart}
              disabled={cart.length === 0}
              className="rounded-2xl border-2 border-red-200 hover:bg-red-50 hover:border-red-300 font-thai text-base py-6 bg-transparent"
            >
              <Trash2 className="h-5 w-5 mr-2" />
              ล้างตะกร้า
            </Button>

            <Button
              onClick={onCheckout}
              disabled={cart.length === 0 || isCheckingOut}
              className="rounded-2xl bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 font-thai text-base py-6 shadow-lg"
            >
              <Receipt className="h-5 w-5 mr-2" />
              {isCheckingOut ? "กำลังบันทึก..." : "ชำระเงิน"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
