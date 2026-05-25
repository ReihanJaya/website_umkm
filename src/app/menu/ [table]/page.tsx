'use client'

import React, { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Navbar from '@/components/Navbar'
import MenuCard from '@/components/MenuCard'
import LoadingSpinner from '@/components/LoadingSpinner'
import { Search, Utensils, Star, Filter } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCart } from '@/context/CartContext'

export default function MenuPage() {
  const params = useParams()
  const tableNumber = params.table as string
  const { setTable } = useCart()

  const [categories, setCategories] = useState<any[]>([])
  const [menuItems, setMenuItems] = useState<any[]>([])
  const [activeCategory, setActiveCategory] = useState<number | null>(null)
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setTable(parseInt(tableNumber))
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
      setCategories([{ id: null, name: 'Semua' }, ...categories])
      setMenuItems(menu)
    } finally {
      setLoading(false)
    }
  }

  const filteredItems = menuItems.filter(item => {
    const matchesCategory = activeCategory === null || item.categoryId === activeCategory
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const scrollToCategory = (id: number | null) => {
    setActiveCategory(id)
    if (id) {
       const el = document.getElementById(`cat-${id}`)
       if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <div className="min-h-screen bg-white pb-32">
      <Navbar />

      <main className="container pt-32">
        {/* Simple Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 px-2">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="text-primary font-black text-xs uppercase tracking-widest bg-primary-soft px-4 py-1.5 rounded-full mb-4 inline-block">Table No. {tableNumber}</span>
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter">Pilih <span className="text-primary italic">Menu Favorit</span></h1>
            <p className="text-text-muted mt-2 text-lg">Silakan telusuri aneka hidangan lezat kami.</p>
          </motion.div>

          <div className="relative w-full md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-light" size={20} />
            <input 
              type="text" 
              placeholder="Cari makanan..."
              className="w-full pl-12 pr-4 py-4 rounded-[20px] bg-bg-surface border border-border focus:border-primary/30 transition-all font-medium text-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Horizontal Scroll Categories */}
        <div className="flex gap-4 overflow-x-auto no-scrollbar pb-10 px-2">
            {categories.map((cat) => (
                <button
                    key={cat.id || 'all'}
                    onClick={() => scrollToCategory(cat.id)}
                    className={`whitespace-nowrap px-10 py-3.5 rounded-full font-extrabold text-xs uppercase tracking-widest transition-all ${
                        activeCategory === cat.id 
                        ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                        : 'bg-bg-surface text-text-muted hover:bg-primary-soft hover:text-primary border border-border'
                    }`}
                >
                    {cat.name}
                </button>
            ))}
        </div>

        {/* Section List */}
        {loading ? (
            <LoadingSpinner message="Menyiapkan hidangan lezat..." />
        ) : (
            <div className="space-y-24 px-2">
                {categories.filter(c => c.id !== null).map(cat => {
                    const items = filteredItems.filter(i => i.categoryId === cat.id)
                    if (items.length === 0) return null
                    
                    return (
                        <div key={cat.id} id={`cat-${cat.id}`} className="scroll-mt-32">
                            <div className="flex items-center gap-4 mb-8">
                                <h2 className="text-3xl font-black">{cat.name}</h2>
                                <div className="h-px bg-border flex-grow"></div>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                                {items.map(item => (
                                    <MenuCard key={item.id} item={item} />
                                ))}
                            </div>
                        </div>
                    )
                })}
            </div>
        )}
      </main>

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  )
}
