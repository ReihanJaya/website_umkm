'use client'

import React, { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { UtensilsCrossed, Lock, User, Loader2, ArrowRight, ShieldCheck } from 'lucide-react'
import { motion } from 'framer-motion'
import { toast } from 'react-hot-toast'

export default function AdminLoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const result = await signIn('credentials', {
        redirect: false,
        username,
        password,
      })

      if (result?.error) {
        toast.error('Username atau password salah!')
      } else {
        toast.success('Selamat datang, Admin!')
        router.push('/admin/dashboard')
      }
    } catch (err) {
      toast.error('Terjadi kesalahan sistem')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-bg-surface flex items-center justify-center p-6 selection:bg-primary/30">
      <div className="w-full max-w-md">
        {/* Logo Section */}
        <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-10"
        >
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-[24px] shadow-xl border border-border text-primary mb-6">
                <UtensilsCrossed size={32} />
            </div>
            <h1 className="text-4xl font-black tracking-tighter text-text-main mb-2">Admin<span className="text-primary italic">In</span></h1>
            <p className="text-text-muted text-sm font-medium">Panel kontrol manajemen UMKM Digital</p>
        </motion.div>

        {/* Login Card */}
        <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-white p-10 rounded-[40px] border border-border shadow-premium relative overflow-hidden"
        >
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-primary/30 via-primary to-primary/30"></div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-text-muted mb-2 block px-1">Username Admin</label>
                    <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-text-light" size={18} />
                        <input 
                            type="text" 
                            className="w-full bg-bg-surface border border-border rounded-2xl py-4 pl-12 pr-4 text-sm font-bold focus:border-primary/50 outline-none transition-all"
                            placeholder="Ketik username..."
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                </div>

                <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-text-muted mb-2 block px-1">Kata Sandi</label>
                    <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-text-light" size={18} />
                        <input 
                            type="password" 
                            className="w-full bg-bg-surface border border-border rounded-2xl py-4 pl-12 pr-4 text-sm font-bold focus:border-primary/50 outline-none transition-all"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                </div>

                <div className="flex items-center justify-between px-1">
                    <label className="flex items-center gap-2 cursor-pointer group">
                        <input type="checkbox" className="w-4 h-4 rounded-md border-border text-primary focus:ring-primary/20 cursor-pointer" />
                        <span className="text-[11px] font-bold text-text-muted group-hover:text-text-main transition-colors">Ingat saya</span>
                    </label>
                    <a href="#" className="text-[11px] font-black text-primary hover:underline">Lupa sandi?</a>
                </div>

                <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full btn-primary py-5 text-base rounded-2xl shadow-xl shadow-primary/20 flex items-center justify-center gap-3 disabled:opacity-50"
                >
                    {loading ? (
                        <Loader2 className="animate-spin" size={20} />
                    ) : (
                        <>Masuk Dashboard <ArrowRight size={20} /></>
                    )}
                </button>
            </form>
        </motion.div>

        {/* Footer info */}
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-10 flex items-center justify-center gap-6 text-[10px] font-black uppercase tracking-[0.2em] text-text-light/50"
        >
            <div className="flex items-center gap-2">
                <ShieldCheck size={14} className="text-success" />
                SECURE ACCESS
            </div>
            <div className="w-1 h-1 bg-border rounded-full"></div>
            <div>VERIFIED BY ORDERIN</div>
        </motion.div>
      </div>
    </div>
  )
}
