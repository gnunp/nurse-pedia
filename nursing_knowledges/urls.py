from django.urls import path
from .views import views

app_name = 'nursing_knowledges'

urlpatterns = [
    path('disease/<int:pk>', views.disease_detail, name='disease_detail'),
    path('diagnosis/<int:pk>', views.diagnosis_detail, name='diagnosis_detail'),
    path('search/', views.search, name='search'),
]