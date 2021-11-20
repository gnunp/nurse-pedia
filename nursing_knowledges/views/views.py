from django.http.request import HttpHeaders
from django.http.response import Http404
from django.shortcuts import render
from .api_views import *
from ..models import DiseaseSmallCategory, DiagnosisToOther, Diagnosis

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
    except:
        raise Http404()

    context = {
        "diagnosis": diagnosis,
    }
    
    return render(request, "nursing_knowledges/diagnosis_detail.html", context)
