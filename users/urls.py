from django.urls import path
from . import views

app_name = 'users'

urlpatterns = [
    path('signin-modal', views.signin_modal, name="signin_modal"),
    path('signup-modal', views.signup_modal, name="signup_modal"),
]