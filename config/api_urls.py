from django.urls import path
from nursing_knowledges.views import views as knowledges_views

api_patterns = [
    path('knowledges/diseases/', knowledges_views.DiseasesView.as_view(), name='diseases'),
    path('knowledges/diagnoses/', knowledges_views.DiagnosesView.as_view(), name='diagnoses'),
    path('knowledges/disease-to-diagnosis/', knowledges_views.DiseaseToDiagnosisView.as_view(), name='disease-to-diagnosis'),
]

api_setting = (
    api_patterns,
    "api"
)