# Generated by Django 3.2.8 on 2022-03-22 06:47

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('nursing_knowledges', '0010_auto_20220322_1531'),
    ]

    operations = [
        migrations.RenameModel(
            old_name='DiagnosisToOther',
            new_name='DiagnosisToDisease',
        ),
    ]
