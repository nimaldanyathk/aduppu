# Aduppu അടുപ്പ്

![Aduppu Banner](https://img.shields.io/badge/Aduppu-Intelligent_LPG_Management-0284c7?style=for-the-badge)

Aduppu (അടുപ്പ്) is a premium LPG conservation and management platform designed to optimize household and commercial gas usage efficiently. Built in response to the March 2026 LPG shortages, it provides AI-driven step-by-step cooking plans and institutional quota management to maximize the lifespan of your LPG cylinders.

## Features

- **Household Dashboard**: Tracks daily gas usage, calculates estimated supply remaining based on family size, and provides intelligent cooking strategies (utilizing electric appliance offloading) to stretch cylinder limits.
- **Restaurant Manager**: Audits commercial menus against the strict 20% state LPG allocation policy. Automatically disables high-thermal items to keep the kitchen operational under severe quotas.
- **AI-Powered Plans**: Powered by Google Gemini 2.0, interpreting complex parameters instantly to output structured, actionable preparation guides.
- **Standard Modern UI**: Built with Next.js and Tailwind CSS, featuring a clean, accessible, light-mode utility aesthetic.

## Tech Stack

- **Frontend**: Next.js 14, React, Tailwind CSS, Lucide Icons
- **Backend**: FastAPI, Python 3
- **AI Core**: Google Generative AI (Gemini 2.0 Flash)

## Getting Started

### Prerequisites

- Node.js (v18+)
- Python (v3.10+)
- Google Gemini API Key

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Set up your environment variables. Copy the example file:
   ```bash
   cp .env.example .env
   ```
   **Open the new `.env` file and insert your Gemini API Key:**
   ```env
   GEMINI_API_KEY=your_actual_api_key_here
   ```
5. Start the FastAPI server:
   ```bash
   uvicorn main:app --reload --port 8000
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. The application will be available at `http://localhost:3000`.

## License

This project is proprietary and confidential. © 2026 Aduppu.
