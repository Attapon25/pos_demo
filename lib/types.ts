export interface Product {
  id: string
  name: string
  price: number
  category?: string
  isActive: boolean
}

export interface CartItem {
  productId: string
  name: string
  price: number
  quantity: number
  category?: string
}

export interface OrderRequest {
  items: {
    productId: string
    quantity: number
  }[]
}

export interface OrderResponse {
  id: string
  total: number
  createdAt: string
  items: {
    id: string
    name: string
    price: number
    quantity: number
  }[]
}

export interface DailyReportResponse {
  total: number
  orders: OrderResponse[]
}

export interface MenuItem {
  id: string
  name: string
  price: number
  category?: string
}
