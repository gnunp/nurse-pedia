# Generated by Django 3.2.8 on 2022-03-22 06:30

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('nursing_knowledges', '0008_auto_20220322_1519'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='diseasesmallcategory',
            name='like_users',
        ),
    ]
