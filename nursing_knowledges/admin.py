from django.contrib import admin
from .models import (
    DiagnosisLargeCategory,
    DiagnosisMediumCategory,
    DiseaseLargeCategory,
    DiseaseMediumCategory,
    DiseaseSmallCategory,
    DiagnosisSmallCategory,
    DiagnosisRelatedDiagnosis,
    DiagnosisToDisease,
    DiagnosisInterventionAlpha,
    KnowledgeEditHistory, DiagnosisSmallCategoryStarInfo, DiseaseSmallCategoryStarInfo, DiseaseSmallCategoryEditHistory,
    DiseaseSmallCategoryEditHistoryRelatedDiagnosis,
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


class DiseaseSmallCategoryStarInfoInline(admin.TabularInline):
    model = DiseaseSmallCategoryStarInfo
    extra = 1


@admin.register(DiseaseSmallCategory)
class DiseaseSmallCategory(admin.ModelAdmin):
    """
    간호 질병 소분류 Model Admin
    """
    inlines = [
        DiseaseSmallCategoryStarInfoInline,
    ]


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


class DiagnosisSmallCategoryStarInfoInline(admin.TabularInline):
    model = DiagnosisSmallCategoryStarInfo
    extra = 1


class DiagnosisRelatedDiagnosisInline(admin.TabularInline):
    model = DiagnosisRelatedDiagnosis
    extra = 1


@admin.register(DiagnosisSmallCategory)
class DiagnosisAdmin(admin.ModelAdmin):
    """
    간호 진단 Model Admin
    """
    inlines = [
        # DiagnosisInterventionAlphaInline,
        DiagnosisSmallCategoryStarInfoInline,
        DiagnosisRelatedDiagnosisInline,
    ]
    list_display = ('name', 'definition', 'intervention_content', 'diagnosis_medium_category')


@admin.register(DiagnosisToDisease)
class DiagnosisToDiseaseAdmin(admin.ModelAdmin):
    """
    질병(중분류 or 대분류) <--> 진단의 연결관계를 나타내는 Model Admin
    """
    pass


class DiseaseSmallCategoryEditHistoryRelatedDiagnosisInline(admin.TabularInline):
    model = DiseaseSmallCategoryEditHistoryRelatedDiagnosis
    extra = 1


@admin.register(DiseaseSmallCategoryEditHistory)
class DiseaseSmallCategoryEditHistoryAdmin(admin.ModelAdmin):
    """
    질병 소분류의 편집 히스토리를 나타내는 Model Admin
    """
    inlines = [
        DiseaseSmallCategoryEditHistoryRelatedDiagnosisInline,
    ]


@admin.register(DiseaseSmallCategoryEditHistoryRelatedDiagnosis)
class DiseaseSmallCategoryEditHistoryRelatedDiagnosisAdmin(admin.ModelAdmin):
    """
    질병 소분류의 편집 히스토리의 관련 진단 Model Admin
    """
    pass


@admin.register(KnowledgeEditHistory)
class KnowledgeEditHistoryAdmin(admin.ModelAdmin):
    """
    질병, 진단을 수정한 사람의 정보와, 시간대가 나와있는 Model Admin
    """
    pass
