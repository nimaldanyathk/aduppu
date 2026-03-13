import os
import json
import re
from pathlib import Path
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional
from dotenv import load_dotenv
import google.generativeai as genai

# Always load .env from the same directory as this file, regardless of cwd
load_dotenv(dotenv_path=Path(__file__).parent / ".env")

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    raise RuntimeError("GEMINI_API_KEY is not set in environment variables.")
genai.configure(api_key=GEMINI_API_KEY)
model = genai.GenerativeModel("gemini-flash-latest")


app = FastAPI(
    title="OptiFlame AI API",
    description="LPG Crisis Optimization API for the March 2026 Strait of Hormuz Disruption",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ── Request / Response Models ──────────────────────────────────────────────────

class HomeOptimizeRequest(BaseModel):
    current_cylinders: float = Field(..., gt=0, description="Number of LPG cylinders remaining (can be partial, e.g. 0.5)")
    family_size: int = Field(..., gt=0, description="Number of family members")
    location_type: str = Field(..., description="Urban or Rural")
    electric_appliances: List[str] = Field(default=[], description="Available electric appliances")
    target_dish: str = Field(..., description="Dish or meal the family wants to cook")

class HomeOptimizeResponse(BaseModel):
    survival_assessment: str
    appliance_routing: List[str]
    estimated_gas_minutes_saved: float
    crisis_tip: str
    days_remaining_estimate: float

class HotelOptimizeRequest(BaseModel):
    commercial_cylinders_left: float = Field(..., gt=0, description="Number of commercial LPG cylinders remaining")
    estimated_daily_footfall: int = Field(..., gt=0, description="Estimated daily customer count")
    existing_menu: str = Field(..., description="Comma-separated list of menu items")
    electric_commercial_equipment: List[str] = Field(default=[], description="Available electric commercial equipment")

class HotelOptimizeResponse(BaseModel):
    status_warning: str
    approved_menu: List[str]
    disabled_menu: List[str]
    kitchen_instructions: List[str]
    estimated_days_quota_lasts: float


# ── Helper: extract JSON from LLM response ────────────────────────────────────

def extract_json(text: str) -> dict:
    """Extract JSON from LLM response, handling markdown code fences."""
    # Try direct parse first
    text = text.strip()
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        pass

    # Strip markdown fences
    match = re.search(r"```(?:json)?\s*([\s\S]+?)\s*```", text)
    if match:
        try:
            return json.loads(match.group(1))
        except json.JSONDecodeError:
            pass

    # Find first { ... }
    start = text.find("{")
    end = text.rfind("}") + 1
    if start != -1 and end > start:
        try:
            return json.loads(text[start:end])
        except json.JSONDecodeError:
            pass

    raise ValueError(f"Could not extract valid JSON from LLM response:\n{text[:500]}")


# ── Endpoints ─────────────────────────────────────────────────────────────────

@app.post("/api/optimize-home", response_model=HomeOptimizeResponse)
async def optimize_home(request: HomeOptimizeRequest):
    """
    Household LPG Optimization endpoint.
    Calculates survival strategy based on location lockout rules and generates
    a Gemini-powered recipe/appliance routing plan.
    """
    location_type = request.location_type.strip().lower()
    minimum_days_required = 25 if location_type == "urban" else 45

    # One commercial 14.2kg cylinder lasts an average Indian family of 4 about 30 days.
    # We scale by family size: base_days_per_cylinder = 30 * (4 / family_size)
    base_days_per_cylinder = 30 * (4 / max(request.family_size, 1))
    available_days = request.current_cylinders * base_days_per_cylinder
    shortage_days = max(0, minimum_days_required - available_days)

    appliances_str = (
        ", ".join(request.electric_appliances) if request.electric_appliances
        else "None available"
    )

    prompt = f"""
You are OptiFlame AI, an emergency LPG conservation expert deployed during the March 2026 Indian gas crisis.

CRITICAL SITUATION BRIEF:
- The Strait of Hormuz is BLOCKED due to the US-Israel-Iran conflict.
- India's LPG imports are severely disrupted. Panic buying is rampant.
- Location: Coimbatore (defaulted), India
- Domestic LPG BOOKING LOCKOUT: {minimum_days_required} days for {request.location_type} areas.
  This means the family CANNOT get a new cylinder for {minimum_days_required} days.

FAMILY PROFILE:
- Cylinders on hand: {request.current_cylinders} (estimated {available_days:.1f} days of gas at current family size)
- Family size: {request.family_size} members
- Days of gas needed before next refill: {minimum_days_required} days
- Shortfall: {shortage_days:.1f} days of gas (CRISIS LEVEL if > 0)
- Available electric appliances: {appliances_str}
- Desired dish/meal: {request.target_dish}

YOUR TASK:
Generate a strict gas-conservation plan. Be authoritative, specific, and actionable.

Return ONLY a valid JSON object with this exact structure (no markdown, no commentary):
{{
  "survival_assessment": "A 2-3 sentence urgent assessment. E.g.: 'With {request.current_cylinders:.1f} cylinder(s) and a {minimum_days_required}-day {request.location_type} lockout, you face a {shortage_days:.1f}-day shortfall. Your gas must last until [date]. Maximum allowed gas use: X minutes per meal.'",
  "appliance_routing": [
    "Step 1: [Specific instruction routing a task to electric appliance or cold-prep]",
    "Step 2: [Which task absolutely requires gas, limited to 2 mins]",
    "Step 3: [How to finish the dish for {request.target_dish}]",
    "Step 4: [Batch cooking / thermal retention tip]"
  ],
  "estimated_gas_minutes_saved": <number: how many gas-minutes are saved vs. traditional cooking of {request.target_dish}>,
  "crisis_tip": "One powerful, specific tip for the current crisis (e.g., using a pressure cooker reduces gas by 70%, soak lentils overnight).",
  "days_remaining_estimate": <number: realistic estimate of how many days the gas will last with your recommended strategy>
}}

Rules:
- Route ALL boiling, steaming, and reheating to electric appliances if available.
- Reserve gas ONLY for rapid high-heat tasks (tempering, sautéing) under 2 minutes.
- If no electric appliances are available, recommend pressure cooking and batch cooking.
- Be extremely specific to {request.target_dish}.
- The tone must be calm, authoritative, and crisis-aware.
"""

    try:
        response = model.generate_content(prompt)
        data = extract_json(response.text)
        return HomeOptimizeResponse(**data)
    except ValueError as e:
        raise HTTPException(status_code=502, detail=f"LLM parsing error: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Gemini API error: {str(e)}")


@app.post("/api/optimize-hotel", response_model=HotelOptimizeResponse)
async def optimize_hotel(request: HotelOptimizeRequest):
    """
    Hotel/Restaurant LPG Menu Pruning endpoint.
    Under the 20% commercial allocation rule, the LLM acts as a ruthless kitchen
    manager to prune the menu and give batch-cooking instructions.
    """
    menu_items = [item.strip() for item in request.existing_menu.split(",") if item.strip()]
    electric_equipment_str = (
        ", ".join(request.electric_commercial_equipment)
        if request.electric_commercial_equipment else "None"
    )

    # Commercial cylinder = 19kg. A restaurant might use 1 cylinder per ~20 covers/day for normal ops.
    # At 20% allocation, effective quota = 0.2 of normal usage.
    allocation_fraction = 0.20
    normal_cylinder_days = len(menu_items) * 0.5  # rough estimate: more complex menu = more gas
    effective_days = (request.commercial_cylinders_left * allocation_fraction * 20) / max(request.estimated_daily_footfall, 1)

    prompt = f"""
You are OptiFlame AI's Commercial Kitchen Emergency Manager, deployed during the March 2026 Indian LPG crisis.

CRITICAL SITUATION BRIEF:
- The Indian government has slashed commercial LPG to 20% of normal allocation.
- The Strait of Hormuz blockade makes this shortage indefinite. There is NO timeline for relief.
- Hotels and restaurants that ignore this will SHUT DOWN within days.
- Location: Coimbatore, India

RESTAURANT PROFILE:
- Commercial LPG cylinders on hand: {request.commercial_cylinders_left}
- Government-mandated effective allocation: 20% (you can only use 20% of your normal gas)
- Daily footfall: {request.estimated_daily_footfall} covers
- Full current menu: {', '.join(menu_items)}
- Available electric commercial equipment: {electric_equipment_str}
- Estimated days quota lasts at 20% rule: {effective_days:.1f} days

YOUR TASK:
Act as a ruthless, experienced kitchen manager. Immediately prune this menu for survival.
A "ruthless" approach means: if a dish takes more than 3 minutes of continuous gas flame, it is DISABLED unless it can be batch-cooked once daily.

Return ONLY a valid JSON object with this exact structure (no markdown, no commentary):
{{
  "status_warning": "An urgent, specific warning. E.g.: 'CRITICAL: Serving your slow-cooked gravies at current footfall will deplete your entire 20% quota by 4 PM today. Immediate menu suspension required.'",
  "approved_menu": [
    "<dish name>: <brief reason why it's approved - e.g., cold-prep, quick-cook under 2 mins, or induction-routable>"
  ],
  "disabled_menu": [
    "<dish name>: <brief reason why it must be IMMEDIATELY paused - e.g., requires 30-min simmering, slow-cooked gravy>"
  ],
  "kitchen_instructions": [
    "Instruction 1: [Specific batch-cooking schedule to maximize thermal retention]",
    "Instruction 2: [How to use electric equipment to replace gas for specific tasks]",
    "Instruction 3: [Staff briefing on new cooking protocols]",
    "Instruction 4: [Procurement/alternative suggestion]"
  ],
  "estimated_days_quota_lasts": <number: how many days the current cylinders will last at strictly enforced 20% allocation with the approved menu>
}}

Rules:
- Analyze EACH menu item individually for gas intensity.
- Approved items: cold-prep (salads, raita, curd rice), pressure-cooker batch items, induction-routable items.
- Disabled items: slow-cooked gravies, deep-fried items requiring sustained heat, breads requiring tandoor.
- Kitchen instructions must be hyper-specific: mention batch cooking windows (e.g., "Cook all dal at 6 AM in bulk").
- The tone must be authoritative and urgent, like a crisis manager, not a chef.
"""

    try:
        response = model.generate_content(prompt)
        data = extract_json(response.text)
        return HotelOptimizeResponse(**data)
    except ValueError as e:
        raise HTTPException(status_code=502, detail=f"LLM parsing error: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Gemini API error: {str(e)}")


@app.get("/health")
async def health_check():
    return {"status": "operational", "crisis": "March 2026 LPG Shortage", "location": "Coimbatore, India"}
