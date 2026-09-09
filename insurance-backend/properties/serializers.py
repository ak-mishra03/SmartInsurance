# properties/serializers.py

from rest_framework import serializers
from .models import Property
from .services import PropertyService


class PropertySerializer(serializers.ModelSerializer):
    """
    Serializer for Property model with latitude and longitude field conversions.
    """

    # Incoming fields from frontend
    lat = serializers.FloatField(write_only=True)
    lon = serializers.FloatField(write_only=True)

    # Outgoing fields to frontend
    latitude = serializers.SerializerMethodField()
    longitude = serializers.SerializerMethodField()

    class Meta:
        model = Property
        fields = (
            "id",
            "name",
            "address",
            "property_type",
            "insured_value",
            "lat",
            "lon",
            "latitude",
            "longitude",
            "created_at",
            "updated_at",
        )
        read_only_fields = (
            "created_at",
            "updated_at",
        )

    def validate_lat(self, value: float) -> float:
        if not (-90.0 <= value <= 90.0):
            raise serializers.ValidationError("Latitude must be between -90 and 90 degrees.")
        return value

    def validate_lon(self, value: float) -> float:
        if not (-180.0 <= value <= 180.0):
            raise serializers.ValidationError("Longitude must be between -180 and 180 degrees.")
        return value

    def get_latitude(self, obj: Property) -> float:
        return obj.location.y if obj.location else 0.0

    def get_longitude(self, obj: Property) -> float:
        return obj.location.x if obj.location else 0.0

    def create(self, validated_data: dict) -> Property:
        # Note: owner is passed via perform_create in view
        request = self.context.get("request")
        owner = validated_data.pop("owner", request.user if request else None)
        return PropertyService.create_property(owner, validated_data)

    def update(self, instance: Property, validated_data: dict) -> Property:
        return PropertyService.update_property(instance, validated_data)
