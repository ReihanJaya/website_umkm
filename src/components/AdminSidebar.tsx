'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
    LayoutDashboard, 
    Utensils, 
    ShoppingBag, 
    CreditCard, 
    Settings, 
    LogOut,
    UtensilsCrossed,
    Menu,
    X,
    QrCode
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { signOut } from 'next-auth/react'

export default function AdminSidebar() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  // Close drawer when route changes
  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  // Close when clicking outside (escape key)
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') setMobileOpen(false) }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [])

  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, href: '/admin/dashboard' },
    { name: 'Daftar Menu', icon: Utensils, href: '/admin/menu' },
    { name: 'Pesanan', icon: ShoppingBag, href: '/admin/orders' },
    { name: 'QR Meja', icon: QrCode, href: '/admin/qr-codes' },
  ]

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-6 pt-8 pb-6 border-b border-border/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/20">
              <UtensilsCrossed size={18} />
            </div>
            <span className="font-heading font-black text-xl tracking-tighter">
              Admin<span className="text-primary">In</span>
            </span>
          </div>
          {/* Close button - mobile only */}
          <button 
            onClick={() => setMobileOpen(false)}
            className="lg:hidden p-2 text-text-muted hover:text-primary hover:bg-primary-soft rounded-xl transition-all"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-grow px-4 py-6 space-y-1">
        {menuItems.map((item) => {
          const isActive = pathname.startsWith(item.href)
          return (
            <Link 
              key={item.href} 
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl font-bold text-sm transition-all group ${
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

      {/* Footer */}
      <div className="p-4 border-t border-border mt-auto">
        <div className="bg-bg-surface p-4 rounded-2xl mb-3">
          <p className="text-[10px] font-black uppercase tracking-widest text-text-light mb-0.5">Logged as</p>
          <p className="text-sm font-bold text-text-main truncate">Super Admin</p>
        </div>
        <button 
           onClick={() => signOut({ callbackUrl: '/admin/login' })}
           className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-sm text-red-400 hover:bg-red-50 hover:text-red-500 transition-all"
        >
          <LogOut size={16} />
          Keluar Panel
        </button>
      </div>
    </div>
  )

  return (
    <>
      {/* ─── Desktop Sidebar ─── */}
      <aside className="hidden lg:flex fixed left-0 top-0 bottom-0 w-64 bg-white border-r border-border z-40 flex-col">
        <SidebarContent />
      </aside>

      {/* ─── Mobile Hamburger Button ─── */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 w-11 h-11 bg-white border border-border shadow-md rounded-2xl flex items-center justify-center text-text-main hover:bg-primary-soft hover:text-primary transition-all"
        aria-label="Open sidebar"
      >
        <Menu size={20} />
      </button>

      {/* ─── Mobile Drawer Overlay ─── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="lg:hidden fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
            />
            {/* Drawer */}
            <motion.div
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="lg:hidden fixed left-0 top-0 bottom-0 w-72 bg-white z-50 shadow-2xl flex flex-col"
            >
              <SidebarContent />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
