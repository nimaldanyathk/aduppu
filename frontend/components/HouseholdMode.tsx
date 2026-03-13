'use client'

import { useState } from 'react'
import {
  AlertTriangle, Flame, Home, UtensilsCrossed, Zap, Clock,
  CheckCircle, XCircle, Lightbulb, Shield, TrendingDown, Info
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
    if (!form.target_dish.trim()) { setError('Please enter the dish you want to cook.'); return }
    setLoading(true)
    setError(null)
    setResult(null)
    try {
      const data = await optimizeHome(form)
      setResult(data)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to connect. Is the backend running?')
    } finally {
      setLoading(false)
    }
  }

  const lockoutDays = form.location_type === 'Urban' ? 25 : 45
  const baseDays = form.current_cylinders * 30 * (4 / Math.max(form.family_size, 1))
  const shortfall = Math.max(0, lockoutDays - baseDays)
  const crisisLevel = shortfall > 10 ? 'CRITICAL' : shortfall > 0 ? 'WARNING' : 'SAFE'

  return (
    <div className="space-y-6">
      {/* Crisis Meter */}
      <div className="glass-card p-4 flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full animate-pulse ${crisisLevel === 'CRITICAL' ? 'bg-red-500' : crisisLevel === 'WARNING' ? 'bg-amber-500' : 'bg-emerald-500'}`} />
          <span className="text-sm font-semibold text-gray-300">
            Lockout Period: <span className="text-white">{lockoutDays} days</span>
          </span>
          <span className="text-gray-600">|</span>
          <span className="text-sm font-semibold text-gray-300">
            Gas Supply: <span className="text-white">{baseDays.toFixed(1)} days</span>
          </span>
        </div>
        <span className={`badge-${crisisLevel === 'CRITICAL' ? 'critical' : crisisLevel === 'WARNING' ? 'warning' : 'safe'}`}>
          {crisisLevel === 'CRITICAL' ? `${shortfall.toFixed(1)}d shortfall` : crisisLevel === 'WARNING' ? `${shortfall.toFixed(1)}d shortfall` : 'Supply OK'}
        </span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Row 1 */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="crisis-label flex items-center gap-1">
              <Flame size={11} className="text-orange-500" /> Cylinders Remaining
            </label>
            <input
              type="number" min={0.1} max={5} step={0.1}
              className="crisis-input"
              value={form.current_cylinders}
              onChange={e => setForm(p => ({ ...p, current_cylinders: parseFloat(e.target.value) || 0 }))}
            />
            <p className="text-xs text-gray-600 mt-1">e.g. 0.5 for half cylinder</p>
          </div>
          <div>
            <label className="crisis-label flex items-center gap-1">
              <Home size={11} className="text-orange-500" /> Family Size
            </label>
            <input
              type="number" min={1} max={20} step={1}
              className="crisis-input"
              value={form.family_size}
              onChange={e => setForm(p => ({ ...p, family_size: parseInt(e.target.value) || 1 }))}
            />
          </div>
          <div>
            <label className="crisis-label flex items-center gap-1">
              <Shield size={11} className="text-orange-500" /> Location Type
            </label>
            <select
              className="crisis-input"
              value={form.location_type}
              onChange={e => setForm(p => ({ ...p, location_type: e.target.value }))}
            >
              <option value="Urban">Urban (25-day lockout)</option>
              <option value="Rural">Rural (45-day lockout)</option>
            </select>
          </div>
        </div>

        {/* Target dish */}
        <div>
          <label className="crisis-label flex items-center gap-1">
            <UtensilsCrossed size={11} className="text-orange-500" /> Dish / Meal to Cook
          </label>
          <input
            type="text" placeholder="e.g. Dal Tadka, Vegetable Biryani, Chapati..."
            className="crisis-input"
            value={form.target_dish}
            onChange={e => setForm(p => ({ ...p, target_dish: e.target.value }))}
          />
        </div>

        {/* Electric appliances */}
        <div>
          <label className="crisis-label flex items-center gap-1">
            <Zap size={11} className="text-orange-500" /> Available Electric Appliances
          </label>
          <div className="appliance-grid">
            {HOME_APPLIANCES.map(ap => (
              <label key={ap} className={`appliance-item ${form.electric_appliances.includes(ap) ? 'selected' : ''}`}>
                <input
                  type="checkbox"
                  checked={form.electric_appliances.includes(ap)}
                  onChange={() => toggleAppliance(ap)}
                  className="w-4 h-4 flex-shrink-0"
                />
                <span className="text-sm text-gray-300">{ap}</span>
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
            <><Flame size={18} /> Generate Survival Recipe</>
          )}
        </button>
      </form>

      {/* Results */}
      {result && (
        <div className="space-y-4 animate-fade-in">
          {/* Metrics row */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="metric-card">
              <div className="text-2xl font-bold text-orange-400">{result.days_remaining_estimate.toFixed(1)}</div>
              <div className="text-xs text-gray-500 mt-1">Days Estimated</div>
            </div>
            <div className="metric-card">
              <div className="text-2xl font-bold text-emerald-400">{result.estimated_gas_minutes_saved.toFixed(0)}</div>
              <div className="text-xs text-gray-500 mt-1">Gas Mins Saved</div>
            </div>
            <div className="metric-card col-span-2 sm:col-span-1">
              <div className="text-sm font-bold text-amber-400">{form.location_type}</div>
              <div className="text-xs text-gray-500 mt-1">{lockoutDays}-Day Lockout Zone</div>
            </div>
          </div>

          {/* Assessment */}
          <div className="result-panel">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle size={16} className="text-orange-400" />
              <h3 className="text-sm font-bold text-orange-300 uppercase tracking-wider">Survival Assessment</h3>
            </div>
            <p className="text-gray-200 text-sm leading-relaxed">{result.survival_assessment}</p>
          </div>

          {/* Appliance Routing Steps */}
          <div className="glass-card p-5">
            <div className="flex items-center gap-2 mb-4">
              <Zap size={16} className="text-orange-400" />
              <h3 className="text-sm font-bold text-orange-300 uppercase tracking-wider">Appliance Routing Plan</h3>
            </div>
            <div className="space-y-0">
              {result.appliance_routing.map((step, i) => (
                <div key={i} className="step-item">
                  <div className="step-number">{i + 1}</div>
                  <p className="text-sm text-gray-300 leading-relaxed">{step}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Crisis Tip */}
          <div className="glass-card p-4 flex items-start gap-3" style={{ borderColor: 'rgba(245, 158, 11, 0.2)' }}>
            <Lightbulb size={18} className="text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-1">OptiFlame Crisis Tip</p>
              <p className="text-sm text-gray-300">{result.crisis_tip}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
