#SmartInsurance/backend/app/api/flood.py

from fastapi import APIRouter
from app.services.ndwi import compute_ndwi_stats, compute_flood_stats

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
def flood_damage(
        lat: float,
        lon: float,
        pre_start: str,
        pre_end: str,
        post_start: str,
        post_end: str,
        ):
    stats = compute_flood_stats(
            lat, lon, pre_start,pre_end,post_start,post_end
            )

    return {
            "location": [lat,lon],
            "pre_flood_range": [pre_start,pre_end],
            "post_flood_range": [post_start,post_end],
            "flood_stats": stats
            }





            
