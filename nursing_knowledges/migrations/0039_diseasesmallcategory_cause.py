# Generated by Django 3.2.8 on 2021-12-26 00:10

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('nursing_knowledges', '0038_auto_20211226_0908'),
    ]

    operations = [
        migrations.AddField(
            model_name='diseasesmallcategory',
            name='cause',
            field=models.TextField(blank=True, default='', max_length=3000),
        ),
    ]
