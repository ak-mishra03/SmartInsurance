# users/serializers.py

from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers

from .models import User
from .services import UserService


class RegisterSerializer(serializers.ModelSerializer):
    """
    Serializer for User registration. Validates strong password rules and delegates user creation.
    """

    password = serializers.CharField(
        write_only=True,
        min_length=8,
    )

    class Meta:
        model = User
        fields = (
            "id",
            "username",
            "email",
            "password",
            "phone_number",
            "company_name",
        )

    def validate_password(self, value: str) -> str:
        validate_password(value)
        return value

    def create(self, validated_data: dict) -> User:
        return UserService.create_user(validated_data)


class UserSerializer(serializers.ModelSerializer):
    """
    Read-only serializer for returning user profile details (e.g. /me endpoint).
    """

    class Meta:
        model = User
        fields = (
            "id",
            "username",
            "email",
            "phone_number",
            "company_name",
            "created_at",
            "updated_at",
        )
        read_only_fields = fields
