# Generated by Django 3.2.8 on 2022-04-07 22:54

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('nursing_knowledges', '0028_diagnosisrelateddiagnosisedithistory'),
    ]

    operations = [
        migrations.CreateModel(
            name='DiseaseSmallCategoryRelatedDiagnosisEditHistory',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('diagnosis_small_category', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='nursing_knowledges.diagnosissmallcategory')),
                ('disease_small_category_edit_history', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='disease_small_category_related_diagnosis_edit_histories', to='nursing_knowledges.diseasesmallcategoryedithistory')),
            ],
        ),
        migrations.DeleteModel(
            name='DiseaseSmallCategoryEditHistoryRelatedDiagnosis',
        ),
    ]
