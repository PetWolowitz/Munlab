# Generated by Django 5.1.2 on 2024-11-11 14:24

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("gestione", "0002_alter_attivita_options_attivita_immagine"),
    ]

    operations = [
        migrations.AlterField(
            model_name="attivita",
            name="tipo",
            field=models.CharField(
                choices=[
                    ("DID", "Didattica"),
                    ("DOM", "Laboratori/Visite domenicali "),
                    ("ALT", "Feste ed Eventi"),
                ],
                max_length=3,
            ),
        ),
    ]