'use client'

import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import { formatRupiah } from '@/lib/utils'
import { Loader2, ShieldCheck, Lock, Zap, CheckCircle2, Phone } from 'lucide-react'
import QRCode from 'qrcode'
import { toast } from 'react-hot-toast'
import { motion } from 'framer-motion'

export default function PaymentPage() {
  const params = useParams()
  const orderId = params.orderId as string
  const router = useRouter()
  
  const [order, setOrder] = useState<any>(null)
  const [qrCodeUrl, setQrCodeUrl] = useState('')
  const [loading, setLoading] = useState(true)
  const [paying, setPaying] = useState(false)

  useEffect(() => {
    fetchOrder()
  }, [orderId])

  const fetchOrder = async () => {
    try {
      const res = await fetch(`/api/orders/${orderId}`)
      const data = await res.json()
      setOrder(data)
      
      const qrData = `QRIS-MOCK-ORDER-${data.orderCode}-${data.totalAmount}`
      const url = await QRCode.toDataURL(qrData, {
        width: 800,
        margin: 2
      })
      setQrCodeUrl(url)
    } catch (error) {
      console.error('Failed to fetch order:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSimulatePayment = async () => {
    setPaying(true)
    try {
      await new Promise(r => setTimeout(r, 2000))
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPaid: true, status: 'CONFIRMED' })
      })
      if (res.ok) {
        toast.success('Pembayaran Berhasil!')
        router.push(`/order/${orderId}`)
      }
    } catch (error) {
      toast.error('Pembayaran gagal')
    } finally {
      setPaying(false)
    }
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <Loader2 className="animate-spin text-primary" size={40} />
    </div>
  )

  return (
    <div className="min-h-screen bg-bg-surface flex flex-col">
      <Navbar />
      
      <main className="container flex-grow pt-32 pb-20 px-6 max-w-lg mx-auto text-center">
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
        >
            <div className="inline-flex items-center gap-2 bg-white px-4 py-1.5 rounded-full border border-border shadow-sm text-text-muted mb-8">
                <Lock size={12} className="text-success" />
                <span className="text-[10px] font-black uppercase tracking-widest leading-none pt-0.5">Secure Transaction</span>
            </div>

            <h1 className="text-3xl font-black mb-10 tracking-tight text-text-main">Scan QRIS Untuk Bayar</h1>

            {/* QRIS Frame Clean */}
            <div className="bg-white p-8 rounded-[40px] shadow-premium mb-10 border border-border">
                <div className="flex justify-between items-center mb-6 px-4">
                     <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/GPN_Logo.svg/1024px-GPN_Logo.svg.png" className="h-4 object-contain opacity-40 grayscale" alt="GPN" />
                     <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/QRIS_logo.svg/1200px-QRIS_logo.svg.png" className="h-4 object-contain" alt="QRIS" />
                </div>
                
                <div className="relative aspect-square w-full mb-6 border-4 border-bg-surface rounded-2xl overflow-hidden p-4">
                    {qrCodeUrl && <img src={qrCodeUrl} alt="QRIS" className="w-full h-full" />}
                </div>

                <div className="pt-6 border-t border-border">
                    <p className="text-[10px] text-text-light font-bold uppercase tracking-widest mb-1">Total Tagihan</p>
                    <p className="text-3xl font-black text-text-main tracking-tighter">{formatRupiah(order?.totalAmount || 0)}</p>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-10">
                <div className="p-4 bg-white rounded-2xl border border-border flex flex-col items-center gap-2">
                    <ShieldCheck className="text-success" size={20} />
                    <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Terverifikasi</span>
                </div>
                <div className="p-4 bg-white rounded-2xl border border-border flex flex-col items-center gap-2">
                    <Zap className="text-warning" size={20} />
                    <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Konfirmasi Instan</span>
                </div>
            </div>

            <button 
                onClick={handleSimulatePayment}
                disabled={paying}
                className="btn btn-primary w-full py-6 text-xl font-black rounded-2xl shadow-xl shadow-primary/20 mb-8"
            >
                {paying ? <Loader2 size={24} className="animate-spin" /> : 'Simulasi Sudah Bayar'}
            </button>

            <button className="flex items-center gap-2 text-text-light hover:text-primary transition-colors text-xs font-bold uppercase tracking-widest mx-auto">
                <Phone size={14} />
                Butuh Bantuan?
            </button>
        </motion.div>
      </main>
    </div>
  )
}
