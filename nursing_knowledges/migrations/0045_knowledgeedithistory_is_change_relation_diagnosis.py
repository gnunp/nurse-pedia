# Generated by Django 3.2.8 on 2022-02-23 11:13

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('nursing_knowledges', '0044_remove_knowledgeedithistory_is_change_relation_diagnosis'),
    ]

    operations = [
        migrations.AddField(
            model_name='knowledgeedithistory',
            name='is_change_relation_diagnosis',
            field=models.BooleanField(default=False),
        ),
    ]