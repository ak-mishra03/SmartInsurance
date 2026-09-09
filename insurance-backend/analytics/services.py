from datetime import timedelta
from typing import Any, Dict

from django.contrib.auth import get_user_model
from django.db.models import Avg, Count, Q
from django.utils import timezone

from assessments.models import Assessment
from properties.models import Property

User = get_user_model()


class DashboardAnalyticsService:
    """
    Service responsible for computing aggregated dashboard analytics metrics
    and monthly trends for a given user.
    """

    @staticmethod
    def trend(current: float, previous: float) -> Dict[str, Any]:
        """
        Calculate trend difference, label, and direction type.
        """
        diff = round(current - previous, 2)

        if diff > 0:
            trend_type = "positive"
        elif diff < 0:
            trend_type = "negative"
        else:
            trend_type = "neutral"

        return {
            "value": diff,
            "type": trend_type,
            "label": "vs last month",
        }

    @classmethod
    def get_dashboard(cls, user: Any) -> Dict[str, Any]:
        """
        Retrieve optimized dashboard analytics for a user.
        Consolidates metrics calculation into aggregated ORM queries.
        """
        today = timezone.now()

        start_this_month = today.replace(
            day=1,
            hour=0,
            minute=0,
            second=0,
            microsecond=0,
        )

        last_day_previous_month = start_this_month - timedelta(days=1)

        start_previous_month = last_day_previous_month.replace(
            day=1,
            hour=0,
            minute=0,
            second=0,
            microsecond=0,
        )

        properties = Property.objects.filter(owner=user)
        assessments = Assessment.objects.filter(property__owner=user)

        # Single aggregation query for Property stats
        property_stats = properties.aggregate(
            total=Count("id"),
            this_month=Count(
                "id",
                filter=Q(created_at__gte=start_this_month),
            ),
            previous_month=Count(
                "id",
                filter=Q(
                    created_at__gte=start_previous_month,
                    created_at__lt=start_this_month,
                ),
            ),
        )

        # Single aggregation query for Assessment stats
        assessment_stats = assessments.aggregate(
            total=Count("id"),
            average=Avg("flooded_area_percent"),
            high_risk=Count(
                "id",
                filter=Q(severity__in=["MAJOR", "SEVERE"]),
            ),
            this_month=Count(
                "id",
                filter=Q(created_at__gte=start_this_month),
            ),
            previous_month=Count(
                "id",
                filter=Q(
                    created_at__gte=start_previous_month,
                    created_at__lt=start_this_month,
                ),
            ),
            avg_this_month=Avg(
                "flooded_area_percent",
                filter=Q(created_at__gte=start_this_month),
            ),
            avg_previous_month=Avg(
                "flooded_area_percent",
                filter=Q(
                    created_at__gte=start_previous_month,
                    created_at__lt=start_this_month,
                ),
            ),
            high_risk_this_month=Count(
                "id",
                filter=Q(
                    created_at__gte=start_this_month,
                    severity__in=["MAJOR", "SEVERE"],
                ),
            ),
            high_risk_previous_month=Count(
                "id",
                filter=Q(
                    created_at__gte=start_previous_month,
                    created_at__lt=start_this_month,
                    severity__in=["MAJOR", "SEVERE"],
                ),
            ),
        )

        # Query recommendation counts grouped by recommendation choice
        recommendation_counts = assessments.values("recommendation").annotate(
            count=Count("id")
        )

        recommendations = {
            "AUTO_APPROVE": 0,
            "MANUAL_REVIEW": 0,
            "AUTO_REJECT": 0,
        }

        for item in recommendation_counts:
            rec_key = item.get("recommendation")
            if rec_key in recommendations:
                recommendations[rec_key] = item["count"]

        avg_this_month = round(assessment_stats["avg_this_month"] or 0, 2)
        avg_previous_month = round(assessment_stats["avg_previous_month"] or 0, 2)

        return {
            "properties": property_stats["total"],
            "property_trend": cls.trend(
                property_stats["this_month"],
                property_stats["previous_month"],
            ),
            "assessments": assessment_stats["total"],
            "assessment_trend": cls.trend(
                assessment_stats["this_month"],
                assessment_stats["previous_month"],
            ),
            "average_flood_percent": round(
                assessment_stats["average"] or 0,
                2,
            ),
            "average_flood_trend": cls.trend(
                avg_this_month,
                avg_previous_month,
            ),
            "high_risk": assessment_stats["high_risk"],
            "high_risk_trend": cls.trend(
                assessment_stats["high_risk_this_month"],
                assessment_stats["high_risk_previous_month"],
            ),
            "recommendations": recommendations,
        }
