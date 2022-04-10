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
    DiagnosisToDisease,
    DiagnosisSmallCategory,
    DiagnosisInterventionAlpha,
    KnowledgeEditHistory, DiagnosisRelatedDiagnosis, DiagnosisLargeCategory, DiagnosisMediumCategory,
    DiseaseSmallCategoryEditHistory, DiseaseSmallCategoryRelatedDiagnosisEditHistory, DiagnosisSmallCategoryEditHistory,
    DiagnosisRelatedDiagnosisEditHistory
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

    before_version = request.GET.get('version')
    is_before_version = True if before_version else False

    if is_before_version:
        try:
            before_version_disease = DiseaseSmallCategoryEditHistory.objects.get(
                version=before_version,
                original_disease_small_category=pk
            )
        except DiseaseSmallCategoryEditHistory.DoesNotExist:
            raise Http404()

    if not is_before_version:
        disease_to_diagnoses = DiagnosisToDisease.objects.filter(disease_small_category=disease)  # pk값으로 가져온 질병과 진단들의 연결관계 객체
        diagnoses = []  # 연결된 진단들의 객체 리스트
        for dis_to_diag in disease_to_diagnoses:
            diagnoses.append(dis_to_diag.diagnosis)
    else:
        disease_to_diagnoses = DiseaseSmallCategoryRelatedDiagnosisEditHistory\
            .objects.filter(disease_small_category_edit_history=before_version_disease)
        diagnoses = []  # 연결된 진단들의 객체 리스트
        for dis_to_diag in disease_to_diagnoses:
            diagnoses.append(dis_to_diag.diagnosis_small_category)

    try:
        user = disease.like_users.get(pk=request.user.pk)
        is_star = True
    except User.DoesNotExist:
        is_star = False

    if is_before_version:
        original_disease = disease
        disease = before_version_disease
    else:
        original_disease = disease

    context = {
        "disease": disease,
        "diagnoses": diagnoses,
        "is_star": is_star,
        "is_before_version": is_before_version,
        "original_knowledge": original_disease,
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

    before_version = request.GET.get('version')
    is_before_version = True if before_version else False

    if is_before_version:
        try:
            before_version_diagnosis = DiagnosisSmallCategoryEditHistory.objects.get(
                version=before_version,
                original_diagnosis_small_category=pk
            )
        except DiagnosisSmallCategoryEditHistory.DoesNotExist:
            raise Http404()

    if not is_before_version:
        diagnosis_related_diagnoses = list(DiagnosisRelatedDiagnosis.objects.filter(target_diagnosis=pk))
        diagnosis_related_diagnoses.sort(key=lambda x: x.like_users.all().count(), reverse=True)
    else:
        diagnosis_related_diagnoses = list(DiagnosisRelatedDiagnosisEditHistory.objects.filter(
            diagnosis_small_category_edit_history=before_version_diagnosis
        ))

    try:
        user = diagnosis.like_users.get(pk=request.user.pk)
        is_star = True
    except User.DoesNotExist:
        is_star = False

    if is_before_version:
        original_diagnosis = diagnosis
        diagnosis = before_version_diagnosis
    else:
        original_diagnosis = diagnosis

    context = {
        "diagnosis": diagnosis,
        "diagnosis_related_diagnoses": diagnosis_related_diagnoses,
        "alphas": alphas,
        "is_star": is_star,
        "is_before_version": is_before_version,
        "original_knowledge": original_diagnosis,
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
    larges = list(DiagnosisLargeCategory.objects.all().values_list('name', flat=True))

    large_to_mediums = dict()
    for large_diagnosis in DiagnosisLargeCategory.objects.all():
        large_to_mediums[large_diagnosis.name] = list(
            large_diagnosis.diagnosis_medium_categories.values_list('name', flat=True)
        )

    medium_to_smalls = dict()
    for medium_diagnosis in DiagnosisMediumCategory.objects.all():
        medium_to_smalls[medium_diagnosis.name] = list(
            medium_diagnosis.diagnosis_small_categories.values('id', 'name'))

    result = {
        "large_diagnoses": larges,
        "large_to_mediums": large_to_mediums,
        "medium_to_smalls": medium_to_smalls,
    }

    context = {"knowledge_data": json.dumps(result, indent=4, ensure_ascii=False)}
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

    diagnosis_to_disease = DiagnosisToDisease.objects.filter(disease_small_category=disease)  # pk값으로 가져온 질병과 진단들의 연결관계 객체

    diagnoses = []  # 연결된 진단들의 객체 리스트
    for dis_to_diag in diagnosis_to_disease:
        diagnoses.append(dis_to_diag.diagnosis)

    if request.method == "POST":
        form = DiseaseSmallForm(request.POST, instance=disease)

        new_diagnoses = []
        for d in request.POST.keys():
            if d.startswith("added_"):
                new_diagnoses.append(d.split("_")[-1])

        if form.is_valid():
            valided_disease = form.save()

            # ------------------------------------------- 편집기록 저장 코드 --------------------------------------------
            after_word_count = count_words(
                disease.definition,
                disease.cause,
                disease.symptom,
                disease.diagnosis_and_checkup,
                disease.treatment,
                disease.nursing,
            )
            disease_small_category_edit_history = DiseaseSmallCategoryEditHistory.objects.create(
                definition=disease.definition,
                cause=disease.cause,
                symptom=disease.symptom,
                diagnosis_and_checkup=disease.diagnosis_and_checkup,
                treatment=disease.treatment,
                nursing=disease.nursing,
                original_disease_small_category=disease,
                editor=request.user,
                changed_word_count=after_word_count - before_word_count,
            )
            # ----------------------------------------------------------------------------------------------------------

            DiagnosisToDisease.objects.filter(disease_small_category=pk).delete()
            for d in new_diagnoses:
                try:
                    d_obj = DiagnosisSmallCategory.objects.get(name=d)
                    DiagnosisToDisease.objects.create(disease_small_category=disease, diagnosis=d_obj)
                    # ----------------------------- 편집기록 저장 코드 ------------------------------
                    DiseaseSmallCategoryRelatedDiagnosisEditHistory.objects.create(
                        disease_small_category_edit_history=disease_small_category_edit_history,
                        diagnosis_small_category=d_obj,
                    )
                    # ----------------------------------------------------------------------------
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
    related_diagnoses = diagnosis.DiagnosisRelatedDiagnoses.all()

    before_word_count = count_words(
        diagnosis.definition,
        diagnosis.intervention_content,
        *[diagnosis.related_diagnosis_name + diagnosis.intervention_content for diagnosis in related_diagnoses]
    )

    if request.method == "POST":
        form = DiagnosisForm(request.POST, instance=diagnosis)

        if form.is_valid():
            form.save()

        # ----------------------------------------- 편집 기록 저장 코드 ----------------------------------------------
        diagnosis_small_category_edit_history = DiagnosisSmallCategoryEditHistory.objects.create(
            definition=diagnosis.definition,
            intervention_content=diagnosis.intervention_content,
            original_diagnosis_small_category=diagnosis,
            editor=request.user,
        )
        # ----------------------------------------------------------------------------------------------------------

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
                # ----------------------------- 편집 기록 저장 코드 -------------------------------
                new_related_diagnosis_edit_history = DiagnosisRelatedDiagnosisEditHistory.objects.create(
                    related_diagnosis_name=relation_diagnosis_name[i],
                    intervention_content=relation_diagnosis_intervention_content[i],
                    diagnosis_small_category_edit_history=diagnosis_small_category_edit_history
                )
                # -------------------------------------------------------------------------------

        after_word_count = count_words(
            diagnosis.definition,
            diagnosis.intervention_content,
            *[
                diagnosis.related_diagnosis_name + diagnosis.intervention_content
                for diagnosis in diagnosis_small_category_edit_history
                .diagnosis_small_category_related_diagnosis_edit_histories.all()
            ]
        )
        diagnosis_small_category_edit_history.changed_word_count = after_word_count - before_word_count
        diagnosis_small_category_edit_history.save()

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

        before_word_count = count_words(
            related_diagnosis.related_diagnosis_name,
            related_diagnosis.intervention_content,
        )

        related_diagnosis.intervention_content = edited_text
        related_diagnosis.save()
        # ---------------- 편집 기록 저장 코드 -----------------
        after_word_count = count_words(
            related_diagnosis.related_diagnosis_name,
            related_diagnosis.intervention_content,
        )
        target_diagnosis = related_diagnosis.target_diagnosis
        diagnosis_small_category_edit_history = DiagnosisSmallCategoryEditHistory.objects.create(
            definition=target_diagnosis.definition,
            intervention_content=target_diagnosis.intervention_content,
            original_diagnosis_small_category=target_diagnosis,
            editor=request.user,
            changed_word_count=after_word_count - before_word_count,
        )

        new_related_diagnosis_edit_history = DiagnosisRelatedDiagnosisEditHistory.objects.create(
            related_diagnosis_name=related_diagnosis.related_diagnosis_name,
            intervention_content=related_diagnosis.intervention_content,
            diagnosis_small_category_edit_history=diagnosis_small_category_edit_history,
        )
        # ---------------------------------------------------
    except DiagnosisRelatedDiagnosis.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    return Response(status=status.HTTP_200_OK)


def history(request):
    disease_small_category_history = list(DiseaseSmallCategoryEditHistory.objects.filter(editor__isnull=False))
    diagnosis_small_category_history = list(DiagnosisSmallCategoryEditHistory.objects.filter(editor__isnull=False))

    histories = disease_small_category_history + diagnosis_small_category_history
    histories.sort(key=lambda x: x.created_at, reverse=True)

    paginator = Paginator(histories, 30)

    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)

    context = {
        'page_obj': page_obj,
        'is_total_history_page': True,
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


def disease_edit_history(request, pk):
    histories = DiseaseSmallCategoryEditHistory.objects.filter(original_disease_small_category=pk).order_by('-created_at')
    knowledge_name = histories.first().original_disease_small_category.name

    paginator = Paginator(histories, 30)

    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)

    context = {
        'knowledge_name': knowledge_name,
        'page_obj': page_obj,
    }

    return render(request, "nursing_knowledges/history.html", context)


def diagnosis_edit_history(request, pk):
    histories = DiagnosisSmallCategoryEditHistory.objects.filter(original_diagnosis_small_category=pk).order_by('-created_at')
    knowledge_name = histories.first().original_diagnosis_small_category.name

    paginator = Paginator(histories, 30)

    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)

    context = {
        'knowledge_name': knowledge_name,
        'page_obj': page_obj,
    }

    return render(request, "nursing_knowledges/history.html", context)
