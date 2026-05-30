'use client'

import React, { useState, useEffect } from 'react'
import Navbar from '@/components/Navbar'
import { 
    QrCode, 
    Utensils, 
    CreditCard, 
    ChevronRight, 
    Star, 
    ChefHat, 
    LayoutGrid, 
    Coffee, 
    Cookie,
    Plus,
    Flame,
    ArrowRight,
    MapPin,
    Phone,
    Mail
} from 'lucide-react'
import { motion } from 'framer-motion'
import { useCart } from '@/context/CartContext'
import { formatRupiah } from '@/lib/utils'
import Image from 'next/image'

export default function OrderInLandingPage() {
  const [data, setData] = useState<{ categories: any[], menu: any[] }>({ categories: [], menu: [] })
  const [loading, setLoading] = useState(true)
  const { addItem } = useCart()

  useEffect(() => {
    fetchData()
  }, [])

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

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* SECTION 1 — HERO */}
      <section className="pt-28 pb-12 md:pt-36 md:pb-20 relative overflow-hidden">
        <div className="container grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-text-main mb-6 leading-[1.15]">
              Nikmati Makanan <br className="hidden md:inline" />
              <span className="text-primary italic text-4xl sm:text-5xl md:text-6xl lg:text-7xl">Favorit</span> Anda
            </h1>
            <p className="text-text-muted text-base md:text-lg max-w-md mb-10 leading-relaxed font-medium">
              Pesan makanan favorit Anda dengan mudah, cepat, dan aman langsung dari meja Anda.
            </p>
            
            {/* 3 Step Icons in Hero */}
            <div className="flex flex-col sm:flex-row flex-wrap gap-6 md:gap-8 mb-12">
               {[
                 { title: 'Scan QR', icon: QrCode, desc: 'Scan QR Code di meja Anda', bg: 'bg-[#FFF5F1]' },
                 { title: 'Pilih Menu', icon: ChefHat, desc: 'Pilih makanan & minuman favorit', bg: 'bg-[#FFF5F1]' },
                 { title: 'Bayar QRIS', icon: CreditCard, desc: 'Bayar mudah pakai QRIS', bg: 'bg-[#FFF5F1]' }
               ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3 min-w-[140px]">
                     <div className={`w-10 h-10 ${item.bg} rounded-lg flex items-center justify-center text-primary flex-shrink-0`}>
                        <item.icon size={20} />
                     </div>
                     <div>
                        <p className="text-xs font-black text-text-main">{item.title}</p>
                        <p className="text-[10px] text-text-light font-medium">{item.desc}</p>
                     </div>
                  </div>
               ))}
            </div>
 
            <button 
              onClick={() => document.getElementById('menu-section')?.scrollIntoView({ behavior: 'smooth' })}
              className="btn-primary py-4 px-8 text-base md:py-5 md:px-10 md:text-lg shadow-xl shadow-primary/20"
            >
              Mulai Pesan <ChevronRight size={22} />
            </button>
          </motion.div>
 
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="relative flex justify-center lg:justify-end"
          >
            {/* Hero Image Frame from the reference */}
            <div className="relative">
                 <div className="hidden md:block absolute -top-10 -right-10 w-20 h-20 text-border opacity-50 z-0">
                    <div className="grid grid-cols-4 gap-2">
                        {[...Array(16)].map((_, i) => <div key={i} className="w-1.5 h-1.5 bg-current rounded-full"></div>)}
                    </div>
                 </div>
                 <div className="relative z-10 w-[270px] h-[270px] sm:w-[320px] sm:h-[320px] md:w-[480px] md:h-[480px] rounded-[40px] md:rounded-[60px] overflow-hidden border-[8px] md:border-[12px] border-white shadow-2xl">
                    <Image 
                        src="https://images.unsplash.com/photo-1473093226795-af9932fe5856?auto=format&fit=crop&q=80&w=1000" 
                        alt="Hero Food" 
                        fill
                        className="object-cover"
                        priority
                    />
                 </div>
                 {/* Floating Badge */}
                 <div className="absolute bottom-4 left-4 md:bottom-10 md:-left-10 bg-white p-4 md:p-5 rounded-[20px] md:rounded-3xl shadow-xl border border-border z-20 flex items-start gap-3">
                    <div className="w-8 h-8 md:w-10 md:h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary flex-shrink-0">
                        <Flame size={16} className="fill-primary md:hidden" />
                        <Flame size={20} className="fill-primary hidden md:block" />
                    </div>
                    <div>
                        <p className="text-lg md:text-xl font-black leading-none">10K+</p>
                        <p className="text-[9px] md:text-[10px] text-text-muted mt-1 font-bold uppercase tracking-wider md:tracking-widest">Pesanan Selesai<br/>Setiap Bulan</p>
                    </div>
                 </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* SECTION 2 — MENU KATEGORI TABS */}
      <section id="menu-section" className="bg-white sticky top-[72px] z-40 border-b border-border shadow-sm">
        <div className="container py-4">
            <div className="flex justify-start md:justify-center items-center gap-4 md:gap-10 overflow-x-auto no-scrollbar px-4 md:px-0">
                {[
                    { name: 'Semua', icon: LayoutGrid },
                    { name: 'Makanan', icon: Utensils },
                    { name: 'Minuman', icon: Coffee },
                    { name: 'Snack', icon: Cookie }
                ].map((cat, idx) => (
                    <button 
                        key={idx}
                        onClick={() => {
                            if (cat.name === 'Semua') window.scrollTo({ top: 1100, behavior: 'smooth' })
                            else document.getElementById(`sec-${cat.name.toLowerCase()}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                        }}
                        className={`flex items-center gap-3 px-6 py-3 rounded-2xl transition-all font-bold text-sm shrink-0 ${
                            idx === 0 ? 'bg-primary-soft text-primary' : 'text-text-muted hover:bg-bg-surface hover:text-text-main'
                        }`}
                    >
                        <cat.icon size={18} />
                        {cat.name}
                    </button>
                ))}
            </div>
        </div>
      </section>

      {/* SECTION 3 — MENU PALING LARIS */}
      <section className="py-20 bg-white">
        <div className="container">
          <div className="flex justify-between items-end mb-10">
            <div>
                <h2 className="text-3xl font-black flex items-center gap-2 mb-2">
                    <Star size={24} className="text-primary fill-primary" />
                    Menu Paling Laris
                </h2>
                <p className="text-text-muted font-medium">Menu favorit pilihan pelanggan kami</p>
            </div>
            <button className="text-primary font-bold text-sm flex items-center gap-1 group">
                Lihat Semua <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {(data.menu || []).slice(0, 4).map((item: any, idx: number) => (
               <motion.div 
                whileHover={{ y: -5 }}
                key={item.id} 
                className="card-best bg-white flex flex-col p-4 h-full relative"
               >
                 <div className="relative aspect-video rounded-2xl overflow-hidden bg-bg-surface mb-4">
                    {item.image && (
                      <Image 
                        src={item.image} 
                        alt={item.name} 
                        fill 
                        className="object-cover" 
                        sizes="(max-width: 768px) 100vw, 25vw"
                      />
                    )}
                    <div className="absolute top-2 left-2">
                       <span className="badge-orange">Best Seller</span>
                    </div>
                 </div>
                 <div className="flex-grow">
                    <h4 className="font-bold text-lg mb-1">{item.name}</h4>
                    <div className="flex items-center gap-1.5 mb-4">
                        <Star size={14} className="fill-warning text-warning" />
                        <span className="text-[11px] font-black">{item.rating || '4.8'}</span>
                        <span className="text-[10px] text-text-light font-medium">(1.2K)</span>
                    </div>
                 </div>
                 <div className="flex justify-between items-center mt-auto">
                    <span className="text-lg font-black text-text-main">{formatRupiah(item.price)}</span>
                    <button 
                        onClick={() => handleAdd(item)}
                        className="px-4 py-2 bg-white border border-border rounded-xl text-primary font-bold text-xs hover:bg-primary-soft transition-all flex items-center gap-1.5"
                    >
                        <Plus size={14} strokeWidth={3} /> Tambah
                    </button>
                 </div>
               </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 4 — DAFTAR MENU (MAKANAN, MINUMAN, SNACK) */}
      <section className="py-10 bg-white">
        <div className="container space-y-24">
           {(data.categories || []).map((cat: any) => (
             <div key={cat.id} id={`sec-${cat.name.toLowerCase()}`} className="scroll-mt-40">
                <div className="flex justify-between items-end mb-10">
                    <h2 className="text-2xl font-black flex items-center gap-3">
                        <div className="w-1 h-8 bg-primary rounded-full"></div>
                        {cat.name}
                    </h2>
                    <button className="text-primary font-bold text-xs group flex items-center gap-1">
                        Lihat Semua <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {(data.menu || []).filter((m: any) => m.categoryId === cat.id).slice(0, 4).map((item: any) => (
                        <div key={item.id} className="bg-bg-surface p-3 sm:p-4 rounded-[20px] sm:rounded-[24px] border border-border flex items-center gap-3 sm:gap-4 group transition-all hover:bg-white hover:shadow-xl hover:shadow-black/[0.02]">
                            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl sm:rounded-2xl overflow-hidden flex-shrink-0 bg-white shadow-sm relative">
                                {item.image && (
                                  <Image 
                                    src={item.image} 
                                    alt={item.name} 
                                    fill 
                                    className="object-cover" 
                                    sizes="80px"
                                  />
                                )}
                            </div>
                            <div className="flex-grow min-w-0">
                                <h4 className="font-bold text-sm mb-1 truncate group-hover:text-primary transition-colors">{item.name}</h4>
                                <div className="flex items-center gap-1 mb-1.5">
                                    <Star size={12} className="fill-warning text-warning" />
                                    <span className="text-[10px] font-bold">4.7</span>
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
           ))}
        </div>
      </section>

      {/* SECTION 5 — CARA ORDER */}
      <section className="py-32 bg-white border-t border-border">
        <div className="container">
           <div className="text-center mb-16">
                <h2 className="text-3xl font-black mb-4">Cara Order</h2>
           </div>
           
           <div className="flex flex-col md:flex-row items-center justify-center gap-10 md:gap-16">
              {[
                  { id: 1, title: 'Scan QR', desc: 'Scan QR Code di meja Anda', icon: QrCode, bg: 'bg-[#FFF5F1]' },
                  { id: 2, title: 'Pilih Menu', icon: ChefHat, desc: 'Pilih makanan dan minuman favorit', bg: 'bg-[#FFF5F1]' },
                  { id: 3, title: 'Bayar QRIS', icon: CreditCard, desc: 'Bayar mudah dan aman menggunakan QRIS', bg: 'bg-[#FFF5F1]' }
              ].map((step, idx) => (
                <React.Fragment key={step.id}>
                    <div className="flex flex-col items-center text-center max-w-[180px]">
                        <div className={`w-24 h-24 ${step.bg} rounded-[32px] flex items-center justify-center text-primary mb-6 transition-transform hover:scale-110 shadow-lg shadow-primary/5`}>
                            <step.icon size={36} />
                        </div>
                        <h4 className="font-bold mb-2">{idx + 1}. {step.title}</h4>
                        <p className="text-[11px] text-text-muted font-medium leading-relaxed">{step.desc}</p>
                    </div>
                    {idx < 2 && (
                        <div className="hidden md:block">
                            <ArrowRight size={24} className="text-border" />
                        </div>
                    )}
                </React.Fragment>
              ))}
           </div>
        </div>
      </section>

      {/* SECTION 6 — FOOTER */}
      <footer className="pt-24 pb-12 bg-white border-t border-border">
        <div className="container">
            <div className="grid md:grid-cols-4 gap-12 mb-20 text-center md:text-left">
                <div className="md:col-span-1">
                    <div className="flex items-center justify-center md:justify-start gap-2 mb-6">
                        <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center text-white">
                            <Utensils size={18} />
                        </div>
                        <span className="font-heading font-black text-xl tracking-tighter">Order<span className="text-primary">In</span></span>
                    </div>
                    <p className="text-text-muted text-sm leading-relaxed mb-6">Sistem pemesanan digital modern untuk UMKM Indonesia.</p>
                </div>
                
                <div>
                    <h5 className="font-bold text-text-main mb-6 uppercase tracking-widest text-[11px]">Menu</h5>
                    <div className="flex flex-col gap-4 text-sm font-medium text-text-muted">
                        <button className="hover:text-primary text-left">Beranda</button>
                        <button className="hover:text-primary text-left">Makanan</button>
                        <button className="hover:text-primary text-left">Minuman</button>
                        <button className="hover:text-primary text-left">Snack</button>
                    </div>
                </div>

                <div>
                    <h5 className="font-bold text-text-main mb-6 uppercase tracking-widest text-[11px]">Informasi</h5>
                    <div className="flex flex-col gap-4 text-sm font-medium text-text-muted">
                        <a href="#" className="hover:text-primary">Tentang Kami</a>
                        <a href="#" className="hover:text-primary">Cara Order</a>
                        <a href="#" className="hover:text-primary">Kebijakan Privasi</a>
                        <a href="#" className="hover:text-primary">Syarat & Ketentuan</a>
                    </div>
                </div>

                <div>
                    <h5 className="font-bold text-text-main mb-6 uppercase tracking-widest text-[11px]">Hubungi Kami</h5>
                    <div className="flex flex-col gap-4 text-sm font-medium text-text-muted">
                        <div className="flex items-center justify-center md:justify-start gap-3">
                            <Phone size={14} className="text-primary" />
                            <span>0812-3456-7890</span>
                        </div>
                        <div className="flex items-center justify-center md:justify-start gap-3">
                            <Mail size={14} className="text-primary" />
                            <span>info@orderin.id</span>
                        </div>
                        <div className="flex items-center justify-center md:justify-start gap-3">
                            <MapPin size={14} className="text-primary" />
                            <span>Jl. Kuliner No. 123, Indonesia</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4 text-text-light text-[11px] font-bold">
                <p>© 2024 Orderin. All rights reserved.</p>
                <div className="flex gap-6">
                    <a href="#">Instagram</a>
                    <a href="#">Facebook</a>
                    <a href="#">Twitter</a>
                </div>
            </div>
        </div>
      </footer>

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  )
}
