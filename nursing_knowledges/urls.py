from django.urls import path
from .views import views

app_name = 'nursing_knowledges'

urlpatterns = [
    path('disease/<int:pk>', views.disease_detail, name='disease_detail'),
    path('diagnosis/<int:pk>', views.diagnosis_detail, name='diagnosis_detail'),
    path('search/', views.search, name='search'),
    path('category/disease', views.disease_category, name='disease_category'),
    path('category/diagnosis', views.diagnosis_category, name='diagnosis_category'),
    path('disease/<int:pk>/edit', views.disease_detail_edit, name='disease_detail_edit'),
    path('diagnosis/<int:pk>/edit', views.diagnosis_detail_edit, name='diagnosis_detail_edit'),
    path('related-diagnosis/<int:pk>/edit', views.diagnosis_detail__related_diagnosis_edit, name='related_diagnosis_edit'),
    path('history/', views.history, name='history'),
    path('diagnosis-related-diagnoses/<int:pk>', views.related_diagnosis_like, name='related_diagnosis_like'),
]