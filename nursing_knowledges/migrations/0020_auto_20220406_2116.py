# Generated by Django 3.2.8 on 2022-04-06 21:16

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('nursing_knowledges', '0019_auto_20220406_2110'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='diseasesmallcategoryedithistory',
            name='disease_large_category',
        ),
        migrations.RemoveField(
            model_name='diseasesmallcategoryedithistory',
            name='disease_medium_category',
        ),
        migrations.RemoveField(
            model_name='diseasesmallcategoryedithistory',
            name='name',
        ),
    ]
