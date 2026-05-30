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
    ArrowRight,
    User
} from 'lucide-react'
import { formatRupiah } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-hot-toast'

export default function AdminMenuPage() {
  const [menuItems, setMenuItems] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingItem, setEditingItem] = useState<any>(null)
  const [submitting, setSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    categoryId: '',
    image: '',
    available: true
  })

  useEffect(() => { fetchData() }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      const [mRes, cRes] = await Promise.all([fetch('/api/menu'), fetch('/api/categories')])
      setMenuItems(await mRes.json())
      setCategories(await cRes.json())
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
      setFormData({ name: '', description: '', price: '', categoryId: categories[0]?.id.toString() || '', image: '', available: true })
    }
    setShowModal(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    const url = editingItem ? `/api/menu/${editingItem.id}` : '/api/menu'
    const method = editingItem ? 'PUT' : 'POST'
    try {
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData) })
      if (res.ok) {
        toast.success(editingItem ? 'Menu diperbarui!' : 'Menu baru ditambahkan!')
        setShowModal(false)
        fetchData()
      } else {
        const err = await res.json()
        throw new Error(err.error || 'Gagal menyimpan')
      }
    } catch (e: any) {
      toast.error(e.message)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Hapus menu ini secara permanen?')) return
    try {
      const res = await fetch(`/api/menu/${id}`, { method: 'DELETE' })
      if (res.ok) { toast.success('Menu dihapus'); fetchData() }
    } catch { toast.error('Gagal menghapus') }
  }

  const filteredMenu = menuItems.filter(m => m.name.toLowerCase().includes(searchTerm.toLowerCase()))

  return (
    <div className="min-h-screen bg-[#F8F9FB] flex">
      <AdminSidebar />
      
      <main className="flex-grow lg:pl-64 transition-all">
        {/* Topbar */}
        <header className="h-16 md:h-20 bg-white border-b border-border sticky top-0 z-30 flex items-center justify-between px-5 md:px-10 pl-16 lg:pl-10">
          <div>
            <h1 className="text-base md:text-xl font-black tracking-tight text-text-main">
              Manajemen <span className="text-primary italic">Menu</span>
            </h1>
            <p className="hidden md:block text-xs text-text-muted font-medium mt-0.5">{menuItems.length} item menu aktif</p>
          </div>
          <button 
            onClick={() => handleOpenModal()}
            className="btn-primary !py-2.5 !px-4 md:!py-3 md:!px-6 !text-sm shadow-lg shadow-primary/20"
          >
            <Plus size={18} strokeWidth={3} />
            <span className="hidden sm:inline">Tambah Menu</span>
            <span className="sm:hidden">Tambah</span>
          </button>
        </header>

        <div className="p-5 md:p-8 lg:p-10">
          {/* Search */}
          <div className="flex items-center gap-3 mb-6">
            <div className="relative flex-grow max-w-md">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-light" />
              <input 
                type="text" 
                placeholder="Cari nama menu..."
                className="w-full bg-white border border-border rounded-2xl py-3 pl-11 pr-4 text-sm font-medium focus:border-primary/30 outline-none shadow-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button className="p-3 bg-white border border-border rounded-2xl text-text-muted hover:text-primary transition-all shadow-sm shrink-0">
              <Filter size={18} />
            </button>
          </div>

          {/* ── Desktop Table View ── */}
          <div className="hidden md:block bg-white rounded-[32px] border border-border shadow-sm overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-border bg-bg-surface/50">
                  <th className="px-6 py-5 text-[11px] font-black uppercase tracking-widest text-text-muted">Produk</th>
                  <th className="px-6 py-5 text-[11px] font-black uppercase tracking-widest text-text-muted">Kategori</th>
                  <th className="px-6 py-5 text-[11px] font-black uppercase tracking-widest text-text-muted">Harga</th>
                  <th className="px-6 py-5 text-[11px] font-black uppercase tracking-widest text-text-muted">Status</th>
                  <th className="px-6 py-5 text-[11px] font-black uppercase tracking-widest text-text-muted text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {loading ? (
                  [...Array(5)].map((_, i) => (
                    <tr key={i}><td colSpan={5} className="px-6 py-5"><div className="h-12 bg-bg-surface animate-pulse rounded-xl" /></td></tr>
                  ))
                ) : filteredMenu.map((item, i) => (
                  <motion.tr 
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                    key={item.id} 
                    className="hover:bg-bg-surface/30 transition-colors group"
                  >
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl overflow-hidden bg-bg-surface border border-border group-hover:scale-105 transition-transform flex-shrink-0">
                          {item.image ? (
                            <img src={item.image} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-text-light/30"><ImageIcon size={20} /></div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-extrabold text-text-main group-hover:text-primary transition-colors truncate">{item.name}</p>
                          <p className="text-[10px] text-text-muted mt-0.5 truncate max-w-[180px]">{item.description || 'Tidak ada deskripsi'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className="px-3 py-1.5 bg-bg-surface border border-border rounded-xl text-[10px] font-black text-text-muted uppercase tracking-widest">
                        {categories.find(c => c.id === item.categoryId)?.name || 'General'}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <span className="font-black text-text-main">{formatRupiah(item.price)}</span>
                    </td>
                    <td className="px-6 py-5">
                      <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                        item.available ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-red-50 text-red-400 border-red-100'
                      }`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${item.available ? 'bg-emerald-500 animate-pulse' : 'bg-red-400'}`} />
                        {item.available ? 'Tersedia' : 'Habis'}
                      </div>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => handleOpenModal(item)} className="p-2.5 bg-white hover:bg-primary-soft hover:text-primary border border-border rounded-xl transition-all shadow-sm">
                          <Edit2 size={16} />
                        </button>
                        <button onClick={() => handleDelete(item.id)} className="p-2.5 bg-white hover:bg-red-50 hover:text-red-400 border border-border rounded-xl transition-all shadow-sm">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ── Mobile Card View ── */}
          <div className="md:hidden space-y-4">
            {loading ? (
              [...Array(4)].map((_, i) => (
                <div key={i} className="bg-white rounded-[20px] border border-border p-4 shadow-sm animate-pulse h-24" />
              ))
            ) : filteredMenu.map((item, i) => (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                key={item.id}
                className="bg-white rounded-[20px] border border-border p-4 shadow-sm flex items-center gap-4"
              >
                <div className="w-16 h-16 rounded-xl overflow-hidden bg-bg-surface border border-border flex-shrink-0">
                  {item.image ? (
                    <img src={item.image} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-text-light/30"><ImageIcon size={20} /></div>
                  )}
                </div>
                <div className="flex-grow min-w-0">
                  <p className="font-bold text-text-main truncate">{item.name}</p>
                  <p className="text-xs text-text-muted font-medium">{formatRupiah(item.price)}</p>
                  <div className={`inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                    item.available ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-red-50 text-red-400 border-red-100'
                  }`}>
                    <div className={`w-1 h-1 rounded-full ${item.available ? 'bg-emerald-500' : 'bg-red-400'}`} />
                    {item.available ? 'Tersedia' : 'Habis'}
                  </div>
                </div>
                <div className="flex flex-col gap-2 flex-shrink-0">
                  <button onClick={() => handleOpenModal(item)} className="p-2 bg-bg-surface hover:bg-primary-soft hover:text-primary border border-border rounded-xl transition-all">
                    <Edit2 size={15} />
                  </button>
                  <button onClick={() => handleDelete(item.id)} className="p-2 bg-bg-surface hover:bg-red-50 hover:text-red-400 border border-border rounded-xl transition-all">
                    <Trash2 size={15} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Modal Add/Edit */}
        <AnimatePresence>
          {showModal && (
            <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-6 bg-black/40 backdrop-blur-sm">
              <motion.div 
                initial={{ opacity: 0, y: 60 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 60 }}
                className="bg-white w-full sm:max-w-2xl rounded-t-[40px] sm:rounded-[40px] shadow-2xl border border-border overflow-hidden max-h-[90vh] overflow-y-auto"
              >
                <div className="p-6 md:p-10">
                  {/* Drag handle — mobile only */}
                  <div className="w-10 h-1 bg-border rounded-full mx-auto mb-6 sm:hidden" />
                  
                  <div className="flex justify-between items-start mb-8">
                    <div>
                      <h2 className="text-2xl md:text-3xl font-black tracking-tight">{editingItem ? 'Edit' : 'Tambah'} <span className="text-primary italic">Menu</span></h2>
                      <p className="text-text-muted mt-1 font-medium text-sm">Informasi produk untuk pelanggan</p>
                    </div>
                    <button onClick={() => setShowModal(false)} className="p-2 hover:bg-bg-surface rounded-full transition-colors">
                      <X size={22} />
                    </button>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Image Upload */}
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-widest text-text-muted mb-3 block">Foto Menu</label>
                      <ImageUpload 
                        initialImage={formData.image}
                        onUploadSuccess={(url) => setFormData({...formData, image: url})} 
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="text-[10px] font-black uppercase tracking-widest text-text-muted mb-2 block">Nama Menu</label>
                        <input 
                          type="text" 
                          className="w-full bg-bg-surface border border-border rounded-2xl py-3.5 px-5 text-sm font-bold focus:border-primary/50 outline-none"
                          placeholder="Nasi Goreng Spesial"
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          required
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-black uppercase tracking-widest text-text-muted mb-2 block">Harga (Rp)</label>
                        <input 
                          type="number" 
                          className="w-full bg-bg-surface border border-border rounded-2xl py-3.5 px-5 text-sm font-bold focus:border-primary/50 outline-none"
                          placeholder="25000"
                          value={formData.price}
                          onChange={(e) => setFormData({...formData, price: e.target.value})}
                          required
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-black uppercase tracking-widest text-text-muted mb-2 block">Kategori</label>
                        <select 
                          className="w-full bg-bg-surface border border-border rounded-2xl py-3.5 px-5 text-sm font-bold focus:border-primary/50 outline-none appearance-none"
                          value={formData.categoryId}
                          onChange={(e) => setFormData({...formData, categoryId: e.target.value})}
                        >
                          {categories.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="text-[10px] font-black uppercase tracking-widest text-text-muted mb-2 block">Status</label>
                        <div className="flex items-center gap-2 bg-bg-surface p-1.5 rounded-2xl border border-border">
                          <button 
                            type="button"
                            onClick={() => setFormData({...formData, available: true})}
                            className={`flex-grow py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${formData.available ? 'bg-white text-emerald-600 shadow-sm' : 'text-text-muted'}`}
                          >
                            Tersedia
                          </button>
                          <button 
                            type="button"
                            onClick={() => setFormData({...formData, available: false})}
                            className={`flex-grow py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${!formData.available ? 'bg-white text-red-400 shadow-sm' : 'text-text-muted'}`}
                          >
                            Habis
                          </button>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] font-black uppercase tracking-widest text-text-muted mb-2 block">Deskripsi</label>
                      <textarea 
                        className="w-full bg-bg-surface border border-border rounded-2xl py-3.5 px-5 text-sm font-bold focus:border-primary/50 outline-none min-h-[90px] resize-none"
                        placeholder="Ceritakan tentang hidangan ini..."
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                      />
                    </div>

                    <button 
                      type="submit" 
                      disabled={submitting}
                      className="w-full btn-primary py-4 text-base rounded-2xl shadow-xl shadow-primary/20 flex items-center justify-center gap-3 disabled:opacity-50"
                    >
                      {submitting ? <Loader2 size={22} className="animate-spin" /> : (
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
