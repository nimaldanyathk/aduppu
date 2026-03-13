const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export interface HomeOptimizeRequest {
  current_cylinders: number
  family_size: number
  location_type: string
  electric_appliances: string[]
  target_dish: string
}

export interface HomeOptimizeResponse {
  survival_assessment: string
  appliance_routing: string[]
  estimated_gas_minutes_saved: number
  crisis_tip: string
  days_remaining_estimate: number
}

export interface HotelOptimizeRequest {
  commercial_cylinders_left: number
  estimated_daily_footfall: number
  existing_menu: string
  electric_commercial_equipment: string[]
}

export interface HotelOptimizeResponse {
  status_warning: string
  approved_menu: string[]
  disabled_menu: string[]
  kitchen_instructions: string[]
  estimated_days_quota_lasts: number
}

export async function optimizeHome(data: HomeOptimizeRequest): Promise<HomeOptimizeResponse> {
  const res = await fetch(`${API_BASE}/api/optimize-home`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: 'Unknown error' }))
    throw new Error(err.detail || `HTTP ${res.status}`)
  }
  return res.json()
}

export async function optimizeHotel(data: HotelOptimizeRequest): Promise<HotelOptimizeResponse> {
  const res = await fetch(`${API_BASE}/api/optimize-hotel`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: 'Unknown error' }))
    throw new Error(err.detail || `HTTP ${res.status}`)
  }
  return res.json()
}
