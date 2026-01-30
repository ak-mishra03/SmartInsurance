from fastapi import APIRouter

router = APIRouter(prefix="/flood", tags=["Flood Detection"])

@router.post("/ndwi")
def compute_ndwi(
        lat:float,
        lon:float,
        start_date:str,
        end_date:str
        ):
    return {
            "message":"NDWI computation placeholder",
            "location":[lat,lon],
            "date_range": [start_date,end_date]
            }




            
