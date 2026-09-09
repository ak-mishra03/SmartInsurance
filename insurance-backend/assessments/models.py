# assessments/models.py

from django.db import models
from properties.models import Property


class Assessment(models.Model):
    class Status(models.TextChoices):
        PENDING = "PENDING", "Pending"
        RUNNING = "RUNNING", "Running"
        COMPLETED = "COMPLETED", "Completed"
        FAILED = "FAILED", "Failed"

    class Recommendation(models.TextChoices):
        AUTO_APPROVE = "AUTO_APPROVE", "Auto Approve"
        MANUAL_REVIEW = "MANUAL_REVIEW", "Manual Review"
        AUTO_REJECT = "AUTO_REJECT", "Auto Reject"

    class Severity(models.TextChoices):
        MINOR = "MINOR", "Minor"
        MODERATE = "MODERATE", "Moderate"
        MAJOR = "MAJOR", "Major"
        SEVERE = "SEVERE", "Severe"

    property = models.ForeignKey(
        Property,
        on_delete=models.CASCADE,
        related_name="assessments",
    )

    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.PENDING,
        db_index=True,
    )

    flooded_area_m2 = models.FloatField(
        null=True,
        blank=True,
    )

    flooded_area_percent = models.FloatField(
        null=True,
        blank=True,
    )

    severity = models.CharField(
        max_length=20,
        choices=Severity.choices,
        blank=True,
        db_index=True,
    )

    recommendation = models.CharField(
        max_length=30,
        choices=Recommendation.choices,
        blank=True,
        db_index=True,
    )

    raw_response = models.JSONField(
        default=dict,
        blank=True,
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
        db_index=True,
    )

    updated_at = models.DateTimeField(
        auto_now=True,
    )

    completed_at = models.DateTimeField(
        null=True,
        blank=True,
    )

    class Meta:
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["property", "-created_at"]),
            models.Index(fields=["status", "created_at"]),
        ]

    def __str__(self):
        return f"Assessment #{self.id} - {self.property.name}"
