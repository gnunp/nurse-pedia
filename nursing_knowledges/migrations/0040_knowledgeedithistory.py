# Generated by Django 3.2.8 on 2022-02-23 10:20

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('nursing_knowledges', '0039_diseasesmallcategory_cause'),
    ]

    operations = [
        migrations.CreateModel(
            name='KnowledgeEditHistory',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('diagnosis', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='nursing_knowledges.diagnosis')),
                ('disease', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='nursing_knowledges.diseasesmallcategory')),
                ('editor', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
