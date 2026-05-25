'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
    LayoutDashboard, 
    Utensils, 
    ShoppingBag, 
    CreditCard, 
    Settings, 
    LogOut,
    UtensilsCrossed
} from 'lucide-react'
import { motion } from 'framer-motion'
import { signOut } from 'next-auth/react'

export default function AdminSidebar() {
  const pathname = usePathname()

  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, href: '/admin/dashboard' },
    { name: 'Daftar Menu', icon: Utensils, href: '/admin/menu' },
    { name: 'Pesanan', icon: ShoppingBag, href: '/admin/orders' },
    { name: 'Pembayaran', icon: CreditCard, href: '/admin/payments' },
    { name: 'Pengaturan', icon: Settings, href: '/admin/settings' },
  ]

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-64 bg-white border-r border-border z-40 flex flex-col pt-8">
      {/* Admin Logo */}
      <div className="px-8 mb-10">
        <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/20">
                <UtensilsCrossed size={18} />
            </div>
            <span className="font-heading font-black text-xl tracking-tighter">
                Admin<span className="text-primary">In</span>
            </span>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-grow px-4 space-y-1">
        {menuItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link 
                key={item.href} 
                href={item.href}
                className={`flex items-center gap-3 px-5 py-3.5 rounded-2xl font-bold text-sm transition-all group ${
                    isActive 
                    ? 'bg-primary-soft text-primary' 
                    : 'text-text-muted hover:bg-bg-surface hover:text-text-main'
                }`}
            >
              <item.icon size={18} className={isActive ? 'text-primary' : 'text-text-light group-hover:text-primary'} />
              {item.name}
              {isActive && (
                <motion.div 
                    layoutId="active-pill"
                    className="ml-auto w-1.5 h-1.5 bg-primary rounded-full"
                />
              )}
            </Link>
          )
        })}
      </nav>

      {/* Admin Footer */}
      <div className="p-6 border-t border-border mt-auto">
        <div className="bg-bg-surface p-4 rounded-2xl mb-4">
            <p className="text-[10px] font-black uppercase tracking-widest text-text-light mb-1">Logged as</p>
            <p className="text-sm font-bold text-text-main truncate">Super Admin</p>
        </div>
        <button 
           onClick={() => signOut({ callbackUrl: '/admin/login' })}
           className="w-full flex items-center gap-3 px-5 py-3.5 rounded-2xl font-bold text-sm text-danger hover:bg-danger/5 transition-all"
        >
            <LogOut size={18} />
            Keluar Panel
        </button>
      </div>
    </aside>
  )
}
