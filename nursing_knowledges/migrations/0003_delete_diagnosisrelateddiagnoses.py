# Generated by Django 3.2.8 on 2022-03-18 08:07

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('nursing_knowledges', '0002_remove_diagnosissmallcategory_related_diagnoses'),
    ]

    operations = [
        migrations.DeleteModel(
            name='DiagnosisRelatedDiagnoses',
        ),
    ]
