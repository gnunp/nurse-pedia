# Generated by Django 3.2.8 on 2022-03-03 19:27

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('nursing_knowledges', '0048_diagnosis_related_diagnoses'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='diagnosis',
            name='related_diagnoses',
        ),
        migrations.AddField(
            model_name='diagnosis',
            name='related_diagnoses',
            field=models.ManyToManyField(related_name='_nursing_knowledges_diagnosis_related_diagnoses_+', to='nursing_knowledges.Diagnosis'),
        ),
    ]
