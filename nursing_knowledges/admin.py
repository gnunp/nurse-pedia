from django.contrib import admin
from .models import (
    DiseaseLargeCategory,
    DiseaseMediumCategory,
    DiseaseSmallCategory,
    Diagnosis,
    DiagnosisToOther,
    DiagnosisInterventionAlpha,
    KnowledgeEditHistory,
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

@admin.register(DiseaseSmallCategory)
class DiseaseSmallCategory(admin.ModelAdmin):
    """
    간호 질병 소분류 Model Admin
    """
    pass

class DiagnosisInterventionAlphaInline(admin.TabularInline):
    model = DiagnosisInterventionAlpha

@admin.register(Diagnosis)
class DiagnosisAdmin(admin.ModelAdmin):
    """
    간호 진단 Model Admin
    """
    inlines = [
        DiagnosisInterventionAlphaInline,
    ]
    list_display = ('name', 'intervention_content')

@admin.register(DiagnosisToOther)
class DiagnosisToOtherAdmin(admin.ModelAdmin):
    """
    질병(중분류 or 대분류) <--> 진단의 연결관계를 나타내는 Model Admin
    """
    pass

@admin.register(KnowledgeEditHistory)
class KnowledgeEditHistoryAdmin(admin.ModelAdmin):
    """
    질병, 진단을 수정한 사람의 정보와, 시간대가 나와있는 Model Admin
    """
    pass