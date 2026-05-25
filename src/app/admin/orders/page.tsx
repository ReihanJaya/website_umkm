'use client'

import React, { useState, useEffect } from 'react'
import AdminSidebar from '@/components/AdminSidebar'
import { 
    Clock, 
    CheckCircle2, 
    ChefHat, 
    Utensils, 
    MoreVertical, 
    ArrowRight,
    User,
    ShoppingBag,
    LayoutGrid,
    Search,
    Filter
} from 'lucide-react'
import { formatRupiah, getStatusLabel } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-hot-toast'

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

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
        toast.success(`Status diperbarui ke ${getStatusLabel(status)}`)
      }
    } catch (e) {
      toast.error('Gagal memperbarui status')
    }
  }

  const getStatusConfig = (status: string) => {
    switch(status) {
        case 'PENDING': return { bg: 'bg-orange-50', text: 'text-orange-600', border: 'border-orange-100', icon: Clock }
        case 'CONFIRMED': return { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-100', icon: CheckCircle2 }
        case 'PROCESSING': return { bg: 'bg-purple-50', text: 'text-purple-600', border: 'border-purple-100', icon: ChefHat }
        case 'READY': return { bg: 'bg-green-50', text: 'text-green-600', border: 'border-green-100', icon: Utensils }
        case 'COMPLETED': return { bg: 'bg-gray-50', text: 'text-gray-600', border: 'border-gray-100', icon: ShoppingBag }
        default: return { bg: 'bg-gray-50', text: 'text-gray-600', border: 'border-gray-100', icon: Clock }
    }
  }

  return (
    <div className="min-h-screen bg-bg-surface flex">
      <AdminSidebar />
      
      <main className="flex-grow pl-64 transition-all">
        {/* Topbar */}
        <header className="h-20 bg-white border-b border-border sticky top-0 z-30 flex items-center justify-between px-10">
          <div className="flex items-center gap-4">
              <h1 className="text-xl font-black tracking-tight text-text-main">Manajemen <span className="text-primary italic">Pesanan</span></h1>
          </div>
          <div className="flex items-center gap-6">
            <div className="w-10 h-10 bg-primary-soft rounded-2xl flex items-center justify-center text-primary border border-primary/20">
                <User size={20} strokeWidth={2.5} />
            </div>
          </div>
        </header>

        <div className="p-10">
            {/* Action Bar */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12">
                <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="relative flex-grow md:w-80">
                        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-light" />
                        <input 
                            type="text" 
                            placeholder="Cari Order ID atau Meja..."
                            className="w-full bg-white border border-border rounded-2xl py-3 pl-12 pr-4 text-sm font-medium focus:border-primary/30 outline-none shadow-sm"
                        />
                    </div>
                </div>
                
                <div className="flex items-center gap-3">
                   {['SEMUA', 'PENDING', 'PROCESSING', 'COMPLETED'].map(t => (
                      <button key={t} className={`px-5 py-2.5 rounded-xl text-[10px] font-black tracking-widest border transition-all ${t === 'SEMUA' ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20' : 'bg-white text-text-muted border-border hover:border-primary/30'}`}>{t}</button>
                   ))}
                </div>
            </div>

            {/* Orders Feed */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                <AnimatePresence>
                {loading ? (
                    <p className="col-span-full py-20 text-center font-bold text-text-light">Memuat pesanan masuk...</p>
                ) : orders.map((order, i) => {
                    const config = getStatusConfig(order.status)
                    const Icon = config.icon
                    
                    return (
                        <motion.div 
                            layout
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.05 }}
                            key={order.id} 
                            className="bg-white rounded-[40px] border border-border p-8 shadow-sm hover:shadow-xl hover:shadow-black/[0.02] transition-all group"
                        >
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className="font-heading font-black text-xl tracking-tighter">#{order.orderCode}</h3>
                                        <div className={`px-2 py-0.5 ${config.bg} ${config.text} border ${config.border} rounded-md text-[9px] font-black uppercase`}>
                                            {order.status}
                                        </div>
                                    </div>
                                    <p className="text-[10px] text-text-light font-bold uppercase tracking-widest">Meja <span className="text-text-main">{order.tableNumber}</span> · {new Date(order.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                                </div>
                                <button className="p-2 text-text-light hover:text-primary transition-colors">
                                    <MoreVertical size={20} />
                                </button>
                            </div>

                            <div className="space-y-3 mb-8">
                                {order.items.map((item: any) => (
                                    <div key={item.id} className="flex justify-between items-center text-sm">
                                        <p className="text-text-main font-bold"><span className="text-primary">{item.quantity}x</span> {item.menuItem.name}</p>
                                        <p className="text-text-muted font-medium">{formatRupiah(item.subtotal)}</p>
                                    </div>
                                ))}
                                <div className="pt-3 border-t border-border/50 flex justify-between items-center text-lg font-black text-text-main">
                                    <span>Total</span>
                                    <span className="text-primary">{formatRupiah(order.totalAmount)}</span>
                                </div>
                            </div>

                            {/* Status Stepper */}
                            <div className="grid grid-cols-4 gap-2 mb-8">
                                {[
                                    { s: 'PENDING', i: Clock },
                                    { s: 'PROCESSING', i: ChefHat },
                                    { s: 'READY', i: Utensils },
                                    { s: 'COMPLETED', i: CheckCircle2 }
                                ].map((step) => {
                                    const isDone = orders.findIndex(o => o.id === order.id && o.status === step.s) !== -1 // Simple check
                                    return (
                                        <button 
                                            key={step.s}
                                            onClick={() => updateStatus(order.id, step.s)}
                                            className={`h-10 rounded-xl flex items-center justify-center transition-all ${
                                                order.status === step.s 
                                                ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-110' 
                                                : 'bg-bg-surface text-text-light hover:bg-primary-soft hover:text-primary'
                                            }`}
                                        >
                                            <step.i size={18} />
                                        </button>
                                    )
                                })}
                            </div>

                            <button className="w-full py-4 bg-bg-surface border border-border rounded-2xl text-[10px] font-black uppercase tracking-widest text-text-muted hover:bg-primary hover:text-white hover:border-primary transition-all flex items-center justify-center gap-2 group/btn">
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
