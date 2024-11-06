# Generated by Django 5.1.2 on 2024-11-06 10:57

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("gestione", "0001_initial"),
    ]

    operations = [
        migrations.AlterModelOptions(
            name="attivita",
            options={"verbose_name": "Attività", "verbose_name_plural": "Attività"},
        ),
        migrations.AddField(
            model_name="attivita",
            name="immagine",
            field=models.ImageField(
                blank=True, null=True, upload_to="attivita_images/"
            ),
        ),
    ]