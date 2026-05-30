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
    Flame,
    Star,
    Search,
    ShoppingBag
} from 'lucide-react'
import { motion } from 'framer-motion'
import { useCart } from '@/context/CartContext'
import { formatRupiah } from '@/lib/utils'

export default function TableMenuPage() {
  const params = useParams()
  const tableNumber = params.table as string
  const { setTable, addItem } = useCart()

  const [data, setData] = useState<{ categories: any[], menu: any[] }>({ categories: [], menu: [] })
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

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

  const handleAdd = (item: any) => {
    addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      quantity: 1
    })
  }

  const filteredMenu = (data.menu || []).filter((m: any) => m.name.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="min-h-screen bg-white pb-40">
      <Navbar />

      <main className="container pt-28 md:pt-36 px-4 md:px-6">
        {/* Header Meja */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <div className="inline-flex items-center gap-2 bg-primary-soft text-primary px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest mb-4">
                    Pesan dari Meja {tableNumber}
                </div>
                <h1 className="text-4xl md:text-5xl font-black tracking-tighter">
                   Nikmati Menu <span className="text-primary italic">Terbaik</span>
                </h1>
                <p className="text-text-muted mt-2 font-medium">Temukan hidangan lezat yang siap kami sajikan di meja Anda.</p>
            </motion.div>

            <div className="relative w-full md:w-80">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-light" size={20} />
                <input 
                    type="text" 
                    placeholder="Cari makanan favoritmu..."
                    className="w-full pl-12 pr-4 py-4 rounded-[20px] bg-bg-surface border border-border focus:border-primary/30 transition-all font-medium text-sm shadow-sm"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-start items-center gap-4 overflow-x-auto no-scrollbar pb-4 px-4 sticky top-[72px] bg-white z-40 pt-2 border-b border-border mb-12 -mx-4 md:mx-0 md:px-0">
            {[
                { name: 'Makanan', icon: Utensils, id: 1 },
                { name: 'Minuman', icon: Coffee, id: 2 },
                { name: 'Snack', icon: Cookie, id: 3 }
            ].map((cat) => (
                <button
                    key={cat.id}
                    onClick={() => document.getElementById(`sec-${cat.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                    className="flex items-center gap-3 px-6 py-3 rounded-2xl transition-all font-bold text-sm bg-bg-surface text-text-muted hover:bg-primary-soft hover:text-primary border border-border shrink-0"
                >
                    <cat.icon size={18} />
                    {cat.name}
                </button>
            ))}
        </div>

        {/* Loading State Skeleton */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-2">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-bg-surface p-4 rounded-[32px] border border-border flex items-center gap-4 animate-pulse">
                <div className="w-20 h-20 rounded-2xl bg-gray-200 flex-shrink-0"></div>
                <div className="flex-grow">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Dynamic Category Sections */}
        {!loading && (
          <div className="space-y-24 px-2">
            {(data.categories || []).map((cat: any) => {
                const items = filteredMenu.filter((m: any) => m.categoryId === cat.id)
                if (items.length === 0) return null

                return (
                    <div key={cat.id} id={`sec-${cat.id}`} className="scroll-mt-40">
                         <div className="flex justify-between items-end mb-10">
                            <h2 className="text-2xl font-black flex items-center gap-3">
                                <div className="w-1 h-8 bg-primary rounded-full"></div>
                                {cat.name}
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {items.map((item: any) => (
                                <div key={item.id} className="bg-bg-surface p-3 sm:p-4 rounded-[20px] sm:rounded-[32px] border border-border flex items-center gap-3 sm:gap-4 group transition-all hover:bg-white hover:shadow-xl hover:shadow-black/[0.02]">
                                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl sm:rounded-2xl overflow-hidden flex-shrink-0 bg-white shadow-sm relative">
                                        {item.image ? (
                                          <Image 
                                            src={item.image} 
                                            alt={item.name} 
                                            fill 
                                            className="object-cover" 
                                            sizes="80px"
                                          />
                                        ) : (
                                          <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                                            <Utensils className="text-gray-300" />
                                          </div>
                                        )}
                                    </div>
                                    <div className="flex-grow min-w-0">
                                        <h4 className="font-bold text-sm mb-1 truncate group-hover:text-primary transition-colors">{item.name}</h4>
                                        <div className="flex items-center gap-1 mb-1.5">
                                            <Star size={12} className="fill-warning text-warning" />
                                            <span className="text-[10px] font-bold">4.8</span>
                                        </div>
                                        <span className="text-sm font-black text-text-main">{formatRupiah(item.price)}</span>
                                    </div>
                                    <button 
                                        onClick={() => handleAdd(item)}
                                        className="w-9 h-9 sm:w-10 sm:h-10 bg-white text-primary rounded-xl sm:rounded-2xl flex items-center justify-center border border-border shadow-sm hover:bg-primary-soft active:scale-95 transition-all flex-shrink-0"
                                    >
                                        <Plus size={18} strokeWidth={3} />
                                    </button>
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
                <h3 className="font-bold text-xl">Menu tidak ditemukan</h3>
                <p className="text-text-muted">Coba kata kunci lain atau pilih kategori lain.</p>
             </div>
        )}
      </main>

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  )
}
