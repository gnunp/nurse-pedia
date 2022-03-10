from django.conf import settings
from numpy import NaN
import pandas as pd
from ..models import (
    DiseaseLargeCategory,
    DiseaseMediumCategory,
    DiseaseSmallCategory,
    DiagnosisSmallCategory,
    DiagnosisToOther,
)


def run():
    """
    질병(대분류/중분류/소분류), 진단의 데이터를 DB에 생성하고 연결관계를 형성하는 스크립트
    """
    df = pd.read_excel(
        settings.BASE_DIR / 'nursing_knowledges/scripts/disease_diagnosis_data.xlsx',
        engine='openpyxl'
    )

    for row in range(df.shape[0]):
        large_category_data = df.iat[row, 0]
        medium_category_data = df.iat[row, 1]
        small_category_data = df.iat[row, 2]
        diagnosis_data = df.iat[row, 3]

        # print(row+1, ": ", large_category_data, medium_category_data, small_category_data, diagnosis_data)

        # 대분류가 DB에 있다면 pass
        try:
            large_category_obj = DiseaseLargeCategory.objects.get(name=large_category_data)
        # 대분류가 DB에 없다면 새로 만들기
        except DiseaseLargeCategory.DoesNotExist:
            large_category_obj = DiseaseLargeCategory.objects.create(name=large_category_data)
            large_category_obj.save()

        # 중분류가 빈값이 아니라면
        if medium_category_data is not NaN:
            # 중분류가 DB에 있다면 pass
            try:
                medium_category_obj = DiseaseMediumCategory.objects.get(name=medium_category_data)
            # 중분류가 DB에 없다면 새로 만들기
            except DiseaseMediumCategory.DoesNotExist:
                medium_category_obj = DiseaseMediumCategory.objects.create(name=medium_category_data,
                                                                           disease_large_category=large_category_obj)
                medium_category_obj.save()


        # 소분류가 빈값이 아니라면
        if small_category_data is not NaN:

            # 중분류가 NaN인지에 따라 옵션값 설정하기
            if medium_category_data is NaN:
                small_category_option = dict(name=small_category_data, disease_large_category=large_category_obj)
            else:
                small_category_option = dict(name=small_category_data, disease_medium_category=medium_category_obj)


            # 소분류가 DB에 있다면 pass
            try:
                small_category_obj = DiseaseSmallCategory.objects.get(name=small_category_data)
            # 소분류가 DB에 없다면 새로 만들기
            except DiseaseSmallCategory.DoesNotExist:
                small_category_obj = DiseaseSmallCategory.objects.create(**small_category_option)
                small_category_obj.save()

        # 간호진단이 빈값이 아니라면
        if diagnosis_data is not NaN:
            # 진단이 DB에 있다면 pass
            try:
                diagnosis_obj = DiagnosisSmallCategory.objects.get(name=diagnosis_data)
            # 진단이 DB에 없다면 새로 만들기
            except DiagnosisSmallCategory.DoesNotExist:
                diagnosis_obj = DiagnosisSmallCategory.objects.create(name=diagnosis_data)
                diagnosis_obj.save()

            # 소분류가 빈값이 아니라면 진단 <--> 소분류 연결
            if small_category_data is not NaN:
                diagnosis_to_small = DiagnosisToOther(diagnosis=diagnosis_obj,
                                                      disease_small_category=small_category_obj)
                diagnosis_to_small.save()
            # 소분류가 빈값이라면 진단 <--> 중분류 연결
            else:
                diagnosis_to_medium = DiagnosisToOther(diagnosis=diagnosis_obj,
                                                       disease_medium_category=medium_category_obj)
                diagnosis_to_medium.save()
