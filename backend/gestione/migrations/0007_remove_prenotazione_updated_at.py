# Generated by Django 5.1.2 on 2024-11-11 15:35

from django.db import migrations


class Migration(migrations.Migration):
    dependencies = [
        ("gestione", "0006_alter_prenotazione_created_at"),
    ]

    operations = [
        migrations.RemoveField(
            model_name="prenotazione",
            name="updated_at",
        ),
    ]