"""config URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from nursing_knowledges.views import views as knowledges_views
from nursing_knowledges.views.api_views import DiseaseDocumentView, DiagnosisDocumentView
from .api_urls import api_setting


urlpatterns = [
    path('admin/', admin.site.urls),
    path('', knowledges_views.home, name='home'),
    path('users/', include('users.urls', namespace="users")),
    path('knowledges/', include('nursing_knowledges.urls', namespace="nursing_knowledges")),
    path('api/', include(api_setting, namespace="api")),
    path('diseases/search/', DiseaseDocumentView.as_view({'get': 'list'})),
    path('diagnoses/search/', DiagnosisDocumentView.as_view({'get': 'list'})),
]
