# Generated by Django 3.2.8 on 2022-03-03 19:17

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0003_alter_user_kakao_id'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='kakao_id',
            field=models.PositiveIntegerField(blank=True, null=True, unique=True),
        ),
    ]
