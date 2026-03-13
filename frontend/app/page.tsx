'use client'

import { useState, useEffect } from 'react'
import { Flame, MapPin, ShieldCheck, Cpu } from 'lucide-react'
import HouseholdMode from '@/components/HouseholdMode'
import HotelMode from '@/components/HotelMode'

export default function Home() {
  const [activeTab, setActiveTab] = useState<'household' | 'hotel'>('household')
  const [currentTime, setCurrentTime] = useState<string>('')

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      setCurrentTime(now.toLocaleString('en-IN', {
        timeZone: 'Asia/Kolkata',
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      }))
    }
    updateTime()
    const interval = setInterval(updateTime, 60000)
    return () => clearInterval(interval)
  }, [])

  return (
    <main className="min-h-screen relative overflow-hidden bg-slate-950 text-slate-50">
      
      {/* Premium Background Orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-1/4 w-[500px] h-[500px] rounded-full opacity-[0.03] blur-[100px] bg-indigo-500" />
        <div className="absolute bottom-1/4 right-0 w-[600px] h-[600px] rounded-full opacity-[0.02] blur-[120px] bg-emerald-500" />
      </div>

      <div className="relative max-w-5xl mx-auto px-6 pt-16 pb-20">
        
        {/* Header / Hero Section */}
        <div className="text-center mb-16 animate-slide-up">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <div className="relative group">
              <div className="absolute inset-0 bg-indigo-500 rounded-2xl blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-500" />
              <div className="relative w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center backdrop-blur-xl">
                <Flame size={32} className="text-indigo-400" />
              </div>
            </div>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-4">
            Aduppu <span className="font-medium text-slate-400 tracking-normal ml-2 text-3xl sm:text-4xl md:text-5xl">അടുപ്പ്</span>
          </h1>
          
          <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-8 font-medium">
            Intelligent LPG Management Protocol. Maximize efficiency, minimize waste, and secure your energy reserves with AI-driven precision.
          </p>

          <div className="flex items-center justify-center gap-6 text-sm font-medium text-slate-500 flex-wrap">
            <div className="flex items-center gap-2">
              <MapPin size={16} className="text-indigo-400" />
              <span>Coimbatore Base</span>
            </div>
            <div className="w-1 h-1 rounded-full bg-slate-700 hidden sm:block" />
            <div className="flex items-center gap-2">
              <ShieldCheck size={16} className="text-emerald-400" />
              <span>Conservation Active</span>
            </div>
            {currentTime && (
              <>
                <div className="w-1 h-1 rounded-full bg-slate-700 hidden sm:block" />
                <span>{currentTime}</span>
              </>
            )}
          </div>
        </div>

        {/* Segmented Control Tabs */}
        <div className="flex justify-center mb-10 animate-fade-in" style={{ animationDelay: '150ms' }}>
          <div className="segmented-control glass-card p-1">
            <button
              className={`segment-btn ${activeTab === 'household' ? 'active' : ''}`}
              onClick={() => setActiveTab('household')}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
              Domestic Core
            </button>
            <button
              className={`segment-btn ${activeTab === 'hotel' ? 'active' : ''}`}
              onClick={() => setActiveTab('hotel')}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="16" height="20" x="4" y="2" rx="2" ry="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M12 6h.01"/><path d="M12 10h.01"/><path d="M12 14h.01"/><path d="M16 10h.01"/><path d="M16 14h.01"/><path d="M8 10h.01"/><path d="M8 14h.01"/></svg>
              Commercial Hub
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="glass-card p-6 md:p-8 animate-slide-up" style={{ animationDelay: '300ms', borderColor: 'rgba(99, 102, 241, 0.15)' }}>
          {/* Header context for the specific mode */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-8 border-b border-slate-800/60">
            <div>
              <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2 mb-2">
                {activeTab === 'household' ? 'Domestic Optimization Engine' : 'Commercial Quota Manager'}
              </h2>
              <p className="text-sm text-slate-400 max-w-xl leading-relaxed">
                {activeTab === 'household' 
                  ? 'Calculate reserve longevity and offload thermal load to electric appliances to stretch your cylinder limits during supply shortages.'
                  : 'Operate cleanly within the 20% institutional allocation. Aduppu AI instantly trims your menu matrix to ensure continuous service.'}
              </p>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold whitespace-nowrap self-start md:self-center">
              <Cpu size={14} />
              Gemini 2.0 AI Core
            </div>
          </div>

          {/* Render Mode Component */}
          {activeTab === 'household' ? <HouseholdMode /> : <HotelMode />}
        </div>

        {/* Footer */}
        <div className="mt-16 pt-8 border-t border-slate-800/50 flex flex-col items-center">
          <p className="text-sm text-slate-500 font-medium tracking-wide">
            Aduppu <span className="font-normal mx-1">അടുപ്പ്</span> © 2026
          </p>
          <p className="text-xs text-slate-600 mt-2">
            Intelligent Energy Systems · Powered by Google Gemini
          </p>
        </div>
      </div>
    </main>
  )
}
