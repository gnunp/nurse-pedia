from django.shortcuts import render

def home(request):
    5/0
    context = {}
    return render(request, "nursing_knowledges/home.html", context)