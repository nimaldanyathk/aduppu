'use client'

import { useState } from 'react'
import {
  AlertCircle, Flame, Users, Shield, UtensilsCrossed, Zap, Clock,
  CheckCircle2, Lightbulb
} from 'lucide-react'
import { optimizeHome, HomeOptimizeResponse, HomeOptimizeRequest } from '@/lib/api'

const HOME_APPLIANCES = ['Microwave', 'Induction Range', 'Rice Cooker', 'Kettle', 'Electric Pressure Cooker', 'Air Fryer']

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
      setError(err instanceof Error ? err.message : 'Network failure. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const lockoutDays = form.location_type === 'Urban' ? 25 : 45
  const baseDays = form.current_cylinders * 30 * (4 / Math.max(form.family_size, 1))
  const shortfall = Math.max(0, lockoutDays - baseDays)
  
  const status = shortfall > 10 ? 'critical' : shortfall > 0 ? 'warning' : 'safe'
  const statusLabels = {
    critical: 'Severe Shortfall',
    warning: 'Mild Shortfall',
    safe: 'Capacity Stable'
  }

  return (
    <div className="space-y-8">
      {/* Status Bar */}
      <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-6">
          <div className="text-sm text-slate-700">
            Current Wait Time: <strong className="text-slate-900 ml-1">{lockoutDays} Days</strong>
          </div>
          <div className="hidden sm:block w-px h-4 bg-slate-300" />
          <div className="text-sm text-slate-700">
            Estimated Supply Remaining: <strong className="text-slate-900 ml-1">{baseDays.toFixed(1)} Days</strong>
          </div>
        </div>
        <div className={`status-badge ${status}`}>
          {statusLabels[status]} ({shortfall > 0 ? `-${shortfall.toFixed(1)}d` : '+OK'})
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div>
            <label className="std-label flex items-center gap-2">
              <Flame size={14} className="text-slate-400" /> Cylinders Remaining
            </label>
            <input
              type="number" min={0.1} max={5} step={0.1}
              className="std-input"
              value={form.current_cylinders}
              onChange={e => setForm(p => ({ ...p, current_cylinders: parseFloat(e.target.value) || 0 }))}
            />
          </div>
          <div>
            <label className="std-label flex items-center gap-2">
              <Users size={14} className="text-slate-400" /> People in Home
            </label>
            <input
              type="number" min={1} max={20} step={1}
              className="std-input"
              value={form.family_size}
              onChange={e => setForm(p => ({ ...p, family_size: parseInt(e.target.value) || 1 }))}
            />
          </div>
          <div>
            <label className="std-label flex items-center gap-2">
              <Shield size={14} className="text-slate-400" /> Location Type
            </label>
            <select
              className="std-input"
              value={form.location_type}
              onChange={e => setForm(p => ({ ...p, location_type: e.target.value }))}
            >
              <option value="Urban">Urban City (25-Day Wait)</option>
              <option value="Rural">Rural Area (45-Day Wait)</option>
            </select>
          </div>
        </div>

        <div>
          <label className="std-label flex items-center gap-2">
            <UtensilsCrossed size={14} className="text-slate-400" /> What are you cooking today?
          </label>
          <input
            type="text" placeholder="e.g. Rice, Sambar, Chicken Curry"
            className="std-input"
            value={form.target_dish}
            onChange={e => setForm(p => ({ ...p, target_dish: e.target.value }))}
          />
        </div>

        <div>
          <label className="std-label mb-3 flex items-center gap-2">
            <Zap size={14} className="text-slate-400" /> Available Electric Appliances
          </label>
          <div className="appliance-grid">
            {HOME_APPLIANCES.map(ap => (
              <label key={ap} className={`appliance-item ${form.electric_appliances.includes(ap) ? 'selected' : ''}`}>
                <input
                  type="checkbox"
                  checked={form.electric_appliances.includes(ap)}
                  onChange={() => toggleAppliance(ap)}
                />
                <span className="text-sm font-medium text-slate-700">{ap}</span>
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
              <><span className="spinner" /> Generating Plan...</>
            ) : (
              <>Create Cooking Plan</>
            )}
          </button>
        </div>
      </form>

      {/* Analytics Output */}
      {result && (
        <div className="space-y-6 animate-fade-in mt-8 pt-8 border-t border-slate-200">
          
          <h2 className="text-lg font-bold text-slate-800">Your Cooking Plan</h2>

          <div className="grid grid-cols-2 gap-4">
            <div className="metric-box bg-slate-50 border-slate-200">
              <div className="text-sm text-slate-500 font-medium mb-1">New Estimated Supply</div>
              <div className="text-3xl font-bold text-slate-800">{result.days_remaining_estimate.toFixed(1)} <span className="text-base font-normal text-slate-500">days</span></div>
            </div>
            <div className="metric-box bg-sky-50 border-sky-200">
              <div className="text-sm text-sky-700 font-medium mb-1">Gas Time Saved</div>
              <div className="text-3xl font-bold text-sky-700">{result.estimated_gas_minutes_saved.toFixed(0)} <span className="text-base font-normal text-sky-600/70">mins</span></div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-lg p-5">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle2 size={18} className="text-green-600" />
              <h3 className="text-base font-bold text-slate-800">Summary</h3>
            </div>
            <p className="text-slate-600 text-[15px] leading-relaxed">{result.survival_assessment}</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
            <div className="bg-slate-50 border-b border-slate-200 px-5 py-3 flex items-center gap-2">
              <Zap size={16} className="text-sky-600" />
              <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide">Cooking Instructions</h3>
            </div>
            <div className="p-0">
              {result.appliance_routing.map((step, i) => (
                <div key={i} className="flex gap-4 items-start p-4 border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600">
                    {i + 1}
                  </div>
                  <p className="text-[15px] text-slate-700 leading-relaxed">{step}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-lg p-4 bg-amber-50 border border-amber-200 flex items-start gap-4">
            <Lightbulb size={20} className="text-amber-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-bold text-amber-800 mb-1">Expert Tip</p>
              <p className="text-sm text-amber-700/90 leading-relaxed">{result.crisis_tip}</p>
            </div>
          </div>
          
        </div>
      )}
    </div>
  )
}
