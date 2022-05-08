from django.urls import path
from . import views

app_name = 'users'

urlpatterns = [
    path('signin', views.signin, name="signin"),
    path("signin/kakao", views.kakao_signin, name="kakao_signin"),
    path("signin/kakao/callback/", views.kakao_callback, name="kakao_callback"),
    path('signup', views.signup, name="signup"),
    path('logout', views.log_out, name="logout"),
    path('mypage', views.mypage, name="mypage"),
]