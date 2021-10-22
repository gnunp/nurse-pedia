# Generated by Django 3.2.8 on 2021-10-21 04:34

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('nursing_knowledges', '0013_alter_interventionrelation_connection'),
    ]

    operations = [
        migrations.AlterField(
            model_name='diagnosis',
            name='name',
            field=models.CharField(max_length=100, unique=True),
        ),
        migrations.AlterField(
            model_name='disease',
            name='name',
            field=models.CharField(max_length=100, unique=True),
        ),
        migrations.AlterField(
            model_name='interventioncontent',
            name='content',
            field=models.TextField(max_length=500, unique=True),
        ),
    ]