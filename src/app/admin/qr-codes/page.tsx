'use client'

import React, { useState } from 'react'
import AdminSidebar from '@/components/AdminSidebar'
import { QrCode, Download, Printer, Plus, Trash2, User, Search, CornerDownRight } from 'lucide-react'
import { motion } from 'framer-motion'
import QRCode from 'qrcode'
import { toast } from 'react-hot-toast'

export default function AdminQRCodesPage() {
  const [tables, setTables] = useState([1, 2, 3, 4, 5])
  const [newTable, setNewTable] = useState('')

  const downloadQR = async (tableNum: number) => {
    try {
      const url = `http://localhost:3000/menu/${tableNum}`
      const dataUrl = await QRCode.toDataURL(url, { width: 500, margin: 2 })
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
    if (!num || tables.includes(num)) return toast.error('Nomor meja tidak valid')
    setTables([...tables, num].sort((a, b) => a - b))
    setNewTable('')
    toast.success(`Meja ${num} ditambahkan`)
  }

  return (
    <div className="min-h-screen bg-bg-surface flex">
      <AdminSidebar />
      
      <main className="flex-grow pl-64 transition-all">
        {/* Topbar */}
        <header className="h-20 bg-white border-b border-border sticky top-0 z-30 flex items-center justify-between px-10">
          <div className="flex items-center gap-4">
              <h1 className="text-xl font-black tracking-tight text-text-main">Manajemen <span className="text-primary italic">QR Meja</span></h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-soft rounded-2xl flex items-center justify-center text-primary border border-primary/20">
                <User size={20} strokeWidth={2.5} />
            </div>
          </div>
        </header>

        <div className="p-10">
            {/* Action Bar */}
            <div className="bg-white p-8 rounded-[40px] border border-border shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
                <div className="flex flex-col">
                    <h3 className="font-bold text-lg">Tambah Meja Baru</h3>
                    <p className="text-xs text-text-muted">Generate QR Code otomatis untuk meja baru.</p>
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="relative flex-grow">
                        <Plus className="absolute left-4 top-1/2 -translate-y-1/2 text-text-light" size={18} />
                        <input 
                            type="number" 
                            placeholder="Nomor meja..."
                            className="w-full md:w-40 bg-bg-surface border border-border rounded-2xl py-3 pl-12 pr-4 text-sm font-bold focus:border-primary/30 outline-none"
                            value={newTable}
                            onChange={(e) => setNewTable(e.target.value)}
                        />
                    </div>
                    <button 
                        onClick={addTable}
                        className="btn-primary"
                    >
                        Tambah Meja
                    </button>
                </div>
            </div>

            {/* QR Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {tables.map((num, i) => (
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        key={num} 
                        className="bg-white p-8 rounded-[40px] border border-border shadow-sm hover:shadow-xl hover:shadow-black/[0.02] transition-all flex flex-col items-center group text-center"
                    >
                        <div className="w-20 h-20 bg-bg-surface rounded-3xl flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                            <QrCode size={40} strokeWidth={1.5} />
                        </div>
                        <h4 className="font-black text-2xl mb-1 tracking-tight">Meja {num}</h4>
                        <p className="text-[10px] text-text-light font-black uppercase tracking-[0.2em] mb-6">TABLE IDENTIFIED</p>
                        
                        <div className="w-full flex flex-col gap-2">
                             <button 
                                onClick={() => downloadQR(num)}
                                className="w-full py-3 bg-bg-surface hover:bg-primary-soft hover:text-primary rounded-2xl flex items-center justify-center gap-2 text-xs font-bold transition-all border border-border group-hover:border-primary/20"
                             >
                                <Download size={14} /> Download PNG
                             </button>
                             <button className="w-full py-3 bg-bg-surface hover:bg-bg-surface font-bold text-text-muted hover:text-text-main rounded-2xl flex items-center justify-center gap-2 text-xs transition-all opacity-50 cursor-not-allowed">
                                <Printer size={14} /> Print Label
                             </button>
                        </div>

                        <button className="mt-4 p-2 text-text-light hover:text-danger hover:bg-danger/5 rounded-xl transition-all opacity-0 group-hover:opacity-100">
                            <Trash2 size={16} />
                        </button>
                    </motion.div>
                ))}
            </div>
        </div>
      </main>
    </div>
  )
}
