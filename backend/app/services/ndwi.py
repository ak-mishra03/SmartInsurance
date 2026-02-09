# SmartInsurance/backend/app/services/ndwi.py

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

def get_ndwi_image(aoi: float, start_date: str, end_date: str):
   collection = (
           ee.ImageCollection("COPERNICUS/S2_SR_HARMONIZED")
           .filterBounds(aoi)
           .filterDate(start_date,end_date)
           .filter(ee.Filter.lt("CLOUDY_PIXEL_PERCENTAGE",60))
           )

   count = collection.size().getInfo()
   if count == 0:
       raise ValueError("No sentinel-2 images found for ths date range")

   image = collection.median()
   green = image.select("B3")
   nir = image.select("B8")

   ndwi = (
           green.subtract(nir)
           .divide(green.add(nir))
           .rename("ndwi")
           )

   return ndwi


def compute_flood_stats(
        lat: float,
        lon: float,
        pre_start: str,
        pre_end: str,
        post_start: str,
        post_end: str
        ):
    init_ee()

    #area of intrest = 5KM around the given coordinate
    aoi = ee.Geometry.Point([lon,lat]).buffer(5000)     

    pre_ndwi = get_ndwi_image(aoi,pre_start,pre_end)
    post_ndwi = get_ndwi_image(aoi,post_start,post_end)
    
    water_threshold = 0.0

    pre_water = pre_ndwi.gt(water_threshold)
    post_water = post_ndwi.gt(water_threshold)

    flood_mask = post_water.And(pre_water.Not())

    pixel_area = ee.Image.pixelArea()

    flooded_area = flood_mask.multiply(pixel_area).reduceRegion(
            reducer = ee.Reducer.sum(),
            geometry = aoi,
            scale = 10,
            maxPixels = 1e9
            )

    total_area = pixel_area.reduceRegion(
            reducer = ee.Reducer.sum(),
            geometry = aoi,
            scale = 10,
            maxPixels = 1e9
            )

    flooded_m2 = flooded_area.get("ndwi").getInfo()
    total_m2 = total_area.get("area").getInfo()

    if flooded_m2 is None or total_m2 is None:
        raise ValueError("Area calculation failed")

    flood_percent = (flooded_m2/total_m2)

    return {
            "flooded_area_m2": flooded_m2,
            "flooded_area_percent": flood_percent
            }

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
    

    
