from django.contrib import admin
from django.db.models import query
from django.db.models import Q
from .models import Disease, Diagnosis
from .models import DiseaseConnect, DiagnosisConnect

# Register your models here.

@admin.register(Disease)
class DiseaseAdmin(admin.ModelAdmin):
    """
    간호 질병 Model Admin
    """
    pass

@admin.register(DiseaseConnect)
class DiseaseDiagnosesAdmin(admin.ModelAdmin):
    """
    간호 질병의 through Model Admin
    """
    def delete_queryset(self, request, queryset):
        for query in queryset:
            disease =query.disease
            diagnosis =query.diagnosis
            query.delete()
            
            # DiagnosisConnect 모델에 같은 연결관계가 있는지 확인
            symmetry_object = DiagnosisConnect.objects.filter(Q(disease=disease) & Q(diagnosis=diagnosis))
            if symmetry_object.exists():
                # 있으면 DiagnosisConnect 모델의 관계도 삭제
                symmetry_object.delete()

@admin.register(Diagnosis)
class DiagnosisAdmin(admin.ModelAdmin):
    """
    간호 진단 Model Admin
    """
    pass

# @admin.register(DiagnosisConnect)
# class DiagnosisDiseasesAdmin(admin.ModelAdmin):
#     """
#     간호 진단의 through Model Admin
#     """
#     def delete_queryset(self, request, queryset):
#         for query in queryset:
#             disease =query.disease
#             diagnosis =query.diagnosis
#             query.delete()

#             # DiseaseConnect 모델에 같은 연결관계가 있는지 확인
#             symmetry_object = DiseaseConnect.objects.filter(Q(disease=disease) & Q(diagnosis=diagnosis))
#             if symmetry_object.exists():
#                 # 있으면 DiseaseConnect 모델의 관계도 삭제
#                 symmetry_object.delete()