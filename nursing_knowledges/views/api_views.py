import json

from rest_framework.views import APIView
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from ..models import (
    DiseaseLargeCategory,
    DiseaseMediumCategory,
    DiseaseSmallCategory,
    DiagnosisSmallCategory,
    DiagnosisToOther,
)
from ..serializers import (
    DiseaseLargeCategorySerializer,
    DiseaseMediumCategorySerializer,
    DiseaseSmallCategorySerializer,
    DiagnosisSerializer,
    DiseaseLargeToMediumSerializer,
    DiseaseMediumToSmallSerializer,
    DiagnosisToOtherSerializer, DiseaseLargeToSmallSerializer,
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
        diagnosis_to_others = DiagnosisToOther.objects.all()
        serializer = DiagnosisToOtherSerializer(diagnosis_to_others, many=True)
        return Response(serializer.data)


class DiseaseLargeCategoryMindmapDataView(APIView):
    """
    특정 대질병에 의해 생기는 마인드맵을 그리기위한 데이터 API
    """
    def get(self, request, pk):
        result = dict()
        disease_small_category = get_object_or_404(DiseaseSmallCategory, pk=pk)

        # 연결된 대분류 진단 데이터 넣기
        if disease_small_category.disease_large_category:
            disease_large_category = disease_small_category.disease_large_category
        else:
            disease_large_category = disease_small_category.disease_medium_category.disease_large_category
        result['disease_large_category'] = {
            'id': disease_large_category.pk,
            'name': disease_large_category.name
        }
        if disease_large_category.disease_small_categories_by_large.all():
            result['disease_large_category']['disease_small_categories'] = []
            for disease_small_category in disease_large_category.disease_small_categories_by_large.all():
                result['disease_large_category']['disease_small_categories'].append(
                    self.get_disease_small_data(disease_small_category)
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
                    self.get_disease_small_data(disease_small_category)
                )

            result['disease_medium_categories'].append(disease_medium_data)

        return Response(result)

    def get_disease_small_data(self, disease_small_category):
        disease_small_data = {
            'id': disease_small_category.pk,
            'name': disease_small_category.name,
            'diagnoses': []
        }
        for diagnosis_to_other in DiagnosisToOther.objects.filter(disease_small_category=disease_small_category):
            disease_small_data['diagnoses'].append({
                'id': diagnosis_to_other.diagnosis.pk,
                'name': diagnosis_to_other.diagnosis.name
            })
        return disease_small_data
