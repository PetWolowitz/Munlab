from django.urls import path
from .views import (
    RegisterView, 
    LoginView,
    ValidateTokenView,
    ApproveAdminView, 
    PendingAdminsView,
    CheckApprovalStatus
)

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('validate-token/', ValidateTokenView.as_view(), name='validate-token'),
    path('approve-admin/<int:user_id>/', ApproveAdminView.as_view(), name='approve-admin'),
    path('pending-admins/', PendingAdminsView.as_view(), name='pending-admins'),
    path('check-approval/', CheckApprovalStatus.as_view(), name='check-approval'),
]