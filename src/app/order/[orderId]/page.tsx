'use client'

import React, { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Navbar from '@/components/Navbar'
import { getStatusColor, getStatusLabel, formatRupiah } from '@/lib/utils'
import { Loader2, CheckCircle2, Clock, ChefHat, Utensils, Star, Phone, BellRing } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function OrderTrackingPage() {
  const params = useParams()
  const orderId = params.orderId as string
  
  const [order, setOrder] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchOrder()
    const interval = setInterval(fetchOrder, 5000)
    return () => clearInterval(interval)
  }, [orderId])

  const fetchOrder = async () => {
    try {
      const res = await fetch(`/api/orders/${orderId}`)
      const data = await res.json()
      setOrder(data)
    } finally {
      setLoading(false)
    }
  }

  const steps = [
    { id: 'PENDING', label: 'Menunggu', icon: Clock },
    { id: 'CONFIRMED', label: 'Konfirmasi', icon: CheckCircle2 },
    { id: 'PROCESSING', label: 'Dimasak', icon: ChefHat },
    { id: 'READY', label: 'Siap', icon: Utensils },
    { id: 'COMPLETED', label: 'Selesai', icon: Star },
  ]

  const currentStepIndex = steps.findIndex(s => s.id === order?.status)

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-white"><Loader2 className="animate-spin text-primary" size={40} /></div>

  return (
    <div className="min-h-screen bg-bg-surface flex flex-col">
      <Navbar />
      
      <main className="container pt-28 md:pt-36 pb-20 px-4 md:px-6 max-w-2xl mx-auto">
        <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
        >
            <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 bg-success/10 px-4 py-1.5 rounded-full border border-success/20 text-success mb-6">
                    <BellRing size={14} className="animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-widest pt-0.5">Live Status Update</span>
                </div>
                <h1 className="text-4xl font-black mb-2 tracking-tight">Cek Pesanan</h1>
                <p className="text-text-muted text-sm font-medium">Order ID: <span className="text-text-main font-bold">#{order?.orderCode}</span></p>
            </div>

            {/* Simple Step Progress */}
            <div className="bg-white p-6 sm:p-10 rounded-[24px] sm:rounded-[32px] border border-border shadow-sm mb-10">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center relative gap-8 md:gap-4">
                    {/* Progress Line Desktop */}
                    <div className="absolute top-[26px] left-0 right-0 h-1 bg-bg-surface rounded-full hidden md:block">
                        <div 
                          className="h-full bg-primary transition-all duration-1000" 
                          style={{ width: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
                        ></div>
                    </div>

                    {steps.map((step, index) => {
                        const Icon = step.icon
                        const isActive = index <= currentStepIndex
                        const isCurrent = index === currentStepIndex

                        return (
                            <div key={step.id} className="flex flex-row md:flex-col items-center gap-4 md:gap-3 relative z-10 w-full md:w-auto">
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 ${
                                    isCurrent ? 'bg-primary text-white shadow-lg shadow-primary/30 scale-110' : 
                                    isActive ? 'bg-primary-soft text-primary' : 
                                    'bg-bg-surface text-text-light border border-border'
                                }`}>
                                    <Icon size={24} />
                                </div>
                                <span className={`text-[11px] font-black uppercase tracking-widest ${isActive ? 'text-text-main' : 'text-text-light'}`}>
                                    {step.label}
                                </span>
                            </div>
                        )
                    })}
                </div>
            </div>

            <div className="bg-white rounded-[24px] sm:rounded-[32px] border border-border p-6 sm:p-8 md:p-10 text-center mb-8">
                <p className="text-text-muted text-xs font-black uppercase tracking-widest mb-4 opacity-60">Status Saat Ini</p>
                <h2 className="text-4xl font-black text-text-main mb-3 tracking-tighter">
                    {getStatusLabel(order?.status)}
                </h2>
                <div className="w-12 h-1.5 bg-primary rounded-full mx-auto"></div>
            </div>

            <div className="bg-white rounded-[24px] sm:rounded-[32px] border border-border p-6 sm:p-8 md:p-10 mb-10">
                <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
                    <span className="w-1.5 h-6 bg-primary rounded-full"></span>
                    Detail Menu
                </h3>
                <div className="space-y-4">
                    {order?.items.map((item: any) => (
                        <div key={item.id} className="flex justify-between items-center py-4 border-b border-border/50 last:border-0">
                            <div className="flex flex-col min-w-0 pr-4">
                                <span className="text-text-main font-bold text-base leading-tight truncate">{item.quantity}x {item.menuItem.name}</span>
                                {item.notes && (
                                    <span className="text-xs text-text-muted bg-bg-surface border border-border/60 px-2.5 py-0.5 rounded-lg mt-1.5 inline-block self-start truncate max-w-xs">
                                        Catatan: {item.notes}
                                    </span>
                                )}
                            </div>
                            <span className="font-extrabold text-text-main shrink-0">{formatRupiah(item.subtotal)}</span>
                        </div>
                    ))}
                    <div className="pt-6 flex justify-between items-center">
                        <span className="text-text-muted text-sm font-bold">Total Pembayaran</span>
                        <span className="text-2xl font-black text-primary tracking-tighter">{formatRupiah(order?.totalAmount || 0)}</span>
                    </div>
                </div>
            </div>

            <button className="w-full p-6 sm:p-8 bg-primary-soft hover:bg-primary/10 border border-primary/20 rounded-[24px] sm:rounded-[32px] transition-all flex items-center justify-between group">
                <div className="text-left">
                    <p className="text-[10px] text-text-muted font-bold uppercase tracking-widest mb-1">Butuh sesuatu?</p>
                    <p className="font-extrabold text-lg text-primary">Panggil Pelayan Meja No. {order?.tableNumber}</p>
                </div>
                <div className="w-14 h-14 bg-primary text-white rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform">
                    <Phone size={24} />
                </div>
            </button>
        </motion.div>
      </main>
    </div>
  )
}
