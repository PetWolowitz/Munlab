from rest_framework.routers import DefaultRouter
from .views import AttivitaViewSet, DisponibilitaViewSet, PrenotazioneViewSet

router = DefaultRouter()
router.register(r'attivita', AttivitaViewSet, basename='attivita')
router.register(r'disponibilita', DisponibilitaViewSet, basename='disponibilita')
router.register(r'prenotazioni', PrenotazioneViewSet, basename='prenotazione')

urlpatterns = router.urls
