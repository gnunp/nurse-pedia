# Generated by Django 3.2.8 on 2022-04-06 20:54

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('nursing_knowledges', '0016_alter_diseasesmallcategoryedithistory_version'),
    ]

    operations = [
        migrations.AlterField(
            model_name='diseasesmallcategoryedithistory',
            name='version',
            field=models.PositiveIntegerField(),
        ),
    ]
