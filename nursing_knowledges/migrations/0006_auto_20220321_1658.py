# Generated by Django 3.2.8 on 2022-03-21 07:58

from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('nursing_knowledges', '0005_diagnosisrelateddiagnosis_intervention_content'),
    ]

    operations = [
        migrations.AddField(
            model_name='diagnosissmallcategory',
            name='like_users',
            field=models.ManyToManyField(blank=True, related_name='diagnosis', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='diseasesmallcategory',
            name='like_users',
            field=models.ManyToManyField(blank=True, related_name='disease', to=settings.AUTH_USER_MODEL),
        ),
    ]
