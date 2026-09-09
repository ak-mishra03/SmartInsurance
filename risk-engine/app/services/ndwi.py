import ee
from app.services.sentinel2 import (
        get_sentinel2_collection,
        )
from app.core.constants import (
        AOI_RADIUS_METERS,
        MAX_CLOUD_COVER,
        MAX_PIXELS,
        NDWI_WATER_THRESHOLD,
        SCALE,
        )
from app.core.exceptions import (
        FloodAnalysisError,
        SatelliteDataUnavailable,
        EarthEngineServiceError,
        SatelliteDataUnavailable
        )


GREEN_BAND = "B3"
NIR_BAND = "B8"


# --------------------------------------------------------
# NDWI Image
# --------------------------------------------------------

def get_ndwi_image(
    aoi: ee.Geometry,
    start_date: str,
    end_date: str,
) -> ee.Image:
    """
    Build a median NDWI image from cloud-masked
    Sentinel-2 imagery.
    """

    collection = get_sentinel2_collection(
        aoi,
        start_date,
        end_date,
    )

    try:
        image_count = collection.size().getInfo()

    except ee.EEException as exc:
        raise EarthEngineServiceError(
            "Unable to query Sentinel-2 imagery."
        ) from exc

    if image_count == 0:
        raise SatelliteDataUnavailable(
            "No Sentinel-2 imagery found "
            f"between {start_date} and {end_date}."
        )

    image = collection.median()

    green = image.select("B3")
    nir = image.select("B8")

    return (
        green.subtract(nir)
        .divide(green.add(nir))
        .rename("ndwi")
    )


def calculate_flood_area(
    flood_mask: ee.Image,
    aoi: ee.Geometry,
) -> tuple[float, float]:
    """
    Calculate flooded area and total AOI area in square meters.
    """

    pixel_area = ee.Image.pixelArea()

    flooded_area_image = (
        flood_mask
        .multiply(pixel_area)
        .rename("flooded_area")
    )

    total_area_image = pixel_area.rename(
        "total_area"
    )

    area_stats = (
        flooded_area_image
        .addBands(total_area_image)
        .reduceRegion(
            reducer=ee.Reducer.sum(),
            geometry=aoi,
            scale=SCALE,
            maxPixels=MAX_PIXELS,
        )
    )

    try:
        area_values = area_stats.getInfo()

    except ee.EEException as exc:
        raise EarthEngineServiceError(
            "Unable to calculate flood area with Earth Engine."
        ) from exc

    flooded_area_m2 = area_values.get(
        "flooded_area"
    )

    total_area_m2 = area_values.get(
        "total_area"
    )

    if (
        flooded_area_m2 is None
        or total_area_m2 is None
        or total_area_m2 <= 0
    ):
        raise FloodAnalysisError(
            "Unable to calculate flood area."
        )

    return (
        float(flooded_area_m2),
        float(total_area_m2),
    )



# --------------------------------------------------------
# Flood Classification
# --------------------------------------------------------

def classify_severity(
        flood_percent: float,
        ) -> str:
    """
    Classify flood severity based on the percentage
    of the analysis area affected by newly detected water.
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


def get_recommendation(
        severity: str,
        ) -> str:
    """
    Map flood severity to the corresponding
    insurance recommendation.
    """

    if severity in ("NONE", "MINOR"):
        return "AUTO_APPROVE"

    if severity in ("MODERATE", "MAJOR"):
        return "MANUAL_REVIEW"

    return "AUTO_REJECT"


# --------------------------------------------------------
# Flood Analysis
# --------------------------------------------------------

def compute_flood_stats(
        lat: float,
        lon: float,
        analysis_window: dict[str, str],
        ) -> dict[str, float | str]:
    """
    Compute newly flooded area using pre/post NDWI comparison.
    """

    aoi = (
            ee.Geometry.Point([lon, lat])
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

    flooded_area_image = (
        flood_mask
        .multiply(pixel_area)
        .rename("flooded_area")
    )

    total_area_image = pixel_area.rename(
        "total_area"
    )

    area_stats = (
        flooded_area_image
        .addBands(total_area_image)
        .reduceRegion(
            reducer=ee.Reducer.sum(),
            geometry=aoi,
            scale=SCALE,
            maxPixels=MAX_PIXELS,
        )
    )

    try:
        area_values = area_stats.getInfo()

    except ee.EEException as exc:
        raise EarthEngineServiceError(
            "Unable to calculate flood area with Earth Engine."
        ) from exc

    flooded_area_m2 = area_values.get(
        "flooded_area"
    )

    total_area_m2 = area_values.get(
        "total_area"
    )
    if (
            flooded_area_m2 is None
            or total_area_m2 is None
            or total_area_m2 <= 0
            ):
        raise FloodAnalysisError(
                "Unable to calculate flood area."
                )

    flood_percent = (
            flooded_area_m2 / total_area_m2
            ) * 100

    severity = classify_severity(
            flood_percent,
            )

    recommendation = get_recommendation(
            severity,
            )

    return {
            "flooded_area_m2": float(
                flooded_area_m2
                ),
            "flooded_area_percent": float(
                flood_percent
                ),
            "severity": severity,
            "recommendation": recommendation,
            }


# --------------------------------------------------------
# NDWI Statistics
# --------------------------------------------------------

def compute_ndwi_stats(
        lat: float,
        lon: float,
        start_date: str,
        end_date: str,
        ) -> dict[str, float | None]:
    """
    Return minimum and maximum NDWI values
    for the specified location and date range.
    """

    aoi = (
            ee.Geometry.Point([lon, lat])
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
            "min_ndwi": stats.get(
                "ndwi_min"
                ).getInfo(),
            "max_ndwi": stats.get(
                "ndwi_max"
                ).getInfo(),
            }
