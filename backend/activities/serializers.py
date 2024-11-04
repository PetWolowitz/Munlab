from rest_framework import serializers
from .models import Attivita, Booking

class AttivitaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Attivita
        fields = '__all__'

class BookingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Booking
        fields = '__all__'