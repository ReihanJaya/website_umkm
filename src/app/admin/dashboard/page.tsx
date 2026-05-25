'use client'

import React, { useState, useEffect } from 'react'
import AdminSidebar from '@/components/AdminSidebar'
import { 
    ShoppingBag, 
    DollarSign, 
    TrendingUp, 
    Clock, 
    ArrowUpRight, 
    Search,
    Bell,
    User,
    ChevronRight,
    Utensils
} from 'lucide-react'
import { formatRupiah } from '@/lib/utils'
import { motion } from 'framer-motion'

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    activeOrders: 0,
    topMenu: '-'
  })

  useEffect(() => {
    // Initial fetch from API
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/stats')
      const data = await res.json()
      setStats(data)
    } catch (e) {
      // Mock data for demo
      setStats({
        totalOrders: 156,
        totalRevenue: 1250000,
        activeOrders: 8,
        topMenu: 'Nasi Goreng Spesial'
      })
    }
  }

  const statCards = [
    { title: 'Total Pendapatan', value: formatRupiah(stats.totalRevenue), icon: DollarSign, trend: '+12.5%', color: 'text-success', bg: 'bg-green-50' },
    { title: 'Total Pesanan', value: stats.totalOrders, icon: ShoppingBag, trend: '+5.2%', color: 'text-primary', bg: 'bg-primary-soft' },
    { title: 'Pesanan Aktif', value: stats.activeOrders, icon: Clock, trend: '8 New', color: 'text-blue-500', bg: 'bg-blue-50' },
    { title: 'Menu Terlaris', value: stats.topMenu, icon: TrendingUp, trend: 'Best Seller', color: 'text-purple-500', bg: 'bg-purple-50' },
  ]

  return (
    <div className="min-h-screen bg-bg-surface flex">
      <AdminSidebar />
      
      <main className="flex-grow pl-64 transition-all">
        {/* Topbar */}
        <header className="h-20 bg-white border-b border-border sticky top-0 z-30 flex items-center justify-between px-10">
          <div className="flex items-center gap-4">
              <h1 className="text-xl font-black tracking-tight text-text-main">Ringkasan <span className="text-primary italic">Dashboard</span></h1>
              <div className="h-5 w-px bg-border"></div>
              <div className="hidden md:flex relative w-64">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-light" />
                <input 
                    type="text" 
                    placeholder="Cari pesanan..."
                    className="w-full bg-bg-surface border border-border rounded-xl py-2 pl-10 pr-4 text-xs font-medium focus:border-primary/30 outline-none"
                />
              </div>
          </div>

          <div className="flex items-center gap-6">
            <button className="relative p-2 text-text-muted hover:text-primary transition-colors">
                <Bell size={20} />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-danger rounded-full border-2 border-white"></span>
            </button>
            <div className="flex items-center gap-3 pl-6 border-l border-border">
                <div className="text-right">
                    <p className="text-xs font-bold text-text-main">Super Admin</p>
                    <p className="text-[10px] font-medium text-text-light uppercase tracking-widest">Administrator</p>
                </div>
                <div className="w-10 h-10 bg-primary-soft rounded-2xl flex items-center justify-center text-primary border border-primary/20">
                    <User size={20} strokeWidth={2.5} />
                </div>
            </div>
          </div>
        </header>

        <div className="p-10">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {statCards.map((card, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-white p-8 rounded-[32px] border border-border shadow-sm hover:shadow-xl hover:shadow-black/[0.02] transition-all group"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className={`w-14 h-14 ${card.bg} rounded-2xl flex items-center justify-center ${card.color} transition-transform group-hover:scale-110`}>
                    <card.icon size={28} />
                  </div>
                  <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-md ${card.trend.includes('+') ? 'bg-success/10 text-success' : 'bg-bg-surface text-text-muted'}`}>
                    {card.trend}
                  </span>
                </div>
                <p className="text-text-muted text-xs font-bold uppercase tracking-widest mb-1 opacity-70">{card.title}</p>
                <h3 className="text-2xl font-black text-text-main tracking-tight group-hover:text-primary transition-colors">{card.value}</h3>
              </motion.div>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-10">
             {/* Charts or Table Placeholder */}
             <div className="lg:col-span-2 bg-white rounded-[40px] border border-border p-10 shadow-sm relative overflow-hidden group">
                <div className="flex justify-between items-center mb-10">
                    <h3 className="text-xl font-black tracking-tight">Performa Penjualan</h3>
                    <div className="flex gap-2">
                        <button className="px-4 py-1.5 bg-primary-soft text-primary rounded-xl text-[10px] font-black tracking-widest">7 HARI TERAKHIR</button>
                    </div>
                </div>
                
                <div className="h-64 flex items-end justify-between gap-4">
                    {[40, 70, 45, 90, 65, 85, 100].map((h, i) => (
                        <div key={i} className="flex-grow group relative flex flex-col items-center gap-3">
                           <motion.div 
                            initial={{ height: 0 }}
                            animate={{ height: `${h}%` }}
                            transition={{ delay: 0.5 + i * 0.1, duration: 1 }}
                            className="w-full bg-primary-soft border border-primary/10 rounded-xl group-hover:bg-primary group-hover:border-primary transition-all relative"
                           >
                              <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-[10px] font-black text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                                {h}%
                              </div>
                           </motion.div>
                           <span className="text-[10px] font-bold text-text-light uppercase">Day{i+1}</span>
                        </div>
                    ))}
                </div>
             </div>

             {/* Recent Activity Mini-Card */}
             <div className="bg-white rounded-[40px] border border-border p-10 shadow-sm">
                <h3 className="text-xl font-black tracking-tight mb-8">Notifikasi Terbaru</h3>
                <div className="space-y-6">
                   {[
                      { msg: 'Pesanan baru Meja 04', time: '2 mins ago', type: 'order' },
                      { msg: 'Pembayaran dikonfirmasi Meja 02', time: '15 mins ago', type: 'pay' },
                      { msg: 'Ayam Bakar ludes terjual!', time: '1 hour ago', type: 'alert' }
                   ].map((notif, i) => (
                      <div key={i} className="flex items-start gap-4 pb-6 border-b border-border/50 last:border-0 last:pb-0">
                         <div className={`w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center ${
                            notif.type === 'order' ? 'bg-primary-soft text-primary' : 
                            notif.type === 'pay' ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'
                         }`}>
                            {notif.type === 'order' ? <ShoppingBag size={18} /> : 
                             notif.type === 'pay' ? <DollarSign size={18} /> : <Clock size={18} />}
                         </div>
                         <div>
                            <p className="text-sm font-bold text-text-main leading-tight">{notif.msg}</p>
                            <p className="text-[10px] text-text-light mt-1 font-medium">{notif.time}</p>
                         </div>
                      </div>
                   ))}
                </div>
                <button className="w-full mt-10 py-4 bg-bg-surface border border-border rounded-2xl text-[10px] font-black uppercase tracking-widest text-text-muted hover:bg-white hover:text-primary hover:border-primary/30 transition-all flex items-center justify-center gap-2">
                    Lihat Selengkapnya <ChevronRight size={14} />
                </button>
             </div>
          </div>
        </div>
      </main>
    </div>
  )
}
