from django.contrib.auth import get_user_model
from django.contrib.gis.geos import Point
from django.test import TestCase
from rest_framework import status
from rest_framework.test import APIClient

from properties.models import Property
from properties.serializers import PropertySerializer
from properties.services import PropertyService

User = get_user_model()


class PropertyServiceTestCase(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="propuser",
            email="propuser@example.com",
            password="Password123!",
        )

    def test_build_point_and_create(self):
        prop = PropertyService.create_property(
            owner=self.user,
            validated_data={
                "name": "Coastal Haven",
                "address": "123 Beach Blvd",
                "property_type": Property.PropertyType.HOUSE,
                "insured_value": 450000.00,
                "lat": 25.7617,
                "lon": -80.1918,
            },
        )
        self.assertEqual(prop.location.y, 25.7617)
        self.assertEqual(prop.location.x, -80.1918)
        self.assertEqual(prop.owner, self.user)


class PropertySerializerTestCase(TestCase):
    def test_lat_lon_validation(self):
        serializer = PropertySerializer(
            data={
                "name": "Invalid Prop",
                "address": "Unknown",
                "property_type": "HOUSE",
                "lat": 105.0,  # Invalid latitude (>90)
                "lon": 45.0,
            }
        )
        self.assertFalse(serializer.is_valid())
        self.assertIn("lat", serializer.errors)


class PropertyViewSetTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user1 = User.objects.create_user(username="u1", password="pw")
        self.user2 = User.objects.create_user(username="u2", password="pw")

        self.prop1 = PropertyService.create_property(
            owner=self.user1,
            validated_data={
                "name": "User 1 Prop",
                "address": "Street 1",
                "property_type": "HOUSE",
                "lat": 10.0,
                "lon": 20.0,
            },
        )

    def test_user_cannot_see_other_properties(self):
        self.client.force_authenticate(user=self.user2)
        response = self.client.get("/properties/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 0)
