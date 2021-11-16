from django.contrib.auth import authenticate, login, logout
from django.shortcuts import render, redirect
from django.http import JsonResponse, HttpResponse
from django.urls import reverse
from .forms import SigninForm, SignupForm
import json
# Create your views here.


def signin(request):
    if request.method == 'GET':
        form = SigninForm()
        context = {"form": form}
        return render(request, 'users/signin.html', context)
    elif request.method == 'POST':
        form = SigninForm(request.POST)
        # print(request.POST)
        if form.is_valid():
            print(form.cleaned_data)
            username = form.cleaned_data.get('username')
            password = form.cleaned_data.get('current_password')
            
            user = authenticate(request, username=username, password=password)
            if user is not None:
                login(request, user)
                return HttpResponse(status=200)
        else:
            context = {"form": form}
            # form_errors_json = json.dumps(form.errors, ensure_ascii=False)
            return JsonResponse(form.errors, status=400)

def signup(request):
    if request.method == 'GET':
        form = SignupForm()
    elif request.method == 'POST':
        form = SignupForm(request.POST)
        if form.is_valid():
            username = form.cleaned_data.get('username')
            password = form.cleaned_data.get('current_password')
            
            user = authenticate(request, username=username, password=password)
            if user is not None:
                login(request, user)
                print("@@@@@@@@@@ 로그인 완료 @@@@@@@@@@")
                return redirect(reverse("home"))

    context = {
        "form": form,
    }
    return render(request, 'users/signup.html', context)