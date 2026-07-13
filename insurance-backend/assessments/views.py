from rest_framework import status, viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import Assessment
from .serializers import AssessmentSerializer
from .application import AssessmentService
from .pagination import AssessmentPagination


class AssessmentViewSet(viewsets.ModelViewSet):

    serializer_class = AssessmentSerializer
    pagination_class = AssessmentPagination

    permission_classes = [
        IsAuthenticated,
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
