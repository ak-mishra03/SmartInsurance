# SmartInsurance/risk-engine/app/services/ndwi.py

import ee

from app.core.constants import (
    AOI_RADIUS_METERS,
    MAX_CLOUD_COVER,
    MAX_PIXELS,
    NDWI_WATER_THRESHOLD,
    SCALE,
)



# --------------------------------------------------------
# Helper Functions
# --------------------------------------------------------

def get_ndwi_image(
    aoi,
    start_date: str,
    end_date: str,
):
    """
    Returns the median NDWI image for the
    specified area and date range.
    """

    collection = (
        ee.ImageCollection(
            "COPERNICUS/S2_SR_HARMONIZED"
        )
        .filterBounds(aoi)
        .filterDate(
            start_date,
            end_date,
        )
        .filter(
            ee.Filter.lt(
                "CLOUDY_PIXEL_PERCENTAGE",
                MAX_CLOUD_COVER,
            )
        )
    )

    if collection.size().getInfo() == 0:
        raise ValueError(
            "No Sentinel-2 imagery found "
            "for the selected period."
        )

    image = collection.median()

    green = image.select("B3")

    nir = image.select("B8")

    ndwi = (
        green.subtract(nir)
        .divide(
            green.add(nir)
        )
        .rename("ndwi")
    )

    return ndwi


def get_recommendation(
    severity: str,
):

    if severity == "NONE":
        return "AUTO_REJECT"

    if severity == "MINOR":
        return "MANUAL_REVIEW"

    return "AUTO_APPROVE"


def classify_severity(
    flooded_area_m2: float,
    flood_percent: float,
):
    """
    Rule-based flood severity.

    Later this can be replaced with
    an ML model.
    """

    if flood_percent < 1:
        return "NONE"

    if flood_percent < 2:
        return "MINOR"

    if flood_percent < 10:
        return "MODERATE"

    if flood_percent < 25:
        return "MAJOR"

    return "SEVERE"


# --------------------------------------------------------
# Flood Analysis
# --------------------------------------------------------

def compute_flood_stats(
    lat: float,
    lon: float,
    analysis_window: dict,
):
    """
    Computes flood extent using
    pre/post NDWI comparison.
    """

    aoi = (
        ee.Geometry.Point(
            [lon, lat]
        )
        .buffer(AOI_RADIUS_METERS)
    )

    pre_ndwi = get_ndwi_image(
        aoi,
        analysis_window["pre_start"],
        analysis_window["pre_end"],
    )

    post_ndwi = get_ndwi_image(
        aoi,
        analysis_window["post_start"],
        analysis_window["post_end"],
    )

    pre_water = pre_ndwi.gt(
        NDWI_WATER_THRESHOLD
    )

    post_water = post_ndwi.gt(
        NDWI_WATER_THRESHOLD
    )

    flood_mask = post_water.And(
        pre_water.Not()
    )

    pixel_area = ee.Image.pixelArea()

    flooded_area = (
        flood_mask
        .multiply(pixel_area)
        .reduceRegion(
            reducer=ee.Reducer.sum(),
            geometry=aoi,
            scale=SCALE,
            maxPixels=MAX_PIXELS,
        )
    )

    total_area = (
        pixel_area
        .reduceRegion(
            reducer=ee.Reducer.sum(),
            geometry=aoi,
            scale=SCALE,
            maxPixels=MAX_PIXELS,
        )
    )

    flooded_area_m2 = (
        flooded_area
        .get("ndwi")
        .getInfo()
    )

    total_area_m2 = (
        total_area
        .get("area")
        .getInfo()
    )

    if (
        flooded_area_m2 is None
        or total_area_m2 is None
    ):
        raise ValueError(
            "Area calculation failed."
        )

    flood_percent = (
        flooded_area_m2
        / total_area_m2
    ) * 100

    severity = classify_severity(
        flooded_area_m2,
        flood_percent,
    )

    recommendation = get_recommendation(
        severity,
    )

    return {

        "flooded_area_m2":
            flooded_area_m2,

        "flooded_area_percent":
            flood_percent,

        "severity":
            severity,

        "recommendation":
            recommendation,

    }


# --------------------------------------------------------
# NDWI Statistics
# --------------------------------------------------------

def compute_ndwi_stats(
    lat: float,
    lon: float,
    start_date: str,
    end_date: str,
):
    """
    Returns NDWI statistics
    for a given location.
    """


    aoi = (
        ee.Geometry.Point(
            [lon, lat]
        )
        .buffer(AOI_RADIUS_METERS)
    )

    ndwi = get_ndwi_image(
        aoi,
        start_date,
        end_date,
    )

    stats = ndwi.reduceRegion(
        reducer=ee.Reducer.minMax(),
        geometry=aoi,
        scale=SCALE,
        maxPixels=MAX_PIXELS,
    )

    return {

        "min_ndwi":
            stats.get(
                "ndwi_min"
            ).getInfo(),

        "max_ndwi":
            stats.get(
                "ndwi_max"
            ).getInfo(),

    }
