from django.contrib.auth.models import AbstractUser
from django.db import models

# Create your models here.

class CustomUser(AbstractUser):
    USER_TYPES = (
        ('user', 'User'),
        ('admin', 'Admin'),
        ('super_admin', 'Super Admin'),
    )
    
    user_type = models.CharField(max_length=20, choices=USER_TYPES, default='user')
    is_approved = models.BooleanField(default=False)
    approval_date = models.DateTimeField(null=True, blank=True)
    approved_by = models.ForeignKey(
        'self', 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True,
        related_name='approved_users'
    )
    
    def __str__(self):
        return self.username
