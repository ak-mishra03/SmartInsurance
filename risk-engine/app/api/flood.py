#SmartInsurance/risk-engine/app/api/flood.py

from fastapi import APIRouter
from app.services.ndwi import compute_ndwi_stats, compute_flood_stats
from app.schemas.flood import FloodDamageRequest
from app.utils.date_selector import choose_analysis_dates

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
    analysis_window = choose_analysis_dates()
    
    stats = compute_flood_stats(

        request.lat,

        request.lon,

        analysis_window,

    )
    print(analysis_window)

    return {

        "location": [

            request.lat,

            request.lon,

        ],

        "analysis_window": analysis_window,

        "flood_stats": stats,

    }           
