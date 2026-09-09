# properties/services.py

from typing import Any, Dict
from django.contrib.gis.geos import Point
from .models import Property


class PropertyService:
    """
    Service layer for managing Property domain operations.
    """

    @staticmethod
    def build_point(lat: float, lon: float) -> Point:
        """
        Builds a WGS84 (SRID 4326) Geos Point from latitude and longitude.
        PostGIS expects (x=longitude, y=latitude).
        """
        return Point(lon, lat, srid=4326)

    @classmethod
    def create_property(cls, owner: Any, validated_data: Dict[str, Any]) -> Property:
        """
        Creates a new Property for the given owner.
        """
        lat = validated_data.pop("lat")
        lon = validated_data.pop("lon")
        validated_data["location"] = cls.build_point(lat, lon)
        validated_data["owner"] = owner
        return Property.objects.create(**validated_data)

    @classmethod
    def update_property(cls, instance: Property, validated_data: Dict[str, Any]) -> Property:
        """
        Updates an existing Property and refreshes its location point if lat/lon changed.
        """
        lat = validated_data.pop("lat", None)
        lon = validated_data.pop("lon", None)

        if lat is not None and lon is not None:
            instance.location = cls.build_point(lat, lon)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.save()
        return instance
