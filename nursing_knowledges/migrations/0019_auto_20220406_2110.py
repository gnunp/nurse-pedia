# Generated by Django 3.2.8 on 2022-04-06 21:10

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('nursing_knowledges', '0018_auto_20220406_2102'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='diseasesmallcategoryedithistory',
            name='disease_small_category',
        ),
        migrations.AddField(
            model_name='diseasesmallcategoryedithistory',
            name='original_disease_small_category',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='disease_small_category_edit_histories', to='nursing_knowledges.diseasesmallcategory'),
        ),
    ]
