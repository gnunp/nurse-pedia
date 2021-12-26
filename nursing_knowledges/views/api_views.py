from django_elasticsearch_dsl_drf.viewsets import DocumentViewSet
from django_elasticsearch_dsl_drf.filter_backends import (
    FilteringFilterBackend,
    CompoundSearchFilterBackend,
    MultiMatchSearchFilterBackend,
)
from rest_framework.views import APIView
from rest_framework.response import Response
from nursing_knowledges.documents import DiagnosisDocument, DiseaseDocument
from ..models import (
    DiseaseLargeCategory,
    DiseaseMediumCategory,
    DiseaseSmallCategory,
    Diagnosis,
    DiagnosisToOther,
)
from ..serializers import (
    DiseaseLargeCategorySerializer,
    DiseaseMediumCategorySerializer,
    DiseaseSmallCategorySerializer,
    DiagnosisSerializer,
    DiseaseLargeToMediumSerializer,
    DiseaseMediumToSmallSerializer,
    DiagnosisToOtherSerializer,
    # DiseaseDocumentSerializer,
    # DiagnosisDocumentSerializer,
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
        diagnoses = Diagnosis.objects.all()
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

class DiagnosisToOtherView(APIView):
    """
    질병(중분류 or 소분류) <--> 진단 연결관계 API View
    """
    def get(self, request):
        diagnosis_to_others = DiagnosisToOther.objects.all()
        serializer = DiagnosisToOtherSerializer(diagnosis_to_others, many=True)
        return Response(serializer.data)

# ------------------------ Elastic Search API --------------------------
# class DiseaseDocumentView(DocumentViewSet):
#     """
#     질병(소분류) Elastic Search API View
#     """
#     document = DiseaseDocument
#     serializer_class = DiseaseDocumentSerializer

#     filter_backends = [
#         FilteringFilterBackend,
#         CompoundSearchFilterBackend,
#         MultiMatchSearchFilterBackend,
#     ]

#     search_fields = ("name",)
#     multi_match_search_fields = ("name",)
#     multi_match_options = {
#         'type': 'phrase_prefix'
#     }
#     filter_fields = {
#         "name": {
#             "field": "name",
#         }
#     }

# class DiagnosisDocumentView(DocumentViewSet):
#     """
#     진단 Elastic Search API View
#     """
#     document = DiagnosisDocument
#     serializer_class = DiagnosisDocumentSerializer

#     filter_backends = [
#         FilteringFilterBackend,
#         CompoundSearchFilterBackend,
#         MultiMatchSearchFilterBackend,
#     ]

#     search_fields = ("name",)
#     multi_match_search_fields = ("name",)
#     multi_match_options = {
#         'type': 'phrase_prefix'
#     }
#     filter_fields = {
#         "name": {
#             "field": "name",
#         }
#     }