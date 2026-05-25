'use client'

import React, { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import { useCart } from '@/context/CartContext'
import { formatRupiah } from '@/lib/utils'
import { CreditCard, ArrowLeft, Loader2, CheckCircle2, ShieldCheck, Zap } from 'lucide-react'
import { motion } from 'framer-motion'
import { toast } from 'react-hot-toast'

export default function CheckoutPage() {
  const params = useParams()
  const tableNumber = params.table as string
  const router = useRouter()
  const { state, totalPrice, clearCart } = useCart()
  const [loading, setLoading] = useState(false)

  const handlePlaceOrder = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tableNumber,
          items: state.items,
          totalAmount: totalPrice,
          notes: ""
        })
      })

      if (!response.ok) throw new Error('Gagal membuat pesanan')
      
      const order = await response.json()
      toast.success('Pesanan berhasil dibuat!')
      clearCart()
      router.push(`/payment/${order.id}`)
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      
      <main className="container pt-32 pb-20 px-6 max-w-2xl">
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 text-text-muted hover:text-primary mb-10 transition-all font-bold text-sm uppercase tracking-widest"
        >
          <ArrowLeft size={18} />
          Kembali
        </button>

        <h1 className="text-4xl font-black mb-10 tracking-tight text-text-main">
            Konfirmasi <span className="text-primary italic">Pesanan</span>
        </h1>

        <div className="space-y-8">
          {/* Order Summary */}
          <div className="bg-bg-surface rounded-[32px] border border-border p-8 md:p-10 shadow-sm">
            <h2 className="text-xl font-bold mb-8 flex items-center gap-3">
              Ringkasan Menu
            </h2>
            
            <div className="space-y-4">
              {state.items.map(item => (
                <div key={item.id} className="flex justify-between items-center py-4 border-b border-border/50 last:border-0">
                  <div className="flex flex-col">
                    <span className="text-text-main font-bold text-base leading-tight">{item.name}</span>
                    <span className="text-text-muted text-xs font-medium mt-1">{item.quantity}x @{formatRupiah(item.price)}</span>
                  </div>
                  <span className="font-extrabold text-text-main">{formatRupiah(item.price * item.quantity)}</span>
                </div>
              ))}
              
              <div className="pt-8 flex justify-between items-center">
                <div className="flex flex-col">
                    <span className="text-text-muted text-xs font-bold uppercase tracking-widest">Total Bayar</span>
                    <span className="text-3xl font-black text-primary tracking-tighter">{formatRupiah(totalPrice)}</span>
                </div>
                <div className="px-4 py-2 bg-success/10 rounded-xl text-success text-[10px] font-black uppercase tracking-widest">
                    Meja {tableNumber}
                </div>
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-bg-surface rounded-[32px] border border-border p-8 md:p-10">
            <h2 className="text-xl font-bold mb-8">Metode Pembayaran</h2>
            <div className="p-6 bg-white border border-primary/20 rounded-2xl flex items-center gap-5 shadow-sm">
              <div className="w-14 h-14 bg-primary rounded-[16px] flex items-center justify-center text-white shadow-lg shadow-primary/20">
                <CreditCard size={28} />
              </div>
              <div>
                <p className="font-bold text-lg">QRIS Instan</p>
                <div className="flex items-center gap-2 text-text-muted text-xs font-medium">
                    <Zap size={12} className="text-warning fill-warning" />
                    <span>Konfirmasi Otomatis</span>
                </div>
              </div>
            </div>
          </div>
          
          <button 
            onClick={handlePlaceOrder}
            disabled={loading}
            className="btn btn-primary w-full py-6 text-xl font-black rounded-2xl shadow-xl shadow-primary/20 disabled:opacity-50"
          >
            {loading ? (
              <Loader2 size={24} className="animate-spin" />
            ) : (
              'Buat Pesanan & Bayar'
            )}
          </button>

          <p className="text-center text-text-light text-xs font-medium">
            Pesanan Anda akan diproses setelah pembayaran terkonfirmasi.
          </p>
        </div>
      </main>
    </div>
  )
}
