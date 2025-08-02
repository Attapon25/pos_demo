"use client"

import type { MenuItem } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus } from "lucide-react"
import { formatCurrency } from "@/lib/utils"

interface MenuItemCardProps {
  item: MenuItem
  onAddToCart: (item: MenuItem) => void
}

export function MenuItemCard({ item, onAddToCart }: MenuItemCardProps) {
  return (
    <Card className="group cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 bg-gradient-to-br from-orange-50 to-pink-50 border-orange-200 hover:border-orange-300">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-gray-800 mb-2 font-thai">{item.name}</h3>
            {item.category && (
              <Badge variant="secondary" className="bg-orange-100 text-orange-800 rounded-full text-sm">
                {item.category}
              </Badge>
            )}
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div className="text-2xl font-bold text-emerald-600">{formatCurrency(item.price)}</div>
          <Button
            onClick={() => onAddToCart(item)}
            size="sm"
            className="rounded-full bg-gradient-to-r from-orange-400 to-pink-500 hover:from-orange-500 hover:to-pink-600 text-white shadow-lg group-hover:shadow-xl transition-all duration-300"
          >
            <Plus className="h-4 w-4 mr-1" />
            เพิ่ม
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
