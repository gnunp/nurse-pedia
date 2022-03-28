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
    path('knowledges/disease-small-categories/', knowledges_views.DiseaseSmallCategoryView.as_view(), name='diseases'),
    path('knowledges/diagnoses/', knowledges_views.DiagnosesView.as_view(), name='diagnoses'),
    path(
        'knowledges/disease-large-to-medium/',
        knowledges_views.DiseaseLargeToMediumView.as_view(),
        name='disease_large_to_medium'
    ),
    path(
        'knowledges/disease-medium-to-small/',
        knowledges_views.DiseaseMediumToSmallView.as_view(),
        name='disease_medium_to_small'
    ),
    path(
        'knowledges/disease-large-to-small/',
        knowledges_views.DiseaseLargeToSmallView.as_view(),
        name='disease_large_to_small'
    ),
    path(
        'knowledges/diagnosis-to-other/',
        knowledges_views.DiagnosisToOtherView.as_view(),
        name='diagnosis_to_other'
    ),
    path(
        'knowledges/detail-mindmap-data/',
        knowledges_views.DetailMindmapDataView.as_view(),
        name='detail_mindmap_data'
    ),
    path(
        'knowledges/user-star-knowledges/',
        knowledges_views.UserStarKnowledgeView.as_view(),
        name='user_star_knowledges'
    ),
    path(
        'knowledges/mindmap-data/all/',
        knowledges_views.AllKnowledgeDataView.as_view(),
        name='all_knowledges'
    )
]

api_setting = (
    api_patterns,
    "api"
)