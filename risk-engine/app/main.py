from fastapi import FastAPI 
from app.api.flood import router as flood_router
import os 
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware
from app.core.earth_engine import init_ee
from fastapi import FastAPI
from fastapi.responses import JSONResponse
from fastapi import status

from app.core.exceptions import (
    EarthEngineServiceError,
    SatelliteDataUnavailable,
    InvalidAnalysisWindow,
)

from app.core.logging_config import configure_logging

configure_logging()

load_dotenv()

EE = os.getenv("EE")

if not EE:
    raise RuntimeError("EE project id not found in environment variables in environment variables")

app = FastAPI(
        title = "SmartInsurance",
        description="Automated flood damage detection using Sentinel-2 satellite cluster and CNN",
        version="0.1.0"
        )

@app.exception_handler(SatelliteDataUnavailable)
async def satellite_handler(request, exc):
    return JSONResponse(
        status_code=status.HTTP_404_NOT_FOUND,
        content={
            "detail": "No suitable satellite imagery found."
        },
    )


@app.exception_handler(EarthEngineServiceError)
async def earth_engine_handler(request, exc):
    return JSONResponse(
        status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
        content={
            "detail": "Earth Engine is temporarily unavailable."
        },
    )


@app.exception_handler(InvalidAnalysisWindow)
async def window_handler(request, exc):
    return JSONResponse(
        status_code=status.HTTP_400_BAD_REQUEST,
        content={
            "detail": str(exc),
        },
    )

app.add_middleware(
        CORSMiddleware,
        allow_origins=["http://localhost:5173"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
        )
app.include_router(flood_router)

@app.on_event("startup")
def startup():
    init_ee()
