from django.shortcuts import render

# Create your views here.


def signin(request):
    """
    로그인 모달 띄울시 fetch되는 html
    """
    return render(request, 'users/signin.html')

def signup(request):
    """
    회원가입 모달 띄울시 fetch되는 html
    """
    return render(request, 'users/signup.html')