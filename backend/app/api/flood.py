from fastapi import APIRouter
from app.services.ndwi import compute_ndwi_stats

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




            
