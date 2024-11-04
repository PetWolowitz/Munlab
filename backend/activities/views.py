from rest_framework import viewsets
from .models import Attivita, Booking
from .serializers import AttivitaSerializer, BookingSerializer

class AttivitaViewSet(viewsets.ModelViewSet):
    queryset = Attivita.objects.all()
    serializer_class = AttivitaSerializer

class BookingViewSet(viewsets.ModelViewSet):
    queryset = Booking.objects.all()
    serializer_class = BookingSerializer