# Generated by Django 3.2.8 on 2022-04-11 19:59

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('nursing_knowledges', '0030_auto_20220411_1951'),
    ]

    operations = [
        migrations.AddField(
            model_name='diagnosissmallcategoryedithistory',
            name='rollback_version',
            field=models.PositiveIntegerField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='diseasesmallcategoryedithistory',
            name='rollback_version',
            field=models.PositiveIntegerField(blank=True, null=True),
        ),
    ]
