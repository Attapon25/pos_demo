"use client"

import type { Product } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Coffee } from "lucide-react"
import { formatCurrency } from "@/lib/utils"

interface ProductCardProps {
  product: Product
  onAddToCart: (product: Product) => void
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const getCategoryColor = (category?: string) => {
    switch (category) {
      case "ชา":
        return "bg-green-100 text-green-800 border-green-200"
      case "กาแฟ":
        return "bg-amber-100 text-amber-800 border-amber-200"
      case "น้ำผลไม้":
        return "bg-orange-100 text-orange-800 border-orange-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <Card className="group cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-105 bg-gradient-to-br from-white to-amber-50/50 border-2 border-amber-100 hover:border-amber-300">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-3">
              <div className="bg-gradient-to-r from-amber-400 to-orange-500 p-2 rounded-lg">
                <Coffee className="h-5 w-5 text-white" />
              </div>
              {product.category && (
                <Badge
                  variant="outline"
                  className={`rounded-full text-xs font-medium ${getCategoryColor(product.category)}`}
                >
                  {product.category}
                </Badge>
              )}
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2 font-thai leading-tight">{product.name}</h3>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div className="text-2xl font-bold text-emerald-600 font-thai">{formatCurrency(product.price)}</div>
          <Button
            onClick={() => onAddToCart(product)}
            size="lg"
            className="rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-white shadow-lg group-hover:shadow-xl transition-all duration-300 px-6 py-3 font-thai text-base"
          >
            <Plus className="h-5 w-5 mr-2" />
            เพิ่มในตะกร้า
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
