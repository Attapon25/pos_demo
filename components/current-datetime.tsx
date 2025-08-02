"use client"

import { useState, useEffect } from "react"
import { formatDateTime, getThaiDayName } from "@/lib/utils"
import { Calendar } from "lucide-react"

export function CurrentDateTime() {
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl px-6 py-3 shadow-lg border border-amber-200">
      <div className="flex items-center space-x-3">
        <div className="bg-gradient-to-r from-amber-400 to-orange-500 p-2 rounded-xl">
          <Calendar className="h-5 w-5 text-white" />
        </div>
        <div className="text-right">
          <div className="text-sm font-medium text-gray-600">วัน{getThaiDayName(currentTime)}</div>
          <div className="text-lg font-bold text-gray-800 font-thai">{formatDateTime(currentTime)}</div>
        </div>
      </div>
    </div>
  )
}
