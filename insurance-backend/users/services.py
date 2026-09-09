# users/services.py

from typing import Any, Dict
from django.contrib.auth import get_user_model

User = get_user_model()


class UserService:
    """
    Domain service for managing User registration and profile lifecycle operations.
    """

    @classmethod
    def create_user(cls, validated_data: Dict[str, Any]) -> User:
        """
        Creates a new User account using Django's hashed password creation.
        """
        return User.objects.create_user(
            username=validated_data["username"],
            email=validated_data["email"],
            password=validated_data["password"],
            phone_number=validated_data.get("phone_number", ""),
            company_name=validated_data.get("company_name", ""),
            first_name=validated_data.get("first_name", ""),
            last_name=validated_data.get("last_name", ""),
        )
