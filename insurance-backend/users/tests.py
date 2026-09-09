from django.contrib.auth import get_user_model
from django.test import TestCase
from rest_framework import status
from rest_framework.test import APIClient

from users.services import UserService

User = get_user_model()


class UserServiceTestCase(TestCase):
    def test_create_user_service(self):
        user = UserService.create_user(
            {
                "username": "serviceuser",
                "email": "service@example.com",
                "password": "ComplexPassword123!",
                "phone_number": "+1234567890",
                "company_name": "Acme Corp",
            }
        )
        self.assertEqual(user.username, "serviceuser")
        self.assertEqual(user.email, "service@example.com")
        self.assertEqual(user.company_name, "Acme Corp")
        self.assertTrue(user.check_password("ComplexPassword123!"))


class UserAPITestCase(TestCase):
    def setUp(self):
        self.client = APIClient()

    def test_register_user_success(self):
        response = self.client.post(
            "/users/register/",
            {
                "username": "newuser",
                "email": "newuser@example.com",
                "password": "StrongPassword123!",
                "phone_number": "555-0199",
            },
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn("id", response.data)
        self.assertNotIn("password", response.data)

    def test_me_view_unauthenticated(self):
        response = self.client.get("/users/me/")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_me_view_authenticated(self):
        user = User.objects.create_user(
            username="meuser",
            email="meuser@example.com",
            password="Password123!",
        )
        self.client.force_authenticate(user=user)
        response = self.client.get("/users/me/")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["username"], "meuser")
        self.assertEqual(response.data["email"], "meuser@example.com")
        self.assertNotIn("password", response.data)
