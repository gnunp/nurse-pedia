from rest_framework.serializers import Serializer
from rest_framework.views import APIView
from rest_framework.response import Response
from ..models import (
    Disease,
    DiseaseConnect,
    Diagnosis,
    InterventionContent,
    InterventionRelation
)
from ..serializers import (
    DiseaseSerializer,
    DiagnosisSerializer,
    DiseaseToDiagnosisSerializer,
    InterventionSerializer,
    InterventionToOthersSerializer
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

class DiseaseToDiagnosisView(APIView):
    """
    질병 <-> 진단의 연결관계 API View
    """
    def get(self, request):
        disease_to_diagnosis = DiseaseConnect.objects.all()
        serializer = DiseaseToDiagnosisSerializer(disease_to_diagnosis, many=True)
        return Response(serializer.data)
    
class InterventionsView(APIView):
    """
    중재들의 API View
    """
    def get(self, request):
        interventions = InterventionContent.objects.all()
        serializer = InterventionSerializer(interventions, many=True)
        return Response(serializer.data)

class InterventionToOthersView(APIView):
    """
    중재 <-> (질병 <-> 진단)의 연결관계 API View
    """
    def get(self, request):
        intervention_to_others = InterventionRelation.objects.all()
        serializer = InterventionToOthersSerializer(intervention_to_others, many=True)
        return Response(serializer.data)