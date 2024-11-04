from rest_framework.routers import DefaultRouter
from .views import AttivitaViewSet, BookingViewSet

router = DefaultRouter()
router.register(r'attivita', AttivitaViewSet, basename='attivita')
router.register(r'bookings', BookingViewSet, basename='booking')

urlpatterns = router.urls