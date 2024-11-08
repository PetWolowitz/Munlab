from rest_framework.routers import DefaultRouter
from .views import AttivitaViewSet, DisponibilitaViewSet, PrenotazioneViewSet

router = DefaultRouter()
router.register(r'activities', AttivitaViewSet, basename='api-activities')
router.register(r'disponibilita', DisponibilitaViewSet, basename='api-disponibilita')
router.register(r'prenotazioni', PrenotazioneViewSet, basename='api-prenotazioni')

urlpatterns = router.urls