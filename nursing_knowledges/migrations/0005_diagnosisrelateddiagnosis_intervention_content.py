# Generated by Django 3.2.8 on 2022-03-18 08:22

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('nursing_knowledges', '0004_diagnosisrelateddiagnosis'),
    ]

    operations = [
        migrations.AddField(
            model_name='diagnosisrelateddiagnosis',
            name='intervention_content',
            field=models.TextField(blank=True, default='', max_length=3000),
        ),
    ]