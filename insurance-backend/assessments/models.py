# assessments/models.py

from django.db import models
from claims.models import Claim


class Assessment(models.Model):

    class Severity(models.TextChoices):
        NONE = "NONE", "None"
        MINOR = "MINOR", "Minor"
        MODERATE = "MODERATE", "Moderate"
        MAJOR = "MAJOR", "Major"
        SEVERE = "SEVERE", "Severe"

    claim = models.OneToOneField(
        Claim,
        on_delete=models.CASCADE,
        related_name="assessment",
    )

    flood_percent = models.FloatField()

    flooded_area_m2 = models.FloatField()

    severity = models.CharField(
        max_length=20,
        choices=Severity.choices,
    )

    recommendation = models.CharField(
        max_length=50,
    )

    analysis_radius_m = models.IntegerField()

    analyzed_at = models.DateTimeField(auto_now_add=True)
