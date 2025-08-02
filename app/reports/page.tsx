"use client"

import type React from "react"

import { useState, useEffect } from "react"
import type { DailyReportResponse } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, Calendar, TrendingUp, ShoppingBag, Receipt, Coffee, Clock, BarChart3 } from "lucide-react"
import { formatCurrency, formatTime, getTodayDateString, formatDate } from "@/lib/utils"
import Link from "next/link"

export default function ReportsPage() {
  const [selectedDate, setSelectedDate] = useState(getTodayDateString())
  const [report, setReport] = useState<DailyReportResponse | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const fetchReport = async (date: string) => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/orders?date=${date}`)
      const result = await response.json()

      if (result.success) {
        setReport({
          total: result.total,
          orders: result.orders,
        })
      } else {
        throw new Error(result.message || "เกิดข้อผิดพลาด")
      }
    } catch (error) {
      console.error("Error fetching report:", error)
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถดึงข้อมูลรายงานได้ กรุณาลองใหม่อีกครั้ง",
        variant: "destructive",
        duration: 4000,
      })
      setReport(null)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchReport(selectedDate)
  }, [selectedDate])

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(e.target.value)
  }

  // Calculate drink statistics
  const getDrinkStats = () => {
    if (!report || report.orders.length === 0) return []

    const drinkMap = new Map<string, { quantity: number; revenue: number }>()

    report.orders.forEach((order) => {
      order.items.forEach((item) => {
        const existing = drinkMap.get(item.name) || { quantity: 0, revenue: 0 }
        drinkMap.set(item.name, {
          quantity: existing.quantity + item.quantity,
          revenue: existing.revenue + item.price * item.quantity,
        })
      })
    })

    return Array.from(drinkMap.entries())
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => b.quantity - a.quantity)
  }

  const totalItems =
    report?.orders.reduce((sum, order) => sum + order.items.reduce((itemSum, item) => itemSum + item.quantity, 0), 0) ||
    0

  const averageOrderValue = report && report.orders.length > 0 ? Math.round(report.total / report.orders.length) : 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-sm shadow-lg border-b-2 border-blue-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button
                  variant="outline"
                  size="lg"
                  className="rounded-2xl bg-transparent border-2 border-blue-200 hover:bg-blue-50 font-thai"
                >
                  <ArrowLeft className="h-5 w-5 mr-2" />
                  กลับหน้าหลัก
                </Button>
              </Link>
              <div className="bg-gradient-to-r from-blue-500 via-indigo-600 to-purple-600 p-3 rounded-2xl shadow-lg">
                <BarChart3 className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 font-thai">รายงานยอดขาย</h1>
                <p className="text-base text-gray-600 font-thai">สรุปยอดขายรายวัน</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3 bg-white/90 rounded-2xl px-4 py-3 shadow-lg border-2 border-blue-200">
                <Calendar className="h-5 w-5 text-blue-600" />
                <Input
                  type="date"
                  value={selectedDate}
                  onChange={handleDateChange}
                  className="border-0 bg-transparent focus:ring-0 font-thai text-base"
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
              <p className="text-xl font-thai text-gray-600">กำลังโหลดรายงาน...</p>
            </div>
          </div>
        ) : report ? (
          <div className="space-y-8">
            {/* Date Header */}
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-800 font-thai mb-2">รายงานประจำวัน</h2>
              <p className="text-lg text-gray-600 font-thai">{formatDate(new Date(selectedDate))}</p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="shadow-xl border-0 bg-gradient-to-br from-emerald-50 to-green-100">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-emerald-600 font-thai mb-1">ยอดขายรวม</p>
                      <p className="text-3xl font-bold text-emerald-700 font-thai">{formatCurrency(report.total)}</p>
                    </div>
                    <div className="bg-emerald-500 p-4 rounded-2xl">
                      <TrendingUp className="h-8 w-8 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-xl border-0 bg-gradient-to-br from-blue-50 to-indigo-100">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-blue-600 font-thai mb-1">จำนวนออเดอร์</p>
                      <p className="text-3xl font-bold text-blue-700">{report.orders.length}</p>
                    </div>
                    <div className="bg-blue-500 p-4 rounded-2xl">
                      <Receipt className="h-8 w-8 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-xl border-0 bg-gradient-to-br from-orange-50 to-amber-100">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-orange-600 font-thai mb-1">เครื่องดื่มที่ขาย</p>
                      <p className="text-3xl font-bold text-orange-700">{totalItems}</p>
                    </div>
                    <div className="bg-orange-500 p-4 rounded-2xl">
                      <Coffee className="h-8 w-8 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-xl border-0 bg-gradient-to-br from-purple-50 to-pink-100">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-purple-600 font-thai mb-1">ยอดขายเฉลี่ย</p>
                      <p className="text-3xl font-bold text-purple-700 font-thai">
                        {formatCurrency(averageOrderValue)}
                      </p>
                    </div>
                    <div className="bg-purple-500 p-4 rounded-2xl">
                      <ShoppingBag className="h-8 w-8 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Drinks Statistics */}
              <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-r from-orange-400 via-pink-500 to-red-500 text-white rounded-t-2xl">
                  <CardTitle className="text-xl font-bold font-thai flex items-center space-x-3">
                    <Coffee className="h-6 w-6" />
                    <span>สรุปเครื่องดื่มที่ขาย</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  {getDrinkStats().length === 0 ? (
                    <div className="text-center text-gray-500 py-12">
                      <Coffee className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                      <p className="text-xl font-thai">ไม่มีการขายในวันนี้</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {getDrinkStats().map((drink, index) => (
                        <div
                          key={drink.name}
                          className="flex items-center justify-between p-4 bg-gradient-to-r from-orange-50 to-pink-50 rounded-2xl border-2 border-orange-100"
                        >
                          <div className="flex items-center space-x-4">
                            <Badge
                              variant="outline"
                              className="bg-white border-2 border-orange-200 text-orange-800 font-bold px-3 py-1"
                            >
                              #{index + 1}
                            </Badge>
                            <div>
                              <h4 className="font-bold text-gray-800 font-thai text-lg">{drink.name}</h4>
                              <p className="text-sm text-gray-600">รายได้: {formatCurrency(drink.revenue)}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-emerald-600">{drink.quantity}</div>
                            <div className="text-sm text-gray-500 font-thai">แก้ว</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Orders List */}
              <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-r from-blue-500 via-indigo-600 to-purple-600 text-white rounded-t-2xl">
                  <CardTitle className="text-xl font-bold font-thai flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Receipt className="h-6 w-6" />
                      <span>รายการออเดอร์</span>
                    </div>
                    <Badge variant="secondary" className="bg-white/20 text-white">
                      {report.orders.length} รายการ
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <ScrollArea className="h-96">
                    {report.orders.length === 0 ? (
                      <div className="text-center text-gray-500 py-12">
                        <Receipt className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                        <p className="text-xl font-thai">ไม่มีออเดอร์ในวันนี้</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {report.orders.map((order) => (
                          <Card
                            key={order.id}
                            className="border-2 border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50 hover:border-blue-200 transition-colors"
                          >
                            <CardContent className="p-4">
                              <div className="flex justify-between items-start mb-4">
                                <div>
                                  <p className="font-bold text-gray-800 font-thai text-lg">
                                    ออเดอร์ #{String(order.id).slice(-8)}
                                  </p>
                                  <div className="flex items-center space-x-2 text-sm text-gray-600 mt-1">
                                    <Clock className="h-4 w-4" />
                                    <span>{formatTime(new Date(order.createdAt))}</span>
                                  </div>
                                </div>
                                <Badge className="bg-emerald-100 text-emerald-800 rounded-full px-3 py-1 font-bold">
                                  {formatCurrency(order.total)}
                                </Badge>
                              </div>
                              <div className="space-y-2">
                                {order.items.map((item, index) => (
                                  <div key={index} className="flex justify-between text-sm bg-white/50 p-2 rounded-lg">
                                    <span className="font-thai font-medium">
                                      {item.name} × {item.quantity}
                                    </span>
                                    <span className="font-bold">{formatCurrency(item.price * item.quantity)}</span>
                                  </div>
                                ))}
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          <div className="text-center text-gray-500 py-16">
            <BarChart3 className="h-20 w-20 mx-auto mb-4 text-gray-300" />
            <p className="text-2xl font-thai mb-2">ไม่พบข้อมูลรายงาน</p>
            <p className="text-gray-400 font-thai">กรุณาเลือกวันที่อื่น</p>
          </div>
        )}
      </div>
    </div>
  )
}
