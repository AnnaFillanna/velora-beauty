import { createContext, useContext } from 'react'
import type { SkinProduct } from './data/skinProducts'

export type CartLine = { productId: string; quantity: number }

export type CartContextValue = {
  lines: CartLine[]
  itemCount: number
  subtotal: number
  drawerOpen: boolean
  addProduct: (product: SkinProduct, quantity?: number) => void
  changeQuantity: (productId: string, quantity: number) => void
  removeProduct: (productId: string) => void
  openDrawer: () => void
  closeDrawer: () => void
}

export const CartContext = createContext<CartContextValue | null>(null)

export function useCart() {
  const context = useContext(CartContext)
  if (!context) throw new Error('useCart muss innerhalb eines CartProvider verwendet werden.')
  return context
}
