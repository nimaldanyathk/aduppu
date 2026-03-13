# OptiFlame AI 🔥

**Emergency LPG Conservation Tool — March 2026 Hormuz Crisis**

A full-stack web application helping Indian households and restaurants survive the March 2026 LPG gas shortage caused by the blockade of the Strait of Hormuz.

## Project Structure

```
lpg_won/
├── backend/           # FastAPI (Python) + Google Gemini AI
│   ├── main.py
│   ├── requirements.txt
│   └── .env.example
└── frontend/          # Next.js 14 + Tailwind CSS + Lucide Icons
    ├── app/
    │   ├── layout.tsx
    │   ├── page.tsx
    │   └── globals.css
    ├── components/
    │   ├── HouseholdMode.tsx
    │   └── HotelMode.tsx
    └── lib/
        └── api.ts
```

## Quick Start

### 1. Backend Setup

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Configure Gemini API key
cp .env.example .env
# Edit .env and set your GEMINI_API_KEY

# Start the server
uvicorn main:app --reload --port 8000
```

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
# Opens at http://localhost:3000
```

## Features

### 🏠 Household Mode
- Calculates if your gas will last through the government lockout period (25 days urban / 45 days rural)
- Routes ALL possible tasks to electric appliances, reserving gas for critical 2-minute bursts
- Provides a dish-specific survival recipe powered by Gemini AI

### 🏨 Hotel Mode
- Operates within the government's 20% commercial LPG allocation
- AI prunes your menu: suspending gas-heavy dishes, approving quick-cook or cold-prep items
- Provides batch-cooking schedules and kitchen crisis protocols

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/optimize-home` | Household LPG survival plan |
| POST | `/api/optimize-hotel` | Restaurant menu pruning |
| GET | `/health` | Health check |

## Environment Variables

### Backend (`backend/.env`)
```
GEMINI_API_KEY=your_key_here
```

### Frontend (`frontend/.env.local`)
```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## Crisis Context — March 2026

- **Strait of Hormuz blocked** by US-Israel-Iran conflict
- **Domestic LPG**: 25-day booking lockout (urban), 45-day (rural)
- **Commercial LPG**: Rationed to 20% of normal allocation
- **Location defaulted to**: Coimbatore, Tamil Nadu, India
