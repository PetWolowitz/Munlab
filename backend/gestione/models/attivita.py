from django.db import models

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
    immagine = models.ImageField(upload_to='attivita_images/', null=True, blank=True)
    costo = models.DecimalField(max_digits=6, decimal_places=2, default=0.00)
    durata = models.DurationField()
    posti_massimi = models.PositiveIntegerField(default=0)
    tipo = models.CharField(max_length=3, choices=TIPO_Attivita)

    class Meta:
        verbose_name = 'Attività'
        verbose_name_plural = 'Attività'

    def __str__(self):
        return self.nome
