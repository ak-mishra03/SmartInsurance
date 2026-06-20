# claims/models.py

from django.db import models
from properties.models import Property


class Claim(models.Model):

    class Status(models.TextChoices):
        PENDING = "PENDING", "Pending"
        UNDER_REVIEW = "UNDER_REVIEW", "Under Review"
        APPROVED = "APPROVED", "Approved"
        REJECTED = "REJECTED", "Rejected"

    property = models.ForeignKey(
        Property,
        on_delete=models.CASCADE,
        related_name="claims",
    )

    incident_date = models.DateField()

    description = models.TextField()

    claim_amount = models.DecimalField(
        max_digits=12,
        decimal_places=2,
    )

    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.PENDING,
    )

    created_at = models.DateTimeField(auto_now_add=True)
