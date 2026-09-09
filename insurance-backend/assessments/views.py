from rest_framework import status, viewsets
from rest_framework.filters import OrderingFilter, SearchFilter
from rest_framework.permissions import IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend

from .filters import AssessmentFilter
from .models import Assessment
from .pagination import AssessmentPagination
from .serializers import AssessmentSerializer
from .services import AssessmentService


class AssessmentViewSet(viewsets.ModelViewSet):
    """
    API ViewSet for managing Assessment records.
    Provides paginated lists, property filtering, and async assessment creation.
    """

    serializer_class = AssessmentSerializer
    pagination_class = AssessmentPagination
    permission_classes = [IsAuthenticated]

    filter_backends = [
        DjangoFilterBackend,
        OrderingFilter,
        SearchFilter,
    ]

    filterset_class = AssessmentFilter
    ordering_fields = [
        "created_at",
        "completed_at",
        "flooded_area_percent",
        "flooded_area_m2",
    ]
    ordering = ["-created_at"]
    search_fields = ["property__name", "recommendation"]

    def get_queryset(self):
        """
        Returns assessments owned by the authenticated user with pre-fetched property data.
        """
        queryset = (
            Assessment.objects.filter(property__owner=self.request.user)
            .select_related("property")
            .order_by("-created_at")
        )

        property_id = self.request.query_params.get("property")
        if property_id:
            queryset = queryset.filter(property_id=property_id)

        return queryset

    def create(self, request: Request, *args, **kwargs) -> Response:
        """
        Creates a new Assessment and queues the risk calculation task.
        """
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        assessment = AssessmentService.create_assessment(serializer)
        output = self.get_serializer(assessment)

        return Response(
            output.data,
            status=status.HTTP_202_ACCEPTED,
        )
