# Generated by Django 3.2.8 on 2022-03-18 08:02

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('nursing_knowledges', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='diagnosissmallcategory',
            name='related_diagnoses',
        ),
    ]
