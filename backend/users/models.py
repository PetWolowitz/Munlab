from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils import timezone
from django.conf import settings

class CustomUser(AbstractUser):
    USER_TYPE_CHOICES = (
        ('user', 'User'),
        ('admin', 'Admin'),
        ('super_admin', 'Super Admin'),
    )
    
    ROLE_CHOICES = (
        ('manager', 'Manager'),
        ('operator', 'Operatore'),
        ('guide', 'Guida Museale'),
    )

    DEPARTMENT_CHOICES = (
        ('education', 'Educazione'),
        ('operations', 'Operazioni'),
        ('management', 'Management'),
    )

    email = models.EmailField(unique=True)
    user_type = models.CharField(
        max_length=20, 
        choices=USER_TYPE_CHOICES,
        default='user'
    )
    role = models.CharField(
        max_length=20,
        choices=ROLE_CHOICES,
        null=True,
        blank=True
    )
    department = models.CharField(
        max_length=20,
        choices=DEPARTMENT_CHOICES,
        null=True,
        blank=True
    )
    is_approved = models.BooleanField(default=False)
    approval_date = models.DateTimeField(null=True, blank=True)
    approved_by = models.ForeignKey(
        'self',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='approved_users'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        swappable = 'AUTH_USER_MODEL'
        verbose_name = 'User'
        verbose_name_plural = 'Users'

    def approve(self, approved_by):
        self.is_approved = True
        self.approved_by = approved_by
        self.approval_date = timezone.now()
        self.save()

    @property
    def is_admin_approved(self):
        return self.user_type == 'admin' and self.is_approved

    def __str__(self):
        return self.email