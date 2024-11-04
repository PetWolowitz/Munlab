# Generated by Django 5.1.2 on 2024-11-04 11:57

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("activities", "0001_initial"),
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
                ("titolo", models.CharField(max_length=100)),
                ("descrizione", models.TextField()),
                ("tipo", models.CharField(max_length=50)),
                ("durata", models.DurationField()),
                ("data_inizio", models.DateField()),
                ("data_fine", models.DateField(blank=True, null=True)),
            ],
        ),
        migrations.AlterField(
            model_name="booking",
            name="status",
            field=models.CharField(
                choices=[
                    ("confirmed", "Confirmed"),
                    ("pending", "Pending"),
                    ("canceled", "Canceled"),
                ],
                max_length=50,
            ),
        ),
        migrations.AlterField(
            model_name="booking",
            name="activity",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE, to="activities.attivita"
            ),
        ),
        migrations.DeleteModel(
            name="Activity",
        ),
    ]