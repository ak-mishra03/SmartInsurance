from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView

from .serializers import DashboardAnalyticsSerializer
from .services import DashboardAnalyticsService


class AnalyticsAPIView(APIView):
    """
    API View serving aggregated dashboard metrics and trends for the authenticated user.
    """

    permission_classes = [IsAuthenticated]

    def get(self, request: Request) -> Response:
        """
        GET /analytics/
        Returns aggregated property, assessment, flood risk, and recommendation statistics.
        """
        data = DashboardAnalyticsService.get_dashboard(request.user)
        serializer = DashboardAnalyticsSerializer(data)
        return Response(serializer.data, status=status.HTTP_200_OK)
