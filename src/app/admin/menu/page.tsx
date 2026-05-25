'use client'

import React, { useState, useEffect } from 'react'
import AdminSidebar from '@/components/AdminSidebar'
import ImageUpload from '@/components/ImageUpload'
import { 
    Plus, 
    Search, 
    Edit2, 
    Trash2, 
    Filter, 
    Image as ImageIcon,
    X,
    Loader2,
    ArrowRight
} from 'lucide-react'
import { formatRupiah } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-hot-toast'

export default function AdminMenuPage() {
  const [menuItems, setMenuItems] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  
  // Modal State
  const [showModal, setShowModal] = useState(false)
  const [editingItem, setEditingItem] = useState<any>(null)
  const [submitting, setSubmitting] = useState(false)

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    categoryId: '',
    image: '',
    available: true
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      const [mRes, cRes] = await Promise.all([
        fetch('/api/menu'),
        fetch('/api/categories')
      ])
      const mData = await mRes.json()
      const cData = await cRes.json()
      setMenuItems(mData)
      setCategories(cData)
    } finally {
      setLoading(false)
    }
  }

  const handleOpenModal = (item: any = null) => {
    if (item) {
      setEditingItem(item)
      setFormData({
        name: item.name,
        description: item.description || '',
        price: item.price.toString(),
        categoryId: item.categoryId.toString(),
        image: item.image || '',
        available: item.available
      })
    } else {
      setEditingItem(null)
      setFormData({
        name: '',
        description: '',
        price: '',
        categoryId: categories[0]?.id.toString() || '',
        image: '',
        available: true
      })
    }
    setShowModal(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    
    const url = editingItem ? `/api/menu/${editingItem.id}` : '/api/menu'
    const method = editingItem ? 'PUT' : 'POST'

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (res.ok) {
        toast.success(editingItem ? 'Menu diperbarui!' : 'Menu baru berhasil ditambahkan!')
        setShowModal(false)
        fetchData()
      } else {
        const errorData = await res.json()
        throw new Error(errorData.error || 'Gagal menyimpan data')
      }
    } catch (e: any) {
      toast.error(e.message)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Apakah Anda yakin ingin menghapus menu ini?')) return
    
    try {
      const res = await fetch(`/api/menu/${id}`, { method: 'DELETE' })
      if (res.ok) {
        toast.success('Menu dihapus secara permanen')
        fetchData()
      }
    } catch (e) {
      toast.error('Gagal menghapus menu')
    }
  }

  const filteredMenu = menuItems.filter(m => m.name.toLowerCase().includes(searchTerm.toLowerCase()))

  return (
    <div className="min-h-screen bg-bg-surface flex">
      <AdminSidebar />
      
      <main className="flex-grow pl-64 transition-all">
        {/* Topbar */}
        <header className="h-20 bg-white border-b border-border sticky top-0 z-30 flex items-center justify-between px-10">
          <div className="flex items-center gap-4">
              <h1 className="text-xl font-black tracking-tight text-text-main">Manajemen <span className="text-primary italic">Menu</span></h1>
          </div>
          <button 
            onClick={() => handleOpenModal()}
            className="btn-primary shadow-xl shadow-primary/20"
          >
            <Plus size={20} strokeWidth={3} />
            Tambah Menu
          </button>
        </header>

        <div className="p-10">
            {/* Search and Filters */}
            <div className="flex items-center gap-4 mb-10">
                <div className="relative flex-grow max-w-md">
                    <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-light" />
                    <input 
                        type="text" 
                        placeholder="Cari menu, kategori, atau deskripsi..."
                        className="w-full bg-white border border-border rounded-2xl py-3.5 pl-12 pr-4 text-sm font-medium focus:border-primary/30 outline-none shadow-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <button className="p-3.5 bg-white border border-border rounded-2xl text-text-muted hover:text-primary transition-all shadow-sm">
                    <Filter size={20} />
                </button>
            </div>

            {/* Table Container */}
            <div className="bg-white rounded-[40px] border border-border shadow-sm overflow-hidden">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-border bg-bg-surface/30">
                            <th className="px-8 py-6 text-[11px] font-black uppercase tracking-[0.2em] text-text-muted">Produk</th>
                            <th className="px-8 py-6 text-[11px] font-black uppercase tracking-[0.2em] text-text-muted">Kategori</th>
                            <th className="px-8 py-6 text-[11px] font-black uppercase tracking-[0.2em] text-text-muted">Harga</th>
                            <th className="px-8 py-6 text-[11px] font-black uppercase tracking-[0.2em] text-text-muted">Status</th>
                            <th className="px-8 py-6 text-[11px] font-black uppercase tracking-[0.2em] text-text-muted text-right">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border/50">
                        {loading && menuItems.length === 0 ? (
                             <tr><td colSpan={5} className="py-20 text-center text-text-light font-bold">Sedang memuat database...</td></tr>
                        ) : filteredMenu.map((item, i) => (
                           <motion.tr 
                             initial={{ opacity: 0, y: 10 }}
                             animate={{ opacity: 1, y: 0 }}
                             transition={{ delay: i * 0.05 }}
                             key={item.id} 
                             className="hover:bg-bg-surface/30 transition-colors group"
                            >
                                <td className="px-8 py-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-16 h-16 rounded-2xl overflow-hidden bg-bg-surface border border-border group-hover:scale-105 transition-transform flex-shrink-0">
                                            {item.image ? (
                                                <img src={item.image} alt="" className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-text-light/30">
                                                    <ImageIcon size={24} />
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <p className="font-extrabold text-text-main group-hover:text-primary transition-colors">{item.name}</p>
                                            <p className="text-[10px] text-text-muted mt-1 uppercase font-black tracking-widest leading-none truncate max-w-[200px]">{item.description || "No description"}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-8 py-6">
                                    <span className="px-4 py-1.5 bg-bg-surface border border-border rounded-xl text-[10px] font-black text-text-muted uppercase tracking-widest">
                                        {categories.find(c => c.id === item.categoryId)?.name || 'General'}
                                    </span>
                                </td>
                                <td className="px-8 py-6">
                                    <span className="font-black text-text-main text-lg">{formatRupiah(item.price)}</span>
                                </td>
                                <td className="px-8 py-6">
                                    <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                                            item.available 
                                            ? 'bg-success/10 text-success border-success/20' 
                                            : 'bg-danger/10 text-danger border-danger/20'
                                        }`}>
                                        <div className={`w-1.5 h-1.5 rounded-full ${item.available ? 'bg-success animate-pulse' : 'bg-danger'}`}></div>
                                        {item.available ? 'Tersedia' : 'Habis'}
                                    </div>
                                </td>
                                <td className="px-8 py-6 text-right">
                                    <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button 
                                            onClick={() => handleOpenModal(item)}
                                            className="p-3 bg-white hover:bg-primary-soft hover:text-primary border border-border rounded-xl transition-all shadow-sm"
                                        >
                                            <Edit2 size={18} />
                                        </button>
                                        <button 
                                            onClick={() => handleDelete(item.id)}
                                            className="p-3 bg-white hover:bg-danger/10 hover:text-danger border border-border rounded-xl transition-all shadow-sm"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </td>
                           </motion.tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>

        {/* MODAL FORM ADD/EDIT */}
        <AnimatePresence>
          {showModal && (
            <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    className="bg-white w-full max-w-2xl rounded-[48px] shadow-2xl border border-border overflow-hidden"
                >
                    <div className="p-10">
                        <div className="flex justify-between items-center mb-10">
                            <div>
                                <h2 className="text-3xl font-black tracking-tight">{editingItem ? 'Edit' : 'Tambah'} <span className="text-primary italic">Menu</span></h2>
                                <p className="text-text-muted mt-1 font-medium italic">Informasi produk detail untuk pelanggan</p>
                            </div>
                            <button onClick={() => setShowModal(false)} className="p-3 hover:bg-bg-surface rounded-full transition-colors">
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-8">
                            <div className="grid grid-cols-2 gap-8">
                                <div className="col-span-full">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-text-muted mb-3 block px-1">Foto Menu</label>
                                    <ImageUpload 
                                      initialImage={formData.image}
                                      onUploadSuccess={(url) => setFormData({...formData, image: url})} 
                                    />
                                </div>

                                <div className="col-span-full sm:col-span-1">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-text-muted mb-3 block px-1">Nama Menu</label>
                                    <input 
                                        type="text" 
                                        className="w-full bg-bg-surface border border-border rounded-2xl py-4 px-6 text-sm font-bold focus:border-primary/50 outline-none"
                                        placeholder="Misal: Nasi Goreng Spesial"
                                        value={formData.name}
                                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                                        required
                                    />
                                </div>

                                <div className="col-span-full sm:col-span-1">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-text-muted mb-3 block px-1">Harga (Rupiah)</label>
                                    <input 
                                        type="number" 
                                        className="w-full bg-bg-surface border border-border rounded-2xl py-4 px-6 text-sm font-bold focus:border-primary/50 outline-none"
                                        placeholder="25000"
                                        value={formData.price}
                                        onChange={(e) => setFormData({...formData, price: e.target.value})}
                                        required
                                    />
                                </div>

                                <div className="col-span-full sm:col-span-1">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-text-muted mb-3 block px-1">Kategori</label>
                                    <select 
                                        className="w-full bg-bg-surface border border-border rounded-2xl py-4 px-6 text-sm font-bold focus:border-primary/50 outline-none appearance-none"
                                        value={formData.categoryId}
                                        onChange={(e) => setFormData({...formData, categoryId: e.target.value})}
                                    >
                                        {categories.map(cat => (
                                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="col-span-full sm:col-span-1">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-text-muted mb-3 block px-1">Status Ketersediaan</label>
                                    <div className="flex items-center gap-4 bg-bg-surface p-2 rounded-2xl border border-border">
                                        <button 
                                            type="button"
                                            onClick={() => setFormData({...formData, available: true})}
                                            className={`flex-grow py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${formData.available ? 'bg-white text-success shadow-sm' : 'text-text-muted'}`}
                                        >
                                            Ada
                                        </button>
                                        <button 
                                            type="button"
                                            onClick={() => setFormData({...formData, available: false})}
                                            className={`flex-grow py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${!formData.available ? 'bg-white text-danger shadow-sm' : 'text-text-muted'}`}
                                        >
                                            Habis
                                        </button>
                                    </div>
                                </div>

                                <div className="col-span-full">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-text-muted mb-3 block px-1">Deskripsi Singkat</label>
                                    <textarea 
                                        className="w-full bg-bg-surface border border-border rounded-2xl py-4 px-6 text-sm font-bold focus:border-primary/50 outline-none min-h-[100px]"
                                        placeholder="Ceritakan tentang hidangan ini..."
                                        value={formData.description}
                                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                                    ></textarea>
                                </div>
                            </div>

                            <button 
                                type="submit" 
                                disabled={submitting}
                                className="w-full btn-primary py-5 text-lg rounded-2xl shadow-xl shadow-primary/20 flex items-center justify-center gap-3 disabled:opacity-50"
                            >
                                {submitting ? <Loader2 size={24} className="animate-spin" /> : (
                                    <>Simpan Database <ArrowRight size={20} /></>
                                )}
                            </button>
                        </form>
                    </div>
                </motion.div>
            </div>
          )}
        </AnimatePresence>
      </main>
    </div>
  )
}
