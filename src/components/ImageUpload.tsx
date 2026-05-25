'use client'

import React, { useState, useRef } from 'react'
import { Upload, X, Loader2, Image as ImageIcon } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface ImageUploadProps {
  onUploadSuccess: (url: string) => void
  initialImage?: string
}

export default function ImageUpload({ onUploadSuccess, initialImage }: ImageUploadProps) {
  const [preview, setPreview] = useState(initialImage || '')
  const [loading, setLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Preview instantly
    setPreview(URL.createObjectURL(file))
    
    // Start Upload
    setLoading(true)
    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })
      const data = await res.json()
      if (data.url) {
        onUploadSuccess(data.url)
      }
    } catch (err) {
      console.error('Upload failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full">
      <input 
        type="file" 
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
      
      <AnimatePresence mode="wait">
        {preview ? (
          <motion.div 
            key="preview"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="relative aspect-video w-full rounded-2xl overflow-hidden group border-2 border-dashed border-primary/20"
          >
            <img src={preview} alt="Upload Preview" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
               <button 
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-3 bg-white text-text-main rounded-xl hover:bg-primary hover:text-white transition-all font-bold text-xs uppercase"
               >
                  Ganti Foto
               </button>
               <button 
                type="button"
                onClick={() => {
                  setPreview('')
                  onUploadSuccess('')
                }}
                className="p-3 bg-danger text-white rounded-xl hover:bg-red-600 transition-all"
               >
                  <X size={18} />
               </button>
            </div>

            {loading && (
                <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center">
                    <Loader2 className="animate-spin text-primary mb-2" size={32} />
                    <p className="text-[10px] font-black uppercase tracking-widest text-primary">Mengunggah...</p>
                </div>
            )}
          </motion.div>
        ) : (
          <motion.div 
            key="dropzone"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => fileInputRef.current?.click()}
            className="aspect-video w-full rounded-2xl border-2 border-dashed border-border flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 hover:bg-primary-soft/30 transition-all group"
          >
            <div className="w-16 h-16 bg-bg-surface rounded-2xl flex items-center justify-center text-text-light mb-4 group-hover:text-primary group-hover:scale-110 transition-all">
                <Upload size={32} />
            </div>
            <p className="font-bold text-sm text-text-main">Klik atau tarik gambar ke sini</p>
            <p className="text-[10px] text-text-light mt-1 font-black uppercase tracking-[0.2em]">Format: JPG, PNG, WEBP (Maks 5MB)</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
