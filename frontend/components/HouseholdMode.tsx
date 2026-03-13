'use client'

import { useState } from 'react'
import {
  AlertCircle, Flame, Users, Shield, UtensilsCrossed, Zap, Clock,
  CheckCircle2, Lightbulb
} from 'lucide-react'
import { optimizeHome, HomeOptimizeResponse, HomeOptimizeRequest } from '@/lib/api'

const HOME_APPLIANCES = ['Microwave', 'Induction', 'Rice Cooker', 'Kettle', 'Electric Pressure Cooker', 'Air Fryer']

export default function HouseholdMode() {
  const [form, setForm] = useState<HomeOptimizeRequest>({
    current_cylinders: 0.5,
    family_size: 4,
    location_type: 'Urban',
    electric_appliances: [],
    target_dish: '',
  })
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<HomeOptimizeResponse | null>(null)
  const [error, setError] = useState<string | null>(null)

  const toggleAppliance = (appliance: string) => {
    setForm(prev => ({
      ...prev,
      electric_appliances: prev.electric_appliances.includes(appliance)
        ? prev.electric_appliances.filter(a => a !== appliance)
        : [...prev.electric_appliances, appliance],
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.target_dish.trim()) { setError('Please enter the dish you plan to cook.'); return }
    setLoading(true)
    setError(null)
    setResult(null)
    try {
      const data = await optimizeHome(form)
      setResult(data)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Network failure. Ensure Aduppu engine is running.')
    } finally {
      setLoading(false)
    }
  }

  const lockoutDays = form.location_type === 'Urban' ? 25 : 45
  const baseDays = form.current_cylinders * 30 * (4 / Math.max(form.family_size, 1))
  const shortfall = Math.max(0, lockoutDays - baseDays)
  
  // Premium, muted status tracking
  const status = shortfall > 10 ? 'critical' : shortfall > 0 ? 'warning' : 'safe'
  const statusLabels = {
    critical: 'Severe Deficit',
    warning: 'Mild Shortfall',
    safe: 'Capacity Stable'
  }

  return (
    <div className="space-y-8">
      {/* Precision Status Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/50 border border-slate-800/80">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 text-sm text-slate-300">
            <Clock size={16} className="text-slate-500" />
            <span>Lockout Profile: <strong className="text-white ml-1">{lockoutDays} Days</strong></span>
          </div>
          <div className="hidden sm:block w-px h-4 bg-slate-700" />
          <div className="flex items-center gap-2 text-sm text-slate-300">
            <Flame size={16} className="text-slate-500" />
            <span>Current Capacity: <strong className="text-white ml-1">{baseDays.toFixed(1)} Days</strong></span>
          </div>
        </div>
        <div className={`status-badge ${status} shadow-sm`}>
          {statusLabels[status]} ({shortfall > 0 ? `-${shortfall.toFixed(1)}d` : '+OK'})
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Core Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="group">
            <label className="premium-label group-focus-within:text-indigo-400 transition-colors">
              <Flame size={14} /> Cylinders Remaining
            </label>
            <input
              type="number" min={0.1} max={5} step={0.1}
              className="premium-input"
              value={form.current_cylinders}
              onChange={e => setForm(p => ({ ...p, current_cylinders: parseFloat(e.target.value) || 0 }))}
            />
          </div>
          <div className="group">
            <label className="premium-label group-focus-within:text-indigo-400 transition-colors">
              <Users size={14} /> Unit Size
            </label>
            <input
              type="number" min={1} max={20} step={1}
              className="premium-input"
              value={form.family_size}
              onChange={e => setForm(p => ({ ...p, family_size: parseInt(e.target.value) || 1 }))}
            />
          </div>
          <div className="group">
            <label className="premium-label group-focus-within:text-indigo-400 transition-colors">
              <Shield size={14} /> Territory
            </label>
            <select
              className="premium-input"
              value={form.location_type}
              onChange={e => setForm(p => ({ ...p, location_type: e.target.value }))}
            >
              <option value="Urban">Urban Zone (25-Day)</option>
              <option value="Rural">Rural Zone (45-Day)</option>
            </select>
          </div>
        </div>

        {/* Action Target */}
        <div className="group">
          <label className="premium-label group-focus-within:text-indigo-400 transition-colors">
            <UtensilsCrossed size={14} /> Target Output (Dish/Meal)
          </label>
          <input
            type="text" placeholder="e.g. Sambar, Parotta, Vegetable Stew"
            className="premium-input"
            value={form.target_dish}
            onChange={e => setForm(p => ({ ...p, target_dish: e.target.value }))}
          />
        </div>

        {/* Thermal Offload (Appliances) */}
        <div>
          <label className="premium-label mb-3">
            <Zap size={14} /> Thermal Offload Assets (Electric)
          </label>
          <div className="appliance-grid">
            {HOME_APPLIANCES.map(ap => (
              <label key={ap} className={`appliance-item ${form.electric_appliances.includes(ap) ? 'selected' : ''}`}>
                <input
                  type="checkbox"
                  checked={form.electric_appliances.includes(ap)}
                  onChange={() => toggleAppliance(ap)}
                  className="accent-indigo-500"
                />
                <span className="text-sm font-medium text-slate-300">{ap}</span>
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
            <><span className="spinner" /> Synthesizing Strategy...</>
          ) : (
            <><Zap size={18} /> Initialize Optimization Engine</>
          )}
        </button>
      </form>

      {/* Analytics Output */}
      {result && (
        <div className="space-y-6 animate-fade-in mt-10">
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="metric-card">
              <div className="text-sm text-slate-500 font-medium mb-1">Projected Lifespan</div>
              <div className="text-3xl font-bold text-slate-100">{result.days_remaining_estimate.toFixed(1)} <span className="text-lg text-slate-500">days</span></div>
            </div>
            <div className="metric-card">
              <div className="text-sm text-slate-500 font-medium mb-1">Thermal Units Saved</div>
              <div className="text-3xl font-bold text-emerald-400">{result.estimated_gas_minutes_saved.toFixed(0)} <span className="text-lg text-emerald-400/50">mins</span></div>
            </div>
            <div className="metric-card col-span-2 md:col-span-1 border-indigo-500/20 bg-indigo-500/5">
              <div className="text-sm text-indigo-300/80 font-medium mb-1">Aduppu Strategy</div>
              <div className="text-xl font-bold text-indigo-400">Deployed</div>
            </div>
          </div>

          <div className="result-panel">
            <div className="flex items-center gap-2 mb-4">
              <Shield size={18} className="text-indigo-400" />
              <h3 className="text-base font-bold text-indigo-200">Executive Assessment</h3>
            </div>
            <p className="text-slate-300 text-[15px] leading-relaxed font-medium">{result.survival_assessment}</p>
          </div>

          <div className="glass-card p-6 md:p-8">
            <div className="flex items-center gap-2 mb-6">
              <Zap size={18} className="text-emerald-400" />
              <h3 className="text-base font-bold text-emerald-200">Offload Routing Protocol</h3>
            </div>
            <div className="space-y-4">
              {result.appliance_routing.map((step, i) => (
                <div key={i} className="flex gap-4 items-start pb-4 border-b border-slate-800/60 last:border-0 last:pb-0">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-400 border border-slate-700">
                    {i + 1}
                  </div>
                  <p className="text-[15px] text-slate-300 leading-relaxed pt-1">{step}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl p-5 md:p-6 bg-slate-800/40 border border-slate-700/50 flex items-start gap-4">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 shrink-0">
              <Lightbulb size={20} />
            </div>
            <div>
              <p className="text-sm font-bold text-amber-200/90 mb-1">Aduppu Intel</p>
              <p className="text-[15px] text-slate-300 leading-relaxed">{result.crisis_tip}</p>
            </div>
          </div>
          
        </div>
      )}
    </div>
  )
}
