from django.contrib import admin
from .models import Disease, Diagnosis

# Register your models here.

@admin.register(Disease)
class DiseaseAdmin(admin.ModelAdmin):
    """
    간호 질병 Model Admin
    """
    pass

@admin.register(Diagnosis)
class DiagnosisAdmin(admin.ModelAdmin):
    """
    간호 진단 Model Admin
    """
    pass
