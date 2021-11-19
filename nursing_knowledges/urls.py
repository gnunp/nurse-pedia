from django.urls import path
from .views import views

app_name = 'nursing_knowledges'

urlpatterns = [
    path('', views.test),
]