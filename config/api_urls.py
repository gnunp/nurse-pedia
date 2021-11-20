from django.urls import path
from nursing_knowledges.views import views as knowledges_views

api_patterns = [
    path(
        'knowledges/disease-large-categories/',
        knowledges_views.DiseaseLargeCategoryView.as_view(),
        name='disease_large_categories'
    ),
    path(
        'knowledges/disease-medium-categories/',
        knowledges_views.DiseaseMediumCategoryView.as_view(),
        name='disease_medium_categories'
    ),
    path('knowledges/diseases/', knowledges_views.DiseasesView.as_view(), name='diseases'),
    path('knowledges/diagnoses/', knowledges_views.DiagnosesView.as_view(), name='diagnoses'),
]

api_setting = (
    api_patterns,
    "api"
)