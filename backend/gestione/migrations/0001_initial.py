# Generated by Django 5.1.2 on 2024-11-04 15:27

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):
    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name="Attivita",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("nome", models.CharField(max_length=100)),
                ("descrizione", models.TextField()),
                (
                    "costo",
                    models.DecimalField(decimal_places=2, default=0.0, max_digits=6),
                ),
                ("durata", models.DurationField()),
                ("posti_massimi", models.PositiveIntegerField(default=0)),
                (
                    "tipo",
                    models.CharField(
                        choices=[
                            ("EDU", "Educativa"),
                            ("DOM", "Domenicale"),
                            ("ALT", "Altro"),
                        ],
                        max_length=3,
                    ),
                ),
            ],
        ),
        migrations.CreateModel(
            name="Disponibilita",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("data", models.DateField()),
                ("posti_disponibili", models.PositiveIntegerField()),
                (
                    "attivita",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to="gestione.attivita",
                    ),
                ),
            ],
        ),
        migrations.CreateModel(
            name="Prenotazione",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "status",
                    models.CharField(
                        choices=[
                            ("CON", "Confermata"),
                            ("ATT", "In Attesa"),
                            ("CAN", "Cancellata"),
                        ],
                        default="ATT",
                        max_length=50,
                    ),
                ),
                (
                    "disponibilita",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="prenotazioni",
                        to="gestione.disponibilita",
                    ),
                ),
                (
                    "user",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
            ],
        ),
    ]
