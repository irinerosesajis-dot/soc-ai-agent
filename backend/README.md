# AI SOC Agent Backend

FastAPI service exposing API endpoints for the AI SOC Incident Investigation Agent.

## Endpoints

- `GET /` - Root info endpoint
- `GET /health` - Health check status endpoint

## Running the Backend

```bash
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```
