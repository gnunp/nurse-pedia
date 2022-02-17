import json
from django.http.response import Http404
from django.shortcuts import redirect, render
from django.urls import reverse
from .api_views import *
from ..models import (
    DiseaseSmallCategory,
    DiagnosisToOther,
    Diagnosis,
    DiagnosisInterventionAlpha
)

def home(request):
    """
    Home 화면 View
    """
    context = {}
    return render(request, "nursing_knowledges/home.html", context)

def disease_detail(request, pk):
    """
    질병 Detail 페이지 View
    """
    try:
        disease = DiseaseSmallCategory.objects.get(pk=pk)  # 해당 질병 객체
    except:
        raise Http404()

    disease_to_diagnoses = DiagnosisToOther.objects.filter(disease_small_category=disease)  # pk값으로 가져온 질병과 진단들의 연결관계 객체

    diagnoses = []  # 연결된 진단들의 객체 리스트
    for dis_to_diag in disease_to_diagnoses:
        diagnoses.append(dis_to_diag.diagnosis)
    

    context = {
        "disease": disease,
        "diagnoses": diagnoses,
    }

    return render(request, "nursing_knowledges/disease_detail.html", context)
    

def diagnosis_detail(request, pk):
    """
    진단 Detail 페이지 View
    """
    try:
        diagnosis = Diagnosis.objects.get(pk=pk)  # 해당 질병 객체
        interventions = diagnosis.intervention_content.split("\n") if True else ""
        alphas = DiagnosisInterventionAlpha.objects.filter(diagnosis=pk)
    except:
        raise Http404()

    context = {
        "diagnosis": diagnosis,
        "interventions": interventions,
        "alphas": alphas,
    }
    
    return render(request, "nursing_knowledges/diagnosis_detail.html", context)

def search(request):
    """
    간호지식 검색 View
    """
    keyword = request.GET.get("keyword")

    try:
        disease = DiseaseSmallCategory.objects.get(name=keyword)
        return redirect(reverse("nursing_knowledges:disease_detail", kwargs={'pk':disease.pk}))
    except DiseaseSmallCategory.DoesNotExist:
        pass

    try:
        diagnosis = Diagnosis.objects.get(name=keyword)
        return redirect(reverse("nursing_knowledges:diagnosis_detail", kwargs={'pk':diagnosis.pk}))
    except Diagnosis.DoesNotExist:
        return render(request, "nursing_knowledges/search_result.html")

def disease_category(request):
    larges = list(DiseaseLargeCategory.objects.all().values_list('name', flat=True)) 

    large_to_mediums = dict()
    for large_disease in DiseaseLargeCategory.objects.all():
        large_to_mediums[large_disease.name] = list(large_disease.disease_medium_categories.values_list('name', flat=True))

    medium_to_smalls = dict()
    for medium_disease in DiseaseMediumCategory.objects.all():
        medium_to_smalls[medium_disease.name] = list(medium_disease.disease_small_categories.values('id', 'name'))

    result = {
        "large_diseases": larges,
        "large_to_mediums": large_to_mediums,
        "medium_to_smalls": medium_to_smalls,
    }

    print(json.dumps(result, indent=4, ensure_ascii=False))
        

    context = {"knowledge_data": json.dumps(result, indent=4, ensure_ascii=False)}
    return render(request, "nursing_knowledges/disease_category.html", context)

def diagnosis_category(request):
    context = {}
    return render(request, "nursing_knowledges/diagnosis_category.html", context)