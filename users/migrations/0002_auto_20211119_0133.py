# Generated by Django 3.2.8 on 2021-11-18 16:33

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='is_kakao',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='user',
            name='kakao_id',
            field=models.PositiveIntegerField(null=True),
        ),
    ]
