from fastapi import FastAPI 
from app.api.flood import router as flood_router

app = FastAPI(
        title = "SmartInsurance",
        description="Automated flood damage detection using Sentinel-2 satellite cluster and CNN",
        version="0.1.0"
        )

@app.get("/")
def health_check():
    return {"status":"ok"}

app.include_router(flood_router)
