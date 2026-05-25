'use client'

import React from 'react'
import { Plus, Star } from 'lucide-react'
import { motion } from 'framer-motion'
import { useCart } from '@/context/CartContext'
import { formatRupiah } from '@/lib/utils'

interface MenuCardProps {
  item: {
    id: number
    name: string
    description: string | null
    price: number
    image: string | null
    available: boolean
    categoryId?: number
  }
  isBestSeller?: boolean
}

export default function MenuCard({ item, isBestSeller = false }: MenuCardProps) {
  const { addItem } = useCart()

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation()
    addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      quantity: 1
    })
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="card flex flex-col group h-full"
    >
      {/* Image Container */}
      <div className="relative aspect-[4/3] rounded-[14px] overflow-hidden bg-bg-surface mb-4">
        {item.image ? (
          <img 
            src={item.image} 
            alt={item.name} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-text-light/20 font-black text-4xl">?</div>
        )}
        
        {isBestSeller && (
          <div className="absolute top-3 left-3">
            <span className="badge-best shadow-sm shadow-primary/20">Best Seller</span>
          </div>
        )}
        
        {!item.available && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] flex items-center justify-center">
             <span className="bg-gray-800 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full">Habis</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-grow">
        <div className="flex items-center gap-1.5 mb-1.5">
           <Star size={12} className="fill-warning text-warning" />
           <span className="text-[11px] font-bold text-text-muted">4.8 (50+)</span>
        </div>
        <h3 className="text-base font-bold text-text-main mb-1 line-clamp-1 group-hover:text-primary transition-colors">{item.name}</h3>
        <p className="text-xs text-text-muted line-clamp-2 mb-4 leading-relaxed h-8 opacity-70">
            {item.description || "Hidangan spesial buatan chef terbaik kami."}
        </p>
      </div>

      {/* Price & Action */}
      <div className="flex items-center justify-between pt-2 border-t border-border mt-auto">
        <span className="text-lg font-extrabold text-text-main">{formatRupiah(item.price)}</span>
        <button 
          onClick={handleAdd}
          disabled={!item.available}
          className="w-10 h-10 bg-primary text-white rounded-[12px] flex items-center justify-center shadow-sm shadow-primary/10 hover:scale-110 active:scale-95 transition-all disabled:opacity-30"
        >
          <Plus size={20} strokeWidth={2.5} />
        </button>
      </div>
    </motion.div>
  )
}
