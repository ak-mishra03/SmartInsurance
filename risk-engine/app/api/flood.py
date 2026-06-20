#SmartInsurance/backend/app/api/flood.py

from fastapi import APIRouter
from app.services.ndwi import compute_ndwi_stats, compute_flood_stats
from app.schemas.flood import FloodDamageRequest

router = APIRouter(prefix="/flood", tags=["Flood Detection"])


@router.post("/ndwi")
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


@router.post("/flood-damage")
def flood_damage(request: FloodDamageRequest):
    stats = compute_flood_stats(
            request.lat,
            request.lon,
            str(request.pre_start),
            str(request.pre_end),
            str(request.post_start),
            str(request.post_end)
            )

    return {
            "location": [request.lat,request.lon],
            "flood_stats": stats,
            }





            
