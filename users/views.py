from django.shortcuts import render

# Create your views here.


def signin_modal(request):
    """
    로그인 모달 띄울시 fetch되는 html
    """
    return render(request, 'users/modals/signin_modal.html')

def signup_modal(request):
    """
    회원가입 모달 띄울시 fetch되는 html
    """
    return render(request, 'users/modals/signup_modal.html')