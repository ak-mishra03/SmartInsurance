from fastapi import FastAPI 
from app.api.flood import router as flood_router
import os 
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware

load_dotenv()

EE = os.getenv("EE")

if not EE:
    raise RuntimeError("EE project id not found in environment variables in environment variables")

app = FastAPI(
        title = "SmartInsurance",
        description="Automated flood damage detection using Sentinel-2 satellite cluster and CNN",
        version="0.1.0"
        )
app.add_middleware(
        CORSMiddleware,
        allow_origins=["http://localhost:5173"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
        )

app.include_router(flood_router)
