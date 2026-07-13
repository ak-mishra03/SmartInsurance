# policies/models.py

from django.db import models
from properties.models import Property


class Policy(models.Model):

    class Plan(models.TextChoices):
        BASIC = "BASIC", "Basic"
        PREMIUM = "PREMIUM", "Premium"
        ENTERPRISE = "ENTERPRISE", "Enterprise"

    property = models.OneToOneField(
        Property,
        on_delete=models.CASCADE,
        related_name="policy",
    )

    plan = models.CharField(
        max_length=20,
        choices=Plan.choices,
    )

    premium = models.DecimalField(
        max_digits=10,
        decimal_places=2,
    )

    start_date = models.DateField()

    end_date = models.DateField()

    active = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.property.name} - {self.plan}"
