from django.conf import settings
from django.core.checks.messages import Error
from numpy import NaN
import pandas as pd
from ..models import (
    DiagnosisSmallCategory, DiagnosisLargeCategory, DiagnosisMediumCategory,
)


def run():
    """
    진단의 중재 내용을 DB에 넣는 스크립트
    """
    df = pd.read_excel(
        settings.BASE_DIR / 'nursing_knowledges/scripts/diagnosis_intervention_data.xlsx',
        engine='openpyxl'
    )

    for row in range(df.shape[0]):
        large_category_data = df.iat[row, 0]
        medium_category_data = df.iat[row, 1]
        small_category_data = df.iat[row, 2]
        diagnosis_definition_data = df.iat[row, 3]
        diagnosis_intervention_data = df.iat[row, 4]


        # print(row+1, ": ", large_category_data, medium_category_data, small_category_data, diagnosis_definition_data)

        # 대분류가 DB에 있다면 pass
        try:
            large_category_obj = DiagnosisLargeCategory.objects.get(name=large_category_data)
        # 대분류가 DB에 없다면 새로 만들기
        except DiagnosisLargeCategory.DoesNotExist:
            large_category_obj = DiagnosisLargeCategory.objects.create(name=large_category_data)
            large_category_obj.save()

        # 중분류가 빈값이 아니라면
        if medium_category_data is not NaN:
            # 중분류가 DB에 있다면 pass
            try:
                medium_category_obj = DiagnosisMediumCategory.objects.get(name=medium_category_data)
            # 중분류가 DB에 없다면 새로 만들기
            except DiagnosisMediumCategory.DoesNotExist:
                medium_category_obj = DiagnosisMediumCategory.objects.create(name=medium_category_data,
                                                                             diagnosis_large_category=large_category_obj)
                medium_category_obj.save()

        # 소분류가 빈값이 아니라면
        if small_category_data is not NaN:

            # 소분류가 DB에 있다면 pass
            try:
                small_category_obj = DiagnosisSmallCategory.objects.get(name=small_category_data)
            # 소분류가 DB에 없다면 새로 만들기
            except DiagnosisSmallCategory.DoesNotExist:
                small_category_obj = DiagnosisSmallCategory.objects.create(name=small_category_data,
                                                                           diagnosis_medium_category=medium_category_obj)
                small_category_obj.save()

        # 진단 정의가 빈값이 아니라면
        if diagnosis_definition_data is not NaN:
            small_category_obj.definition = diagnosis_definition_data.strip()
            small_category_obj.save()

        # 중재가 빈값이 아니라면
        if diagnosis_intervention_data is not NaN:
            small_category_obj.intervention_content = diagnosis_intervention_data.strip()
            small_category_obj.save()
