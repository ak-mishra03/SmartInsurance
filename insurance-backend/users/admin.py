# users/admin.py

from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    """
    Custom Admin interface for User model inheriting from Django BaseUserAdmin.
    """

    list_display = (
        "username",
        "email",
        "company_name",
        "phone_number",
        "is_staff",
        "created_at",
    )
    list_filter = ("is_staff", "is_superuser", "is_active", "created_at")
    search_fields = ("username", "email", "company_name", "phone_number")
    ordering = ("-created_at",)

    fieldsets = BaseUserAdmin.fieldsets + (
        ("Additional Info", {"fields": ("phone_number", "company_name")}),
    )
    add_fieldsets = BaseUserAdmin.add_fieldsets + (
        ("Additional Info", {"fields": ("phone_number", "company_name")}),
    )
