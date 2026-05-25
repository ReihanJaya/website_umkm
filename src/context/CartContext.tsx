'use client'

import React, { createContext, useContext, useEffect, useReducer } from 'react'
import { toast } from 'react-hot-toast'

export interface CartItem {
  id: number
  name: string
  price: number
  image: string | null
  quantity: number
}

interface CartState {
  items: CartItem[]
  tableNumber: number | null
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; payload: number }
  | { type: 'UPDATE_QUANTITY'; payload: { id: number, quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'SET_TABLE'; payload: number }
  | { type: 'HYDRATE'; payload: CartState }

const CartContext = createContext<{
  state: CartState
  addItem: (item: CartItem) => void
  removeItem: (id: number) => void
  updateQuantity: (id: number, quantity: number) => void
  clearCart: () => void
  setTable: (table: number) => void
  totalItems: number
  totalPrice: number
} | undefined>(undefined)

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItem = state.items.find(item => item.id === action.payload.id)
      if (existingItem) {
        return {
          ...state,
          items: state.items.map(item =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        }
      }
      return { ...state, items: [...state.items, { ...action.payload, quantity: 1 }] }
    }
    case 'REMOVE_ITEM':
      return { ...state, items: state.items.filter(item => item.id !== action.payload) }
    case 'UPDATE_QUANTITY':
      return {
        ...state,
        items: state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: Math.max(1, action.payload.quantity) }
            : item
        ),
      }
    case 'CLEAR_CART':
      return { ...state, items: [] }
    case 'SET_TABLE':
      return { ...state, tableNumber: action.payload }
    case 'HYDRATE':
      return action.payload
    default:
      return state
  }
}

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, { items: [], tableNumber: null })

  // Initialize from LocalStorage
  useEffect(() => {
    const savedCart = localStorage.getItem('cart')
    if (savedCart) {
      try {
        const parsed = JSON.parse(savedCart)
        dispatch({ type: 'HYDRATE', payload: parsed })
      } catch (e) {
        console.error('Failed to parse cart storage', e)
      }
    }
  }, [])

  // Save to LocalStorage
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(state))
  }, [state])

  const addItem = React.useCallback((item: CartItem) => {
    dispatch({ type: 'ADD_ITEM', payload: item })
    toast.success(`${item.name} ditambahkan ke keranjang`)
  }, [])

  const removeItem = React.useCallback((id: number) => {
    dispatch({ type: 'REMOVE_ITEM', payload: id })
  }, [])

  const updateQuantity = React.useCallback((id: number, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } })
  }, [])

  const clearCart = React.useCallback(() => {
    dispatch({ type: 'CLEAR_CART' })
  }, [])

  const setTable = React.useCallback((table: number) => {
    dispatch({ type: 'SET_TABLE', payload: table })
  }, [])

  const totalItems = React.useMemo(() => state.items.reduce((acc, item) => acc + item.quantity, 0), [state.items])
  const totalPrice = React.useMemo(() => state.items.reduce((acc, item) => acc + item.price * item.quantity, 0), [state.items])

  const contextValue = React.useMemo(() => ({
    state,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    setTable,
    totalItems,
    totalPrice,
  }), [state, addItem, removeItem, updateQuantity, clearCart, setTable, totalItems, totalPrice])

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
