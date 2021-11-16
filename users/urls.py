from django.urls import path
from . import views

app_name = 'users'

urlpatterns = [
    path('signin', views.signin, name="signin"),
    path('signin-action', views.signin_action, name="signin_action"),
    path('signup', views.signup, name="signup"),
]