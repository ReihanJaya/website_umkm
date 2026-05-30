'use client'

import React, { useState } from 'react'
import AdminSidebar from '@/components/AdminSidebar'
import { QrCode, Download, Printer, Plus, Trash2, User } from 'lucide-react'
import { motion } from 'framer-motion'
import QRCode from 'qrcode'
import { toast } from 'react-hot-toast'

export default function AdminQRCodesPage() {
  const [tables, setTables] = useState([1, 2, 3, 4, 5])
  const [newTable, setNewTable] = useState('')
  const [baseUrl, setBaseUrl] = useState(
    typeof window !== 'undefined' ? window.location.origin : 'https://website-umkm-knvf.vercel.app'
  )

  const downloadQR = async (tableNum: number) => {
    try {
      const url = `${baseUrl}/menu/${tableNum}`
      const dataUrl = await QRCode.toDataURL(url, { width: 600, margin: 2 })
      const link = document.createElement('a')
      link.href = dataUrl
      link.download = `QR-Meja-${tableNum}.png`
      link.click()
      toast.success(`QR Meja ${tableNum} berhasil diunduh`)
    } catch (e) {
      toast.error('Gagal generate QR')
    }
  }

  const addTable = () => {
    const num = parseInt(newTable)
    if (!num || tables.includes(num)) return toast.error('Nomor meja tidak valid atau sudah ada')
    setTables([...tables, num].sort((a, b) => a - b))
    setNewTable('')
    toast.success(`Meja ${num} ditambahkan`)
  }

  const removeTable = (num: number) => {
    setTables(tables.filter(t => t !== num))
    toast.success(`Meja ${num} dihapus`)
  }

  return (
    <div className="min-h-screen bg-[#F8F9FB] flex">
      <AdminSidebar />
      
      <main className="flex-grow lg:pl-64 transition-all">
        {/* Topbar */}
        <header className="h-16 md:h-20 bg-white border-b border-border sticky top-0 z-30 flex items-center justify-between px-5 md:px-10 pl-16 lg:pl-10">
          <div>
            <h1 className="text-base md:text-xl font-black tracking-tight text-text-main">
              Manajemen <span className="text-primary italic">QR Meja</span>
            </h1>
            <p className="hidden md:block text-xs text-text-muted font-medium mt-0.5">{tables.length} meja terdaftar</p>
          </div>
          <div className="w-9 h-9 md:w-10 md:h-10 bg-primary-soft rounded-2xl flex items-center justify-center text-primary border border-primary/20">
            <User size={18} strokeWidth={2.5} />
          </div>
        </header>

        <div className="p-5 md:p-8 lg:p-10">
          {/* Add Table Card */}
          <div className="bg-white p-5 md:p-8 rounded-[24px] md:rounded-[40px] border border-border shadow-sm mb-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
              <div>
                <h3 className="font-bold text-base md:text-lg mb-1">Tambah Meja Baru</h3>
                <p className="text-xs text-text-muted">Generate QR Code otomatis untuk meja baru.</p>
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <div className="relative flex-grow sm:flex-grow-0">
                  <Plus className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-light" size={16} />
                  <input 
                    type="number" 
                    placeholder="No. meja"
                    className="w-full sm:w-36 bg-bg-surface border border-border rounded-2xl py-3 pl-10 pr-4 text-sm font-bold focus:border-primary/30 outline-none"
                    value={newTable}
                    onChange={(e) => setNewTable(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addTable()}
                  />
                </div>
                <button onClick={addTable} className="btn-primary !py-3 !px-5 !text-sm shrink-0">
                  Tambah
                </button>
              </div>
            </div>

            {/* Base URL config */}
            <div className="mt-5 pt-5 border-t border-border/50">
              <label className="text-[10px] font-black uppercase tracking-widest text-text-muted mb-2 block">
                Base URL Customer (untuk generate QR)
              </label>
              <input 
                type="url"
                className="w-full bg-bg-surface border border-border rounded-xl py-2.5 px-4 text-sm font-medium focus:border-primary/30 outline-none"
                value={baseUrl}
                onChange={(e) => setBaseUrl(e.target.value)}
                placeholder="https://website-umkm-knvf.vercel.app"
              />
              <p className="text-[10px] text-text-muted mt-1.5 font-medium">QR akan mengarah ke: {baseUrl}/menu/[nomor_meja]</p>
            </div>
          </div>

          {/* QR Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
            {tables.map((num, i) => (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                key={num} 
                className="bg-white p-5 md:p-7 rounded-[24px] md:rounded-[32px] border border-border shadow-sm hover:shadow-lg hover:shadow-black/[0.04] transition-all flex flex-col items-center group text-center"
              >
                <div className="w-14 h-14 md:w-20 md:h-20 bg-bg-surface rounded-2xl md:rounded-3xl flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform">
                  <QrCode size={28} className="md:hidden" strokeWidth={1.5} />
                  <QrCode size={40} className="hidden md:block" strokeWidth={1.5} />
                </div>
                <h4 className="font-black text-xl md:text-2xl mb-0.5 tracking-tight">Meja {num}</h4>
                <p className="text-[9px] md:text-[10px] text-text-light font-black uppercase tracking-widest mb-4">Table ID · {num}</p>
                
                <div className="w-full flex flex-col gap-2">
                  <button 
                    onClick={() => downloadQR(num)}
                    className="w-full py-2.5 bg-bg-surface hover:bg-primary-soft hover:text-primary rounded-xl md:rounded-2xl flex items-center justify-center gap-2 text-xs font-bold transition-all border border-border group-hover:border-primary/20"
                  >
                    <Download size={13} /> PNG
                  </button>
                  <button className="w-full py-2.5 bg-bg-surface font-bold text-text-muted rounded-xl md:rounded-2xl flex items-center justify-center gap-2 text-xs transition-all opacity-40 cursor-not-allowed">
                    <Printer size={13} /> Print
                  </button>
                </div>

                <button 
                  onClick={() => removeTable(num)}
                  className="mt-3 p-1.5 text-text-light hover:text-red-400 hover:bg-red-50 rounded-xl transition-all opacity-0 group-hover:opacity-100 text-xs flex items-center gap-1 font-bold"
                >
                  <Trash2 size={13} /> Hapus
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
