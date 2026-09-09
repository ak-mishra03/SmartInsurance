from unittest.mock import patch
from django.contrib.auth import get_user_model
from django.contrib.gis.geos import Point
from django.core.cache import cache
from django.test import TestCase
from rest_framework import status
from rest_framework.test import APIClient

from properties.models import Property
from assessments.models import Assessment
from assessments.serializers import AssessmentSerializer
from assessments.services import AssessmentService

User = get_user_model()


class AssessmentServiceTestCase(TestCase):
    def setUp(self):
        cache.clear()
        self.user = User.objects.create_user(
            username="assessmentuser",
            email="assessmentuser@example.com",
            password="Password123!",
        )

        self.property = Property.objects.create(
            owner=self.user,
            name="Lakefront Villa",
            address="456 Ocean Drive",
            location=Point(34.05, -118.25),
            property_type="RESIDENTIAL",
            building_value=500000.0,
            contents_value=200000.0,
        )

    @patch("requests.post")
    def test_execute_assessment_success_and_caching(self, mock_post):
        mock_post.return_value.status_code = 200
        mock_post.return_value.json.return_value = {
            "flood_stats": {
                "flooded_area_m2": 1500.0,
                "flooded_area_percent": 35.5,
                "severity": Assessment.Severity.MAJOR,
                "recommendation": Assessment.Recommendation.MANUAL_REVIEW,
            }
        }

        assessment = Assessment.objects.create(property=self.property)
        executed = AssessmentService.execute_assessment(assessment)

        self.assertEqual(executed.status, Assessment.Status.COMPLETED)
        self.assertEqual(executed.flooded_area_percent, 35.5)
        self.assertEqual(executed.severity, Assessment.Severity.MAJOR)
        self.assertEqual(mock_post.call_count, 1)

        # Second execution for identical coordinates should use cache
        assessment2 = Assessment.objects.create(property=self.property)
        executed2 = AssessmentService.execute_assessment(assessment2)

        self.assertEqual(executed2.status, Assessment.Status.COMPLETED)
        self.assertEqual(mock_post.call_count, 1)  # No extra HTTP post made


class AssessmentAPITestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            username="apiuser2",
            email="apiuser2@example.com",
            password="Password123!",
        )
        self.other_user = User.objects.create_user(
            username="otheruser",
            email="other@example.com",
            password="Password123!",
        )

        self.property = Property.objects.create(
            owner=self.user,
            name="User Property",
            address="789 Pine St",
            location=Point(12.0, 34.0),
            property_type="RESIDENTIAL",
            building_value=300000.0,
            contents_value=100000.0,
        )

        self.other_property = Property.objects.create(
            owner=self.other_user,
            name="Other Property",
            address="101 Oak St",
            location=Point(56.0, 78.0),
            property_type="COMMERCIAL",
            building_value=800000.0,
            contents_value=400000.0,
        )

    def test_create_assessment_valid(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.post(
            "/assessments/",
            {"property_id": self.property.id},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_202_ACCEPTED)

    def test_create_assessment_unauthorized_property(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.post(
            "/assessments/",
            {"property_id": self.other_property.id},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
