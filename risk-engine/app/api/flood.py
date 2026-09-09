#SmartInsurance/risk-engine/app/api/flood.py

from fastapi import APIRouter
from app.services.flood_service import FloodService
from app.services.ndwi import compute_ndwi_stats
from app.schemas.flood import FloodDamageRequest, FloodDamageResponse, NDWIResponse

router = APIRouter(prefix="/flood", tags=["Flood Detection"])


@router.post("/ndwi", response_model=NDWIResponse)
def compute_ndwi(
        lat:float,
        lon:float,
        start_date:str,
        end_date:str
        ):
    stats = compute_ndwi_stats(lat,lon,start_date,end_date)
    
    return {
            "location":[lat,lon],
            "date_range": [start_date,end_date],
            "ndwi_stats":stats
            }


@router.post("/flood-damage", response_model=FloodDamageResponse)
def flood_damage(request: FloodDamageRequest):
    return FloodService.analyze_flood_damage(request)
