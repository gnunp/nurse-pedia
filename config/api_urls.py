from django.urls import path
from nursing_knowledges.views import views as knowledges_views

api_patterns = [
    path('knowledges/diseases/', knowledges_views.DiseasesView.as_view(), name='diseases'),
    path('knowledges/diagnoses/', knowledges_views.DiagnosesView.as_view(), name='diagnoses'),
    path('knowledges/disease-to-diagnosis/', knowledges_views.DiseaseToDiagnosisView.as_view(), name='disease-to-diagnosis'),
    path('knowledges/interventions/', knowledges_views.InterventionsView.as_view(), name='interventions'),
    path('knowledges/intervention-to-others/', knowledges_views.InterventionToOthersView.as_view(), name='intervention-to-others'),
]

api_setting = (
    api_patterns,
    "api"
)