from django.contrib.auth import get_user_model
from django.contrib.gis.geos import Point
from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient

from assessments.models import Assessment
from properties.models import Property
from analytics.serializers import DashboardAnalyticsSerializer
from analytics.services import DashboardAnalyticsService

User = get_user_model()


class AnalyticsServiceTestCase(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="testuser",
            email="test@example.com",
            password="Password123!",
        )

        self.prop1 = Property.objects.create(
            owner=self.user,
            name="Property 1",
            address="123 Main St",
            location=Point(10.0, 20.0),
            property_type="RESIDENTIAL",
            building_value=100000.0,
            contents_value=50000.0,
        )

        self.assessment1 = Assessment.objects.create(
            property=self.prop1,
            status=Assessment.Status.COMPLETED,
            flooded_area_percent=25.0,
            severity="MAJOR",
            recommendation=Assessment.Recommendation.AUTO_APPROVE,
        )

    def test_trend_calculation(self):
        trend_pos = DashboardAnalyticsService.trend(10.0, 5.0)
        self.assertEqual(trend_pos["type"], "positive")
        self.assertEqual(trend_pos["value"], 5.0)

        trend_neg = DashboardAnalyticsService.trend(2.0, 8.0)
        self.assertEqual(trend_neg["type"], "negative")
        self.assertEqual(trend_neg["value"], -6.0)

        trend_neu = DashboardAnalyticsService.trend(5.0, 5.0)
        self.assertEqual(trend_neu["type"], "neutral")
        self.assertEqual(trend_neu["value"], 0.0)

    def test_get_dashboard_aggregations(self):
        data = DashboardAnalyticsService.get_dashboard(self.user)

        self.assertEqual(data["properties"], 1)
        self.assertEqual(data["assessments"], 1)
        self.assertEqual(data["average_flood_percent"], 25.0)
        self.assertEqual(data["high_risk"], 1)
        self.assertEqual(data["recommendations"]["AUTO_APPROVE"], 1)
        self.assertEqual(data["recommendations"]["MANUAL_REVIEW"], 0)
        self.assertEqual(data["recommendations"]["AUTO_REJECT"], 0)

        # Validate structure with serializer
        serializer = DashboardAnalyticsSerializer(data)
        self.assertTrue(serializer.data)


class AnalyticsAPIViewTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            username="apiuser",
            email="apiuser@example.com",
            password="Password123!",
        )

    def test_unauthenticated_request_denied(self):
        response = self.client.get("/analytics/")
        self.assertIn(
            response.status_code,
            [status.HTTP_401_UNAUTHORIZED, status.HTTP_403_FORBIDDEN],
        )

    def test_authenticated_request_success(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.get("/analytics/")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("properties", response.data)
        self.assertIn("assessments", response.data)
        self.assertIn("recommendations", response.data)
        self.assertIn("AUTO_APPROVE", response.data["recommendations"])
