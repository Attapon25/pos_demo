"use client"

import { useState, useEffect } from "react"
import type { Product, CartItem, OrderRequest } from "@/lib/types"
import { ProductCard } from "@/components/product-card"
import { ShoppingCartComponent } from "@/components/shopping-cart"
import { CurrentDateTime } from "@/components/current-datetime"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Coffee, BarChart3, Store } from "lucide-react"
import Link from "next/link"

export default function POSPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [cart, setCart] = useState<CartItem[]>([])
  const [isCheckingOut, setIsCheckingOut] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  // Fetch products on mount
  useEffect(() => {
    fetchProducts()
  }, [])

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("thai-pos-cart")
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart))
      } catch (error) {
        console.error("Error loading cart from localStorage:", error)
      }
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("thai-pos-cart", JSON.stringify(cart))
  }, [cart])

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/products")
      const result = await response.json()

      if (result.success) {
        setProducts(result.products)
      } else {
        throw new Error(result.message || "เกิดข้อผิดพลาด")
      }
    } catch (error) {
      console.error("Error fetching products:", error)
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถโหลดข้อมูลสินค้าได้",
        variant: "destructive",
        duration: 4000,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const addToCart = (product: Product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((cartItem) => cartItem.productId === product.id)
      if (existingItem) {
        return prevCart.map((cartItem) =>
          cartItem.productId === product.id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem,
        )
      }
      return [
        ...prevCart,
        {
          productId: product.id,
          name: product.name,
          price: product.price,
          quantity: 1,
          category: product.category,
        },
      ]
    })

    toast({
      title: "เพิ่มในตะกร้าแล้ว",
      description: `${product.name} ถูกเพิ่มในตะกร้าเรียบร้อยแล้ว`,
      duration: 2000,
    })
  }

  const updateQuantity = (productId: string, change: number) => {
    setCart((prevCart) => {
      return prevCart
        .map((item) => {
          if (item.productId === productId) {
            const newQuantity = Math.max(0, item.quantity + change)
            return newQuantity === 0 ? null : { ...item, quantity: newQuantity }
          }
          return item
        })
        .filter(Boolean) as CartItem[]
    })
  }

  const removeFromCart = (productId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.productId !== productId))
    toast({
      title: "ลบรายการแล้ว",
      description: "รายการถูกลบออกจากตะกร้าเรียบร้อยแล้ว",
      duration: 2000,
    })
  }

  const clearCart = () => {
    setCart([])
    toast({
      title: "ล้างตะกร้าแล้ว",
      description: "รายการทั้งหมดถูกลบออกจากตะกร้าเรียบร้อยแล้ว",
      duration: 2000,
    })
  }

  const checkout = async () => {
    if (cart.length === 0) return

    setIsCheckingOut(true)

    try {
      const orderData: OrderRequest = {
        items: cart.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
      }

      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      })

      const result = await response.json()

      if (result.success) {
        toast({
          title: "ชำระเงินสำเร็จ! 🎉",
          description: `บันทึกออเดอร์เรียบร้อยแล้ว รหัสออเดอร์: ${result.order.id.toString().slice(-8)}`,
          duration: 5000,
        })
        setCart([])
      } else {
        throw new Error(result.message || "เกิดข้อผิดพลาด")
      }
    } catch (error) {
      console.error("Checkout error:", error)
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถบันทึกออเดอร์ได้ กรุณาลองใหม่อีกครั้ง",
        variant: "destructive",
        duration: 4000,
      })
    } finally {
      setIsCheckingOut(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-amber-500 mx-auto mb-4"></div>
          <p className="text-xl font-thai text-gray-600">กำลังโหลด...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-pink-50">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-sm shadow-lg border-b-2 border-amber-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-amber-400 via-orange-500 to-pink-500 p-3 rounded-2xl shadow-lg">
                <Store className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 font-thai">ร้านเครื่องดื่มไทย</h1>
                <p className="text-base text-gray-600 font-thai">ระบบขายหน้าร้าน POS</p>
              </div>
            </div>

            <div className="flex items-center space-x-6">
              <CurrentDateTime />
              <Link href="/reports">
                <Button
                  variant="outline"
                  size="lg"
                  className="rounded-2xl border-2 border-amber-200 hover:bg-amber-50 hover:border-amber-300 font-thai text-base px-6 py-3 bg-transparent"
                >
                  <BarChart3 className="h-5 w-5 mr-2" />
                  รายงานยอดขาย
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Products Grid */}
          <div className="lg:col-span-2">
            <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-amber-400 via-orange-500 to-pink-500 text-white rounded-t-2xl">
                <CardTitle className="text-2xl font-bold font-thai flex items-center space-x-3">
                  <Coffee className="h-7 w-7" />
                  <span>เมนูเครื่องดื่ม</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} onAddToCart={addToCart} />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Shopping Cart */}
          <div className="lg:col-span-1">
            <ShoppingCartComponent
              cart={cart}
              onUpdateQuantity={updateQuantity}
              onRemoveItem={removeFromCart}
              onClearCart={clearCart}
              onCheckout={checkout}
              isCheckingOut={isCheckingOut}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
