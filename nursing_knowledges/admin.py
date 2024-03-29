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
    DiagnosisSmallCategoryStarInfo, DiseaseSmallCategoryStarInfo, DiseaseSmallCategoryEditHistory,
    DiseaseSmallCategoryRelatedDiagnosisEditHistory, DiagnosisSmallCategoryEditHistory,
    DiagnosisRelatedDiagnosisEditHistory, ReportedKnowledgeEditHistory,
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
class DiseaseSmallCategoryAdmin(admin.ModelAdmin):
    """
    간호 질병 소분류 Model Admin
    """
    inlines = [
        DiseaseSmallCategoryStarInfoInline,
    ]


@admin.register(DiagnosisLargeCategory)
class DiagnosisLargeCategoryAdmin(admin.ModelAdmin):
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
class DiagnosisSmallCategoryAdmin(admin.ModelAdmin):
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
    model = DiseaseSmallCategoryRelatedDiagnosisEditHistory
    extra = 1


@admin.register(DiseaseSmallCategoryEditHistory)
class DiseaseSmallCategoryEditHistoryAdmin(admin.ModelAdmin):
    """
    질병 소분류의 편집 히스토리를 나타내는 Model Admin
    """
    inlines = [
        DiseaseSmallCategoryEditHistoryRelatedDiagnosisInline,
    ]


class DiagnosisRelatedDiagnosisEditHistoryInline(admin.TabularInline):
    model = DiagnosisRelatedDiagnosisEditHistory
    extra = 1


@admin.register(DiagnosisSmallCategoryEditHistory)
class DiagnosisSmallCategoryEditHistoryAdmin(admin.ModelAdmin):
    """
    진단 소분류의 편집 히스토리를 나타내는 Model Admin
    """
    inlines = [
        DiagnosisRelatedDiagnosisEditHistoryInline,
    ]


@admin.register(ReportedKnowledgeEditHistory)
class ReportedKnowledgeEditHistoryAdmin(admin.ModelAdmin):
    """
    악의적이라고 생각된 편집 기록을 유저가 신고한 기록을 가진 Model Admin
    """
    pass