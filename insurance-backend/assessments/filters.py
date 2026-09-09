import django_filters
from django.db import models

from .models import Assessment


class RiskLevel(models.TextChoices):
    LOW = "LOW", "Low"
    MEDIUM = "MEDIUM", "Medium"
    HIGH = "HIGH", "High"
    CRITICAL = "CRITICAL", "Critical"


class AssessmentFilter(django_filters.FilterSet):
    # Numeric Filters
    min_flood_percent = django_filters.NumberFilter(
        field_name="flooded_area_percent",
        lookup_expr="gte",
    )
    max_flood_percent = django_filters.NumberFilter(
        field_name="flooded_area_percent",
        lookup_expr="lte",
    )
    min_flood_area = django_filters.NumberFilter(
        field_name="flooded_area_m2",
        lookup_expr="gte",
    )
    max_flood_area = django_filters.NumberFilter(
        field_name="flooded_area_m2",
        lookup_expr="lte",
    )

    # Date Filters
    created_after = django_filters.DateTimeFilter(
        field_name="created_at",
        lookup_expr="gte",
    )
    created_before = django_filters.DateTimeFilter(
        field_name="created_at",
        lookup_expr="lte",
    )
    completed_after = django_filters.DateTimeFilter(
        field_name="completed_at",
        lookup_expr="gte",
    )
    completed_before = django_filters.DateTimeFilter(
        field_name="completed_at",
        lookup_expr="lte",
    )

    risk = django_filters.ChoiceFilter(
        method="filter_risk",
        choices=RiskLevel.choices,
    )

    def filter_risk(self, queryset, name, value):
        if value == RiskLevel.LOW:
            return queryset.filter(flooded_area_percent__lt=10)

        if value == RiskLevel.MEDIUM:
            return queryset.filter(
                flooded_area_percent__gte=10,
                flooded_area_percent__lt=30,
            )

        if value == RiskLevel.HIGH:
            return queryset.filter(
                flooded_area_percent__gte=30,
                flooded_area_percent__lt=60,
            )

        if value == RiskLevel.CRITICAL:
            return queryset.filter(
                flooded_area_percent__gte=60,
            )

        return queryset

    class Meta:
        model = Assessment
        fields = [
            "property",
            "status",
            "severity",
            "recommendation",
        ]
