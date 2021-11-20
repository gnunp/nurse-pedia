from rest_framework.views import APIView
from rest_framework.response import Response
from ..models import (
    Disease,
    Diagnosis,
    DiseaseMediumCategory,
    DiseaseLargeCategory,
)
from ..serializers import (
    DiseaseSerializer,
    DiagnosisSerializer,
    DiseaseMediumCategorySerializer,
    DiseaseLargeCategorySerializer,
)

class DiseaseLargeCategoryView(APIView):
    """
    질병 중분류 List API View
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

class DiseasesView(APIView):
    """
    질병 List API View
    """
    def get(self, request):
        diseases = Disease.objects.all()
        serializer = DiseaseSerializer(diseases, many=True)
        return Response(serializer.data)

class DiagnosesView(APIView):
    """
    진단 List API View
    """
    def get(self, request):
        diagnoses = Diagnosis.objects.all()
        serializer = DiagnosisSerializer(diagnoses, many=True)
        return Response(serializer.data)