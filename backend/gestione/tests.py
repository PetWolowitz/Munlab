from django.test import TestCase
from datetime import timedelta
from .models import Attivita, Prenotazione, Disponibilita
from users.models import CustomUser

class PrenotazioneTestCase(TestCase):

    def setUp(self):
        # Creazione di un utente e di una attività di esempio
        self.user = CustomUser.objects.create_user(username='testuser', password='12345')
        self.attivita = Attivita.objects.create(
            nome='Laboratorio Argilla', 
            descrizione='Un laboratorio per creare figure in argilla', 
            costo=10.00, 
            durata=timedelta(hours=1),  # Usa timedelta per definire la durata
            posti_massimi=10, 
            tipo='LAB'
        )
        self.disponibilita = Disponibilita.objects.create(
            attivita=self.attivita,
            data='2024-11-20'
        )
        self.prenotazione = Prenotazione.objects.create(
            user=self.user,
            disponibilita=self.disponibilita,
            status='ATT'
        )

    # Test per verificare la creazione della prenotazione
    def test_create_prenotazione(self):
        self.assertEqual(self.prenotazione.user.username, 'testuser')
        self.assertEqual(self.prenotazione.status, 'ATT')

    # Test per verificare l'approvazione della prenotazione
    def test_approve_prenotazione(self):
        self.prenotazione.status = 'CON'
        self.prenotazione.save()
        self.assertEqual(self.prenotazione.status, 'CON')
