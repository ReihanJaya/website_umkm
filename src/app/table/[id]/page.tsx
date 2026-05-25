'use client'

import React, { useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { QrCode, Utensils, Loader2 } from 'lucide-react'
import { useCart } from '@/context/CartContext'

export default function TableEntryPage() {
  const params = useParams()
  const tableId = params.id as string
  const router = useRouter()
  const { setTable } = useCart()

  useEffect(() => {
    const tableNum = parseInt(tableId)
    if (isNaN(tableNum) || tableNum < 1) {
      router.replace('/')
      return
    }
    
    // Prefetch for faster transition
    router.prefetch(`/menu/${tableId}`)
    
    setTable(tableNum)
    
    // Redirect to menu after a brief welcome animation
    const timer = setTimeout(() => {
      router.replace(`/menu/${tableId}`)
    }, 500)
    
    return () => clearTimeout(timer)
  }, [tableId, router, setTable])

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-white to-primary/10 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="text-center"
      >
        {/* Logo */}
        <motion.div
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          className="flex items-center justify-center gap-3 mb-10"
        >
          <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-white shadow-lg shadow-primary/30">
            <Utensils size={24} />
          </div>
          <span className="font-heading font-black text-3xl tracking-tighter">
            Order<span className="text-primary">In</span>
          </span>
        </motion.div>

        {/* QR Scan Animation */}
        <motion.div
          animate={{ 
            scale: [1, 1.05, 1],
            borderColor: ['rgba(255,107,44,0.2)', 'rgba(255,107,44,0.5)', 'rgba(255,107,44,0.2)']
          }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-32 h-32 bg-white rounded-[32px] flex items-center justify-center mx-auto mb-10 border-2 border-primary/20 shadow-2xl"
        >
          <QrCode size={56} className="text-primary" />
        </motion.div>

        {/* Table Number */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="inline-flex items-center gap-2 bg-primary-soft px-6 py-2.5 rounded-full border border-primary/20 mb-6">
            <span className="text-primary text-sm font-black uppercase tracking-widest">
              Meja {tableId}
            </span>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-black text-text-main mb-4 tracking-tight">
            Selamat Datang! 👋
          </h1>
          <p className="text-text-muted font-medium mb-8 max-w-sm mx-auto leading-relaxed">
            Anda sedang memesan dari <strong className="text-text-main">Meja {tableId}</strong>. 
            Mengarahkan ke halaman menu...
          </p>
          
          <div className="flex items-center justify-center gap-3 text-primary">
            <Loader2 size={20} className="animate-spin" />
            <span className="text-xs font-black uppercase tracking-widest">Memuat Menu</span>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}
