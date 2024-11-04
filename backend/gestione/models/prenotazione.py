from django.db import models
from users.models import CustomUser
from .disponibilita import Disponibilita

class Prenotazione(models.Model):
    STATO_PRENOTAZIONE = [
        ('CON', 'Confermata'),
        ('ATT', 'In Attesa'),
        ('CAN', 'Cancellata'),
    ]

    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    disponibilita = models.ForeignKey(Disponibilita, on_delete=models.CASCADE, related_name='prenotazioni')
    status = models.CharField(max_length=50, choices=STATO_PRENOTAZIONE, default='ATT')

    def __str__(self):
        return f"{self.user.username} - {self.disponibilita.attivita.nome} on {self.disponibilita.data}"
