from django.contrib.auth import authenticate, login, logout
from django.shortcuts import render, redirect
from django.http import JsonResponse, HttpResponse
from django.urls import reverse
from .forms import SigninForm, SignupForm
from .models import User
# Create your views here.

def signin_action(request):
    if request.method == 'POST':
        form = SigninForm(request.POST)
        print(form)
        if form.is_valid():
            username = form.cleaned_data.get('username')
            password = form.cleaned_data.get('current_password')
            user = authenticate(request, username=username, password=password)
            if user is not None:
                login(request, user)
                return redirect(reverse("home"))


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
                return HttpResponse(status=200)
        else:
            context = {"form": form}
            return JsonResponse(form.errors, status=400)



def signup(request):
    if request.method == 'GET':
        form = SignupForm()
        context = {"form": form}
        return render(request, 'users/signup.html', context)

    elif request.method == 'POST':
        form = SignupForm(request.POST)
        if form.is_valid():
            username = form.cleaned_data.get('username')
            email = form.cleaned_data.get('email')
            password = form.cleaned_data.get('current_password')

            new_user = User.objects.create(username=username, email=email)
            new_user.set_password(password)
            new_user.save()

            user = authenticate(request, username=username, password=password)
            if user is not None:
                return HttpResponse(status=200)

        else:
            context = {"form": form}
            return JsonResponse(form.errors, status=400)

    context = {
        "form": form,
    }
    return render(request, 'users/signup.html', context)

def log_out(request):
    logout(request)
    return redirect(reverse("home"))