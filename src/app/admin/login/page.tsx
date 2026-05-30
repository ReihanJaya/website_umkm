'use client'

import React, { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { UtensilsCrossed, Lock, User, Loader2, ArrowRight, ShieldCheck, Eye, EyeOff } from 'lucide-react'
import { motion } from 'framer-motion'
import { toast } from 'react-hot-toast'

export default function AdminLoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
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
    } catch {
      toast.error('Terjadi kesalahan sistem')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#F8F9FB] flex items-center justify-center p-4 sm:p-6">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-sm sm:max-w-md relative z-10">
        {/* Logo */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-white rounded-[20px] sm:rounded-[24px] shadow-xl border border-border text-primary mb-5">
            <UtensilsCrossed size={28} />
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tighter text-text-main mb-1">
            Admin<span className="text-primary italic">In</span>
          </h1>
          <p className="text-text-muted text-sm font-medium">Panel kontrol manajemen UMKM Digital</p>
        </motion.div>

        {/* Login Card */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-7 sm:p-10 rounded-[32px] sm:rounded-[40px] border border-border shadow-xl shadow-black/[0.06] relative overflow-hidden"
        >
          {/* Top accent bar */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary/30 via-primary to-primary/30" />
          
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username */}
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-text-muted mb-2 block px-1">
                Username Admin
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-text-light" size={17} />
                <input 
                  type="text" 
                  className="w-full bg-bg-surface border border-border rounded-2xl py-3.5 pl-11 pr-4 text-sm font-bold focus:border-primary/50 outline-none transition-all placeholder:font-normal placeholder:text-text-light"
                  placeholder="Ketik username..."
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  autoComplete="username"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-text-muted mb-2 block px-1">
                Kata Sandi
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-text-light" size={17} />
                <input 
                  type={showPass ? 'text' : 'password'}
                  className="w-full bg-bg-surface border border-border rounded-2xl py-3.5 pl-11 pr-12 text-sm font-bold focus:border-primary/50 outline-none transition-all placeholder:font-normal placeholder:text-text-light"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-text-light hover:text-text-main transition-colors"
                >
                  {showPass ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            {/* Remember me */}
            <div className="flex items-center justify-between px-1">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input 
                  type="checkbox" 
                  className="w-4 h-4 rounded border-border text-primary cursor-pointer accent-primary" 
                />
                <span className="text-[11px] font-bold text-text-muted group-hover:text-text-main transition-colors">
                  Ingat saya
                </span>
              </label>
              <a href="#" className="text-[11px] font-black text-primary hover:underline">Lupa sandi?</a>
            </div>

            {/* Submit */}
            <button 
              type="submit" 
              disabled={loading}
              className="w-full btn-primary py-4 sm:py-5 text-sm sm:text-base rounded-2xl shadow-xl shadow-primary/20 flex items-center justify-center gap-3 disabled:opacity-50 mt-2"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>Masuk Dashboard <ArrowRight size={20} /></>
              )}
            </button>
          </form>
        </motion.div>

        {/* Footer */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-8 flex items-center justify-center gap-4 text-[10px] font-black uppercase tracking-widest text-text-light/50"
        >
          <div className="flex items-center gap-1.5">
            <ShieldCheck size={13} className="text-emerald-400" />
            Secure Access
          </div>
          <div className="w-1 h-1 bg-border rounded-full" />
          <div>Verified by OrderIn</div>
        </motion.div>
      </div>
    </div>
  )
}
