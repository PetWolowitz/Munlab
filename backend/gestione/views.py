from django.shortcuts import render
from rest_framework import viewsets, permissions
from .models import Attivita, Prenotazione, Disponibilita
from .serializers import AttivitaSerializer, DisponibilitaSerializer, PrenotazioneSerializer

class AttivitaViewSet(viewsets.ModelViewSet):
    queryset = Attivita.objects.all()
    serializer_class = AttivitaSerializer
    permission_classes = [permissions.AllowAny] # Accesso aperto a tutti

class DisponibilitaViewSet(viewsets.ModelViewSet):
    queryset = Disponibilita.objects.all()
    serializer_class = DisponibilitaSerializer
    permission_classes = [permissions.AllowAny]

class PrenotazioneViewSet(viewsets.ModelViewSet):
    queryset = Prenotazione.objects.all()
    serializer_class = PrenotazioneSerializer
    permission_classes = [permissions.IsAuthenticated]  # accesso solo a utenti autenticati


