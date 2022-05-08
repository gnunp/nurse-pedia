import uuid

from django.contrib.auth import authenticate, login, logout
from django.shortcuts import render, redirect
from django.http import Http404, JsonResponse, HttpResponse
from django.urls import reverse
from django.conf import settings
from django.contrib import messages
from .forms import SigninForm, SignupForm, KakaoSignupForm, UpdateProfileForm
from .models import User
import requests
import random


def signin(request):
    if request.user.is_authenticated:
        return redirect(reverse("home"))

    if request.method == 'POST':
        form = SigninForm(request.POST)
        if form.is_valid():
            username = form.cleaned_data.get('username')
            password = form.cleaned_data.get('current_password')

            user = authenticate(request, username=username, password=password)
            if user is not None:
                login(request, user)
                return redirect(reverse("home"))
    else:
        form = SigninForm()

    context = {"form": form}

    return render(request, "users/pages/signin.html", context)


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
            raise KakaoException("권한이 없습니다.")

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

        try:
            user = User.objects.get(kakao_id=kakao_id)
            login(request, user)
            return redirect(reverse("home"))
        except User.DoesNotExist:
            new_user_dict = {
                "kakao_id": kakao_id,
                "username": f"kakao.login.user{kakao_id}",
                "is_kakao": True,
            }
            if email:
                new_user_dict["email"] = email

            new_user = User.objects.create(**new_user_dict)
            new_user.set_unusable_password()
            new_user.save()

            messages.info(request, "원하는 아이디를 설정하세요!")
            login(request, new_user)
            return redirect(reverse("users:mypage"))
    # 토큰이 유효하지 않으면 홈화면으로 반환
    except KakaoException as e:
        messages.info(request, e)
        return redirect(reverse("users:signin"))


def signup(request):
    if request.user.is_authenticated:
        return redirect(reverse("home"))

    if request.method == 'POST':
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
                login(request, user)
                return redirect(reverse("home"))
    else:
        form = SignupForm()

    context = {"form": form}

    return render(request, "users/pages/signup.html", context)


def log_out(request):
    logout(request)
    return redirect(reverse("home"))


def mypage(request):
    # 로그인 한 사람만 갈 수 있도록
    if request.user.is_anonymous:
        return redirect(reverse("home"))

    if request.method == 'GET':
        profile_update_form = UpdateProfileForm(instance=request.user)
    elif request.method == 'POST':
        profile_update_form = UpdateProfileForm(request.POST, instance=request.user, request=request)
        if profile_update_form.is_valid():
            profile_update_form.save()
            messages.info(request, '프로필이 수정되었습니다.')

    context = {
        'profile_update_form': profile_update_form,
    }

    return render(request, 'users/pages/mypage.html', context)
