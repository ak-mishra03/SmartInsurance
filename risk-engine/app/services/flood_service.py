import logging

from app.schemas.flood import FloodDamageRequest
from app.services.ndwi import compute_flood_stats
from app.utils.date_selector import choose_analysis_dates


logger = logging.getLogger(__name__)


class FloodService:
    """
    Service responsible for orchestrating flood damage analysis.
    """

    @staticmethod
    def analyze_flood_damage(
        request: FloodDamageRequest,
    ) -> dict:
        """
        Perform flood damage analysis for a location.
        """

        logger.info(
            "Starting flood analysis "
            "(lat=%s, lon=%s)",
            request.lat,
            request.lon,
        )

        analysis_window = choose_analysis_dates()

        logger.info(
            "Selected analysis window: %s",
            analysis_window,
        )

        try:
            stats = compute_flood_stats(
                request.lat,
                request.lon,
                analysis_window,
            )

        except Exception:
            logger.exception(
                "Flood analysis failed "
                "(lat=%s, lon=%s)",
                request.lat,
                request.lon,
            )
            raise

        logger.info(
            "Flood analysis completed "
            "(severity=%s, recommendation=%s)",
            stats["severity"],
            stats["recommendation"],
        )

        return {
            "location": [
                request.lat,
                request.lon,
            ],
            "analysis_window": analysis_window,
            "flood_stats": stats,
        }
