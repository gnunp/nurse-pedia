from django.contrib import admin
from .models import NursingKnowledge, NursingInterventionContent, KnowledgeInterventionRelation

# Register your models here.

@admin.register(NursingKnowledge)
class NursingKnowledgeAdmin(admin.ModelAdmin):
    """
    (간호 질병 + 간호 진단) Model Admin
    """
    pass

@admin.register(NursingInterventionContent)
class NursingInterventionContentAdmin(admin.ModelAdmin):
    """
    간호 중재 내용 Model Admin
    """
    pass

@admin.register(KnowledgeInterventionRelation)
class KnowledgeInterventionRelationAdmin(admin.ModelAdmin):
    """
    어떤 질병의 -> 어떤 진단의 중재인지 관계를 나타내는 Model Admin
    """
    pass