# properties/models.py

from django.conf import settings
from django.contrib.gis.db import models


class Property(models.Model):
    class PropertyType(models.TextChoices):
        HOUSE = "HOUSE", "House"
        FARM = "FARM", "Farm"
        COMMERCIAL = "COMMERCIAL", "Commercial"
        INDUSTRIAL = "INDUSTRIAL", "Industrial"

    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="properties",
    )
    name = models.CharField(max_length=200)

    address = models.TextField()

    location = models.PointField(
        geography=True,
        srid=4326,
    )

    property_type = models.CharField(
        max_length=20,
        choices=PropertyType.choices,
        db_index=True,
    )

    insured_value = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=0,
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
        db_index=True,
    )

    updated_at = models.DateTimeField(
        auto_now=True,
    )

    class Meta:
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["owner", "-created_at"]),
            models.Index(fields=["property_type"]),
        ]

    def __str__(self):
        return f"{self.name} ({self.get_property_type_display()})"
