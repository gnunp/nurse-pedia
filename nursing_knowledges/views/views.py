from .api_views import *
from django.shortcuts import render

def home(request):
    """
    Home 화면을 띄우는 View
    """
    context = {}
    return render(request, "nursing_knowledges/home.html", context)

def test(request):
    context = {}
    return render(request, "nursing_knowledges/test.html", context)