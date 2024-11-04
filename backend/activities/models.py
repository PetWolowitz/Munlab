from django.db import models
from users.models import CustomUser

class Attivita(models.Model):
    # Definisci le opzioni per il tipo di attività
    TIPO_Attivita = [
        ('EDU', "Educativa"),
        ('DOM', "Domenicale"),
        ('ALT', "Altro"),
    ]

    # Campi del modello Attivita
    nome = models.CharField(max_length=100)
    descrizione = models.TextField()
    costo = models.DecimalField(max_digits=6, decimal_places=2, default=0.00)

    durata = models.DurationField()
    posti_massimi = models.PositiveIntegerField(default=0)
    tipo = models.CharField(max_length=3, choices=TIPO_Attivita)

    def __str__(self):
        return self.nome

class Booking(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    activity = models.ForeignKey(Attivita, on_delete=models.CASCADE)
    date = models.DateField()
    status = models.CharField(max_length=50, choices=[('confirmed', 'Confirmed'), ('pending', 'Pending'), ('canceled', 'Canceled')])

    def __str__(self):
        return f"{self.user.username} - {self.activity.titolo} on {self.date}"