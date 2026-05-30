'use client'

import React, { useState, useEffect } from 'react'
import AdminSidebar from '@/components/AdminSidebar'
import { 
    ShoppingBag, 
    DollarSign, 
    TrendingUp, 
    Clock, 
    ChevronRight, 
    Bell,
    User
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
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/stats')
      const data = await res.json()
      setStats(data)
    } catch (e) {
      setStats({
        totalOrders: 156,
        totalRevenue: 1250000,
        activeOrders: 8,
        topMenu: 'Nasi Goreng Spesial'
      })
    }
  }

  const statCards = [
    { title: 'Total Pendapatan', value: formatRupiah(stats.totalRevenue), icon: DollarSign, trend: '+12.5%', color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { title: 'Total Pesanan', value: String(stats.totalOrders), icon: ShoppingBag, trend: '+5.2%', color: 'text-primary', bg: 'bg-primary-soft' },
    { title: 'Pesanan Aktif', value: String(stats.activeOrders), icon: Clock, trend: 'Live', color: 'text-blue-500', bg: 'bg-blue-50' },
    { title: 'Menu Terlaris', value: stats.topMenu, icon: TrendingUp, trend: 'Top', color: 'text-purple-500', bg: 'bg-purple-50' },
  ]

  return (
    <div className="min-h-screen bg-[#F8F9FB] flex">
      <AdminSidebar />
      
      {/* Main — offset for desktop sidebar */}
      <main className="flex-grow lg:pl-64 transition-all">
        {/* Topbar */}
        <header className="h-16 md:h-20 bg-white border-b border-border sticky top-0 z-30 flex items-center justify-between px-5 md:px-10 pl-16 lg:pl-10">
          <div>
            <h1 className="text-base md:text-xl font-black tracking-tight text-text-main">
              Ringkasan <span className="text-primary italic">Dashboard</span>
            </h1>
            <p className="hidden md:block text-xs text-text-muted font-medium mt-0.5">Selamat datang kembali, Super Admin 👋</p>
          </div>

          <div className="flex items-center gap-3 md:gap-6">
            <button className="relative p-2 text-text-muted hover:text-primary transition-colors">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="flex items-center gap-2.5 pl-3 md:pl-6 border-l border-border">
              <div className="hidden md:block text-right">
                <p className="text-xs font-bold text-text-main">Super Admin</p>
                <p className="text-[10px] font-medium text-text-light uppercase tracking-widest">Administrator</p>
              </div>
              <div className="w-9 h-9 md:w-10 md:h-10 bg-primary-soft rounded-2xl flex items-center justify-center text-primary border border-primary/20">
                <User size={18} strokeWidth={2.5} />
              </div>
            </div>
          </div>
        </header>

        <div className="p-5 md:p-8 lg:p-10">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
            {statCards.map((card, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -4 }}
                className="bg-white p-5 md:p-7 rounded-[24px] md:rounded-[32px] border border-border shadow-sm hover:shadow-lg hover:shadow-black/[0.04] transition-all group"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className={`w-10 h-10 md:w-12 md:h-12 ${card.bg} rounded-xl md:rounded-2xl flex items-center justify-center ${card.color} transition-transform group-hover:scale-110`}>
                    <card.icon size={20} className="md:hidden" />
                    <card.icon size={24} className="hidden md:block" />
                  </div>
                  <span className={`text-[9px] md:text-[10px] font-black uppercase tracking-widest px-2 py-0.5 md:py-1 rounded-md ${card.trend.includes('+') ? 'bg-emerald-50 text-emerald-600' : 'bg-bg-surface text-text-muted'}`}>
                    {card.trend}
                  </span>
                </div>
                <p className="text-text-muted text-[10px] font-bold uppercase tracking-widest mb-1 opacity-70 truncate">{card.title}</p>
                <h3 className="text-lg md:text-2xl font-black text-text-main tracking-tight group-hover:text-primary transition-colors truncate">{card.value}</h3>
              </motion.div>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-6 md:gap-8">
            {/* Bar Chart */}
            <div className="lg:col-span-2 bg-white rounded-[28px] md:rounded-[40px] border border-border p-6 md:p-10 shadow-sm">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <h3 className="text-lg md:text-xl font-black tracking-tight">Performa Penjualan</h3>
                <button className="px-4 py-1.5 bg-primary-soft text-primary rounded-xl text-[10px] font-black tracking-widest shrink-0">
                  7 HARI TERAKHIR
                </button>
              </div>
              
              <div className="h-48 md:h-64 flex items-end justify-between gap-2 md:gap-4">
                {[40, 70, 45, 90, 65, 85, 100].map((h, i) => (
                  <div key={i} className="flex-grow group relative flex flex-col items-center gap-2 md:gap-3">
                    <motion.div 
                      initial={{ height: 0 }}
                      animate={{ height: `${h}%` }}
                      transition={{ delay: 0.5 + i * 0.1, duration: 1 }}
                      className="w-full bg-primary-soft border border-primary/10 rounded-lg md:rounded-xl group-hover:bg-primary group-hover:border-primary transition-all relative"
                    >
                      <div className="absolute -top-7 left-1/2 -translate-x-1/2 text-[10px] font-black text-primary opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        {h}%
                      </div>
                    </motion.div>
                    <span className="text-[9px] md:text-[10px] font-bold text-text-light uppercase hidden sm:block">D{i+1}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Notifications */}
            <div className="bg-white rounded-[28px] md:rounded-[40px] border border-border p-6 md:p-10 shadow-sm">
              <h3 className="text-lg md:text-xl font-black tracking-tight mb-6">Notifikasi Terbaru</h3>
              <div className="space-y-5">
                {[
                  { msg: 'Pesanan baru Meja 04', time: '2 menit lalu', type: 'order' },
                  { msg: 'Pembayaran dikonfirmasi Meja 02', time: '15 menit lalu', type: 'pay' },
                  { msg: 'Ayam Bakar ludes terjual!', time: '1 jam lalu', type: 'alert' }
                ].map((notif, i) => (
                  <div key={i} className="flex items-start gap-3 pb-5 border-b border-border/50 last:border-0 last:pb-0">
                    <div className={`w-9 h-9 rounded-xl flex-shrink-0 flex items-center justify-center text-sm ${
                      notif.type === 'order' ? 'bg-primary-soft text-primary' : 
                      notif.type === 'pay' ? 'bg-emerald-50 text-emerald-500' : 'bg-red-50 text-red-400'
                    }`}>
                      {notif.type === 'order' ? <ShoppingBag size={16} /> : 
                       notif.type === 'pay' ? <DollarSign size={16} /> : <Clock size={16} />}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-text-main leading-tight truncate">{notif.msg}</p>
                      <p className="text-[10px] text-text-light mt-0.5 font-medium">{notif.time}</p>
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full mt-6 py-3.5 bg-bg-surface border border-border rounded-2xl text-[10px] font-black uppercase tracking-widest text-text-muted hover:bg-white hover:text-primary hover:border-primary/30 transition-all flex items-center justify-center gap-2">
                Lihat Selengkapnya <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
