# Generated by Django 3.2.8 on 2021-10-21 02:44

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('nursing_knowledges', '0009_auto_20211021_0221'),
    ]

    operations = [
        migrations.CreateModel(
            name='NursingKnowledge',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100)),
                ('type', models.CharField(choices=[('DISEASE', 'Disease'), ('DIAGNOSIS', 'Diagnosis')], max_length=20)),
                ('connection', models.ManyToManyField(blank=True, related_name='_nursing_knowledges_nursingknowledge_connection_+', to='nursing_knowledges.NursingKnowledge')),
            ],
        ),
        migrations.RemoveField(
            model_name='diagnosis',
            name='diseases',
        ),
        migrations.RemoveField(
            model_name='disease',
            name='diagnoses',
        ),
        migrations.RemoveField(
            model_name='diseasediagnoses',
            name='diagnosis',
        ),
        migrations.RemoveField(
            model_name='diseasediagnoses',
            name='disease',
        ),
        migrations.DeleteModel(
            name='DiagnosisDiseases',
        ),
        migrations.DeleteModel(
            name='Disease',
        ),
        migrations.DeleteModel(
            name='DiseaseDiagnoses',
        ),
        migrations.AlterField(
            model_name='interventionrelation',
            name='diagnosis',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='diagnosis_relations', to='nursing_knowledges.nursingknowledge'),
        ),
        migrations.AlterField(
            model_name='interventionrelation',
            name='disease',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='disease_relations', to='nursing_knowledges.nursingknowledge'),
        ),
        migrations.DeleteModel(
            name='Diagnosis',
        ),
    ]
