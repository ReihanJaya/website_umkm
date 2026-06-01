'use client'

import React, { useState, useEffect } from 'react'
import AdminSidebar from '@/components/AdminSidebar'
import { 
    Clock, 
    CheckCircle2, 
    ChefHat, 
    Utensils, 
    ArrowRight,
    User,
    ShoppingBag,
    Search
} from 'lucide-react'
import { formatRupiah, getStatusLabel } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-hot-toast'

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState('SEMUA')

  useEffect(() => {
    fetchOrders()
    const interval = setInterval(fetchOrders, 10000)
    return () => clearInterval(interval)
  }, [])

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/orders')
      const data = await res.json()
      setOrders(data)
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (id: number, status: string) => {
    try {
      const res = await fetch(`/api/orders/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      })
      if (res.ok) {
        setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o))
        toast.success(`Status → ${getStatusLabel(status)}`)
      }
    } catch (e) {
      toast.error('Gagal memperbarui status')
    }
  }

  const getStatusConfig = (status: string) => {
    switch(status) {
      case 'PENDING':    return { bg: 'bg-orange-50',  text: 'text-orange-600',  border: 'border-orange-100',  icon: Clock }
      case 'CONFIRMED':  return { bg: 'bg-blue-50',    text: 'text-blue-600',    border: 'border-blue-100',    icon: CheckCircle2 }
      case 'PROCESSING': return { bg: 'bg-purple-50',  text: 'text-purple-600',  border: 'border-purple-100',  icon: ChefHat }
      case 'READY':      return { bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-100', icon: Utensils }
      case 'COMPLETED':  return { bg: 'bg-gray-50',    text: 'text-gray-500',    border: 'border-gray-100',    icon: ShoppingBag }
      default:           return { bg: 'bg-gray-50',    text: 'text-gray-500',    border: 'border-gray-100',    icon: Clock }
    }
  }

  const filters = ['SEMUA', 'PENDING', 'PROCESSING', 'READY', 'COMPLETED']
  const filteredOrders = activeFilter === 'SEMUA' ? orders : orders.filter(o => o.status === activeFilter)

  return (
    <div className="min-h-screen bg-[#F8F9FB] flex">
      <AdminSidebar />
      
      <main className="flex-grow lg:pl-64 transition-all">
        {/* Topbar */}
        <header className="h-16 md:h-20 bg-white border-b border-border sticky top-0 z-30 flex items-center justify-between px-5 md:px-10 pl-16 lg:pl-10">
          <div>
            <h1 className="text-base md:text-xl font-black tracking-tight text-text-main">
              Manajemen <span className="text-primary italic">Pesanan</span>
            </h1>
            <p className="hidden md:block text-xs text-text-muted font-medium mt-0.5">Update otomatis setiap 10 detik</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-full text-xs font-black border border-emerald-100">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              Live
            </div>
            <div className="w-9 h-9 md:w-10 md:h-10 bg-primary-soft rounded-2xl flex items-center justify-center text-primary border border-primary/20">
              <User size={18} strokeWidth={2.5} />
            </div>
          </div>
        </header>

        <div className="p-5 md:p-8 lg:p-10">
          {/* Action Bar */}
          <div className="flex flex-col gap-4 mb-8">
            {/* Search */}
            <div className="relative w-full md:max-w-sm">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-light" />
              <input 
                type="text" 
                placeholder="Cari Order ID atau Meja..."
                className="w-full bg-white border border-border rounded-2xl py-3 pl-11 pr-4 text-sm font-medium focus:border-primary/30 outline-none shadow-sm"
              />
            </div>
            {/* Filters — horizontal scroll on mobile */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
              {filters.map(f => (
                <button 
                  key={f} 
                  onClick={() => setActiveFilter(f)}
                  className={`px-4 py-2 rounded-xl text-[10px] font-black tracking-widest border shrink-0 transition-all ${
                    f === activeFilter 
                    ? 'bg-primary text-white border-primary shadow-md shadow-primary/20' 
                    : 'bg-white text-text-muted border-border hover:border-primary/30'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Orders Feed */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            <AnimatePresence>
            {loading ? (
              [...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-[28px] border border-border p-6 shadow-sm animate-pulse h-64" />
              ))
            ) : filteredOrders.length === 0 ? (
              <div className="col-span-full py-20 text-center">
                <ShoppingBag size={40} className="text-text-light mx-auto mb-4" />
                <p className="font-bold text-text-muted">Tidak ada pesanan ditemukan</p>
              </div>
            ) : filteredOrders.map((order, i) => {
              const config = getStatusConfig(order.status)
              const Icon = config.icon
              return (
                <motion.div 
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: i * 0.04 }}
                  key={order.id} 
                  className="bg-white rounded-[24px] md:rounded-[32px] border border-border p-5 md:p-7 shadow-sm hover:shadow-lg hover:shadow-black/[0.04] transition-all group"
                >
                  {/* Header */}
                  <div className="flex justify-between items-start mb-5">
                    <div>
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h3 className="font-heading font-black text-lg tracking-tighter">#{order.orderCode}</h3>
                        <div className={`px-2 py-0.5 ${config.bg} ${config.text} border ${config.border} rounded-md text-[9px] font-black uppercase`}>
                          {order.status}
                        </div>
                      </div>
                      <p className="text-[10px] text-text-light font-bold uppercase tracking-widest">
                        Meja <span className="text-text-main">{order.tableNumber}</span>
                        <span className="mx-1">·</span>
                        {new Date(order.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </p>
                    </div>
                    <div className={`w-10 h-10 ${config.bg} ${config.text} rounded-xl flex items-center justify-center flex-shrink-0`}>
                      <Icon size={18} />
                    </div>
                  </div>

                  {/* Items */}
                  <div className="space-y-3.5 mb-5">
                    {order.items.slice(0, 4).map((item: any) => (
                      <div key={item.id} className="text-sm">
                        <div className="flex justify-between items-center">
                          <p className="text-text-main font-bold truncate mr-2">
                            <span className="text-primary">{item.quantity}x</span> {item.menuItem.name}
                          </p>
                          <p className="text-text-muted font-medium shrink-0">{formatRupiah(item.subtotal)}</p>
                        </div>
                        {item.notes && (
                          <div className="mt-1">
                            <span className="text-[10px] font-bold text-primary bg-primary-soft border border-primary/10 px-2.5 py-0.5 rounded-lg inline-block truncate max-w-full">
                              Catatan: {item.notes}
                            </span>
                          </div>
                        )}
                      </div>
                    ))}
                    {order.items.length > 4 && (
                      <p className="text-[10px] text-text-light font-bold">+{order.items.length - 4} item lainnya</p>
                    )}
                    <div className="pt-3 border-t border-border/50 flex justify-between items-center">
                      <span className="text-xs font-bold text-text-muted">Total</span>
                      <span className="font-black text-text-main">{formatRupiah(order.totalAmount)}</span>
                    </div>
                  </div>

                  {/* Status Stepper */}
                  <div className="grid grid-cols-4 gap-1.5 mb-4">
                    {[
                      { s: 'PENDING',    i: Clock },
                      { s: 'PROCESSING', i: ChefHat },
                      { s: 'READY',      i: Utensils },
                      { s: 'COMPLETED',  i: CheckCircle2 }
                    ].map((step) => (
                      <button 
                        key={step.s}
                        onClick={() => updateStatus(order.id, step.s)}
                        title={step.s}
                        className={`h-9 rounded-xl flex items-center justify-center transition-all text-xs ${
                          order.status === step.s 
                          ? 'bg-primary text-white shadow-md shadow-primary/20 scale-105' 
                          : 'bg-bg-surface text-text-light hover:bg-primary-soft hover:text-primary'
                        }`}
                      >
                        <step.i size={16} />
                      </button>
                    ))}
                  </div>

                  <button className="w-full py-3 bg-bg-surface border border-border rounded-2xl text-[10px] font-black uppercase tracking-widest text-text-muted hover:bg-primary hover:text-white hover:border-primary transition-all flex items-center justify-center gap-2 group/btn">
                    Detail Pesanan <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </motion.div>
              )
            })}
            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  )
}
