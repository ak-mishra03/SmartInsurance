from rest_framework import serializers

from properties.models import Property
from .models import Assessment


class AssessmentSerializer(serializers.ModelSerializer):

    property_id = serializers.PrimaryKeyRelatedField(
        queryset=Property.objects.all(),
        source="property",
        write_only=True,
    )

    property_name = serializers.CharField(
        source="property.name",
        read_only=True,
    )

    class Meta:
        model = Assessment

        fields = (
            "id",
            "property_id",
            "property_name",
            "status",
            "flooded_area_m2",
            "flooded_area_percent",
            "severity",
            "recommendation",
            "created_at",
            "updated_at",
            "completed_at",
        )

        read_only_fields = (
            "status",
            "flooded_area_m2",
            "flooded_area_percent",
            "severity",
            "recommendation",
            "created_at",
            "updated_at",
            "completed_at",
        )

    def validate_property(self, property_obj):

        request = self.context["request"]

        if property_obj.owner != request.user:
            raise serializers.ValidationError(
                "You do not own this property."
            )

        return property_obj
