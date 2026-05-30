'use client'

import React from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import { useCart } from '@/context/CartContext'
import { formatRupiah } from '@/lib/utils'
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, ArrowLeft } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function CartPage() {
  const params = useParams()
  const tableNumber = params.table as string
  const router = useRouter()
  const { state, removeItem, updateQuantity, totalPrice, totalItems } = useCart()

  if (!state.items || state.items.length === 0) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Navbar />
        <main className="container flex-grow flex flex-col items-center justify-center py-20 px-6 mt-20">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-24 h-24 bg-bg-surface rounded-full flex items-center justify-center mb-8 border border-border shadow-sm"
          >
            <ShoppingBag size={40} className="text-text-light" />
          </motion.div>
          <h1 className="text-3xl font-black mb-3">Pesanan Kosong</h1>
          <p className="text-text-muted text-center max-w-sm mb-10 leading-relaxed">
            Wah, sepertinya Anda belum memilih hidangan apapun. Ayo mulai memesan!
          </p>
          <Link href={`/menu/${tableNumber}`} className="btn btn-primary px-10 py-4 shadow-lg shadow-primary/20">
            Pesan Sekarang
          </Link>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-bg-surface/30 pb-40">
      <Navbar />
      
      <main className="container pt-28 md:pt-36 px-4 md:px-6 max-w-3xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-3">
                <button onClick={() => router.back()} className="p-2 hover:bg-bg-surface rounded-full transition-colors">
                    <ArrowLeft size={20} className="text-text-muted" />
                </button>
                <div className="h-1 w-6 bg-primary/20 rounded-full"></div>
            </div>
            <h1 className="text-4xl font-black tracking-tight">Keranjang <span className="text-primary italic">Belanja</span></h1>
            <p className="text-text-muted mt-1 font-medium">Memesan untuk <span className="text-text-main font-bold">Meja {tableNumber}</span></p>
          </div>
          <div className="bg-white px-5 py-2.5 rounded-full border border-border shadow-sm">
             <span className="text-text-muted text-xs font-bold uppercase tracking-widest">{totalItems} Produk</span>
          </div>
        </div>

        <div className="flex flex-col gap-5">
          <AnimatePresence mode='popLayout'>
            {state.items.map((item, idx) => (
              <motion.div 
                key={item.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-white p-4 sm:p-5 rounded-[20px] sm:rounded-[24px] border border-border flex gap-4 sm:gap-5 hover:border-primary/20 transition-all group"
              >
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-[14px] sm:rounded-[18px] overflow-hidden bg-bg-surface flex-shrink-0 border border-border">
                  {item.image ? (
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-text-light/20">
                        <ShoppingBag size={24} />
                    </div>
                  )}
                </div>

                <div className="flex-grow flex flex-col justify-between py-1">
                  <div className="flex justify-between items-start">
                    <div>
                        <h3 className="font-bold text-lg leading-tight mb-1 group-hover:text-primary transition-colors">{item.name}</h3>
                        <p className="text-text-muted text-xs font-semibold uppercase tracking-widest opacity-60">Dapur Nusantara</p>
                    </div>
                    <button 
                      onClick={() => removeItem(item.id)}
                      className="text-text-light hover:text-danger p-2 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                  
                  <div className="flex justify-between items-end mt-2 sm:mt-4">
                    <span className="text-text-main font-black text-base sm:text-lg">{formatRupiah(item.price)}</span>
                    
                    <div className="flex items-center gap-2.5 sm:gap-4 bg-bg-surface rounded-2xl p-1 sm:p-1.5 border border-border">
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-lg sm:rounded-xl bg-white hover:bg-gray-100 text-text-muted border border-border transition-colors"
                      >
                        <Minus size={14} className="sm:hidden" />
                        <Minus size={16} className="hidden sm:block" />
                      </button>
                      <span className="w-4 text-center font-bold text-xs sm:text-sm">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-lg sm:rounded-xl bg-primary text-white border border-primary hover:bg-primary-dark transition-colors"
                      >
                        <Plus size={14} className="sm:hidden" />
                        <Plus size={16} className="hidden sm:block" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Notes Input */}
        <div className="mt-10">
            <h4 className="text-xs font-black uppercase tracking-widest mb-4 text-text-light">Catatan Pesanan</h4>
            <textarea 
                placeholder="Misal: Tidak pakai sambal, es batu dipisah, dll..."
                className="w-full bg-white border border-border rounded-[20px] p-6 text-text-main min-h-[120px] focus:border-primary/50 transition-all placeholder:text-text-light/50 text-sm shadow-sm"
            ></textarea>
        </div>
      </main>

      {/* Floating Price Bar */}
      <div className="fixed bottom-0 left-0 right-0 p-5 pb-8 sm:p-8 bg-white/80 backdrop-blur-xl border-t border-border z-50">
        <div className="container flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6 max-w-3xl px-4 md:px-6">
          <div className="flex flex-col items-center sm:items-start">
            <span className="text-text-muted text-xs font-bold uppercase tracking-widest mb-1">Total Pembayaran</span>
            <span className="text-3xl font-black text-text-main tracking-tighter">
                {formatRupiah(totalPrice)}
            </span>
          </div>
          <Link href={`/checkout/${tableNumber}`} className="btn btn-primary px-16 py-5 text-lg rounded-2xl w-full sm:w-auto shadow-xl shadow-primary/20">
            Bayar Pesanan
            <ArrowRight size={20} />
          </Link>
        </div>
      </div>
    </div>
  )
}
