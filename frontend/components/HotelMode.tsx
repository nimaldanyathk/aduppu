'use client'

import { useState } from 'react'
import {
  AlertCircle, Flame, Users, Zap, BookOpen, ChefHat, CheckCircle2, XCircle
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
    if (!form.existing_menu.trim()) { setError('Please enter your menu items.'); return }
    setLoading(true)
    setError(null)
    setResult(null)
    try {
      const data = await optimizeHotel(form)
      setResult(data)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Network failure. Ensure Aduppu engine is running.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      
      {/* Policy Banner */}
      <div className="flex items-start gap-4 p-5 rounded-2xl bg-indigo-500/10 border border-indigo-500/20">
        <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400 mt-0.5 shrink-0">
          <BookOpen size={20} />
        </div>
        <div>
          <h3 className="text-sm font-bold text-indigo-100 uppercase tracking-wider mb-1">State Allocation Policy Active</h3>
          <p className="text-sm text-indigo-200/70 leading-relaxed">
            Commercial LPG operations are strictly limited to 20% of standard baseline due to supply constraints. Aduppu AI will automatically audit and trim your menu to maintain operational longevity.
          </p>
        </div>
        <div className="hidden sm:flex ml-auto pl-4 shrink-0">
          <span className="status-badge brand">20% Quota Enforced</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Unit Data */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="group">
            <label className="premium-label group-focus-within:text-indigo-400 transition-colors">
              <Flame size={14} /> Commercial Cylinders Available
            </label>
            <input
              type="number" min={0.5} max={50} step={0.5}
              className="premium-input"
              value={form.commercial_cylinders_left}
              onChange={e => setForm(p => ({ ...p, commercial_cylinders_left: parseFloat(e.target.value) || 1 }))}
            />
          </div>
          <div className="group">
            <label className="premium-label group-focus-within:text-indigo-400 transition-colors">
              <Users size={14} /> Estimated Daily Footfall
            </label>
            <input
              type="number" min={10} max={2000} step={10}
              className="premium-input"
              value={form.estimated_daily_footfall}
              onChange={e => setForm(p => ({ ...p, estimated_daily_footfall: parseInt(e.target.value) || 50 }))}
            />
          </div>
        </div>

        {/* Existing Menu */}
        <div className="group">
          <label className="premium-label group-focus-within:text-indigo-400 transition-colors">
            <BookOpen size={14} /> Current Menu Matrix (CSV Format)
          </label>
          <textarea
            rows={3}
            className="premium-input resize-y min-h-[100px]"
            value={form.existing_menu}
            onChange={e => setForm(p => ({ ...p, existing_menu: e.target.value }))}
          />
        </div>

        {/* Commercial Grid */}
        <div>
          <label className="premium-label mb-3">
            <Zap size={14} /> Electric Institutional Equipment
          </label>
          <div className="appliance-grid">
            {HOTEL_EQUIPMENT.map(eq => (
              <label key={eq} className={`appliance-item ${form.electric_commercial_equipment.includes(eq) ? 'selected' : ''}`}>
                <input
                  type="checkbox"
                  checked={form.electric_commercial_equipment.includes(eq)}
                  onChange={() => toggleEquip(eq)}
                  className="accent-indigo-500"
                />
                <span className="text-sm font-medium text-slate-300">{eq}</span>
              </label>
            ))}
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-200 text-sm">
            <AlertCircle size={18} className="text-red-400" />
            <p>{error}</p>
          </div>
        )}

        <button type="submit" disabled={loading} className="btn-primary w-full py-4 text-base mt-4">
          {loading ? (
            <><span className="spinner" /> Analyzing Matrix...</>
          ) : (
            <><ChefHat size={18} /> Run Menu Pruning Protocol</>
          )}
        </button>
      </form>

      {/* Analytics Output */}
      {result && (
        <div className="space-y-6 animate-fade-in mt-10">
          
          {/* Key Result Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="metric-card">
              <div className="text-sm text-slate-500 font-medium mb-1">Operational Longevity</div>
              <div className="text-3xl font-bold text-indigo-400">{result.estimated_days_quota_lasts.toFixed(1)} <span className="text-lg text-indigo-400/50">days</span></div>
            </div>
            <div className="metric-card">
              <div className="text-sm text-slate-500 font-medium mb-1">Approved Line Items</div>
              <div className="text-3xl font-bold text-emerald-400">{result.approved_menu.length} <span className="text-lg text-emerald-400/50">items</span></div>
            </div>
            <div className="metric-card col-span-2 md:col-span-1">
              <div className="text-sm text-slate-500 font-medium mb-1">Suspended Line Items</div>
              <div className="text-3xl font-bold text-red-400">{result.disabled_menu.length} <span className="text-lg text-red-400/50">items</span></div>
            </div>
          </div>

          <div className="result-panel bg-slate-800/20 border-slate-700/50">
            <div className="flex items-center gap-2 mb-4">
              <AlertCircle size={18} className="text-amber-400" />
              <h3 className="text-base font-bold text-slate-200">System Warning</h3>
            </div>
            <p className="text-slate-300 text-[15px] leading-relaxed font-medium">{result.status_warning}</p>
          </div>

          {/* Menu Split */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Approved */}
            <div className="glass-card p-6">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800/60">
                <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wider">Approved Matrix</h3>
                <CheckCircle2 size={18} className="text-emerald-500/50" />
              </div>
              <ul className="space-y-3">
                {result.approved_menu.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
                    <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                    <span className="text-sm text-emerald-100/90 leading-tight">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Suspended */}
            <div className="glass-card p-6">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800/60">
                <h3 className="text-sm font-bold text-red-400 uppercase tracking-wider">Suspended Matrix</h3>
                <XCircle size={18} className="text-red-500/50" />
              </div>
              <ul className="space-y-3">
                {result.disabled_menu.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 p-3 rounded-xl bg-red-500/5 border border-red-500/10">
                    <XCircle size={16} className="text-red-500 shrink-0 mt-0.5" />
                    <span className="text-sm text-red-100/90 leading-tight">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="glass-card p-6 md:p-8 border-indigo-500/10">
            <div className="flex items-center gap-2 mb-6">
              <ChefHat size={18} className="text-indigo-400" />
              <h3 className="text-base font-bold text-indigo-200">Aduppu AI Kitchen Protocol</h3>
            </div>
            <div className="space-y-6">
              {result.kitchen_instructions.map((step, i) => (
                <div key={i} className="flex gap-4 items-start">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-400 border border-slate-700">
                    {i + 1}
                  </div>
                  <p className="text-[15px] text-slate-300 leading-relaxed pt-1">{step}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}
    </div>
  )
}
