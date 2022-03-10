from ..models import (
    DiagnosisLargeCategory,
    DiseaseLargeCategory,
    DiseaseMediumCategory,
    DiseaseSmallCategory,
    DiagnosisSmallCategory,
    DiagnosisToOther,
)

def run():
    """
    DB에 있는 질병(대분류/중분류/소분류), 진단, 진단과의 연결관계 데이터를 지우는 스크립트
    """
    DiseaseLargeCategory.objects.all().delete()
    DiagnosisLargeCategory.objects.all().delete()