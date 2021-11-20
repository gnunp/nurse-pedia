from rest_framework import serializers
from .models import (
    Disease,
    Diagnosis,
    DiseaseLargeCategory,
    DiseaseMediumCategory,
)

class DiseaseLargeCategorySerializer(serializers.ModelSerializer):
    """
    질병 대분류 Serializer
    """
    class Meta:
        model = DiseaseLargeCategory
        fields = (
            'id',
            'name',
            'content',
        )

class DiseaseMediumCategorySerializer(serializers.ModelSerializer):
    """
    질병 중분류 Serializer
    """
    class Meta:
        model = DiseaseMediumCategory
        fields = (
            'id',
            'name',
            'content',
        )

class DiseaseSerializer(serializers.ModelSerializer):
    """
    질병 Serializer
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
    진단 Serializer
    """
    class Meta:
        model = Diagnosis
        fields = (
            'id',
            'name',
            'intervention_content',
        )