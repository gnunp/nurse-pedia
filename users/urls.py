from django.urls import path
from . import views

app_name = 'users'

urlpatterns = [
    path('signin', views.signin, name="signin"),
    path('signin-action', views.signin_action, name="signin_action"),
    path("signin/kakao", views.kakao_signin, name="kakao_signin"),
    path("signin/kakao/callback/", views.kakao_callback, name="kakao_callback"),
    path("signin/kakao/validation", views.kakao_signin_validation, name="kakao_signin_validation"),
    path("signin/kakao/action", views.kakao_signin_action, name="kakao_signin_action"),
    path('signup', views.signup, name="signup"),
    path('logout', views.log_out, name="logout"),
    path('mypage', views.mypage, name="mypage"),
]