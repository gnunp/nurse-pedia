import json

from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from ..models import (
    DiseaseLargeCategory,
    DiseaseMediumCategory,
    DiseaseSmallCategory,
    DiagnosisSmallCategory,
    DiagnosisToDisease,
)
from ..serializers import (
    DiseaseLargeCategorySerializer,
    DiseaseMediumCategorySerializer,
    DiseaseSmallCategorySerializer,
    DiagnosisSerializer,
    DiseaseLargeToMediumSerializer,
    DiseaseMediumToSmallSerializer,
    DiagnosisToDiseaseSerializer, DiseaseLargeToSmallSerializer,
)

class DiseaseLargeCategoryView(APIView):
    """
    질병 대분류 List API View
    """
    def get(self, request):
        disease_large_categories = DiseaseLargeCategory.objects.all()
        serializer = DiseaseLargeCategorySerializer(disease_large_categories, many=True)
        return Response(serializer.data)


class DiseaseMediumCategoryView(APIView):
    """
    질병 중분류 List API View
    """
    def get(self, request):
        disease_medium_categories = DiseaseMediumCategory.objects.all()
        serializer = DiseaseMediumCategorySerializer(disease_medium_categories, many=True)
        return Response(serializer.data)

class DiseaseSmallCategoryView(APIView):
    """
    질병 소분류 List API View
    """
    def get(self, request):
        disease_small_categories = DiseaseSmallCategory.objects.all()
        serializer = DiseaseSmallCategorySerializer(disease_small_categories, many=True)
        return Response(serializer.data)

class DiagnosesView(APIView):
    """
    진단 List API View
    """
    def get(self, request):
        diagnoses = DiagnosisSmallCategory.objects.all()
        serializer = DiagnosisSerializer(diagnoses, many=True)
        return Response(serializer.data)

class DiseaseLargeToMediumView(APIView):
    """
    질병 대분류 <--> 중분류 연결관계 API View
    """
    def get(self, request):
        disease_large_categories = DiseaseLargeCategory.objects.all()
        serializer = DiseaseLargeToMediumSerializer(disease_large_categories, many=True)
        return Response(serializer.data)

class DiseaseMediumToSmallView(APIView):
    """
    질병 중분류 <--> 소분류 연결관계 API View
    """
    def get(self, request):
        disease_medium_categories = DiseaseMediumCategory.objects.all()
        serializer = DiseaseMediumToSmallSerializer(disease_medium_categories, many=True)
        return Response(serializer.data)


class DiseaseLargeToSmallView(APIView):
    """
    질병 대분류 <--> 소분류 연결관계 API View
    """
    def get(self, request):
        disease_large_categories = DiseaseLargeCategory.objects.all()
        serializer = DiseaseLargeToSmallSerializer(disease_large_categories, many=True)
        return Response(serializer.data)


class DiagnosisToOtherView(APIView):
    """
    질병(중분류 or 소분류) <--> 진단 연결관계 API View
    """
    def get(self, request):
        diagnosis_to_disease = DiagnosisToDisease.objects.all()
        serializer = DiagnosisToDiseaseSerializer(diagnosis_to_disease, many=True)
        return Response(serializer.data)


class DetailMindmapDataView(APIView):
    """
    특정 대질병에 의해 생기는 마인드맵을 그리기위한 데이터 API
    """
    def get(self, request):
        disease_large_category = self.find_disease_large_top_node(request)

        return Response(get_knowledge_data__by_large_disease(disease_large_category))

    def find_disease_large_top_node(self, request):
        if request.GET.get('disease_small_category_id'):
            disease_small_category = get_object_or_404(DiseaseSmallCategory, pk=request.GET.get('disease_small_category_id'))
            if disease_small_category.disease_large_category:
                disease_large_category = disease_small_category.disease_large_category
            else:
                disease_large_category = disease_small_category.disease_medium_category.disease_large_category
        elif request.GET.get('diagnosis_small_category_id'):
            diagnosis_to_disease = DiagnosisToDisease.objects.filter(diagnosis=request.GET.get('diagnosis_small_category_id'))
            if not diagnosis_to_disease:
                return Response(status=status.HTTP_404_NOT_FOUND)
            diagnosis_to_disease = diagnosis_to_disease[0]
            if diagnosis_to_disease.disease_medium_category:
                disease_large_category = diagnosis_to_disease.disease_medium_category.disease_large_category
            else:
                if diagnosis_to_disease.disease_small_category.disease_large_category:
                    disease_large_category = diagnosis_to_disease.disease_small_category.disease_large_category
                else:
                    disease_large_category = diagnosis_to_disease.disease_small_category.disease_medium_category.disease_large_category

        if disease_large_category:
            return disease_large_category
        else:
            return Response(status=status.HTTP_404_NOT_FOUND)


def get_knowledge_data__by_large_disease(disease_large_category):
    """
    질병 대분류의 모든 그 밑의 노드들을 가져오는 함수
    """
    result = dict()
    result['disease_large_category'] = {
        'id': disease_large_category.pk,
        'name': disease_large_category.name
    }
    if disease_large_category.disease_small_categories_by_large.all():
        result['disease_large_category']['disease_small_categories'] = []
        for disease_small_category in disease_large_category.disease_small_categories_by_large.all():
            result['disease_large_category']['disease_small_categories'].append(
                get_disease_small_data(disease_small_category)
            )

    disease_medium_categories = disease_large_category.disease_medium_categories.all()
    result['disease_medium_categories'] = []
    for disease_medium_category in disease_medium_categories:
        disease_medium_data = {
            'id': disease_medium_category.pk,
            'name': disease_medium_category.name,
            'disease_small_categories': []
        }
        for disease_small_category in disease_medium_category.disease_small_categories_by_medium.all():
            disease_medium_data['disease_small_categories'].append(
                get_disease_small_data(disease_small_category)
            )

        result['disease_medium_categories'].append(disease_medium_data)

    return result


def get_disease_small_data(disease_small_category):
    disease_small_data = {
        'id': disease_small_category.pk,
        'name': disease_small_category.name,
        'diagnoses': []
    }
    for diagnosis_to_disease in DiagnosisToDisease.objects.filter(disease_small_category=disease_small_category):
        disease_small_data['diagnoses'].append({
            'id': diagnosis_to_disease.diagnosis.pk,
            'name': diagnosis_to_disease.diagnosis.name
        })
    return disease_small_data


class UserStarKnowledgeView(APIView):
    """
    유저가 찜한 소질병&소진단의 리스트를 가져오는 API
    """
    def get(self, request):
        if request.user.is_anonymous:
            return Response(status=status.HTTP_401_UNAUTHORIZED)

        user_star_info = list(
            request.user.disease_small_category_star_infoes.all()
                .values('disease_small_category__id', 'disease_small_category__name', 'created_at')
        ) + list(
            request.user.diagnosis_small_category_star_infoes.all()
                .values('diagnosis_small_category__id', 'diagnosis_small_category__name', 'created_at')
        )

        user_star_info.sort(key=lambda x: x["created_at"], reverse=True)

        return Response(user_star_info)


class AllKnowledgeDataView(APIView):
    """
    [
        질병 대분류1: 하위노드들,
        질병 대분류2: 하위노드들,
        ...
    ]
    위와 같은 형식으로 모든 간호지식 데이터를 전달하는 API
    """
    def get(self, request):
        result = []
        disease_large_categories = DiseaseLargeCategory.objects.all()
        for disease_large_category in disease_large_categories:
            result.append(get_knowledge_data__by_large_disease(disease_large_category))

        return Response(result)