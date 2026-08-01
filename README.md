# AI SOC Incident Investigation Agent

A modern, high-performance cybersecurity web application featuring an interactive React + Vite + Tailwind CSS frontend and a Python FastAPI backend.

## Project Structure

```
soc-ai-agent/
├── backend/
│   ├── app/
│   │   └── main.py          # FastAPI application with / and /health endpoints
│   ├── requirements.txt     # Python backend dependencies (FastAPI, uvicorn, pydantic)
│   └── README.md
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/      # Sidebar, Header, Layout containers
│   │   │   ├── dashboard/   # Metric cards, IncidentFeed, IncidentChart, ThreatCategoryChart
│   │   │   ├── investigation/ # InvestigationWizard, SimulationModal, LogViewer
│   │   │   ├── history/     # FilterBar, HistoryTable, IncidentDetailModal
│   │   │   ├── settings/    # ApiConfigForm, NotificationSettings, SocRulesForm
│   │   │   └── common/      # Badge, StatCard
│   │   ├── pages/           # Dashboard, NewInvestigation, History, Settings
│   │   ├── mockData/        # Incident datasets & metric benchmarks
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── postcss.config.js
└── README.md
```

## Quick Start

### 1. Run Backend (FastAPI)

```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

Backend Endpoints:
- `GET /`: Returns API root info
- `GET /health`: Returns health status `{"status": "healthy"}`

### 2. Run Frontend (React + Vite)

```bash
cd frontend
npm install
npm run dev
```

Visit `http://localhost:5173` to access the application.

## Key UI Modules

1. **Dashboard**: High-impact cybersecurity dashboard with active threat level, KPI cards, 7-day volume graph, MITRE tactic matrix, and interactive alert stream.
2. **New Investigation**: Multi-preset alert ingest wizard with raw log syntax viewer and interactive step-by-step AI triage reasoning simulation.
3. **Investigation History**: Filterable and searchable security audit table with side drawer showing IOCs, attack timelines, and mitigation playbooks.
4. **Settings**: LLM inference provider selector, API key management, EDR/SIEM URL configuration, and active containment threshold sliders.
