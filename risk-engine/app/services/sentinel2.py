import ee

from app.core.constants import MAX_CLOUD_COVER


SENTINEL_2_DATASET = "COPERNICUS/S2_SR_HARMONIZED"


def mask_clouds_and_shadows(
    image: ee.Image,
) -> ee.Image:
    """
    Mask clouds, cloud shadows, cirrus, and snow/ice
    using Sentinel-2 Scene Classification Layer.
    """

    scl = image.select("SCL")

    mask = (
        scl.neq(3)   # Cloud shadow
        .And(scl.neq(8))   # Medium-probability cloud
        .And(scl.neq(9))   # High-probability cloud
        .And(scl.neq(10))  # Cirrus
        .And(scl.neq(11))  # Snow / ice
    )

    return image.updateMask(mask)


def get_sentinel2_collection(
    aoi: ee.Geometry,
    start_date: str,
    end_date: str,
) -> ee.ImageCollection:
    """
    Return a cloud-masked Sentinel-2 collection.
    """

    return (
        ee.ImageCollection(SENTINEL_2_DATASET)
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
        .map(mask_clouds_and_shadows)
    )
