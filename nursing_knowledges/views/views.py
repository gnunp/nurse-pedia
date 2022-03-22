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
    DiseaseSmallCategory,
    DiagnosisToOther,
    DiagnosisSmallCategory,
    DiagnosisInterventionAlpha,
    KnowledgeEditHistory, DiagnosisRelatedDiagnosis
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

    try:
        user = disease.like_users.get(pk=request.user.pk)
        is_star = True
    except User.DoesNotExist:
        is_star = False

    context = {
        "disease": disease,
        "diagnoses": diagnoses,
        "is_star": is_star,
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

    diagnosis_related_diagnoses = list(DiagnosisRelatedDiagnosis.objects.filter(target_diagnosis=pk))
    diagnosis_related_diagnoses.sort(key=lambda x: x.like_users.all().count(), reverse=True)

    form = DiagnosisForm()

    try:
        user = diagnosis.like_users.get(pk=request.user.pk)
        is_star = True
    except User.DoesNotExist:
        is_star = False

    context = {
        "diagnosis": diagnosis,
        "diagnosis_related_diagnoses": diagnosis_related_diagnoses,
        "alphas": alphas,
        "form": form,
        "is_star": is_star,
    }

    return render(request, "nursing_knowledges/diagnosis_detail.html", context)


def search(request):
    """
    간호지식 검색 View
    """
    keyword = request.GET.get("keyword")

    try:
        disease = DiseaseSmallCategory.objects.get(name=keyword)
        return redirect(reverse("nursing_knowledges:disease_detail", kwargs={'pk': disease.pk}))
    except DiseaseSmallCategory.DoesNotExist:
        pass

    try:
        diagnosis = DiagnosisSmallCategory.objects.get(name=keyword)
        return redirect(reverse("nursing_knowledges:diagnosis_detail", kwargs={'pk': diagnosis.pk}))
    except DiagnosisSmallCategory.DoesNotExist:
        return render(request, "nursing_knowledges/search_result.html")


def disease_category(request):
    larges = list(DiseaseLargeCategory.objects.all().values_list('name', flat=True))

    large_to_mediums = dict()
    for large_disease in DiseaseLargeCategory.objects.all():
        large_to_mediums[large_disease.name] = list(
            large_disease.disease_medium_categories.values_list('name', flat=True))

    medium_to_smalls = dict()
    for medium_disease in DiseaseMediumCategory.objects.all():
        medium_to_smalls[medium_disease.name] = list(
            medium_disease.disease_small_categories_by_medium.values('id', 'name'))

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


def disease_detail_edit(request, pk):
    if request.user.is_anonymous:
        return redirect('home')

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
                created_at=timezone.localtime(),
                changed_word_count=after_word_count - before_word_count,
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
        "form": form,
        "disease": disease,
        "related_diagnoses": diagnoses,
        "all_diagnosis": DiagnosisSmallCategory.objects.all().values_list("name", flat=True),
    }

    return render(request, "nursing_knowledges/disease_detail_edit.html", context)


def diagnosis_detail_edit(request, pk):
    if request.user.is_anonymous:
        return redirect('home')

    diagnosis = get_object_or_404(DiagnosisSmallCategory, pk=pk)
    before_word_count = count_words(
        diagnosis.definition,
        diagnosis.intervention_content
    )

    related_diagnoses = diagnosis.DiagnosisRelatedDiagnoses.all()
    if request.method == "POST":
        form = DiagnosisForm(request.POST, instance=diagnosis)

        if form.is_valid():
            form.save()

        # 기존의 관련 진단 전부 삭제
        related_diagnoses.delete()

        # 관련 진단 새로 추가
        relation_diagnosis_name = request.POST.getlist("relation_diagnosis_name")
        relation_diagnosis_intervention_content = request.POST.getlist("relation_diagnosis_intervention_content")
        for i in range(len(relation_diagnosis_name)):
            if relation_diagnosis_name[i]:
                new_related_diagnosis = DiagnosisRelatedDiagnosis.objects.create(
                    related_diagnosis_name=relation_diagnosis_name[i],
                    intervention_content=relation_diagnosis_intervention_content[i],
                    target_diagnosis=diagnosis
                )

        # ------- 편집 기록 저장 코드 --------------------------------------------------------------------------------
        after_word_count = count_words(
            diagnosis.definition,
            diagnosis.intervention_content
        )
        KnowledgeEditHistory.objects.create(
            diagnosis=diagnosis,
            editor=request.user,
            created_at=timezone.localtime(),
            changed_word_count=after_word_count - before_word_count,
        )
        # ----------------------------------------------------------------------------------------------------------

        return redirect(diagnosis)

    else:
        form = DiagnosisForm(instance=diagnosis)

    context = {
        "form": form,
        "diagnosis": diagnosis,
        "related_diagnoses": related_diagnoses,
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
        related_diagnosis = DiagnosisRelatedDiagnosis.objects.get(pk=pk)
        related_diagnosis.intervention_content = edited_text
        related_diagnosis.save()
    except DiagnosisRelatedDiagnosis.DoesNotExist:
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
        diagnosis_related_diagnoses = DiagnosisRelatedDiagnosis.objects.get(pk=pk)

        try:
            like_user = diagnosis_related_diagnoses.like_users.get(pk=request.user.pk)
            diagnosis_related_diagnoses.like_users.remove(like_user)
            return Response(status=status.HTTP_200_OK)

        except User.DoesNotExist:
            diagnosis_related_diagnoses.like_users.add(request.user)
            return Response(status=status.HTTP_201_CREATED)

    except DiagnosisRelatedDiagnosis.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)


def mindmap(request):
    context = {}

    return render(request, "nursing_knowledges/mindmap_page.html", context)


@api_view(["POST"])
def add_knowledge_star(request):
    if request.user.is_anonymous:
        return Response(status=status.HTTP_401_UNAUTHORIZED)

    knowledge_category = request.data.get('knowledgeCategory')
    knowledge_id = request.data.get('id')

    if (not knowledge_category) or (not knowledge_id):
        return Response(status=status.HTTP_404_NOT_FOUND)

    if knowledge_category == "disease":
        knowledge = get_object_or_404(DiseaseSmallCategory, pk=knowledge_id)
    elif knowledge_category == "diagnosis":
        knowledge = get_object_or_404(DiagnosisSmallCategory, pk=knowledge_id)
    else:
        return Response(status=status.HTTP_404_NOT_FOUND)

    try:
        is_already_star = knowledge.like_users.get(pk=request.user.pk)
        knowledge.like_users.remove(request.user)
        return Response(status=status.HTTP_200_OK)
    except User.DoesNotExist:
        knowledge.like_users.add(request.user)
        return Response(status=status.HTTP_201_CREATED)
