from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action, api_view
from rest_framework.response import Response
from django.shortcuts import redirect
from django.contrib import messages
from .models import Attivita, Prenotazione, Disponibilita
from .serializers import AttivitaSerializer, PrenotazioneSerializer, DisponibilitaSerializer


class AttivitaViewSet(viewsets.ModelViewSet):
    queryset = Attivita.objects.all()
    serializer_class = AttivitaSerializer
    permission_classes = [permissions.AllowAny]  # Accesso aperto a tutti


class DisponibilitaViewSet(viewsets.ModelViewSet):
    queryset = Disponibilita.objects.all()
    serializer_class = DisponibilitaSerializer
    permission_classes = [permissions.AllowAny]


class PrenotazioneViewSet(viewsets.ModelViewSet):
    queryset = Prenotazione.objects.all()
    serializer_class = PrenotazioneSerializer
    permission_classes = [permissions.IsAuthenticated]  # Accesso solo a utenti autenticati

    @action(detail=True, methods=['patch'], url_path='approve', permission_classes=[permissions.IsAdminUser])
    def approve_booking(self, request, pk=None):
        """
        Endpoint per approvare una prenotazione.
        Solo gli amministratori possono approvare le prenotazioni.
        """
        try:
            prenotazione = self.get_object()
            prenotazione.status = 'CON'  # Aggiorna lo stato della prenotazione a 'Confermata'
            prenotazione.save()
            return Response({'status': 'Prenotazione confermata'}, status=status.HTTP_200_OK)
        except Prenotazione.DoesNotExist:
            return Response({'error': 'Prenotazione non trovata'}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=True, methods=['delete'], url_path='cancel', permission_classes=[permissions.IsAdminUser])
    def cancel_booking(self, request, pk=None):
        """
        Endpoint per cancellare una prenotazione.
        Solo gli amministratori possono cancellare le prenotazioni.
        """
        try:
            prenotazione = self.get_object()
            prenotazione.delete()
            return Response({'status': 'Prenotazione cancellata'}, status=status.HTTP_200_OK)
        except Prenotazione.DoesNotExist:
            return Response({'error': 'Prenotazione non trovata'}, status=status.HTTP_404_NOT_FOUND)


@api_view(['GET'])
def check_approval(request):
    """
    Endpoint per controllare se l'utente è stato approvato.
    Restituisce lo stato 'approved' o 'pending' in base al valore di requires_approval.
    """
    user = request.user
    if user.is_authenticated:
        if getattr(user, 'requires_approval', True):
            return Response({'status': 'pending'}, status=status.HTTP_200_OK)
        else:
            return Response({'status': 'approved'}, status=status.HTTP_200_OK)
    return Response({'error': 'Non autenticato'}, status=status.HTTP_401_UNAUTHORIZED)


@api_view(['POST'])
def verify_token(request):
    """
    Endpoint per verificare il token JWT.
    """
    # Esempio base di come verificare il token
    # Usa le librerie di DRF JWT per una gestione completa
    token = request.data.get('token')
    if token:
        # Verifica del token JWT (richiede un metodo specifico in base alla tua configurazione JWT)
        # Qui sotto va inserita la logica di verifica del token JWT
        return Response({'status': 'Token valido'}, status=status.HTTP_200_OK)
    return Response({'error': 'Token mancante o non valido'}, status=status.HTTP_400_BAD_REQUEST)
