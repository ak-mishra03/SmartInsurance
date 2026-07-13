# properties/serializers.py

from rest_framework import serializers
from django.contrib.gis.geos import Point

from .models import Property


class PropertySerializer(serializers.ModelSerializer):

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

    def get_latitude(self, obj):
        return obj.location.y

    def get_longitude(self, obj):
        return obj.location.x

    def create(self, validated_data):

        lat = validated_data.pop("lat")
        lon = validated_data.pop("lon")

        validated_data["location"] = Point(
            lon,
            lat,
            srid=4326,
        )

        return super().create(validated_data)

    def update(self, instance, validated_data):

        lat = validated_data.pop("lat", None)
        lon = validated_data.pop("lon", None)

        if lat is not None and lon is not None:
            validated_data["location"] = Point(
                lon,
                lat,
                srid=4326,
            )

        return super().update(
            instance,
            validated_data,
        )
