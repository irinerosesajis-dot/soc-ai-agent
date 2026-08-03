from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.investigation import router as investigation_router
from app.api.history import router as history_router
from app.api.report import router as report_router
from app.api.dashboard import router as dashboard_router

app = FastAPI(
    title="AI SOC Incident Investigation Agent Backend",
    description="Basic API service for AI SOC Agent",
    version="1.0.0"
)

# Enable CORS for frontend development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {
        "name": "AI SOC Incident Investigation Agent API",
        "status": "online",
        "version": "1.0.0",
        "docs_url": "/docs"
    }

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "AI SOC Agent Backend",
        "version": "1.0.0"
    }

app.include_router(investigation_router)
app.include_router(history_router)
app.include_router(report_router)
app.include_router(dashboard_router)



