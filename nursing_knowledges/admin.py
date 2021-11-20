from django.contrib import admin
from .models import (
    Disease,
    Diagnosis,
    Connection,
    DiseaseLargeCategory,
    DiseaseMediumCategory
)

@admin.register(DiseaseLargeCategory)
class DiseaseLargeCategoryAdmin(admin.ModelAdmin):
    """
    간호 질병 대분류 Model Admin
    """
    pass

@admin.register(DiseaseMediumCategory)
class DiseaseMediumCategoryAdmin(admin.ModelAdmin):
    """
    간호 질병 중분류 Model Admin
    """
    pass

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

@admin.register(Connection)
class ConnectionAdmin(admin.ModelAdmin):
    """
    노드의 연결관계를 나타내는 Model Admin
    """
    pass