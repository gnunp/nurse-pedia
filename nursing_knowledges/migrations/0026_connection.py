# Generated by Django 3.2.8 on 2021-11-20 06:54

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('nursing_knowledges', '0025_remove_diagnosis_diseases'),
    ]

    operations = [
        migrations.CreateModel(
            name='Connection',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('diagnosis', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='nursing_knowledges.diagnosis')),
                ('disease', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='nursing_knowledges.disease')),
            ],
        ),
    ]