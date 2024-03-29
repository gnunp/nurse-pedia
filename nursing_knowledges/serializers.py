from rest_framework import serializers
from .models import (
    DiseaseSmallCategory,
    DiagnosisSmallCategory,
    DiagnosisToDisease,
    DiseaseLargeCategory,
    DiseaseMediumCategory,
)
from collections import OrderedDict

class DiseaseLargeCategorySerializer(serializers.ModelSerializer):
    """
    질병 대분류 Serializer
    """
    class Meta:
        model = DiseaseLargeCategory
        fields = (
            'id',
            'name',
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
        )

class DiseaseSmallCategorySerializer(serializers.ModelSerializer):
    """
    질병 소분류 Serializer
    """
    class Meta:
        model = DiseaseSmallCategory
        fields = (
            'id',
            'name',
        )

class DiagnosisSerializer(serializers.ModelSerializer):
    """
    진단 Serializer
    """
    class Meta:
        model = DiagnosisSmallCategory
        fields = (
            'id',
            'name',
        )

class DiseaseLargeToMediumSerializer(serializers.ModelSerializer):
    """
    질병 대분류 <--> 중분류 연결관계 Serializer
    """
    disease_large_category = serializers.SerializerMethodField('get_id')
    disease_medium_categories = serializers.PrimaryKeyRelatedField(queryset=DiseaseMediumCategory.objects.all(), many=True)

    class Meta:
        model = DiseaseLargeCategory
        fields = (
            'disease_large_category',
            'disease_medium_categories',
        )

    def get_id(self, obj):
        return obj.id

class DiseaseMediumToSmallSerializer(serializers.ModelSerializer):
    """
    질병 중분류 <--> 소분류 연결관계 Serializer
    """
    disease_medium_category = serializers.SerializerMethodField('get_id')
    disease_small_categories_by_medium = serializers.PrimaryKeyRelatedField(queryset=DiseaseSmallCategory.objects.all(), many=True)

    class Meta:
        model = DiseaseMediumCategory
        fields = (
            'disease_medium_category',
            'disease_small_categories_by_medium',
        )

    def get_id(self, obj):
        return obj.id

class DiseaseLargeToSmallSerializer(serializers.ModelSerializer):
    """
    질병 대분류 <--> 소분류 연결관계 Serializer
    """
    disease_large_category = serializers.SerializerMethodField('get_id')
    disease_small_categories_by_large = serializers.PrimaryKeyRelatedField(queryset=DiseaseSmallCategory.objects.all(), many=True)

    class Meta:
        model = DiseaseLargeCategory
        fields = (
            'disease_large_category',
            'disease_small_categories_by_large',
        )

    def get_id(self, obj):
        return obj.id

class DiagnosisToDiseaseSerializer(serializers.ModelSerializer):
    """
    질병(중분류 or 소분류) <--> 진단 연결관계 Serializer
    """
    class Meta:
        model = DiagnosisToDisease
        exclude = ("id",)

    def to_representation(self, instance):
        result = super(DiagnosisToDiseaseSerializer, self).to_representation(instance)
        return OrderedDict([(key, result[key]) for key in result if result[key] is not None])