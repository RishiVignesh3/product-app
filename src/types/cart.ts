export interface CartItemResponse {
  id: number
  productId: number
  productName: string
  productPrice: number
  quantity: number
  subtotal: number
}

export interface CartResponse {
  items: CartItemResponse[]
  totalItems: number
  totalPrice: number
}

export interface AddToCartRequest {
  productId: number
  quantity: number
}
