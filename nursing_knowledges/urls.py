from django.urls import path
from . import views

app_name = 'nursing_knowledges'

urlpatterns = [
    path('test', views.test),
]