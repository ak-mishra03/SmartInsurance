from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.

class User(AbstractUser):
    email = models.EmailField(
            unique=True,
            )

    phone_number = models.CharField(
            max_length=20,
            blank=True,
            )
    company_name = models.CharField(
            max_length=200,
            blank=True,
            )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.username
