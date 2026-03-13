'use client'

import { useState } from 'react'
import {
  AlertCircle, Flame, Users, Zap, BookOpen, ChefHat, CheckCircle2, XCircle, Info
} from 'lucide-react'
import { optimizeHotel, HotelOptimizeResponse, HotelOptimizeRequest } from '@/lib/api'

const HOTEL_EQUIPMENT = [
  'Induction Hob', 'Electric Oven', 'Combi Steamer',
  'Electric Griller', 'Hot Food Cabinet', 'Microwave', 'Electric Kettle'
]

const DEFAULT_MENU =
  'Vegetable Biryani, Chicken Curry, Dal Makhani, Tandoori Roti, Paneer Butter Masala, Curd Rice, Sambar, Rasam, Papad, Lassi, Filter Coffee'

export default function HotelMode() {
  const [form, setForm] = useState<HotelOptimizeRequest>({
    commercial_cylinders_left: 3,
    estimated_daily_footfall: 120,
    existing_menu: DEFAULT_MENU,
    electric_commercial_equipment: [],
  })
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<HotelOptimizeResponse | null>(null)
  const [error, setError] = useState<string | null>(null)

  const toggleEquip = (equipment: string) => {
    setForm(prev => ({
      ...prev,
      electric_commercial_equipment: prev.electric_commercial_equipment.includes(equipment)
        ? prev.electric_commercial_equipment.filter(e => e !== equipment)
        : [...prev.electric_commercial_equipment, equipment],
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.existing_menu.trim()) { setError('Please enter your daily menu items.'); return }
    setLoading(true)
    setError(null)
    setResult(null)
    try {
      const data = await optimizeHotel(form)
      setResult(data)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Network connection failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      
      {/* Informational Banner */}
      <div className="flex items-start gap-3 p-4 rounded-lg bg-sky-50 border border-sky-100">
        <Info className="flex-shrink-0 text-sky-600 mt-0.5" size={20} />
        <div>
          <h3 className="text-sm font-semibold text-sky-900 mb-1">State LPG Allocation Act</h3>
          <p className="text-sm text-sky-800 leading-relaxed">
            During the current shortage, commercial gas allocation is strictly capped at 20% of your standard volume. Use this tool to optimize your menu offerings and keep your restaurant operating.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 flex flex-col">
        
        {/* Unit Data */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="std-label flex items-center gap-2">
              <Flame size={14} className="text-slate-400" /> Stock (Commercial Cylinders)
            </label>
            <input
              type="number" min={0.5} max={50} step={0.5}
              className="std-input"
              value={form.commercial_cylinders_left}
              onChange={e => setForm(p => ({ ...p, commercial_cylinders_left: parseFloat(e.target.value) || 1 }))}
            />
          </div>
          <div>
            <label className="std-label flex items-center gap-2">
              <Users size={14} className="text-slate-400" /> Expected Daily Customers
            </label>
            <input
              type="number" min={10} max={2000} step={10}
              className="std-input"
              value={form.estimated_daily_footfall}
              onChange={e => setForm(p => ({ ...p, estimated_daily_footfall: parseInt(e.target.value) || 50 }))}
            />
          </div>
        </div>

        {/* Existing Menu */}
        <div>
          <label className="std-label flex items-center gap-2">
            <BookOpen size={14} className="text-slate-400" /> Current Menu Offerings (comma-separated)
          </label>
          <textarea
            rows={3}
            className="std-input resize-y min-h-[100px]"
            value={form.existing_menu}
            onChange={e => setForm(p => ({ ...p, existing_menu: e.target.value }))}
          />
        </div>

        {/* Commercial Grid */}
        <div>
          <label className="std-label mb-3 flex items-center gap-2">
            <Zap size={14} className="text-slate-400" /> Electric Kitchen Equipment Available
          </label>
          <div className="appliance-grid">
            {HOTEL_EQUIPMENT.map(eq => (
              <label key={eq} className={`appliance-item ${form.electric_commercial_equipment.includes(eq) ? 'selected' : ''}`}>
                <input
                  type="checkbox"
                  checked={form.electric_commercial_equipment.includes(eq)}
                  onChange={() => toggleEquip(eq)}
                />
                <span className="text-sm font-medium text-slate-700">{eq}</span>
              </label>
            ))}
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-3 p-4 rounded-md bg-red-50 border border-red-200 text-red-700 text-sm">
            <AlertCircle size={18} className="text-red-500" />
            <p>{error}</p>
          </div>
        )}

        <div className="pt-2 border-t border-slate-200">
          <button type="submit" disabled={loading} className="btn-primary w-full py-3 text-base">
            {loading ? (
              <><span className="spinner" /> Analyzing Menu...</>
            ) : (
              <><ChefHat size={18} /> Generate Optimized Menu</>
            )}
          </button>
        </div>
      </form>

      {/* Analytics Output */}
      {result && (
        <div className="space-y-6 animate-fade-in mt-8 pt-8 border-t border-slate-200">
          
          <h2 className="text-lg font-bold text-slate-800">Menu Analysis Results</h2>
          
          {/* Key Result Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="metric-box bg-slate-50">
              <div className="text-sm text-slate-500 font-medium mb-1">Estimated Operating Days</div>
              <div className="text-3xl font-bold text-slate-800">{result.estimated_days_quota_lasts.toFixed(1)} <span className="text-base font-normal text-slate-500">days</span></div>
            </div>
            <div className="metric-box bg-green-50 border-green-200">
              <div className="text-sm text-green-700 font-medium mb-1">Menu Items Approved</div>
              <div className="text-3xl font-bold text-green-700">{result.approved_menu.length} <span className="text-base font-normal text-green-600/70">items</span></div>
            </div>
            <div className="metric-box bg-red-50 border-red-200 sm:col-span-2 lg:col-span-1">
              <div className="text-sm text-red-700 font-medium mb-1">Items Suspended</div>
              <div className="text-3xl font-bold text-red-700">{result.disabled_menu.length} <span className="text-base font-normal text-red-600/70">items</span></div>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-5">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle size={18} className="text-amber-600" />
              <h3 className="text-base font-bold text-amber-900">Important Notice</h3>
            </div>
            <p className="text-amber-800 text-[14px] leading-relaxed">{result.status_warning}</p>
          </div>

          {/* Menu Split */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Approved */}
            <div className="standard-card">
              <div className="bg-slate-50 px-5 py-4 border-b border-slate-200 flex items-center justify-between">
                <h3 className="font-semibold text-slate-800">Approved Menu</h3>
                <CheckCircle2 size={18} className="text-green-500" />
              </div>
              <ul className="divide-y divide-slate-100 px-5 py-2">
                {result.approved_menu.map((item, i) => (
                  <li key={i} className="flex items-center py-3 text-sm text-slate-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-3 shrink-0"></span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Suspended */}
            <div className="standard-card">
              <div className="bg-slate-50 px-5 py-4 border-b border-slate-200 flex items-center justify-between">
                <h3 className="font-semibold text-slate-800">Suspended Items</h3>
                <XCircle size={18} className="text-red-500" />
              </div>
              <ul className="divide-y divide-slate-100 px-5 py-2">
                {result.disabled_menu.map((item, i) => (
                  <li key={i} className="flex items-center py-3 text-sm text-slate-500 line-through">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-300 mr-3 shrink-0"></span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
            <div className="bg-slate-50 border-b border-slate-200 px-5 py-3 flex items-center gap-2">
              <ChefHat size={16} className="text-sky-600" />
              <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide">Kitchen Preparation Guide</h3>
            </div>
            <div className="p-0">
              {result.kitchen_instructions.map((step, i) => (
                <div key={i} className="flex gap-4 items-start p-4 border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600">
                    {i + 1}
                  </div>
                  <p className="text-[15px] text-slate-700 leading-relaxed">{step}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}
    </div>
  )
}
