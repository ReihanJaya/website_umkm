'use client'

import React from 'react'
import Link from 'next/link'
import { ShoppingCart, Utensils } from 'lucide-react'
import { useCart } from '@/context/CartContext'

export default function Navbar() {
  const { totalItems } = useCart()

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-border py-4">
      <div className="container flex justify-between items-center">
        {/* Logo OrderIn Style */}
        <Link href="/" className="flex items-center gap-2">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white">
            <Utensils size={22} />
          </div>
          <span className="font-heading font-extrabold text-2xl tracking-tighter">
            Order<span className="text-primary">In</span>
          </span>
        </Link>

        {/* Links */}
        <div className="hidden lg:flex items-center gap-8 text-sm font-bold text-text-main/80">
          <Link href="/" className="hover:text-primary transition-colors">Beranda</Link>
          <button onClick={() => document.getElementById('sec-makanan')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-primary">Makanan</button>
          <button onClick={() => document.getElementById('sec-minuman')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-primary">Minuman</button>
          <button onClick={() => document.getElementById('sec-snack')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-primary">Snack</button>
          <Link href="#" className="hover:text-primary">Tentang Kami</Link>
        </div>

        {/* Action Button */}
        <div className="flex items-center gap-4">
          <Link href="/cart/1" className="relative p-2.5 bg-bg-surface rounded-xl hover:bg-primary-soft transition-colors group">
            <ShoppingCart size={22} className="text-text-main group-hover:text-primary" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary text-white text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">
                {totalItems}
              </span>
            )}
          </Link>
          <button 
            onClick={() => document.getElementById('menu-section')?.scrollIntoView({ behavior: 'smooth' })}
            className="hidden md:flex btn-primary !py-2.5 !px-6 !text-sm"
          >
            Pesan Sekarang
          </button>
        </div>
      </div>
    </nav>
  )
}
