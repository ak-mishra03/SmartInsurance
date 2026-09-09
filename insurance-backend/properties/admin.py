# properties/admin.py

from django.contrib.gis import admin
from .models import Property


@admin.register(Property)
class PropertyAdmin(admin.GISModelAdmin):
    list_display = ("name", "property_type", "owner", "insured_value", "created_at")
    list_filter = ("property_type", "created_at")
    search_fields = ("name", "address", "owner__username", "owner__email")
