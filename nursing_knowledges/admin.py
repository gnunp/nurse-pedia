from django.contrib import admin
from .models import (
    DiagnosisLargeCategory,
    DiagnosisMediumCategory,
    DiagnosisRelatedDiagnoses,
    DiseaseLargeCategory,
    DiseaseMediumCategory,
    DiseaseSmallCategory,
    DiagnosisSmallCategory,
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

@admin.register(DiagnosisLargeCategory)
class DiagnosisLargeCategory(admin.ModelAdmin):
    """
    간호 진단 대분류 Model Admin
    """
    pass

@admin.register(DiagnosisMediumCategory)
class DiagnosisMediumCategoryAdmin(admin.ModelAdmin):
    """
    간호 진단 중분류 Model Admin
    """
    pass


class DiagnosisInterventionAlphaInline(admin.TabularInline):
    model = DiagnosisInterventionAlpha
    extra = 1

class DiagnosisRelatedDiagnosesInline(admin.TabularInline):
    model = DiagnosisRelatedDiagnoses
    extra = 1
    fk_name = "from_diagnosis"

@admin.register(DiagnosisSmallCategory)
class DiagnosisAdmin(admin.ModelAdmin):
    """
    간호 진단 Model Admin
    """
    inlines = [
        DiagnosisInterventionAlphaInline,
        DiagnosisRelatedDiagnosesInline
    ]
    list_display = ('name', 'definition', 'intervention_content','diagnosis_medium_category')


# @admin.register(DiagnosisRelatedDiagnoses)
# class DiagnosisRelatedDiagnosesAdmin(admin.ModelAdmin):
#     """
#     간호 진단 Model의 related_diagnoses의 through에 설정된 Model Admin
#     """
#     pass


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