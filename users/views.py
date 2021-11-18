from django.contrib.auth import authenticate, login, logout
from django.shortcuts import render, redirect
from django.http import JsonResponse, HttpResponse
from django.urls import reverse
from django.conf import settings
from .forms import SigninForm, SignupForm, KakaoSignupForm
from .models import User
import requests
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

def kakao_signin(request):
    client_id = settings.KAKAO_ID
    redirect_uri = f"{settings.MY_URL}{reverse('users:kakao_callback')}"
    return redirect(
        f"https://kauth.kakao.com/oauth/authorize?client_id={client_id}&redirect_uri={redirect_uri}&response_type=code"
    )

class KakaoException(Exception):
    pass

def kakao_callback(request):
    try:
        code = request.GET.get("code")
        client_id = settings.KAKAO_ID
        redirect_uri = f"{settings.MY_URL}{reverse('users:kakao_callback')}"

        # 유효시간이 10분인 code값을 통해 KAKAO API로 부터 토큰 받기
        token_request = requests.get(
            f"https://kauth.kakao.com/oauth/token?grant_type=authorization_code&client_id={client_id}&redirect_uri={redirect_uri}&code={code}"
        )

        token_json = token_request.json()

        # 에러 처리
        error = token_json.get("error", None)
        if error is not None:
            raise KakaoException("접근할 수 없습니다.")

        # 토큰으로부터 access_token 받기
        access_token = token_json.get("access_token")

        profile_request = requests.get(
            "https://kapi.kakao.com/v2/user/me",
            headers={"Authorization": f"Bearer {access_token}"},
        )

        # 프로필 정보가 전부 들어있는 JSON 객체(딕셔너리로 변환됨) 
        profile_json = profile_request.json()

        kakao_id = profile_json.get("id")


        user_info = profile_json.get("kakao_account")
        email = user_info.get("email")



        context = {
            "email": email,
            "kakao_id":kakao_id
        }
        # 유저가 이미 존재한다면 로그인
        try:
            user = User.objects.get(kakao_id=kakao_id)
            login(request, user)
            return redirect(reverse("home"))
        # 아니면 회원정보 추가 화면으로 이동
        except User.DoesNotExist:
            return render(request, "users/kakao_signin_user_form.html", context)

    # 토큰이 유효하지 않으면 홈화면으로 반환
    except:
        # 추후 에러 토스트 메세지 추가 예정
        return redirect(reverse("home"))

def kakao_signin_validation(request):
    if request.method == 'POST':
        form = KakaoSignupForm(request.POST)
        if form.is_valid():
            username = form.cleaned_data.get('username')
            email = form.cleaned_data.get('email')
            kakao_id = form.cleaned_data.get('kakao_id')

            if email:
                new_user = User.objects.create(username=username, email=email, is_kakao=True, kakao_id=kakao_id)
            else:
                new_user = User.objects.create(username=username, is_kakao=True, kakao_id=kakao_id)

            new_user.set_unusable_password()
            new_user.save()

            return HttpResponse(status=200)

        else:
            return JsonResponse(form.errors, status=400)

def kakao_signin_action(request):
    # 카카오 로그인에서 접근한건지 확인
    previous_url = request.META.get('HTTP_REFERER')
    try:
        user_url = previous_url.split("?")[0]
        if not reverse("users:kakao_callback") in user_url:
            # 추후 toast 메세지 추가 or http404
            return redirect(reverse("home"))
    except:
        return redirect(reverse("home"))


    if request.method == 'POST':
        username = request.POST.get("username")

        user = User.objects.get(username=username)
        login(request, user)

        return redirect(reverse("home"))

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