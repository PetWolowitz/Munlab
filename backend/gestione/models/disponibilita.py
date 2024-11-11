from django.db import models
from .attivita import Attivita

class Disponibilita(models.Model):
    attivita = models.ForeignKey(Attivita, on_delete=models.CASCADE)
    data = models.DateField()
    posti_disponibili = models.PositiveIntegerField(default=0)
    
  

    def __str__(self):
        return f"{self.attivita.nome} disponibile il {self.data} - posti disponibili: {self.posti_disponibili}"
