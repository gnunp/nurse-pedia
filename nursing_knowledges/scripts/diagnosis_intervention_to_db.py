from django.conf import settings
from django.core.checks.messages import Error
from numpy import NaN
import pandas as pd
from ..models import (
    DiagnosisSmallCategory,
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
        diagnosis_data = df.iat[row,0]
        intervention_data = df.iat[row,1]

        try:
            diagnosis_obj = DiagnosisSmallCategory.objects.get(name=diagnosis_data)
            diagnosis_obj.intervention_content = intervention_data
            diagnosis_obj.save()
        except DiagnosisSmallCategory.DoesNotExist:
            print("엑셀 기준",row+2, "행에서 에러 발생")