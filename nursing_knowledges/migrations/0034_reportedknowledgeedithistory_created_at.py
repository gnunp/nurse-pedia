# Generated by Django 3.2.8 on 2022-04-12 00:34

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('nursing_knowledges', '0033_reportedknowledgeedithistory'),
    ]

    operations = [
        migrations.AddField(
            model_name='reportedknowledgeedithistory',
            name='created_at',
            field=models.DateTimeField(auto_now_add=True, null=True),
        ),
    ]
