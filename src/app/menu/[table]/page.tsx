'use client'

import React, { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import Navbar from '@/components/Navbar'
import { 
    LayoutGrid, 
    Coffee, 
    Utensils, 
    Cookie,
    Plus,
    Minus,
    X,
    Flame,
    Star,
    Search,
    ShoppingBag,
    MessageSquare
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCart } from '@/context/CartContext'
import { formatRupiah } from '@/lib/utils'

export default function TableMenuPage() {
  const params = useParams()
  const tableNumber = params.table as string
  const { setTable, addItem } = useCart()

  const [data, setData] = useState<{ categories: any[], menu: any[] }>({ categories: [], menu: [] })
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  // Modal Detail States
  const [selectedItem, setSelectedItem] = useState<any>(null)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [quantity, setQuantity] = useState(1)
  const [notes, setNotes] = useState('')

  useEffect(() => {
    if (tableNumber) {
      setTable(parseInt(tableNumber))
    }
    fetchData()
  }, [tableNumber])

  const fetchData = async () => {
    try {
      const [catRes, menuRes] = await Promise.all([
        fetch('/api/categories'),
        fetch('/api/menu')
      ])
      const categories = await catRes.json()
      const menu = await menuRes.json()
      setData({ 
        categories: Array.isArray(categories) ? categories : [], 
        menu: Array.isArray(menu) ? menu : [] 
      })
    } catch (error) {
      console.error("Failed to fetch data:", error)
      setData({ categories: [], menu: [] })
    } finally {
      setLoading(false)
    }
  }

  const handleItemClick = (item: any) => {
    if (!item.available) return
    setSelectedItem(item)
    setQuantity(1)
    setNotes('')
    setShowDetailModal(true)
  }

  const handleAddFromModal = () => {
    if (!selectedItem) return
    addItem({
      id: selectedItem.id,
      name: selectedItem.name,
      price: selectedItem.price,
      image: selectedItem.image,
      quantity: quantity,
      notes: notes.trim()
    })
    setShowDetailModal(false)
  }

  const filteredMenu = (data.menu || []).filter((m: any) => m.name.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="min-h-screen bg-[#F9FAFB] pb-40">
      <Navbar />

      <main className="container pt-28 md:pt-36 px-4 md:px-6 max-w-5xl mx-auto">
        {/* Banner/Header Meja modern */}
        <div className="bg-gradient-to-br from-primary-soft to-orange-50 rounded-[32px] border border-primary/10 p-6 md:p-10 mb-12 shadow-sm relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="relative z-10 max-w-lg">
                <div className="inline-flex items-center gap-2 bg-white text-primary px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest mb-4 shadow-sm border border-primary/5">
                    📍 Meja No. {tableNumber}
                </div>
                <h1 className="text-3xl md:text-5xl font-black tracking-tight text-text-main leading-tight mb-2">
                   Nikmati Menu <span className="text-primary italic">Terbaik</span> Kami
                </h1>
                <p className="text-text-muted text-sm md:text-base font-medium">Temukan hidangan lezat Dapur Nusantara yang siap kami sajikan langsung di meja Anda.</p>
            </div>

            <div className="relative w-full md:w-80 z-10 shrink-0">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-light" size={20} />
                <input 
                    type="text" 
                    placeholder="Cari menu favoritmu..."
                    className="w-full pl-12 pr-4 py-4 rounded-[20px] bg-white border border-border focus:border-primary/40 focus:ring-1 focus:ring-primary/20 outline-none transition-all font-semibold text-sm shadow-sm"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            {/* Background decoration circles */}
            <div className="absolute -right-16 -bottom-16 w-64 h-64 rounded-full bg-primary/5 blur-3xl z-0" />
            <div className="absolute left-1/2 -top-16 w-32 h-32 rounded-full bg-primary/5 blur-2xl z-0" />
        </div>

        {/* Tab Navigation Sticky */}
        <div className="flex justify-start items-center gap-3 overflow-x-auto no-scrollbar pb-4 px-4 sticky top-[72px] bg-[#F9FAFB]/90 backdrop-blur-md z-40 pt-2 border-b border-border/60 mb-10 -mx-4 md:mx-0 md:px-0">
            {[
                { name: 'Makanan', icon: Utensils, id: 1 },
                { name: 'Minuman', icon: Coffee, id: 2 },
                { name: 'Snack', icon: Cookie, id: 3 }
            ].map((cat) => (
                <button
                    key={cat.id}
                    onClick={() => document.getElementById(`sec-${cat.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                    className="flex items-center gap-2.5 px-6 py-3 rounded-2xl transition-all font-bold text-sm bg-white text-text-muted hover:bg-primary-soft hover:text-primary border border-border shadow-sm shrink-0 active:scale-95"
                >
                    <cat.icon size={16} />
                    {cat.name}
                </button>
            ))}
        </div>

        {/* Loading State Skeleton */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white p-5 rounded-[28px] border border-border flex items-center gap-4 animate-pulse h-28" />
            ))}
          </div>
        )}

        {/* Dynamic Category Sections */}
        {!loading && (
          <div className="space-y-16">
            {(data.categories || []).map((cat: any) => {
                const items = filteredMenu.filter((m: any) => m.categoryId === cat.id)
                if (items.length === 0) return null

                return (
                    <div key={cat.id} id={`sec-${cat.id}`} className="scroll-mt-40">
                         <div className="flex items-center gap-4 mb-8">
                            <h2 className="text-2xl font-black flex items-center gap-3 text-text-main shrink-0">
                                <div className="w-1.5 h-7 bg-primary rounded-full"></div>
                                {cat.name}
                            </h2>
                            <div className="h-px bg-border/80 flex-grow" />
                        </div>

                        {/* Modern Grid layout for GoFood/GrabFood feel */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {items.map((item: any) => (
                                <div 
                                    key={item.id} 
                                    onClick={() => handleItemClick(item)}
                                    className={`bg-white p-4 rounded-[24px] border ${item.available ? 'border-border/60 hover:border-primary/20 hover:shadow-xl hover:shadow-black/[0.02] cursor-pointer' : 'border-border/40 opacity-70'} flex items-center gap-4 group transition-all duration-300 relative`}
                                >
                                    {/* Thumbnail Image */}
                                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden flex-shrink-0 bg-bg-surface border border-border/40 relative">
                                        {item.image ? (
                                          <Image 
                                            src={item.image} 
                                            alt={item.name} 
                                            fill 
                                            className="object-cover transition-transform duration-500 group-hover:scale-105" 
                                            sizes="100px"
                                          />
                                        ) : (
                                          <div className="w-full h-full bg-gray-50 flex items-center justify-center text-text-light/30">
                                            <Utensils size={24} />
                                          </div>
                                        )}
                                        
                                        {!item.available && (
                                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                            <span className="text-[9px] font-black uppercase text-white bg-red-500 px-2 py-0.5 rounded-full">Habis</span>
                                          </div>
                                        )}
                                    </div>

                                    {/* Info details */}
                                    <div className="flex-grow min-w-0 pr-4">
                                        <h4 className="font-extrabold text-base mb-1 truncate text-text-main group-hover:text-primary transition-colors">{item.name}</h4>
                                        <p className="text-xs text-text-muted line-clamp-2 leading-relaxed mb-2 opacity-80 font-medium">
                                            {item.description || "Hidangan Nusantara lezat dibuat dengan bahan premium segar."}
                                        </p>
                                        <span className="text-base font-black text-text-main">{formatRupiah(item.price)}</span>
                                    </div>

                                    {/* Pill Styled Add Button */}
                                    {item.available && (
                                      <button 
                                          onClick={(e) => { e.stopPropagation(); handleItemClick(item); }}
                                          className="w-10 h-10 bg-bg-surface text-primary rounded-2xl flex items-center justify-center border border-border/80 shadow-sm hover:bg-primary-soft hover:border-primary/20 active:scale-95 transition-all flex-shrink-0"
                                      >
                                          <Plus size={18} strokeWidth={3} />
                                      </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )
            })}
          </div>
        )}

        {filteredMenu.length === 0 && !loading && (
             <div className="py-20 text-center flex flex-col items-center">
                <ShoppingBag size={48} className="text-text-light mb-4" />
                <h3 className="font-bold text-xl text-text-main">Menu tidak ditemukan</h3>
                <p className="text-text-muted mt-1">Coba kata kunci lain atau pilih kategori lain.</p>
             </div>
        )}
      </main>

      {/* Detail Modal */}
      <AnimatePresence>
        {showDetailModal && selectedItem && (
          <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm">
            {/* Backdrop click to close */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0"
              onClick={() => setShowDetailModal(false)}
            />

            <motion.div
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
              transition={{ type: 'spring', damping: 25, stiffness: 250 }}
              className="relative w-full sm:max-w-xl bg-white rounded-t-[32px] sm:rounded-[32px] shadow-2xl overflow-hidden max-h-[92vh] flex flex-col z-10 border border-border"
            >
              {/* Close Button Floating */}
              <button 
                onClick={() => setShowDetailModal(false)}
                className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white text-text-main flex items-center justify-center border border-border shadow-sm active:scale-95 transition-all"
              >
                <X size={18} strokeWidth={2.5} />
              </button>

              {/* Scrollable Area */}
              <div className="overflow-y-auto flex-grow no-scrollbar pb-4">
                {/* Image Section */}
                <div className="relative aspect-video w-full bg-bg-surface overflow-hidden">
                  {selectedItem.image ? (
                    <Image 
                      src={selectedItem.image} 
                      alt={selectedItem.name} 
                      fill 
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-text-light/20 bg-gray-100">
                      <Utensils size={64} />
                    </div>
                  )}
                </div>

                {/* Info & Description */}
                <div className="p-6">
                  <div className="flex justify-between items-start gap-4 mb-3">
                    <h3 className="text-xl sm:text-2xl font-black tracking-tight text-text-main">{selectedItem.name}</h3>
                    <span className="text-lg sm:text-xl font-black text-primary shrink-0">{formatRupiah(selectedItem.price)}</span>
                  </div>

                  <div className="flex items-center gap-1.5 mb-5 text-xs text-text-muted font-bold">
                    <Star size={14} className="fill-warning text-warning" />
                    <span>4.8</span>
                    <span className="mx-1">•</span>
                    <span>Pilihan Pelanggan</span>
                  </div>

                  {selectedItem.description && (
                    <div className="bg-bg-surface border border-border/60 rounded-2xl p-4 mb-6">
                      <p className="text-xs sm:text-sm text-text-muted leading-relaxed font-medium">{selectedItem.description}</p>
                    </div>
                  )}

                  {/* Quantity Customizer */}
                  <div className="flex items-center justify-between py-4 border-t border-b border-border/60 mb-6">
                    <span className="text-sm font-bold text-text-main">Jumlah Pesanan</span>
                    <div className="flex items-center gap-4 bg-bg-surface rounded-2xl p-1.5 border border-border shadow-sm">
                      <button 
                        onClick={() => setQuantity(q => Math.max(1, q - 1))}
                        className="w-8 h-8 flex items-center justify-center rounded-xl bg-white hover:bg-gray-100 text-text-muted border border-border active:scale-90 transition-all"
                      >
                        <Minus size={14} strokeWidth={2.5} />
                      </button>
                      <span className="w-6 text-center font-extrabold text-sm">{quantity}</span>
                      <button 
                        onClick={() => setQuantity(q => q + 1)}
                        className="w-8 h-8 flex items-center justify-center rounded-xl bg-primary text-white active:scale-90 transition-all hover:bg-primary-light"
                      >
                        <Plus size={14} strokeWidth={2.5} />
                      </button>
                    </div>
                  </div>

                  {/* Order Notes Field */}
                  <div className="mb-4">
                    <label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-text-muted mb-3">
                      <MessageSquare size={14} className="text-primary" />
                      Catatan Pesanan (Opsional)
                    </label>

                    {/* Quick Tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {['Less Sugar', 'Tidak Pedas', 'Extra Sambal', 'Tanpa Bawang', 'Tambah Es Batu'].map((tag) => (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => {
                            setNotes(prev => {
                              const trimmed = prev.trim()
                              if (!trimmed) return tag
                              if (trimmed.toLowerCase().includes(tag.toLowerCase())) return prev // avoid duplicate
                              return `${trimmed}, ${tag}`
                            })
                          }}
                          className="px-3.5 py-1.5 bg-bg-surface hover:bg-primary-soft hover:text-primary rounded-xl text-[10px] sm:text-xs font-bold border border-border text-text-muted transition-all active:scale-95"
                        >
                          +{tag}
                        </button>
                      ))}
                    </div>

                    <textarea
                      placeholder="Masukkan catatan kustom di sini... (misal: tidak pedas, es batu dipisah)"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full bg-bg-surface border border-border rounded-2xl p-4 text-sm font-semibold focus:border-primary/40 outline-none transition-all placeholder:text-text-light/50 text-text-main min-h-[90px] resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* Add to Cart Fixed Bottom Bar */}
              <div className="p-5 border-t border-border bg-white sticky bottom-0 z-10 shadow-[0_-4px_12px_rgba(0,0,0,0.02)]">
                <button 
                  onClick={handleAddFromModal}
                  className="w-full btn-primary py-4 text-base font-black rounded-2xl shadow-xl shadow-primary/20 flex items-center justify-center gap-2 transition-all active:scale-98"
                >
                  Tambah ke Keranjang - {formatRupiah(selectedItem.price * quantity)}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  )
}
