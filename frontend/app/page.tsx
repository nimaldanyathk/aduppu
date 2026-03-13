'use client'

import { useState, useEffect } from 'react'
import { Flame, AlertTriangle, MapPin, Radio, ShieldAlert } from 'lucide-react'
import HouseholdMode from '@/components/HouseholdMode'
import HotelMode from '@/components/HotelMode'

const CRISIS_UPDATES = [
  '🔴 LIVE: Strait of Hormuz blockade enters Day 12 — Indian LPG imports at 8% of normal capacity',
  '⚠️ COIMBATORE: Next cylinder booking window opens in 18 days for urban households',
  '🏨 COMMERCIAL ALERT: Hotels violating 20% quota face immediate supply suspension',
  '📦 SCARCITY: Panic buying spikes in Tamil Nadu — 3 cylinders/household reported hoarded',
  '🚢 UPDATE: No relief tankers expected for the next 30 days per PPAC statement',
  '🇮🇳 GOVT ORDER: New cylinder bookings frozen — lockout strictly enforced from March 10',
]

export default function Home() {
  const [activeTab, setActiveTab] = useState<'household' | 'hotel'>('household')
  const [tickerIndex, setTickerIndex] = useState(0)
  const [currentTime, setCurrentTime] = useState<string>('')

  useEffect(() => {
    const interval = setInterval(() => {
      setTickerIndex(i => (i + 1) % CRISIS_UPDATES.length)
    }, 6000)
    return () => clearInterval(interval)
  }, [])

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
    <main className="min-h-screen" style={{ background: 'var(--bg-dark)' }}>

      {/* Crisis Ticker Banner */}
      <div className="crisis-ticker py-2 px-4 flex items-center gap-3 overflow-hidden">
        <div className="flex items-center gap-2 flex-shrink-0">
          <Radio size={14} className="text-red-300 animate-pulse" />
          <span className="text-xs font-bold text-red-200 uppercase tracking-widest whitespace-nowrap">CRISIS ALERT</span>
        </div>
        <div className="h-4 w-px bg-red-800" />
        <p className="text-xs text-red-100 truncate transition-all duration-500">
          {CRISIS_UPDATES[tickerIndex]}
        </p>
      </div>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background gradient orbs */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full opacity-10 blur-3xl"
            style={{ background: 'radial-gradient(circle, #f97316, transparent)' }} />
          <div className="absolute top-0 right-1/4 w-64 h-64 rounded-full opacity-8 blur-3xl"
            style={{ background: 'radial-gradient(circle, #ef4444, transparent)' }} />
        </div>

        <div className="relative max-w-5xl mx-auto px-4 pt-12 pb-8 text-center">
          {/* Logo + Title */}
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="relative">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #ea580c, #f97316)', boxShadow: '0 0 30px rgba(249,115,22,0.4)' }}>
                <span className="flame-icon text-3xl">🔥</span>
              </div>
            </div>
            <div className="text-left">
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight" style={{ background: 'linear-gradient(90deg, #f97316, #fbbf24)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                OptiFlame AI
              </h1>
              <p className="text-xs text-gray-500 font-medium tracking-widest uppercase">Emergency LPG Optimizer</p>
            </div>
          </div>

          {/* Location + Time */}
          <div className="flex items-center justify-center gap-4 mb-5 flex-wrap">
            <div className="flex items-center gap-1.5 text-sm text-gray-400">
              <MapPin size={14} className="text-orange-500" />
              <span>Coimbatore, Tamil Nadu</span>
            </div>
            <div className="h-4 w-px bg-gray-700 hidden sm:block" />
            <div className="flex items-center gap-1.5 text-sm text-gray-400">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span>March 2026 Crisis Active</span>
            </div>
            {currentTime && (
              <>
                <div className="h-4 w-px bg-gray-700 hidden sm:block" />
                <span className="text-sm text-gray-500">{currentTime}</span>
              </>
            )}
          </div>

          {/* Crisis Summary Card */}
          <div className="max-w-2xl mx-auto glass-card p-5 mb-8" style={{ borderColor: 'rgba(239,68,68,0.2)', background: 'rgba(239,68,68,0.04)' }}>
            <div className="flex items-start gap-3">
              <ShieldAlert size={20} className="text-red-400 flex-shrink-0 mt-0.5" />
              <div className="text-left">
                <p className="text-sm font-bold text-red-300 mb-1">Situation — March 2026</p>
                <p className="text-xs text-gray-400 leading-relaxed">
                  The Strait of Hormuz is blocked due to the US-Israel-Iran conflict. India&apos;s LPG imports have dropped to critical levels.
                  <span className="text-amber-400"> Domestic households face a 25–45 day refill lockout.</span>
                  <span className="text-red-400"> Commercial establishments are restricted to 20% of normal LPG allocation.</span>
                  {' '}OptiFlame AI helps you survive this crisis with precise gas conservation.
                </p>
              </div>
            </div>
          </div>

          {/* Mode Tabs */}
          <div className="inline-flex items-center gap-2 p-1.5 rounded-xl" style={{ background: 'rgba(14,14,26,0.8)', border: '1px solid #1f1f2e' }}>
            <button
              className={`tab-btn ${activeTab === 'household' ? 'active' : ''}`}
              onClick={() => setActiveTab('household')}
            >
              🏠 Household Mode
            </button>
            <button
              className={`tab-btn ${activeTab === 'hotel' ? 'active' : ''}`}
              onClick={() => setActiveTab('hotel')}
            >
              🏨 Hotel Mode
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 pb-16">
        {/* Mode description */}
        <div className="glass-card p-4 mb-6 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: 'rgba(249,115,22,0.15)', border: '1px solid rgba(249,115,22,0.2)' }}>
            {activeTab === 'household' ? '🏠' : '🏨'}
          </div>
          <div>
            {activeTab === 'household' ? (
              <>
                <p className="text-sm font-semibold text-white">Household Survival Optimizer</p>
                <p className="text-xs text-gray-500">
                  Calculate exactly how long your gas will last and get a step-by-step plan that routes every possible task to electric appliances — preserving gas only for critical 2-minute bursts.
                </p>
              </>
            ) : (
              <>
                <p className="text-sm font-semibold text-white">Commercial Kitchen Crisis Manager</p>
                <p className="text-xs text-gray-500">
                  Operating under the government&apos;s 20% commercial allocation? Let OptiFlame AI prune your menu, identify gas-heavy dishes to suspend, and restructure your kitchen workflow for maximum survival.
                </p>
              </>
            )}
          </div>
        </div>

        {/* Mode Panel */}
        <div className="glass-card p-6">
          {activeTab === 'household' ? <HouseholdMode /> : <HotelMode />}
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-xs text-gray-600">
            OptiFlame AI · Emergency LPG Conservation Tool · March 2026 ·
            <span className="text-orange-800"> Powered by Google Gemini</span>
          </p>
          <div className="flex items-center justify-center gap-2 mt-2">
            <AlertTriangle size={12} className="text-amber-800" />
            <p className="text-xs text-gray-700">
              AI estimates are advisory. Always follow official government guidelines for LPG usage.
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
