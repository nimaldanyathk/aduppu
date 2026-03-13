'use client'

import { useState, useEffect } from 'react'
import { MapPin, Info, Flame } from 'lucide-react'
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
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Top Navigation Bar */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-md bg-sky-600 flex items-center justify-center text-white">
              <Flame size={18} />
            </div>
            <span className="font-bold text-lg text-slate-900 tracking-tight">
              Aduppu <span className="font-normal text-slate-500 ml-1">അടുപ്പ്</span>
            </span>
          </div>
          
          <div className="hidden sm:flex items-center gap-4 text-sm text-slate-500 font-medium">
            <div className="flex items-center gap-1">
              <MapPin size={14} className="text-slate-400" />
              Coimbatore
            </div>
            {currentTime && (
              <>
                <div className="w-px h-4 bg-slate-200" />
                <span>{currentTime}</span>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Simple Page Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">LPG Management Dashboard</h1>
          <p className="text-slate-500 text-sm max-w-3xl">
            Calculate your gas requirements and get step-by-step cooking plans to ensure your supply lasts through the current shortage period.
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          {/* Tabs */}
          <div className="px-6 border-b border-gray-200">
            <nav className="flex space-x-8" aria-label="Tabs">
              <button
                onClick={() => setActiveTab('household')}
                className={`flex whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'household'
                    ? 'border-sky-600 text-sky-700'
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                }`}
              >
                Household Dashboard
              </button>
              <button
                onClick={() => setActiveTab('hotel')}
                className={`flex whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'hotel'
                    ? 'border-sky-600 text-sky-700'
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                }`}
              >
                Restaurant Manager
              </button>
            </nav>
          </div>

          {/* Active Tab Content */}
          <div className="p-6">
            {activeTab === 'household' ? <HouseholdMode /> : <HotelMode />}
          </div>
        </div>

        {/* Footer info */}
        <div className="mt-8 flex items-start gap-3 p-4 rounded-lg bg-blue-50 border border-blue-100 text-blue-800">
          <Info size={18} className="text-blue-500 shrink-0 mt-0.5" />
          <p className="text-sm">
            <strong>March 2026 Advisory:</strong> Domestic households face a 25-45 day booking wait time. Commercial establishments are restricted to 20% of their normal allocation.
          </p>
        </div>
      </main>
      
      <footer className="bg-white border-t border-gray-200 py-6 text-center">
        <p className="text-sm text-slate-500">Aduppu അടുപ്പ് © 2026. Powered by Google Gemini AI.</p>
      </footer>
    </div>
  )
}
