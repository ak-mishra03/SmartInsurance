# properties/views.py

from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from .models import Property
from .serializers import PropertySerializer


class PropertyViewSet(viewsets.ModelViewSet):
    """
    API ViewSet for viewing and managing user properties.
    Restricts access strictly to properties owned by the authenticated user.
    """

    serializer_class = PropertySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """
        Filters properties owned by the current authenticated user.
        """
        return Property.objects.filter(owner=self.request.user)

    def perform_create(self, serializer: PropertySerializer) -> None:
        """
        Passes authenticated user as property owner upon creation.
        """
        serializer.save(owner=self.request.user)
