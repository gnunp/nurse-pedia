from rest_framework import serializers
from .models import (
    Disease,
    DiseaseConnect,
    Diagnosis,
)


class DiseaseSerializer(serializers.ModelSerializer):
    """
    질병들의 Serializer
    """
    class Meta:
        model = Disease
        fields = (
            'id',
            'name',
            'content',
        )

class DiagnosisSerializer(serializers.ModelSerializer):
    """
    진단들의 Serializer
    """
    class Meta:
        model = Diagnosis
        fields = (
            'id',
            'name',
        )

class DiseaseToDiagnosisSerializer(serializers.ModelSerializer):
    """
    질병 <-> 진단의 연결관계 Serializer
    """
    disease = DiseaseSerializer()
    diagnosis = DiagnosisSerializer()

    class Meta:
        model = DiseaseConnect
        fields = (
            'id',
            'disease',
            'diagnosis',
        )