from django.urls import path
from .views import (
    RegisterView, 
    SocialAuthView, 
    ApproveAdminView, 
    PendingAdminsView,
    CheckApprovalStatus
)

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('social-auth/', SocialAuthView.as_view(), name='social-auth'),
    path('approve-admin/<int:user_id>/', ApproveAdminView.as_view(), name='approve-admin'),
    path('pending-admins/', PendingAdminsView.as_view(), name='pending-admins'),
    path('check-approval/', CheckApprovalStatus.as_view(), name='check-approval'),
]