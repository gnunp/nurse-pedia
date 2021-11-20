from rest_framework.views import APIView
from rest_framework.response import Response
from ..models import (
    Disease,
    Diagnosis,
)
from ..serializers import (
    DiseaseSerializer,
    DiagnosisSerializer,
)

class DiseasesView(APIView):
    """
    질병들의 API View
    """
    def get(self, request):
        diseases = Disease.objects.all()
        serializer = DiseaseSerializer(diseases, many=True)
        return Response(serializer.data)

class DiagnosesView(APIView):
    """
    진단들의 API View
    """
    def get(self, request):
        diagnoses = Diagnosis.objects.all()
        serializer = DiagnosisSerializer(diagnoses, many=True)
        return Response(serializer.data)