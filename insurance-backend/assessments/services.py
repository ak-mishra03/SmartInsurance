import logging
from typing import Any, Dict
import requests

from django.conf import settings
from django.core.cache import cache
from django.db import transaction
from django.utils import timezone

from .models import Assessment

logger = logging.getLogger(__name__)

RISK_ENGINE_CACHE_TIMEOUT = getattr(settings, "RISK_ENGINE_CACHE_TTL", 3600)  # 1 hour default TTL
RISK_ENGINE_HTTP_TIMEOUT = getattr(settings, "RISK_ENGINE_TIMEOUT", 30)  # 30 seconds default HTTP timeout


class AssessmentService:
    """
    Service layer handling domain operations for Risk Assessments.
    """

    @staticmethod
    def create_assessment(serializer: Any) -> Assessment:
        """
        Creates an assessment record and safely queues a background task
        only AFTER the database transaction commits.
        """
        with transaction.atomic():
            assessment = serializer.save()

            # Defer importing tasks to prevent circular import issues
            from .tasks import run_assessment_task

            # Dispatch Celery task strictly on transaction commit to prevent race conditions
            transaction.on_commit(
                lambda: run_assessment_task.delay(assessment.id)
            )

        return assessment

    @classmethod
    def execute_assessment(cls, assessment: Assessment) -> Assessment:
        """
        Executes flood risk assessment against the external risk engine microservice.
        Caches results by geographic coordinates to prevent redundant service calls.
        """
        property_obj = assessment.property

        assessment.status = Assessment.Status.RUNNING
        assessment.save(update_fields=["status", "updated_at"])

        lat = property_obj.location.y
        lon = property_obj.location.x

        cache_key = f"risk_assessment:{round(lat, 5)}:{round(lon, 5)}"
        cached_data = cache.get(cache_key)

        try:
            if cached_data:
                logger.info(f"Using cached risk assessment for lat={lat}, lon={lon}")
                data = cached_data
            else:
                risk_engine_url = getattr(
                    settings,
                    "RISK_ENGINE_URL",
                    "http://localhost:8000/flood/flood-damage",
                )
                response = requests.post(
                    risk_engine_url,
                    json={"lat": lat, "lon": lon},
                    timeout=RISK_ENGINE_HTTP_TIMEOUT,
                )
                response.raise_for_status()
                data = response.json()

                # Cache successful response for identical coordinates
                cache.set(cache_key, data, timeout=RISK_ENGINE_CACHE_TIMEOUT)

            stats = data.get("flood_stats", {})

            assessment.flooded_area_m2 = stats.get("flooded_area_m2")
            assessment.flooded_area_percent = stats.get("flooded_area_percent")
            assessment.severity = stats.get("severity", "")
            assessment.recommendation = stats.get("recommendation", "")
            assessment.raw_response = data
            assessment.status = Assessment.Status.COMPLETED
            assessment.completed_at = timezone.now()

        except Exception as exc:
            logger.error(
                f"Failed to execute assessment {assessment.id} for property {property_obj.id}: {exc}",
                exc_info=True,
            )
            assessment.status = Assessment.Status.FAILED
            assessment.raw_response = {"error": str(exc)}
            assessment.save()
            # Re-raise exception so Celery task runner handles retry policies appropriately
            raise exc

        assessment.save()
        return assessment


# Backward compatibility alias
execute_assessment = AssessmentService.execute_assessment
