export interface ApiErrorResponse {
  success: boolean
  message: string
}

export interface Admin {
  id: string
  name: string
  username: string
  email?: string
  profile?: string
  phone?: string
  role: 'Superadmin' | 'Staff'
  tokenVersion: number
  created_at: string
  updated_at: string
}

export interface Article {
  id: string
  title: string
  slug: string
  content: string
  published_at: string
  image_url: string
  created_at: string
  updated_at: string
}

export interface Category {
  id: string
  name: string
  slug: string
  image_url: string
  created_at: string
  updated_at: string
}

export interface Book {
  id: string
  name: string
  slug: string
  desc: string
  author: string
  publisher: string
  published_at: string
  language: string
  page: number
  length: number
  width: number
  weight: number
  price: number
  discount_price?: number
  qty?: number
  categoryId: string
  image_url: string
  created_at: string
  updated_at: string
}

export type BookImage = {
  id: string
  title: string
  bookId: string
  image_url: string
  created_at: string
  updated_at: string
}

export type ShippingService = {
  service: string
  description: string
  cost: number
  etd: string
}

export type OrderItem = {
  id: string
  bookId: string
  qty: number
  price: number
  book: {
    id: string
    name: string
    slug: string
    image_url: string
    author: string
  }
}

export type OrderShipping = {
  id: string
  courier: string
  service: string
  description: string
  cost: number
  etd: string
}

export type OrderPayment = {
  id: string
  method: string | null
  status: 'Pending' | 'Paid' | 'Failed'
  token: string
  paid_at: string | null
}

export type OrderAddress = {
  id: string
  name: string
  phone: string
  province: string
  city: string
  district: string
  street: string
  zip: string
}

export type User = {
  id: string
  name?: string
  email?: string
  profile?: string
  provider: "Email" | "Google"
  phone?: string
  tokenVersion: number
  created_at: string
  updated_at: string
}

export type Order = {
  id: string
  receipt_number: string | null
  userId: string
  addressId: string | null
  status: 'Pending' | 'Paid' | 'Processing' | 'Completed' | 'Cancelled' | 'Failed'
  total: number
  note: string | null
  created_at: string
  items: OrderItem[]
  payment: OrderPayment | null
  shipping: OrderShipping | null
  address: OrderAddress | null
  user: User | null
}

export type Review = {
  id: string
  userId: string
  bookId: string
  rating: number
  comment?: string
  created_at: string
  user?: {
    id: string
    name: string
    email: string
    profile?: string
  }
  book?: {
    id: string
    name: string
    author: string
    slug: string
    image_url?: string
  }
}