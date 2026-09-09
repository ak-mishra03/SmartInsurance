from typing import Any

from pydantic import BaseModel, Field


class FloodStatsResponse(BaseModel):
    mean_ndwi: float
    min_ndwi: float
    max_ndwi: float
    flooded_area_m2: float
    flooded_area_percent: float
    severity: str
    recommendation: str


class FloodDamageResponse(BaseModel):
    location: list[float]
    analysis_window: dict[str, str]
    flood_stats: FloodStatsResponse


class NDWIResponse(BaseModel):
    location: list[float]
    date_range: list[str]
    ndwi_stats: dict[str, Any]

class FloodDamageRequest(BaseModel):
    lat: float
    lon: float

