from rest_framework.routers import DefaultRouter
from .views import AttivitaViewSet, DisponibilitaViewSet, PrenotazioneViewSet, check_approval
from django.urls import path, include

router = DefaultRouter()
router.register(r'attivita', AttivitaViewSet, basename='api-attivita')
router.register(r'disponibilita', DisponibilitaViewSet, basename='api-disponibilita')
router.register(r'prenotazioni', PrenotazioneViewSet, basename='api-prenotazioni')

urlpatterns = [
    path('api/', include(router.urls)),  # Registra le rotte del router sotto 'api/'
    path('api/users/check-approval/', check_approval, name='check-approval'),
]
