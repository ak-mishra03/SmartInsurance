import django_filters

from .models import Assessment


class AssessmentFilter(django_filters.FilterSet):

    # ----------------------------
    # Numeric Filters
    # ----------------------------

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

    # ----------------------------
    # Date Filters
    # ----------------------------

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

    def filter_risk(self, queryset, name, value):

        if value == "LOW":
            return queryset.filter(flooded_area_percent__lt=10)

        if value == "MEDIUM":
            return queryset.filter(
                flooded_area_percent__gte=10,
                flooded_area_percent__lt=30,
            )

        if value == "HIGH":
            return queryset.filter(
                flooded_area_percent__gte=30,
                flooded_area_percent__lt=60,
            )

        if value == "CRITICAL":
            return queryset.filter(
                flooded_area_percent__gte=60,
            )

        return queryset

    risk = django_filters.ChoiceFilter(
            method="filter_risk",
            choices = [
                    ("LOW","Low"),
                    ("MEDIUM","Medium"),
                    ("HIGH","High"),
                    ("CRITICAL","Critical"),
                ],
            )

    # ----------------------------
    # Exact Filters
    # ----------------------------

    class Meta:

        model = Assessment

        fields = [

            "property",

            "status",

            "severity",

            "recommendation",

        ]

