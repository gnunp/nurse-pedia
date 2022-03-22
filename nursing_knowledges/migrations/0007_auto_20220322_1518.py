# Generated by Django 3.2.8 on 2022-03-22 06:18

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('nursing_knowledges', '0006_auto_20220321_1658'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='diagnosissmallcategory',
            name='like_users',
        ),
        migrations.AlterField(
            model_name='diagnosissmallcategory',
            name='diagnosis_medium_category',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='diagnosis_small_categories', to='nursing_knowledges.diagnosismediumcategory'),
        ),
        migrations.AlterField(
            model_name='diseasesmallcategory',
            name='like_users',
            field=models.ManyToManyField(blank=True, related_name='like_diseases', to=settings.AUTH_USER_MODEL),
        ),
    ]
