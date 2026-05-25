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
      <div className="min-h-screen bg-bg-dark flex flex-col">
        <Navbar />
        <main className="container flex-grow flex flex-col items-center justify-center py-20 px-6 mt-20">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-28 h-28 bg-white/[0.03] rounded-[32px] flex items-center justify-center mb-10 border border-white/5 shadow-2xl"
          >
            <ShoppingBag size={48} className="text-text-muted" />
          </motion.div>
          <h1 className="text-3xl font-black mb-4 tracking-tight">Keranjang Kosong</h1>
          <p className="text-text-secondary text-center max-w-sm mb-12 text-balance leading-relaxed">
            Sepertinya pesanan lezat Anda belum dimulai. Yuk jelajahi menu spesial kami!
          </p>
          <Link href={`/menu/${tableNumber}`} className="btn btn-primary px-12 py-5 rounded-2xl">
            Jelajahi Menu
          </Link>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-bg-dark pb-40">
      <Navbar />
      
      <main className="container pt-32 px-6 max-w-4xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-2">
                <button onClick={() => router.back()} className="p-2 hover:bg-white/5 rounded-xl transition-colors">
                    <ArrowLeft size={18} className="text-text-muted" />
                </button>
                <div className="h-1 w-8 bg-primary/20 rounded-full"></div>
            </div>
            <h1 className="text-4xl font-black tracking-tight">Keranjang <span className="text-primary italic">Saya</span></h1>
            <p className="text-text-secondary mt-2">Menyiapkan hidangan untuk <span className="text-white font-bold">Meja {tableNumber}</span></p>
          </div>
          <div className="bg-white/[0.03] px-6 py-3 rounded-2xl border border-white/5 backdrop-blur-md">
             <span className="text-text-secondary text-xs uppercase font-black tracking-widest">{totalItems} Items Selected</span>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <AnimatePresence mode='popLayout'>
            {state.items.map((item, idx) => (
              <motion.div 
                key={item.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-[#111] p-6 rounded-[28px] border border-white/[0.05] flex gap-6 hover:bg-[#161616] transition-all group"
              >
                <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-[22px] overflow-hidden bg-bg-elevated flex-shrink-0 border border-white/[0.08] shadow-lg">
                  {item.image ? (
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-text-muted">
                        <ShoppingBag size={32} />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                </div>

                <div className="flex-grow flex flex-col justify-between py-1">
                  <div className="flex justify-between items-start">
                    <div>
                        <h3 className="font-heading font-extrabold text-xl mb-1 group-hover:text-primary transition-colors">{item.name}</h3>
                        <p className="text-text-muted text-xs font-bold uppercase tracking-widest">Premium Choice</p>
                    </div>
                    <motion.button 
                      whileHover={{ scale: 1.1, backgroundColor: 'rgba(239, 68, 68, 0.1)' }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => removeItem(item.id)}
                      className="text-text-muted p-2 rounded-xl transition-all"
                    >
                      <Trash2 size={20} />
                    </motion.button>
                  </div>
                  
                  <div className="flex justify-between items-end">
                    <div className="flex flex-col">
                        <span className="text-text-muted text-[10px] font-black uppercase tracking-widest mb-1">Price</span>
                        <span className="text-white font-black text-xl">{formatRupiah(item.price)}</span>
                    </div>
                    
                    <div className="flex items-center gap-4 bg-black/40 rounded-2xl p-2 border border-white/[0.05] shadow-inner">
                      <motion.button 
                        whileTap={{ scale: 0.8 }}
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/[0.03] hover:bg-white/[0.08] text-text-secondary border border-white/[0.05]"
                      >
                        <Minus size={18} />
                      </motion.button>
                      <span className="w-6 text-center font-black text-base">{item.quantity}</span>
                      <motion.button 
                        whileTap={{ scale: 0.8 }}
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-10 h-10 flex items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20 hover:bg-primary hover:text-white transition-all shadow-lg shadow-primary/5"
                      >
                        <Plus size={18} />
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Premium Notes Section */}
        <div className="mt-12 group">
            <h4 className="text-sm font-black uppercase tracking-[0.2em] mb-4 text-text-muted flex items-center gap-2">
                Special Instructions
                <div className="h-px bg-white/[0.05] flex-grow"></div>
            </h4>
            <textarea 
                placeholder="Ada permintaan khusus? (misal: tingkat kepedasan, tanpa bawang, dll)"
                className="w-full bg-white/[0.02] border border-white/5 rounded-[24px] p-6 text-white min-h-[140px] focus:bg-white/[0.05] focus:border-primary/30 transition-all placeholder:text-text-muted/50 text-sm leading-relaxed"
            ></textarea>
        </div>
      </main>

      {/* Modern Fixed Checkout Bar */}
      <div className="fixed bottom-0 left-0 right-0 p-6 sm:p-10 glass border-t border-white/[0.08] z-50 overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[80px] -mr-32 -mt-32"></div>
        <div className="container relative z-10 flex flex-col sm:flex-row items-center justify-between gap-8 max-w-4xl">
          <div className="flex flex-col items-center sm:items-start">
            <span className="text-text-secondary text-xs font-black uppercase tracking-widest mb-1">Total Checkout</span>
            <span className="text-4xl font-black text-white leading-none tracking-tighter">
                {formatRupiah(totalPrice)}
            </span>
          </div>
          <Link href={`/checkout/${tableNumber}`} className="btn btn-primary px-16 py-6 text-xl rounded-2xl w-full sm:w-auto shadow-[0_20px_50px_rgba(255,107,53,0.3)] group overflow-hidden">
            <div className="relative z-10 flex items-center gap-3">
                Lanjutkan
                <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform duration-500" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
          </Link>
        </div>
      </div>
    </div>
  )
}
