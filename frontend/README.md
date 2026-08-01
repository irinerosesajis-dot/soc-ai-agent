# AI SOC Incident Investigation Agent - Frontend

Modern, dark-themed cybersecurity React web application built with Vite and Tailwind CSS.

## Features

- **Dashboard**: Real-time KPI metrics, 7-day incident trends, MITRE threat distribution matrix, and live alert stream.
- **New Investigation**: Interactive alert submission wizard with pre-loaded attack payloads (LSASS dump, Ransomware, DNS tunneling) and live AI execution simulation.
- **Investigation History**: Filterable, searchable audit repository with deep-dive modal drawer (IOC breakdown, timelines, recommended playbooks).
- **Settings**: AI model provider configuration (OpenAI, Claude, Gemini, Ollama), API keys, webhook integrations (Slack, PagerDuty), and active containment thresholds.
- **FastAPI Integration**: Auto-detects FastAPI backend status via `/api/health`.

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run local development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:5173](http://localhost:5173) in your browser.
