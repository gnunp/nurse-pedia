from django.shortcuts import render

def home(request):
    context = {}
    return render(request, "nursing_knowledges/home.html", context)