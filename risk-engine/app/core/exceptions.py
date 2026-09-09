from fastapi import HTTPException, status


class FloodAnalysisException(Exception):
    """Base exception for flood analysis errors."""


class SatelliteDataUnavailable(FloodAnalysisException):
    """No suitable satellite imagery found for the requested location."""


class EarthEngineServiceError(FloodAnalysisException):
    """Google Earth Engine failed to process the request."""


class InvalidAnalysisWindow(FloodAnalysisException):
    """The requested analysis window is invalid."""
