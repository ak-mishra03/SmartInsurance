from pydantic import BaseModel, model_validator
from datetime import date

class FloodDamageRequest(BaseModel):
    lat: float
    lon: float

