from pydantic import BaseModel, model_validator
from datetime import date

class FloodDamageRequest(BaseModel):
    lat: float
    lon: float

    pre_start: date
    pre_end: date

    post_start: date
    post_end: date

    @model_validator(mode="after")
    def validate_dates(self):
        if self.pre_start>self.pre_end:
            raise ValueError("pre_start must be before pre_end")
        if self.post_start>self.post_end:
            raise ValueError("post_start must be before post_end")
        return self
