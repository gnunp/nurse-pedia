from rest_framework import serializers
from .models import (
    Disease,
    Diagnosis,
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
            'intervention_content',
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
            'diagnoses',
        )