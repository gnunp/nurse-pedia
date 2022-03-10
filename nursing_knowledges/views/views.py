import json
from rest_framework.decorators import api_view, renderer_classes
from rest_framework.renderers import JSONRenderer, TemplateHTMLRenderer
from rest_framework import status
from django.http.response import Http404
from django.shortcuts import get_object_or_404, redirect, render
from django.urls import reverse
from django.contrib.auth.decorators import login_required
from django.utils import timezone
from django.core.paginator import Paginator
from nursing_knowledges.forms import DiagnosisForm, DiseaseSmallForm
from .api_views import *
from ..models import (
    DiagnosisRelatedDiagnoses,
    DiseaseSmallCategory,
    DiagnosisToOther,
    DiagnosisSmallCategory,
    DiagnosisInterventionAlpha,
    KnowledgeEditHistory
)
from users.models import User

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
        diagnosis = DiagnosisSmallCategory.objects.get(pk=pk)  # 해당 질병 객체
        alphas = DiagnosisInterventionAlpha.objects.filter(diagnosis=pk)
    except DiagnosisSmallCategory.DoesNotExist:
        raise Http404()

    try:
        diagnosis_related_diagnoses = list(DiagnosisRelatedDiagnoses.objects.filter(from_diagnosis=pk))
        diagnosis_related_diagnoses.sort(key=lambda x: x.like_users.all().count(), reverse=True)
    except:
        diagnosis_related_diagnoses = [""]
        pass

    form = DiagnosisForm()

    context = {
        "diagnosis": diagnosis,
        "diagnosis_related_diagnoses": diagnosis_related_diagnoses,
        "alphas": alphas,
        "form": form,
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
        diagnosis = DiagnosisSmallCategory.objects.get(name=keyword)
        return redirect(reverse("nursing_knowledges:diagnosis_detail", kwargs={'pk':diagnosis.pk}))
    except DiagnosisSmallCategory.DoesNotExist:
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

    context = {"knowledge_data": json.dumps(result, indent=4, ensure_ascii=False)}
    return render(request, "nursing_knowledges/disease_category.html", context)

def diagnosis_category(request):
    context = {}
    return render(request, "nursing_knowledges/diagnosis_category.html", context)



@login_required
def disease_detail_edit(request, pk):
    disease = get_object_or_404(DiseaseSmallCategory, pk=pk)
    before_word_count = count_words(
        disease.definition,
        disease.cause,
        disease.symptom,
        disease.diagnosis_and_checkup,
        disease.treatment,
        disease.nursing,
    )

    disease_to_diagnoses = DiagnosisToOther.objects.filter(disease_small_category=disease)  # pk값으로 가져온 질병과 진단들의 연결관계 객체

    diagnoses = []  # 연결된 진단들의 객체 리스트
    for dis_to_diag in disease_to_diagnoses:
        diagnoses.append(dis_to_diag.diagnosis)

    if request.method == "POST":
        form = DiseaseSmallForm(request.POST, instance=disease)

        new_diagnoses = []
        for d in request.POST.keys():
            if d.startswith("added_"):
                new_diagnoses.append(d.split("_")[-1])

        if form.is_valid():
            valided_disease = form.save()

            # ------- 편집기록 저장 코드 --------------------------------------------------------------------------------
            after_word_count = count_words(
                disease.definition,
                disease.cause,
                disease.symptom,
                disease.diagnosis_and_checkup,
                disease.treatment,
                disease.nursing,
            )
            KnowledgeEditHistory.objects.create(
                disease=disease,
                editor=request.user,
                created_at= timezone.localtime(),
                changed_word_count = after_word_count - before_word_count,
            )
            # ----------------------------------------------------------------------------------------------------------

            DiagnosisToOther.objects.filter(disease_small_category=pk).delete()
            for d in new_diagnoses:
                try:
                    d_obj = DiagnosisSmallCategory.objects.get(name=d)
                    DiagnosisToOther.objects.create(disease_small_category=disease, diagnosis=d_obj)
                except DiagnosisSmallCategory.DoesNotExist:
                    pass

            return redirect(valided_disease)
    else:
        form = DiseaseSmallForm(instance=disease)


    context = {
        "form":form,
        "disease":disease,
        "related_diagnoses":diagnoses,
        "all_diagnosis":DiagnosisSmallCategory.objects.all().values_list("name", flat=True),
    }

    return render(request, "nursing_knowledges/disease_detail_edit.html", context)

@login_required
def diagnosis_detail_edit(request, pk):
    diagnosis = get_object_or_404(DiagnosisSmallCategory, pk=pk)
    before_word_count = count_words(
        diagnosis.definition,
        diagnosis.intervention_content
    )


    related_diagnoses = DiagnosisRelatedDiagnoses.objects.filter(from_diagnosis=diagnosis)
    related_diagnoses_string_list = [related_diagnosis.to_diagnosis.name for related_diagnosis in related_diagnoses]
    if request.method == "POST":
        form = DiagnosisForm(request.POST, instance=diagnosis)

        new_diagnoses = []
        for d in request.POST.keys():
            if d.startswith("added_"):
                new_diagnoses.append(d.split("_")[-1])
            
        # 삭제된 관련진단 처리하는 코드
        deleted_diagnoses = set(related_diagnoses_string_list) - set(new_diagnoses)
        for deleted_diagnosis_string in deleted_diagnoses:
            try:
                DiagnosisRelatedDiagnoses.objects.get(from_diagnosis=diagnosis, to_diagnosis__name=deleted_diagnosis_string).delete()
            except DiagnosisRelatedDiagnoses.DoesNotExist:
                pass

        if form.is_valid():
            valided_diagnosis = form.save()
            # ------- 편집기록 저장 코드 --------------------------------------------------------------------------------
            after_word_count = count_words(
                diagnosis.definition,
                diagnosis.intervention_content
            )
            KnowledgeEditHistory.objects.create(
                diagnosis=diagnosis,
                editor=request.user,
                created_at= timezone.localtime(),
                changed_word_count = after_word_count - before_word_count,
            )
            # ----------------------------------------------------------------------------------------------------------
            for d in new_diagnoses:
                try:
                    diagnosis_obj = DiagnosisSmallCategory.objects.get(name=d)

                    try:
                        diagnosis_related_diagnosis = DiagnosisRelatedDiagnoses.objects.get(from_diagnosis=diagnosis, to_diagnosis=diagnosis_obj)
                    except DiagnosisRelatedDiagnoses.DoesNotExist:
                        DiagnosisRelatedDiagnoses.objects.create(from_diagnosis=diagnosis, to_diagnosis=diagnosis_obj)
                    
                except DiagnosisSmallCategory.DoesNotExist:
                    pass

            return redirect(valided_diagnosis)
    
    else:
        form = DiagnosisForm(instance=diagnosis)

    context = {
        "form": form,
        "diagnosis": diagnosis,
        "related_diagnoses":related_diagnoses,
    }
    
    return render(request, "nursing_knowledges/diagnosis_detail_edit.html", context)

def count_words(*words):
    result = 0
    for word in words:
        result += len(word)

    return result

@api_view(["POST"])
def diagnosis_detail__related_diagnosis_edit(request, pk):
    edited_text = request.data.get('editedText')

    try:
        diagnosis = DiagnosisSmallCategory.objects.get(pk=pk)
        diagnosis.intervention_content = edited_text
        diagnosis.save()
    except DiagnosisSmallCategory.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    

    return Response(status=status.HTTP_200_OK)



def history(request):
    histories = KnowledgeEditHistory.objects.all().order_by("-created_at")
    paginator = Paginator(histories, 30)

    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)

    context = {
        'page_obj': page_obj,
    }

    return render(request, "nursing_knowledges/history.html", context)

@api_view(["POST"])
def related_diagnosis_like(request, pk):
    if request.user.is_anonymous:
        return Response(status=status.HTTP_401_UNAUTHORIZED)
    
    try:
        diagnosis_related_diagnoses = DiagnosisRelatedDiagnoses.objects.get(pk=pk)

        try:
            like_user = diagnosis_related_diagnoses.like_users.get(pk=request.user.pk)
            diagnosis_related_diagnoses.like_users.remove(like_user)
            return Response(status=status.HTTP_200_OK)

        except User.DoesNotExist:
            diagnosis_related_diagnoses.like_users.add(request.user)
            return Response(status=status.HTTP_201_CREATED)

    except DiagnosisRelatedDiagnoses.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    
