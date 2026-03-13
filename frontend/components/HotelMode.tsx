'use client'

import { useState } from 'react'
import {
  AlertTriangle, Flame, Building2, Users, Zap,
  CheckCircle, XCircle, BookOpen, ChefHat
} from 'lucide-react'
import { optimizeHotel, HotelOptimizeResponse, HotelOptimizeRequest } from '@/lib/api'

const HOTEL_EQUIPMENT = [
  'Induction Hob', 'Electric Oven', 'Combi Steamer',
  'Electric Griller', 'Hot Case', 'Microwave', 'Electric Kettle'
]

const DEFAULT_MENU =
  'Veg Biryani, Chicken Curry, Dal Makhani, Tandoori Roti, Paneer Butter Masala, Curd Rice, Sambar, Rasam, Papad, Lassi, Filter Coffee'

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
    if (!form.existing_menu.trim()) { setError('Please enter your current menu items.'); return }
    setLoading(true)
    setError(null)
    setResult(null)
    try {
      const data = await optimizeHotel(form)
      setResult(data)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to connect. Is the backend running?')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* 20% quota warning banner */}
      <div className="flex items-center gap-3 p-4 rounded-xl" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)' }}>
        <AlertTriangle size={18} className="text-red-400 flex-shrink-0" />
        <div>
          <p className="text-sm font-bold text-red-300">Government 20% Allocation Active</p>
          <p className="text-xs text-gray-400 mt-0.5">Commercial LPG is rationed to 20% of normal supply. Violations may result in your establishment&apos;s connection being suspended.</p>
        </div>
        <span className="badge-critical ml-auto whitespace-nowrap">20% Quota</span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Row 1 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="crisis-label flex items-center gap-1">
              <Flame size={11} className="text-orange-500" /> Commercial Cylinders Left
            </label>
            <input
              type="number" min={0.5} max={50} step={0.5}
              className="crisis-input"
              value={form.commercial_cylinders_left}
              onChange={e => setForm(p => ({ ...p, commercial_cylinders_left: parseFloat(e.target.value) || 1 }))}
            />
            <p className="text-xs text-gray-600 mt-1">19kg commercial cylinders</p>
          </div>
          <div>
            <label className="crisis-label flex items-center gap-1">
              <Users size={11} className="text-orange-500" /> Estimated Daily Footfall
            </label>
            <input
              type="number" min={10} max={2000} step={10}
              className="crisis-input"
              value={form.estimated_daily_footfall}
              onChange={e => setForm(p => ({ ...p, estimated_daily_footfall: parseInt(e.target.value) || 50 }))}
            />
            <p className="text-xs text-gray-600 mt-1">Covers per day (realistic, not peak)</p>
          </div>
        </div>

        {/* Menu items */}
        <div>
          <label className="crisis-label flex items-center gap-1">
            <BookOpen size={11} className="text-orange-500" /> Current Menu (Comma-separated)
          </label>
          <textarea
            rows={4}
            className="crisis-input resize-none"
            placeholder="e.g. Veg Biryani, Chicken Curry, Dal Makhani, Curd Rice..."
            value={form.existing_menu}
            onChange={e => setForm(p => ({ ...p, existing_menu: e.target.value }))}
          />
          <p className="text-xs text-gray-600 mt-1">Include every item currently on your menu</p>
        </div>

        {/* Electric equipment */}
        <div>
          <label className="crisis-label flex items-center gap-1">
            <Zap size={11} className="text-orange-500" /> Available Electric Commercial Equipment
          </label>
          <div className="appliance-grid">
            {HOTEL_EQUIPMENT.map(eq => (
              <label key={eq} className={`appliance-item ${form.electric_commercial_equipment.includes(eq) ? 'selected' : ''}`}>
                <input
                  type="checkbox"
                  checked={form.electric_commercial_equipment.includes(eq)}
                  onChange={() => toggleEquip(eq)}
                  className="w-4 h-4 flex-shrink-0"
                />
                <span className="text-sm text-gray-300">{eq}</span>
              </label>
            ))}
          </div>
        </div>

        {error && (
          <div className="flex items-start gap-3 p-4 rounded-xl" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}>
            <AlertTriangle size={18} className="text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-300">{error}</p>
          </div>
        )}

        <button type="submit" disabled={loading} className="btn-ember w-full flex items-center justify-center gap-3 text-base py-3.5">
          {loading ? (
            <><span className="spinner" /> Analyzing with OptiFlame AI...</>
          ) : (
            <><ChefHat size={18} /> Prune Menu for 20% Quota</>
          )}
        </button>
      </form>

      {/* Results */}
      {result && (
        <div className="space-y-4 animate-fade-in">
          {/* Days quota metric */}
          <div className="grid grid-cols-3 gap-3">
            <div className="metric-card">
              <div className="text-2xl font-bold text-orange-400">{result.estimated_days_quota_lasts.toFixed(1)}</div>
              <div className="text-xs text-gray-500 mt-1">Days Quota Lasts</div>
            </div>
            <div className="metric-card">
              <div className="text-2xl font-bold text-emerald-400">{result.approved_menu.length}</div>
              <div className="text-xs text-gray-500 mt-1">Approved Items</div>
            </div>
            <div className="metric-card">
              <div className="text-2xl font-bold text-red-400">{result.disabled_menu.length}</div>
              <div className="text-xs text-gray-500 mt-1">Suspended Items</div>
            </div>
          </div>

          {/* Status Warning */}
          <div className="result-panel" style={{ background: 'linear-gradient(135deg, rgba(239,68,68,0.07), rgba(14,14,26,0.9))', borderColor: 'rgba(239,68,68,0.25)' }}>
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle size={16} className="text-red-400" />
              <h3 className="text-sm font-bold text-red-300 uppercase tracking-wider">Status Warning</h3>
            </div>
            <p className="text-gray-200 text-sm leading-relaxed">{result.status_warning}</p>
          </div>

          {/* Approved & Disabled menu side by side */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Approved */}
            <div className="glass-card p-5">
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle size={16} className="text-emerald-400" />
                <h3 className="text-sm font-bold text-emerald-300 uppercase tracking-wider">Approved Menu</h3>
              </div>
              <div>
                {result.approved_menu.map((item, i) => (
                  <div key={i} className="menu-approved">
                    <CheckCircle size={14} className="text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Disabled */}
            <div className="glass-card p-5">
              <div className="flex items-center gap-2 mb-4">
                <XCircle size={16} className="text-red-400" />
                <h3 className="text-sm font-bold text-red-300 uppercase tracking-wider">Suspended Menu</h3>
              </div>
              <div>
                {result.disabled_menu.map((item, i) => (
                  <div key={i} className="menu-disabled">
                    <XCircle size={14} className="text-red-400 flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Kitchen Instructions */}
          <div className="glass-card p-5">
            <div className="flex items-center gap-2 mb-4">
              <ChefHat size={16} className="text-orange-400" />
              <h3 className="text-sm font-bold text-orange-300 uppercase tracking-wider">Crisis Kitchen Protocol</h3>
            </div>
            <div className="space-y-0">
              {result.kitchen_instructions.map((step, i) => (
                <div key={i} className="step-item">
                  <div className="step-number">{i + 1}</div>
                  <p className="text-sm text-gray-300 leading-relaxed">{step}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
