import logging
from celery import shared_task

from .models import Assessment
from .services import execute_assessment

logger = logging.getLogger(__name__)


@shared_task(
    bind=True,
    autoretry_for=(Exception,),
    retry_backoff=True,
    max_retries=3,
)
def run_assessment_task(self, assessment_id: int) -> int:
    """
    Celery task wrapper to asynchronously execute a flood risk assessment.
    """
    logger.info(f"Starting assessment task for assessment_id={assessment_id}")

    try:
        assessment = Assessment.objects.get(id=assessment_id)
    except Assessment.DoesNotExist:
        logger.error(f"Assessment with id={assessment_id} does not exist.")
        return assessment_id

    execute_assessment(assessment)

    logger.info(f"Finished assessment task for assessment_id={assessment_id}")
    return assessment.id
