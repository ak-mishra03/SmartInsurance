import requests

from django.conf import settings
from django.utils import timezone

from .models import Assessment

RISK_ENGINE_URL = settings.RISK_ENGINE_URL


def execute_assessment(
    assessment: Assessment,
):
    property_obj = assessment.property

    assessment.status = (
        Assessment.Status.RUNNING
    )

    assessment.save(
        update_fields=["status"]
    )

    lat = property_obj.location.y
    lon = property_obj.location.x

    try:

        response = requests.post(
            RISK_ENGINE_URL,
            json={
                "lat": lat,
                "lon": lon,
            },
            timeout=180,
        )

        response.raise_for_status()

        data = response.json()

        stats = data["flood_stats"]

        assessment.flooded_area_m2 = (
            stats["flooded_area_m2"]
        )

        assessment.flooded_area_percent = (
            stats["flooded_area_percent"]
        )

        assessment.severity = (
            stats["severity"]
        )

        assessment.recommendation = (
            stats["recommendation"]
        )

        assessment.raw_response = data

        assessment.status = (
            Assessment.Status.COMPLETED
        )

        assessment.completed_at = (
            timezone.now()
        )

    except Exception as e:

        assessment.status = (
            Assessment.Status.FAILED
        )

        assessment.raw_response = {
            "error": str(e)
        }

    assessment.save()

    return assessment
