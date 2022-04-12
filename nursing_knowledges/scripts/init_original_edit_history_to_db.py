from nursing_knowledges.models import DiseaseSmallCategory, DiagnosisSmallCategory, DiseaseSmallCategoryEditHistory, \
    DiagnosisSmallCategoryEditHistory


def run():
    for disease_small_category in DiseaseSmallCategory.objects.all():
        DiseaseSmallCategoryEditHistory.objects.create(
            original_disease_small_category=disease_small_category,
            definition=disease_small_category.definition,
            cause=disease_small_category.cause,
            symptom=disease_small_category.symptom,
            diagnosis_and_checkup=disease_small_category.diagnosis_and_checkup,
            treatment=disease_small_category.treatment,
            nursing=disease_small_category.nursing,
        )

    for diagnosis_small_category in DiagnosisSmallCategory.objects.all():
        DiagnosisSmallCategoryEditHistory.objects.create(
            original_diagnosis_small_category=diagnosis_small_category,
            definition=diagnosis_small_category.definition,
            intervention_content=diagnosis_small_category.intervention_content,
        )