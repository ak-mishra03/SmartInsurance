# /backend/app/services/ndwi.py

from warnings import warn
import ee 
import os 
from dotenv import load_dotenv

load_dotenv()

EE = os.getenv("EE")

if not EE:
    raise RuntimeError("EE project id not found in environment variables in environment variables")

# Authenticate and Initialize the google earth engine
def init_ee():
    try:
        ee.Initialize(project= EE)
    except Exception:
        ee.Authenticate()
        ee.Initialize(project = EE)


#computes the ndwi values for a given location in a given time range
def compute_ndwi_stats(lat:float, lon:float, start_date:str,end_date:str):
    init_ee()

    point = ee.Geometry.Point([lon,lat]).buffer(5000)   #AOI (buffer in meters)

    collection = (
            ee.ImageCollection("COPERNICUS/S2_SR_HARMONIZED")
            .filterBounds(point)
            .filterDate(start_date,end_date)
            .filter(ee.Filter.lt("CLOUDY_PIXEL_PERCENTAGE",60))
            )
    count = collection.size().getInfo()
    if count == 0:
        raise ValueError("No sentinel-2 images found for the given location or time range")

    image = collection.median()
    
    #selecting bands
    green = image.select("B3")
    nir = image.select("B8")

    ndwi = (green
            .subtract(nir)
            .divide(green.add(nir))
            .rename("ndwi"))  #calculating ndwi

    stats = ndwi.reduceRegion(
            reducer = ee.Reducer.mean(),
            geometry = point,
            scale = 10,
            maxPixels = 1e9
            )
    mean_ndwi = stats.get("ndwi").getInfo()
    return {
            "mean_ndwi": float(mean_ndwi)
            }
    

    
