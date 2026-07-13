from celery import shared_task
import logging

from .models import Assessment
from .services import execute_assessment

logger = logging.getLogger(__name__)


@shared_task(
    bind=True,
    autoretry_for=(Exception,),
    retry_backoff=True,
    max_retries=3,
)
def run_assessment_task(self, assessment_id):

    logger.info(
        f"Starting assessment {assessment_id}"
    )

    assessment = Assessment.objects.get(
        id=assessment_id
    )

    execute_assessment(assessment)

    logger.info(
        f"Finished assessment {assessment_id}"
    )

    return assessment.id
