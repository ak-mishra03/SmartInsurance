from rest_framework import status, viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import OrderingFilter, SearchFilter, search_smart_split

from .models import Assessment
from .serializers import AssessmentSerializer
from .application import AssessmentService
from .pagination import AssessmentPagination
from .filters import AssessmentFilter


class AssessmentViewSet(viewsets.ModelViewSet):

    serializer_class = AssessmentSerializer
    pagination_class = AssessmentPagination

    permission_classes = [
        IsAuthenticated,
    ]

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
            "flooded_m2",
            ]
    ordering = ["-created_at"]

    search_fields = [
            "property__name",
            "recommendation"
            ]

    def get_queryset(self):

        queryset = (
            Assessment.objects
            .filter(
                property__owner=self.request.user
            )
            .select_related("property")
            .order_by("-created_at")
        )

        property_id = self.request.query_params.get(
            "property"
        )

        if property_id:

            queryset = queryset.filter(
                property_id=property_id
            )

        return queryset

    def create(self, request, *args, **kwargs):

        serializer = self.get_serializer(
            data=request.data
        )

        serializer.is_valid(
            raise_exception=True
        )

        assessment = (
            AssessmentService.create_assessment(
                serializer
            )
        )

        output = self.get_serializer(
            assessment
        )

        return Response(
            output.data,
            status=status.HTTP_202_ACCEPTED,
        )
